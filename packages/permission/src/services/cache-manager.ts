import type { RedisClient } from "bun";
import type { BitsetData, CachedDecision, PermissionMap } from "../lib/types";

/**
 * CacheManager manages all Redis-backed caching for the permission system.
 *
 * This class handles three types of caches, each with version-based staleness detection:
 * 1. **Decision Cache** - Caches individual authorization decisions (allowed/denied)
 * 2. **Bitset Cache** - Caches compiled permission bitsets for fast pre-filtering
 * 3. **Permission Map Cache** - Caches complete permission maps for frontend hydration
 *
 * **Cache Invalidation Strategy:**
 * All caches are version-aware. When policies change (role assignment, policy override),
 * the policy version is incremented in Redis. On cache read, if the cached version doesn't
 * match the current version, the cache entry is automatically evicted and recomputed.
 *
 * **TTL Values:**
 * - Decision cache: 300s (5 minutes)
 * - Bitset cache: 600s (10 minutes)
 * - Permission map cache: 600s (10 minutes)
 *
 * **Redis Key Patterns:**
 * - Decision: `perm:<userId>:<orgId>:<permissionKey>`
 * - Bitset: `bitset:<userId>:<orgId>`
 * - Permission Map: `perm_map:<userId>:<orgId>`
 */
export class CacheManager {
  private readonly redis: RedisClient;

  /** Redis key prefix for decision cache: `perm:` */
  private readonly DECISION_PREFIX = "perm:";
  /** Redis key prefix for bitset cache: `bitset:` */
  private readonly BITSET_PREFIX = "bitset:";
  /** Redis key prefix for permission map cache: `perm_map:` */
  private readonly PERM_MAP_PREFIX = "perm_map:";

  /** Decision cache TTL in seconds (5 minutes) */
  private readonly DECISION_TTL = 300;
  /** Bitset cache TTL in seconds (10 minutes) */
  private readonly BITSET_TTL = 600;
  /** Permission map cache TTL in seconds (10 minutes) */
  private readonly PERM_MAP_TTL = 600;

  /**
   * Creates a new CacheManager instance.
   *
   * @param redis - Redis client instance for caching operations
   */
  constructor(redis: RedisClient) {
    this.redis = redis;
  }

  /**
   * Retrieves a cached authorization decision from Redis.
   *
   * **Version Validation:**
   * If the cached decision's policy version doesn't match the current version,
   * the cache entry is automatically deleted and `null` is returned (cache miss).
   *
   * @param userId - ID of the user whose decision is being checked
   * @param orgId - ID of the organization context
   * @param permissionKey - The permission key (e.g., "channel.create")
   * @param currentVersion - Current policy version from Redis
   * @returns The cached decision if found and fresh, otherwise `null`
   *
   * @example
   * ```typescript
   * const decision = await cacheManager.getCachedDecision(
   *   "user_123",
   *   "org_456",
   *   "channel.create",
   *   7 // current policy version
   * );
   *
   * if (decision) {
   *   console.log(`Cached: ${decision.allowed}`);
   * }
   * ```
   */
  async getCachedDecision(
    userId: string,
    orgId: string,
    permissionKey: string,
    currentVersion: number
  ): Promise<CachedDecision | null> {
    const key = `${this.DECISION_PREFIX}${userId}:${orgId}:${permissionKey}`;
    const raw = await this.redis.get(key);

    if (!raw) return null;

    const cached = JSON.parse(raw) as CachedDecision;

    if (cached.policyVersion !== currentVersion) {
      await this.redis.send("DEL", [key]);
      return null;
    }

    return cached;
  }

