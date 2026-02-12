import type { db as Db } from "@work-holo/db";
import {
  policyOverrideTable,
  roleAssignmentTable,
  rolePermissionTable,
} from "@work-holo/db/schema/authorization";
import { and, eq, gt, isNull, or } from "drizzle-orm";
import type {
  AuthorizationRequest,
  AuthorizationResult,
  BitsetData,
} from "../lib/types";
import { PERMISSION_BY_KEY, TOTAL_PERMISSIONS } from "../lib/vocabulary";
import { checkBit } from "../utils/bitset";
import type { CacheManager } from "./cache-manager";
import type { PolicyManager } from "./policy-manager";

/**
 * Three-layer authorization decision engine with owner bypass semantics
 *
 * **AuthorizationEngine** implements the core authorization pipeline that evaluates
 * permission requests through three progressively expensive layers:
 *
 * **Authorization Pipeline:**
 * 1. **Layer 1 - Decision Cache (Redis)**: ~1ms latency, exact accuracy
 *    - Cached allow/deny decisions keyed by (userId, orgId, permissionKey)
 *    - Validates policy version for staleness detection
 *    - TTL: 300 seconds
 *
 * 2. **Layer 2 - Bitset Pre-filter**: ~2-5ms latency, over-approximation
 *    - Hex-encoded bitset representing user's permission set
 *    - Fast reject: if bit is OFF → definitely denied (skip Casbin)
 *    - If bit is ON → might be allowed (needs Casbin confirmation)
 *    - TTL: 600 seconds
 *
 * 3. **Layer 3 - Casbin Enforcer**: ~10-50ms latency, exact RBAC evaluation
 *    - Full RBAC with roles, domains, patterns, owner bypass
 *    - Handles complex policies (allow/deny, role inheritance, wildcards)
 *    - Result cached in Layer 1 for future requests
 *
 * **Owner Bypass:**
 * - If `attrs.ownerId === userId`, immediate allow without checking any layers
 * - Checked before entering the 3-layer pipeline
 * - Returns { allowed: true, decidedBy: "owner", durationMs: 0 }
 *
 * **Bitset Compilation:**
 * - Compiles user's permissions from DB (role assignments + overrides)
 * - Creates Uint8Array bitset where each of 59 permissions has a stable bit index
 * - Encodes as hex string for compact Redis storage
 * - Respects effect priority: allow adds key, deny removes key
 * - Filters expired policy overrides
 *
 * **Cross-Process Synchronization:**
 * - All cached data includes policyVersion field
 * - Version sourced from Redis (policy_version:<orgId>)
 * - Stale cache entries evicted and recomputed on version mismatch
 *
 * @example
 * ```typescript
 * const engine = new AuthorizationEngine(cacheManager, policyManager, db);
 *
 * // Authorization with owner bypass
 * const request: AuthorizationRequest = {
 *   userId: "user_123",
 *   orgId: "org_456",
 *   permission: {
 *     obj: "channel:member:ch_789",
 *     act: "channel.member.add",
 *     permissionKey: "channel.member.add",
 *     bitIndex: 49,
 *     attrs: { ownerId: "user_999" }
 *   }
 * };
 * const result = await engine.authorizeWithOwnerBypass(request, "user_999");
 * // If userId === ownerId → { allowed: true, decidedBy: "owner" }
 * // Otherwise → runs through 3-layer pipeline
 *
 * // Direct authorization (no owner bypass)
 * const result2 = await engine.authorize(request);
 * // Returns: { allowed: boolean, decidedBy: "cache"|"bitset"|"casbin", durationMs: number }
 * ```
 */
export class AuthorizationEngine {
  /** Cache manager for decision cache, bitset cache, and permission map cache */
  private readonly cacheManager: CacheManager;

  /** Policy manager for Casbin enforcer access and policy version tracking */
  private readonly policyManager: PolicyManager;

  /** Database connection for querying role assignments, permissions, and overrides */
  private readonly db: typeof Db;

  constructor(
    cacheManager: CacheManager,
    policyManager: PolicyManager,
    db: typeof Db
  ) {
    this.cacheManager = cacheManager;
    this.policyManager = policyManager;
    this.db = db;
  }

