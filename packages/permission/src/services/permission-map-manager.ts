import type { db as Db } from "@work-holo/db";
import {
  permissionSnapshotTable,
  policyVersionTable,
} from "@work-holo/db/schema/authorization";
import { and, desc, eq } from "drizzle-orm";
import type { PermissionMap } from "../lib/types";
import { PERMISSIONS } from "../lib/vocabulary";
import type { CacheManager } from "./cache-manager";
import type { PolicyManager } from "./policy-manager";

/**
 * Manages full permission map computation, caching, and persistence for users in organizations.
 *
 * **Responsibilities:**
 * - Build complete permission maps containing all 59 permission flags
 * - Implement 3-tier read strategy (Redis → DB snapshot → Casbin recomputation)
 * - Manage permission map caching and persistence
 * - Validate policy version staleness for cached/persisted maps
 *
 * **Permission Map Structure:**
 * A permission map is a complete snapshot of all permissions for a user in an organization:
 * ```typescript
 * {
 *   userId: "user_123",
 *   orgId: "org_456",
 *   policyVersion: 7,
 *   permissions: {
 *     "attendance.record.create": true,
 *     "attendance.record.delete": false,
 *     // ... all 59 permission keys with boolean values
 *     "message.unread_count": true
 *   },
 *   computedAt: 1707634800000
 * }
 * ```
 *
 * **3-Tier Read Strategy:**
 *
 * **Tier 1 - Redis Cache** (~1-2ms):
 * - Key: `perm_map:<userId>:<orgId>`
 * - TTL: 600 seconds
 * - Includes policyVersion for staleness detection
 * - Fastest read path for repeated requests
 *
 * **Tier 2 - Database Snapshot** (~5-10ms):
 * - Table: `permission_snapshot`
 * - Persistent backup of permission maps
 * - Used when Redis cache miss occurs
 * - Validates policyVersion before use
 * - On hit: promotes to Redis cache
 *
 * **Tier 3 - Casbin Recomputation** (~500-1000ms):
 * - Full evaluation of all 59 permissions via enforcer.enforce()
 * - Used when both cache and snapshot miss or are stale
 * - Most expensive operation (59 sequential Casbin checks)
 * - Result saved to both Redis and DB
 * - Typical scenarios: first-time user in org, after policy recompilation
 *
 * **When Each Tier is Used:**
 * - Cache hit (Tier 1): Most common case, fast frontend hydration
 * - Cache miss, snapshot hit (Tier 2): Cold start or cache eviction
 * - Both miss (Tier 3): First-time user in org, or after policy compilation
 *
 * **Policy Version Validation:**
 * Both cached and persisted maps include a `policyVersion` field. Before returning
 * a cached/persisted map, the current policy version is fetched and compared.
 * If versions don't match, the stale data is discarded and recomputation occurs.
 *
 * @example
 * ```typescript
 * const manager = new PermissionMapManager(db, cacheManager, policyManager);
 *
 * // Build permission map (uses 3-tier strategy)
 * const permMap = await manager.buildPermissionMap("user_123", "org_456");
 * console.log(permMap.permissions["channel.create"]); // true or false
 *
 * // Invalidate permission map (clears Redis cache)
 * await manager.invalidatePermissionMap("user_123", "org_456");
 * ```
 */
export class PermissionMapManager {
  /** Database client for querying snapshots and policy versions */
  private readonly db: typeof Db;

  /** Cache manager for Redis operations */
  private readonly cacheManager: CacheManager;

  /** Policy manager for accessing Casbin enforcer and version info */
  private readonly policyManager: PolicyManager;

  constructor(
    db: typeof Db,
    cacheManager: CacheManager,
    policyManager: PolicyManager
  ) {
    this.db = db;
    this.cacheManager = cacheManager;
    this.policyManager = policyManager;
  }