  /**
   * Stores an authorization decision in Redis cache.
   *
   * **TTL & Versioning:**
   * The decision is cached with a 300-second (5 minute) TTL and tagged with the current policy version.
   * When the decision is later retrieved, the version is validated. If the policy version has changed,
   * the cached entry is automatically evicted and recomputed.
   *
   * @param userId - ID of the user whose decision is being cached
   * @param orgId - ID of the organization context
   * @param permissionKey - The permission key (e.g., "channel.create")
   * @param allowed - Whether the permission is allowed (true) or denied (false)
   * @param currentVersion - Current policy version from Redis (used for staleness detection)
   * @returns Promise that resolves when the decision is stored
   *
   * @example
   * ```typescript
   * // After computing an authorization decision
   * const allowed = await authorizeWithCasbin(userId, orgId, permissionKey);
   *
   * // Cache the result for 5 minutes
   * await cacheManager.setCachedDecision(
   *   "user_123",
   *   "org_456",
   *   "channel.create",
   *   allowed,
   *   7 // current policy version
   * );
   *
   * // Next check for same user/org/permission will hit cache
   * ```
   */
  async setCachedDecision(
    userId: string,
    orgId: string,
    permissionKey: string,
    allowed: boolean,
    currentVersion: number
  ): Promise<void> {
    const key = `${this.DECISION_PREFIX}${userId}:${orgId}:${permissionKey}`;

    const decision: CachedDecision = {
      allowed,
      policyVersion: currentVersion,
      cachedAt: Date.now(),
    };

    await this.redis.send("SET", [
      key,
      JSON.stringify(decision),
      "EX",
      String(this.DECISION_TTL),
    ]);
  }

  /**
   * Invalidates all cached authorization decisions for a specific user in an organization.
   *
   * **Redis SCAN Pattern:**
   * Uses Redis SCAN command with pattern matching to find all decision cache keys for this user+org.
   * SCAN is non-blocking and cursor-based, making it safe for large datasets without blocking the Redis server.
   * The pattern `perm:<userId>:<orgId>:*` matches all permission keys for this user in this org.
   *
   * **Bulk Deletion:**
   * All matching keys are collected and deleted in a single DEL command for efficiency.
   *
   * @param userId - ID of the user whose cache should be invalidated
   * @param orgId - ID of the organization context
   * @returns Promise that resolves when all matching cache entries are deleted
   *
   * @example
   * ```typescript
   * // When a user's role is changed, invalidate all their cached decisions
   * await cacheManager.invalidateUserCache("user_123", "org_456");
   *
   * // Next authorization check for this user will recompute from Casbin
   * // Pattern matched: perm:user_123:org_456:channel.create, perm:user_123:org_456:message.delete, etc.
   * ```
   */
  async invalidateUserCache(userId: string, orgId: string): Promise<void> {
    const pattern = `${this.DECISION_PREFIX}${userId}:${orgId}:*`;

    const keys: string[] = [];
    let cursor = "0";

    do {
      const result = (await this.redis.send("SCAN", [
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        "100",
      ])) as [string, string[]];
      cursor = result[0];
      keys.push(...result[1]);
    } while (cursor !== "0");

    if (keys.length > 0) {
      await this.redis.send("DEL", keys);
    }
  }

  /**
   * Invalidates all cached authorization decisions for an entire organization.
   *
   * **Redis SCAN Pattern:**
   * Uses Redis SCAN with pattern `perm:*:<orgId>:*` to find all decision cache keys across all users
   * in this organization. SCAN is non-blocking and cursor-based, safe for large datasets.
   *
   * **Use Case:**
   * Called when organization-wide policy changes occur (e.g., role template permissions updated,
   * organization-level policy overrides changed). Ensures all users in the org recompute their decisions.
   *
   * @param orgId - ID of the organization whose cache should be invalidated
   * @returns Promise that resolves when all matching cache entries are deleted
   *
   * @example
   * ```typescript
   * // When org-level permissions change, invalidate all decisions in the org
   * await cacheManager.invalidateOrgCache("org_456");
   *
   * // All users in org_456 will recompute their authorization decisions on next check
   * // Pattern matched: perm:user_123:org_456:*, perm:user_789:org_456:*, etc.
   * ```
   */
  async invalidateOrgCache(orgId: string): Promise<void> {
    const pattern = `${this.DECISION_PREFIX}*:${orgId}:*`;

    const keys: string[] = [];
    let cursor = "0";

    do {
      const result = (await this.redis.send("SCAN", [
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        "100",
      ])) as [string, string[]];
      cursor = result[0];
      keys.push(...result[1]);
    } while (cursor !== "0");

    if (keys.length > 0) {
      await this.redis.send("DEL", keys);
    }
  }