  /**
   * Authorize a permission request with owner bypass check
   *
   * **Owner Bypass Semantics:**
   * - If `ownerId` is provided AND `request.userId === ownerId`, immediately allow
   * - This bypasses all three layers (cache, bitset, Casbin)
   * - Used for resource ownership checks (e.g., message author can delete their message)
   *
   * **Otherwise:**
   * - Delegates to `authorize()` for the full 3-layer pipeline
   *
   * @param request - Authorization request with userId, orgId, and permission descriptor
   * @param ownerId - Optional resource owner ID for bypass check
   * @returns Authorization result (sync if owner bypass, async otherwise)
   *
   * @example
   * ```typescript
   * // Message deletion: author can always delete
   * const result = engine.authorizeWithOwnerBypass(
   *   { userId: "user_123", orgId: "org_456", permission: deleteMessageDescriptor },
   *   message.senderId  // ownerId
   * );
   * // If user_123 === message.senderId → immediate allow
   *
   * // Channel member add: no owner bypass (ownerId undefined)
   * const result2 = engine.authorizeWithOwnerBypass(
   *   { userId: "user_789", orgId: "org_456", permission: addMemberDescriptor },
   *   undefined
   * );
   * // Runs through full authorization pipeline
   * ```
   */
  authorizeWithOwnerBypass(
    request: AuthorizationRequest,
    ownerId?: string
  ): AuthorizationResult | Promise<AuthorizationResult> {
    if (ownerId && request.userId === ownerId) {
      return {
        allowed: true,
        decidedBy: "owner",
        durationMs: 0,
        permissionKey: request.permission.permissionKey,
      };
    }

    return this.authorize(request);
  }

  /**
   * Authorize a permission request through the 3-layer decision pipeline
   *
   * **Pipeline Flow:**
   * 1. **Layer 1 - Cache Check**:
   *    - Query Redis for cached decision (perm:<userId>:<orgId>:<key>)
   *    - Validate policyVersion matches current version
   *    - If hit and valid → return immediately
   *    - If stale → evict and continue to Layer 2
   *
   * 2. **Layer 2 - Bitset Pre-filter**:
   *    - Get or compile user's permission bitset (hex string)
   *    - Check if permission's bit index is ON
   *    - If bit OFF → definitely denied (cache decision, return false)
   *    - If bit ON → might be allowed (continue to Layer 3)
   *
   * 3. **Layer 3 - Casbin Enforcer**:
   *    - Build domain (org:<orgId>)
   *    - Call enforcer.enforce() with full RBAC evaluation
   *    - Cache the final decision (allow or deny)
   *    - Return result
   *
   * **Performance Characteristics:**
   * - Cache hit: ~1ms
   * - Bitset rejection: ~2-5ms
   * - Casbin evaluation: ~10-50ms
   *
   * **Atomicity:**
   * - Each layer decision is cached for future requests
   * - Cache writes are fire-and-forget (don't block return)
   *
   * @param request - Authorization request with userId, orgId, and permission descriptor
   * @returns Authorization result with allowed status, decision layer, and duration
   *
   * @example
   * ```typescript
   * const request: AuthorizationRequest = {
   *   userId: "user_123",
   *   orgId: "org_456",
   *   permission: {
   *     obj: "channel:member",
   *     act: "channel.member.add",
   *     permissionKey: "channel.member.add",
   *     bitIndex: 49
   *   }
   * };
   *
   * const result = await engine.authorize(request);
   * console.log(result);
   * // Cache hit: { allowed: true, decidedBy: "cache", durationMs: 1.2, permissionKey: "..." }
   * // Bitset reject: { allowed: false, decidedBy: "bitset", durationMs: 3.5, permissionKey: "..." }
   * // Casbin allow: { allowed: true, decidedBy: "casbin", durationMs: 25.8, permissionKey: "..." }
   * ```
   */
  async authorize(request: AuthorizationRequest): Promise<AuthorizationResult> {
    const start = performance.now();
    const { userId, orgId, permission } = request;

    const currentVersion = await this.policyManager.getPolicyVersion(orgId);

    const cached = await this.cacheManager.getCachedDecision(
      userId,
      orgId,
      permission.permissionKey,
      currentVersion
    );
    if (cached) {
      return {
        allowed: cached.allowed,
        decidedBy: "cache",
        durationMs: performance.now() - start,
        permissionKey: permission.permissionKey,
      };
    }

    const bitsetData = await this.getOrCompileBitset(userId, orgId);
    const bitsetAllowed = checkBit(bitsetData.bitset, permission.bitIndex);

    if (!bitsetAllowed) {
      await this.cacheManager.setCachedDecision(
        userId,
        orgId,
        permission.permissionKey,
        false,
        currentVersion
      );
      return {
        allowed: false,
        decidedBy: "bitset",
        durationMs: performance.now() - start,
        permissionKey: permission.permissionKey,
      };
    }

    const enforcer = await this.policyManager.getEnforcer();
    const domain = `org:${orgId}`;
    const attrs = permission.attrs ?? {};

    const allowed = await enforcer.enforce(
      userId,
      domain,
      { name: permission.obj, ownerId: attrs.ownerId ?? "" },
      permission.act
    );

    await this.cacheManager.setCachedDecision(
      userId,
      orgId,
      permission.permissionKey,
      allowed,
      currentVersion
    );

    return {
      allowed,
      decidedBy: "casbin",
      durationMs: performance.now() - start,
      permissionKey: permission.permissionKey,
    };
  }