  /**
   * Builds a complete permission map for a user in an organization using a 3-tier read strategy.
   *
   * **Read Strategy (in order):**
   * 1. **Redis cache**: Check `perm_map:<userId>:<orgId>` with version validation
   * 2. **DB snapshot**: Query `permission_snapshot` table with version validation
   * 3. **Casbin recomputation**: Evaluate all 59 permissions and save to cache + DB
   *
   * **Important Behavior:**
   * - Always validates `policyVersion` before returning cached/persisted data
   * - Stale data triggers recomputation from Casbin (Tier 3)
   * - Tier 2 hits are promoted to Redis cache for future requests
   * - Tier 3 recomputation saves to both Redis and DB in parallel
   * - Returns map with all 59 permission keys mapped to boolean values
   *
   * **Performance Characteristics:**
   * - Tier 1 hit: ~1-2ms (most common case)
   * - Tier 2 hit: ~5-10ms (cold start recovery)
   * - Tier 3 recomputation: ~500-1000ms (59 sequential enforcer.enforce() calls)
   *
   * @param userId - Target user ID
   * @param orgId - Organization ID
   * @returns Complete permission map with all 59 permissions and version metadata
   *
   * @example
   * ```typescript
   * // First request (Tier 3 - recomputation)
   * const map1 = await manager.buildPermissionMap("user_123", "org_456");
   * // Takes ~500ms, saves to cache + DB
   *
   * // Second request (Tier 1 - cache hit)
   * const map2 = await manager.buildPermissionMap("user_123", "org_456");
   * // Takes ~1ms, returns cached result
   *
   * // After policy recompilation (Tier 3 - stale cache)
   * await policyManager.compilePolicies("org_456");
   * const map3 = await manager.buildPermissionMap("user_123", "org_456");
   * // Takes ~500ms, old version was stale, recomputes
   * ```
   */
  async buildPermissionMap(
    userId: string,
    orgId: string
  ): Promise<PermissionMap> {
    const policyVersion = await this.policyManager.getPolicyVersion(orgId);

    const cached = await this.cacheManager.getCachedPermissionMap(
      userId,
      orgId,
      policyVersion
    );
    if (cached) return cached;

    const dbSnapshot = await this.loadSnapshotFromDb(userId, orgId);
    if (dbSnapshot && dbSnapshot.policyVersion === policyVersion) {
      await this.cacheManager.setCachedPermissionMap(userId, orgId, dbSnapshot);
      return dbSnapshot;
    }

    const permissionMap = await this.computePermissionMap(userId, orgId);

    await Promise.all([
      this.saveSnapshot(userId, orgId, permissionMap),
      this.cacheManager.setCachedPermissionMap(userId, orgId, permissionMap),
    ]);

    return permissionMap;
  }

  /**
   * Invalidates the cached permission map for a user in an organization.
   *
   * **Important Behavior:**
   * - Only clears Redis cache (`perm_map:<userId>:<orgId>`)
   * - Does NOT clear DB snapshot (persistent backup remains)
   * - Next `buildPermissionMap()` call will fall back to Tier 2 (DB) if snapshot is fresh
   * - If snapshot is stale, will trigger Tier 3 (Casbin recomputation)
   *
   * **Typical Usage:**
   * Called after permission changes (role assignment, override creation) to ensure
   * fresh permission data on next request. Usually called alongside `invalidateUserCache()`
   * and `invalidateBitset()` for complete cache invalidation.
   *
   * @param userId - Target user ID
   * @param orgId - Organization ID
   *
   * @example
   * ```typescript
   * // After assigning a role
   * await manager.invalidatePermissionMap("user_123", "org_456");
   *
   * // Next request will use DB snapshot if fresh, or recompute if stale
   * const map = await manager.buildPermissionMap("user_123", "org_456");
   * ```
   */
  async invalidatePermissionMap(userId: string, orgId: string): Promise<void> {
    await this.cacheManager.invalidatePermissionMap(userId, orgId);
  }

  /**
   * Retrieves the latest compiled policy version ID for an organization.
   *
   * **Important Behavior:**
   * - Queries `policy_version` table for the org
   * - Filters for `status = "compiled"` (ignores pending/error versions)
   * - Orders by version number descending (most recent first)
   * - Returns `null` if no compiled version exists
   *
   * **Used For:**
   * Linking permission snapshots to specific policy version records in the DB.
   * Required for `saveSnapshot()` to maintain referential integrity.
   *
   * @param orgId - Organization ID
   * @returns Policy version record ID, or null if no compiled version exists
   *
   * @example
   * ```typescript
   * const versionId = await manager.getLatestVersionId("org_456");
   * // Returns: "pol_xyz123" or null
   * ```
   */
  private async getLatestVersionId(orgId: string): Promise<string | null> {
    const row = await this.db.query.policyVersionTable.findFirst({
      where: and(
        eq(policyVersionTable.organizationId, orgId),
        eq(policyVersionTable.status, "compiled")
      ),
      orderBy: [desc(policyVersionTable.version)],
      columns: { id: true },
    });
    return row?.id ?? null;
  }

  /**
   * Loads a permission map from the database snapshot table.
   *
   * **Important Behavior:**
   * - Queries `permission_snapshot` table for exact (userId, orgId) match
   * - Returns JSON-parsed permission map from `permissionMap` column
   * - Does NOT validate policy version (caller must check staleness)
   * - Returns `null` if no snapshot exists
   *
   * **Data Format:**
   * The `permissionMap` column contains a JSON-stringified `PermissionMap` object:
   * ```
   * {
   *   "userId": "user_123",
   *   "orgId": "org_456",
   *   "policyVersion": 7,
   *   "permissions": { "channel.create": true, ... },
   *   "computedAt": 1707634800000
   * }
   * ```
   *
   * @param userId - Target user ID
   * @param orgId - Organization ID
   * @returns Persisted permission map, or null if no snapshot exists
   *
   * @example
   * ```typescript
   * const snapshot = await this.loadSnapshotFromDb("user_123", "org_456");
   * if (snapshot && snapshot.policyVersion === currentVersion) {
   *   // Snapshot is fresh, use it
   * }
   * ```
   */
  private async loadSnapshotFromDb(
    userId: string,
    orgId: string
  ): Promise<PermissionMap | null> {
    const row = await this.db.query.permissionSnapshotTable.findFirst({
      where: and(
        eq(permissionSnapshotTable.userId, userId),
        eq(permissionSnapshotTable.organizationId, orgId)
      ),
      columns: {
        permissionMap: true,
        policyVersionId: true,
      },
    });

    if (!row) return null;

    return JSON.parse(row.permissionMap) as PermissionMap;
  }