  /**
   * Retrieves a cached permission bitset from Redis.
   *
   * **Version Validation:**
   * If the cached bitset's policy version doesn't match the current version,
   * the cache entry is automatically deleted and `null` is returned (cache miss).
   * This ensures the bitset reflects the latest policy state.
   *
   * **Bitset Purpose:**
   * The bitset is a hex-encoded Uint8Array where each bit represents a permission.
   * A bit being ON means the permission might be allowed (requires Casbin confirmation).
   * A bit being OFF means the permission is definitely denied (no Casbin call needed).
   * This pre-filter eliminates expensive Casbin evaluations for most denial cases.
   *
   * @param userId - ID of the user whose bitset is being retrieved
   * @param orgId - ID of the organization context
   * @param currentVersion - Current policy version from Redis
   * @returns The cached bitset if found and fresh, otherwise `null`
   *
   * @example
   * ```typescript
   * const bitset = await cacheManager.getCachedBitset(
   *   "user_123",
   *   "org_456",
   *   7 // current policy version
   * );
   *
   * if (bitset) {
   *   // Use bitset for fast pre-filtering
   *   const allowed = checkBit(bitset.bitset, permissionBitIndex);
   * }
   * ```
   */
  async getCachedBitset(
    userId: string,
    orgId: string,
    currentVersion: number
  ): Promise<BitsetData | null> {
    const cacheKey = `${this.BITSET_PREFIX}${userId}:${orgId}`;
    const raw = await this.redis.get(cacheKey);

    if (!raw) return null;

    const data = JSON.parse(raw) as BitsetData;

    if (data.policyVersion !== currentVersion) {
      await this.redis.send("DEL", [cacheKey]);
      return null;
    }

    return data;
  }

  /**
   * Stores a compiled permission bitset in Redis cache.
   *
   * **TTL & Versioning:**
   * The bitset is cached with a 600-second (10 minute) TTL and tagged with the current policy version.
   * The bitset is a hex-encoded Uint8Array where each bit index corresponds to a permission.
   * When retrieved, the version is validated. If the policy version has changed, the cached entry
   * is automatically evicted and recompiled.
   *
   * @param userId - ID of the user whose bitset is being cached
   * @param orgId - ID of the organization context
   * @param bitsetData - The compiled bitset data including hex string and policy version
   * @returns Promise that resolves when the bitset is stored
   *
   * @example
   * ```typescript
   * // After compiling a user's permission bitset
   * const bitsetData = {
   *   bitset: "ff00ff00ff00ff00",  // hex-encoded Uint8Array
   *   policyVersion: 7,
   *   compiledAt: Date.now()
   * };
   *
   * await cacheManager.setCachedBitset("user_123", "org_456", bitsetData);
   *
   * // Bitset is now cached for 10 minutes
   * ```
   */
  async setCachedBitset(
    userId: string,
    orgId: string,
    bitsetData: BitsetData
  ): Promise<void> {
    const cacheKey = `${this.BITSET_PREFIX}${userId}:${orgId}`;
    await this.redis.send("SET", [
      cacheKey,
      JSON.stringify(bitsetData),
      "EX",
      String(this.BITSET_TTL),
    ]);
  }

  /**
   * Invalidates the cached permission bitset for a specific user in an organization.
   *
   * **Direct Key Deletion:**
   * Unlike decision cache invalidation which uses SCAN, bitset invalidation directly deletes
   * the single bitset key `bitset:<userId>:<orgId>`. This is efficient since there's only one
   * bitset per user per org.
   *
   * **Use Case:**
   * Called when a user's role assignments or policy overrides change, requiring bitset recompilation.
   *
   * @param userId - ID of the user whose bitset should be invalidated
   * @param orgId - ID of the organization context
   * @returns Promise that resolves when the bitset cache entry is deleted
   *
   * @example
   * ```typescript
   * // When a user's role is assigned or revoked
   * await cacheManager.invalidateBitset("user_123", "org_456");
   *
   * // Next authorization check will recompile the bitset from role assignments
   * ```
   */
  async invalidateBitset(userId: string, orgId: string): Promise<void> {
    const cacheKey = `${this.BITSET_PREFIX}${userId}:${orgId}`;
    await this.redis.send("DEL", [cacheKey]);
  }