  /**
   * Get user's permission bitset from cache or compile from database
   *
   * **Cache Strategy:**
   * - Check Redis for cached bitset (bitset:<userId>:<orgId>)
   * - Validate policyVersion matches current version
   * - If valid hit → return cached bitset
   * - If miss or stale → compile fresh bitset from DB
   *
   * **Version Validation:**
   * - Cached bitset includes policyVersion field
   * - Compared against current version from Redis
   * - Stale cache automatically evicted and recompiled
   *
   * @param userId - User ID to compile bitset for
   * @param orgId - Organization ID for scoping role assignments and overrides
   * @returns Bitset data with hex-encoded bitset, policy version, and compilation timestamp
   *
   * @example
   * ```typescript
   * const bitsetData = await engine.getOrCompileBitset("user_123", "org_456");
   * console.log(bitsetData);
   * // {
   * //   bitset: "3f7a9c01e2b4d8ff",  // 8 bytes = 16 hex chars for 59 permissions
   * //   policyVersion: 7,
   * //   compiledAt: 1707634800000
   * // }
   *
   * // Check specific permission
   * const canAddMember = checkBit(bitsetData.bitset, 49);  // channel.member.add
   * ```
   */
  async getOrCompileBitset(userId: string, orgId: string): Promise<BitsetData> {
    const currentVersion = await this.policyManager.getPolicyVersion(orgId);
    const cached = await this.cacheManager.getCachedBitset(
      userId,
      orgId,
      currentVersion
    );
    if (cached) return cached;
    return this.compileBitset(userId, orgId);
  }

  /**
   * Compile user's permission bitset from database role assignments and overrides
   *
   * **Compilation Process:**
   * 1. Query all role assignments for user (across all orgs, filtered by userId)
   * 2. For each role template: fetch role permissions
   *    - Effect "allow" → add permission key to Set
   *    - Effect "deny" → remove permission key from Set
   * 3. Query policy overrides for (userId, orgId), filter expired
   *    - Effect "allow" → add permission key to Set
   *    - Effect "deny" → remove permission key from Set
   * 4. Build Uint8Array bitset (ceil(59/8) = 8 bytes)
   * 5. For each allowed key: set bit at vocabulary bitIndex
   * 6. Encode as hex string (16 hex chars)
   * 7. Cache in Redis with current policyVersion and TTL 600s
   *
   * **Bitset Layout:**
   * - Size: ceil(TOTAL_PERMISSIONS / 8) bytes (currently 8 bytes for 59 permissions)
   * - Each permission has a stable bitIndex from vocabulary
   * - Bit ON (1) = permission allowed
   * - Bit OFF (0) = permission denied or not granted
   *
   * **Effect Priority:**
   * - Deny always wins over allow (Set operations: deny removes key)
   * - Overrides processed after role permissions
   *
   * **Expiration Handling:**
   * - Policy overrides with expiresAt <= now are excluded
   * - Null expiresAt = never expires
   *
   * @param userId - User ID to compile bitset for
   * @param orgId - Organization ID for scoping policy overrides
   * @returns Compiled bitset data with hex-encoded bitset, current policy version, and timestamp
   *
   * @example
   * ```typescript
   * const bitsetData = await engine.compileBitset("user_123", "org_456");
   * console.log(bitsetData);
   * // {
   * //   bitset: "1f00000000000000",  // User has permissions 0-4 (attendance.record.*)
   * //   policyVersion: 7,
   * //   compiledAt: 1707634800000
   * // }
   *
   * // Bitset breakdown (8 bytes, little-endian bit order):
   * // Byte 0: 0x1f = 0b00011111 → bits 0-4 ON (attendance.record.{create,delete,list,update,view})
   * // Bytes 1-7: 0x00 → all OFF
   * ```
   */
  async compileBitset(userId: string, orgId: string): Promise<BitsetData> {
    const permissionKeys = await this.getUserPermissionKeys(userId, orgId);
    const bitset = this.createEmptyBitset();

    for (const key of permissionKeys) {
      const entry = PERMISSION_BY_KEY.get(key);
      if (entry) {
        this.setBit(bitset, entry.bitIndex);
      }
    }

    const currentVersion = await this.policyManager.getPolicyVersion(orgId);
    const data: BitsetData = {
      bitset: this.bitsetToHex(bitset),
      policyVersion: currentVersion,
      compiledAt: Date.now(),
    };

    await this.cacheManager.setCachedBitset(userId, orgId, data);
    return data;
  }