  /**
   * Computes a complete permission map by evaluating all 59 permissions via Casbin.
   *
   * **Important Behavior:**
   * - Iterates through all 59 entries in `PERMISSIONS` vocabulary
   * - Calls `enforcer.enforce()` for each permission (sequential, not parallel)
   * - Builds object path from `resource` and optional `subResource`
   * - Uses empty string for `ownerId` (no owner bypass semantics)
   * - Includes current policy version and timestamp in result
   *
   * **Performance:**
   * This is the most expensive operation in the permission system (~500-1000ms).
   * Each `enforcer.enforce()` call evaluates Casbin rules, role inheritance,
   * domain matching, and policy effects. Minimize calls through aggressive caching.
   *
   * **Object Path Construction:**
   * - `resource` only: `"channel"`
   * - `resource:subResource`: `"channel:member"`
   * - Used as Casbin `obj.name` parameter
   *
   * @param userId - Target user ID
   * @param orgId - Organization ID
   * @returns Freshly computed permission map with all 59 permissions
   *
   * @example
   * ```typescript
   * const permMap = await this.computePermissionMap("user_123", "org_456");
   * // Result: { userId, orgId, policyVersion: 7, permissions: {...}, computedAt }
   * // permissions object contains all 59 keys with boolean values
   * ```
   */
  private async computePermissionMap(
    userId: string,
    orgId: string
  ): Promise<PermissionMap> {
    const enforcer = await this.policyManager.getEnforcer();
    const domain = `org:${orgId}`;
    const permissions: Record<string, boolean> = {};

    for (const entry of PERMISSIONS) {
      const objParts: string[] = [entry.resource];
      if (entry.subResource) {
        objParts.push(entry.subResource);
      }
      const objName = objParts.join(":");
      const allowed = await enforcer.enforce(
        userId,
        domain,
        { name: objName, ownerId: "" },
        entry.key
      );
      permissions[entry.key] = allowed;
    }

    const currentVersion = await this.policyManager.getPolicyVersion(orgId);
    return {
      userId,
      orgId,
      policyVersion: currentVersion,
      permissions,
      computedAt: Date.now(),
    };
  }

  /**
   * Persists a permission map to the database snapshot table.
   *
   * **Important Behavior:**
   * - Requires latest compiled policy version ID (fetched via `getLatestVersionId()`)
   * - Does nothing if no compiled policy version exists (`versionId` is null)
   * - Uses upsert pattern: UPDATE existing row, or INSERT new row
   * - Stores JSON-stringified permission map in `permissionMap` column
   * - Also stores empty bitset string (reserved for future use)
   * - Sets `computedAt` timestamp to current time
   *
   * **Database Table:**
   * Table: `permission_snapshot`
   * Unique constraint: (userId, organizationId)
   * Columns: id, userId, organizationId, policyVersionId, bitset, permissionMap, computedAt
   *
   * **Why Upsert:**
   * Each user can have at most one snapshot per organization. When recomputing
   * permission maps, we update the existing snapshot row rather than creating
   * duplicate entries.
   *
   * @param userId - Target user ID
   * @param orgId - Organization ID
   * @param permissionMap - The computed permission map to persist
   *
   * @example
   * ```typescript
   * const permMap = await this.computePermissionMap("user_123", "org_456");
   * await this.saveSnapshot("user_123", "org_456", permMap);
   * // Snapshot is now persisted in DB, survives Redis eviction
   * ```
   */
  private async saveSnapshot(
    userId: string,
    orgId: string,
    permissionMap: PermissionMap
  ): Promise<void> {
    const versionId = await this.getLatestVersionId(orgId);
    if (!versionId) return;

    const existing = await this.db.query.permissionSnapshotTable.findFirst({
      where: and(
        eq(permissionSnapshotTable.userId, userId),
        eq(permissionSnapshotTable.organizationId, orgId)
      ),
      columns: { id: true },
    });

    if (existing) {
      await this.db
        .update(permissionSnapshotTable)
        .set({
          policyVersionId: versionId,
          bitset: "",
          permissionMap: JSON.stringify(permissionMap),
          computedAt: new Date(),
        })
        .where(eq(permissionSnapshotTable.id, existing.id));
    } else {
      await this.db.insert(permissionSnapshotTable).values({
        userId,
        organizationId: orgId,
        policyVersionId: versionId,
        bitset: "",
        permissionMap: JSON.stringify(permissionMap),
      });
    }
  }
}