  /**
   * Retrieves a cached permission map from Redis.
   *
   * **Version Validation:**
   * If the cached permission map's policy version doesn't match the current version,
   * the cache entry is automatically deleted and `null` is returned (cache miss).
   *
   * **Permission Map Purpose:**
   * The permission map is a complete record of all 59 permissions and whether each is allowed
   * for the user in the organization. It's used for frontend hydration to display UI elements
   * based on user permissions without making individual authorization checks.
   *
   * @param userId - ID of the user whose permission map is being retrieved
   * @param orgId - ID of the organization context
   * @param currentVersion - Current policy version from Redis
   * @returns The cached permission map if found and fresh, otherwise `null`
   *
   * @example
   * ```typescript
   * const permMap = await cacheManager.getCachedPermissionMap(
   *   "user_123",
   *   "org_456",
   *   7 // current policy version
   * );
   *
   * if (permMap) {
   *   // Use for frontend hydration
   *   return {
   *     permissions: permMap.permissions,  // Record<permissionKey, boolean>
   *     computedAt: permMap.computedAt
   *   };
   * }
   * ```
   */
  async getCachedPermissionMap(
    userId: string,
    orgId: string,
    currentVersion: number
  ): Promise<PermissionMap | null> {
    const cacheKey = `${this.PERM_MAP_PREFIX}${userId}:${orgId}`;
    const raw = await this.redis.get(cacheKey);

    if (!raw) return null;

    const map = JSON.parse(raw) as PermissionMap;

    if (map.policyVersion !== currentVersion) {
      await this.redis.send("DEL", [cacheKey]);
      return null;
    }

    return map;
  }

  /**
   * Stores a complete permission map in Redis cache.
   *
   * **TTL & Versioning:**
   * The permission map is cached with a 600-second (10 minute) TTL and tagged with the current
   * policy version. The map contains all 59 permissions and their allow/deny status for the user.
   * When retrieved, the version is validated. If the policy version has changed, the cached entry
   * is automatically evicted and recomputed.
   *
   * **Frontend Hydration:**
   * This cache is used to hydrate the frontend with the user's complete permission state,
   * allowing the UI to conditionally render elements without making individual authorization checks.
   *
   * @param userId - ID of the user whose permission map is being cached
   * @param orgId - ID of the organization context
   * @param permissionMap - The complete permission map with all 59 permissions and their status
   * @returns Promise that resolves when the permission map is stored
   *
   * @example
   * ```typescript
   * // After computing all permissions for a user
   * const permissionMap: PermissionMap = {
   *   userId: "user_123",
   *   orgId: "org_456",
   *   policyVersion: 7,
   *   permissions: {
   *     "channel.create": true,
   *     "channel.delete": false,
   *     "message.create": true,
   *     // ... all 59 permissions
   *   },
   *   computedAt: Date.now()
   * };
   *
   * await cacheManager.setCachedPermissionMap("user_123", "org_456", permissionMap);
   * ```
   */
  async setCachedPermissionMap(
    userId: string,
    orgId: string,
    permissionMap: PermissionMap
  ): Promise<void> {
    const cacheKey = `${this.PERM_MAP_PREFIX}${userId}:${orgId}`;
    await this.redis.send("SET", [
      cacheKey,
      JSON.stringify(permissionMap),
      "EX",
      String(this.PERM_MAP_TTL),
    ]);
  }

  /**
   * Invalidates the cached permission map for a specific user in an organization.
   *
   * **Direct Key Deletion:**
   * Directly deletes the single permission map key `perm_map:<userId>:<orgId>`.
   * This is efficient since there's only one permission map per user per org.
   *
   * **Use Case:**
   * Called when a user's role assignments or policy overrides change, requiring the permission
   * map to be recomputed. This ensures the frontend receives updated permission state.
   *
   * @param userId - ID of the user whose permission map should be invalidated
   * @param orgId - ID of the organization context
   * @returns Promise that resolves when the permission map cache entry is deleted
   *
   * @example
   * ```typescript
   * // When a user's role is assigned or revoked
   * await cacheManager.invalidatePermissionMap("user_123", "org_456");
   *
   * // Next frontend hydration request will recompute the complete permission map
   * ```
   */
  async invalidatePermissionMap(userId: string, orgId: string): Promise<void> {
    const cacheKey = `${this.PERM_MAP_PREFIX}${userId}:${orgId}`;
    await this.redis.send("DEL", [cacheKey]);
  }
}