  /**
   * Query database to build set of allowed permission keys for a user
   *
   * **Query Strategy:**
   * 1. Fetch all role assignments for user (role_assignment WHERE userId)
   * 2. Extract roleTemplateIds
   * 3. For each role template: query role permissions (role_permission WHERE roleTemplateId)
   *    - Join with permission_node to get permission key
   *    - Apply effect: "allow" adds key, "deny" removes key
   * 4. Fetch policy overrides for (userId, orgId), filter non-expired
   *    - Join with permission_node to get permission key
   *    - Apply effect: "allow" adds key, "deny" removes key
   *
   * **Effect Semantics:**
   * - Start with empty Set
   * - "allow" effect → Set.add(key)
   * - "deny" effect → Set.delete(key)
   * - Overrides processed after role permissions (can override role grants)
   *
   * **Expiration Filtering:**
   * - Overrides with expiresAt IS NULL → included (never expires)
   * - Overrides with expiresAt > now() → included
   * - Overrides with expiresAt <= now() → excluded
   *
   * @param userId - User ID to query permissions for
   * @param orgId - Organization ID for scoping policy overrides
   * @returns Set of allowed permission keys (e.g., "channel.member.add")
   */
  private async getUserPermissionKeys(
    userId: string,
    orgId: string
  ): Promise<Set<string>> {
    const permissionKeys = new Set<string>();

    const assignments = await this.db.query.roleAssignmentTable.findMany({
      where: eq(roleAssignmentTable.userId, userId),
      columns: { roleTemplateId: true },
      with: {
        roleTemplate: {
          columns: { id: true },
        },
      },
    });

    const templateIds = assignments.map(
      (a: { roleTemplateId: string }) => a.roleTemplateId
    );

    for (const templateId of templateIds) {
      const rolePerms = await this.db.query.rolePermissionTable.findMany({
        where: eq(rolePermissionTable.roleTemplateId, templateId),
        columns: { effect: true },
        with: {
          permissionNode: {
            columns: { key: true },
          },
        },
      });

      for (const rp of rolePerms) {
        if (rp.effect === "allow") {
          permissionKeys.add(rp.permissionNode.key);
        } else if (rp.effect === "deny") {
          permissionKeys.delete(rp.permissionNode.key);
        }
      }
    }

    const overrides = await this.db.query.policyOverrideTable.findMany({
      where: and(
        eq(policyOverrideTable.userId, userId),
        eq(policyOverrideTable.organizationId, orgId),
        or(
          isNull(policyOverrideTable.expiresAt),
          gt(policyOverrideTable.expiresAt, new Date())
        )
      ),
      columns: { effect: true },
      with: {
        permissionNode: {
          columns: { key: true },
        },
      },
    });

    for (const override of overrides) {
      if (override.effect === "allow") {
        permissionKeys.add(override.permissionNode.key);
      } else if (override.effect === "deny") {
        permissionKeys.delete(override.permissionNode.key);
      }
    }

    return permissionKeys;
  }

  /**
   * Create an empty bitset sized for total permission count
   *
   * **Size Calculation:**
   * - Bitset size = ceil(TOTAL_PERMISSIONS / 8) bytes
   * - Currently: ceil(59 / 8) = 8 bytes
   * - All bits initialized to 0 (no permissions granted)
   *
   * @returns Empty Uint8Array bitset with all bits OFF
   */
  private createEmptyBitset(): Uint8Array {
    return new Uint8Array(Math.ceil(TOTAL_PERMISSIONS / 8));
  }

  /**
   * Set a bit to 1 (ON) in the bitset at the specified index
   *
   * **Bit Addressing:**
   * - byteIndex = floor(bitIndex / 8)
   * - bitPosition = bitIndex % 8
   * - Set bit: bitset[byteIndex] |= (1 << bitPosition)
   *
   * **Bounds Checking:**
   * - Only sets bit if byteIndex < bitset.length
   * - Out-of-bounds indices silently ignored
   *
   * @param bitset - Uint8Array bitset to modify
   * @param index - Bit index to set (0-58 for 59 permissions)
   */
  private setBit(bitset: Uint8Array, index: number): void {
    const byteIndex = Math.floor(index / 8);
    const bitPosition = index % 8;
    if (byteIndex < bitset.length) {
      bitset[byteIndex] = (bitset[byteIndex] ?? 0) | (1 << bitPosition);
    }
  }

  /**
   * Convert Uint8Array bitset to hex string for compact storage
   *
   * **Encoding:**
   * - Each byte → 2 hex characters
   * - Padded with leading zeros (e.g., 0x05 → "05")
   * - 8 bytes → 16 hex characters
   *
   * **Format:**
   * - Little-endian byte order (byte 0 first)
   * - Lowercase hex digits
   *
   * @param bitset - Uint8Array bitset to encode
   * @returns Hex-encoded string (2 chars per byte)
   */
  private bitsetToHex(bitset: Uint8Array): string {
    return Array.from(bitset)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
}
