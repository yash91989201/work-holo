import type { RedisClient } from "bun";
import type { BitsetData, CachedDecision, PermissionMap } from "../lib/types";

type RedisClientProvider = () => Promise<RedisClient>;

/**
 * Manages Redis-backed decision, bitset, and permission-map caches.
 */
export class CacheManager {
  private readonly getRedisClient: RedisClientProvider;

  private readonly DECISION_PREFIX = "perm:";
  private readonly BITSET_PREFIX = "bitset:";
  private readonly PERM_MAP_PREFIX = "perm_map:";
  private readonly DECISION_TTL = 300;
  private readonly BITSET_TTL = 600;
  private readonly PERM_MAP_TTL = 600;

  private buildScopeKey(scopeKey?: string): string {
    return scopeKey ?? "org";
  }

  /**
   * Creates a cache manager from a Redis client.
   */
  constructor(redis: RedisClient | RedisClientProvider) {
    this.getRedisClient =
      typeof redis === "function" ? redis : async () => redis;
  }

  /**
   * Returns a cached decision when present and version-aligned.
   */
  async getCachedDecision(
    userId: string,
    orgId: string,
    permissionKey: string,
    currentVersion: number,
    scopeKey?: string
  ): Promise<CachedDecision | null> {
    const redis = await this.getRedisClient();
    const key = `${this.DECISION_PREFIX}${userId}:${orgId}:${this.buildScopeKey(scopeKey)}:${permissionKey}`;
    const raw = await redis.get(key);

    if (!raw) return null;

    const cached = JSON.parse(raw) as CachedDecision;

    if (cached.policyVersion !== currentVersion) {
      await redis.send("DEL", [key]);
      return null;
    }

    return cached;
  }

  /**
   * Stores a versioned authorization decision with TTL.
   */
  async setCachedDecision(
    userId: string,
    orgId: string,
    permissionKey: string,
    allowed: boolean,
    currentVersion: number,
    scopeKey?: string
  ): Promise<void> {
    const redis = await this.getRedisClient();
    const key = `${this.DECISION_PREFIX}${userId}:${orgId}:${this.buildScopeKey(scopeKey)}:${permissionKey}`;

    const decision: CachedDecision = {
      allowed,
      policyVersion: currentVersion,
      cachedAt: Date.now(),
    };

    await redis.send("SET", [
      key,
      JSON.stringify(decision),
      "EX",
      String(this.DECISION_TTL),
    ]);
  }

  /**
   * Clears all decision cache entries for a user within an organization.
   */
  async invalidateUserCache(userId: string, orgId: string): Promise<void> {
    const redis = await this.getRedisClient();
    const pattern = `${this.DECISION_PREFIX}${userId}:${orgId}:*`;

    const keys: string[] = [];
    let cursor = "0";

    do {
      const result = (await redis.send("SCAN", [
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
      await redis.send("DEL", keys);
    }
  }

  /**
   * Clears all decision cache entries for an organization.
   */
  async invalidateOrgCache(orgId: string): Promise<void> {
    const redis = await this.getRedisClient();
    const patterns = [
      `${this.DECISION_PREFIX}*:${orgId}:*`,
      `${this.BITSET_PREFIX}*:${orgId}:*`,
      `${this.PERM_MAP_PREFIX}*:${orgId}`,
    ];

    const keys: string[] = [];

    for (const pattern of patterns) {
      let cursor = "0";
      do {
        const result = (await redis.send("SCAN", [
          cursor,
          "MATCH",
          pattern,
          "COUNT",
          "100",
        ])) as [string, string[]];
        cursor = result[0];
        keys.push(...result[1]);
      } while (cursor !== "0");
    }

    if (keys.length > 0) {
      await redis.send("DEL", keys);
    }
  }

  /**
   * Returns a cached bitset when present and version-aligned.
   */
  async getCachedBitset(
    userId: string,
    orgId: string,
    currentVersion: number,
    scopeKey?: string
  ): Promise<BitsetData | null> {
    const redis = await this.getRedisClient();
    const cacheKey = `${this.BITSET_PREFIX}${userId}:${orgId}:${this.buildScopeKey(scopeKey)}`;
    const raw = await redis.get(cacheKey);

    if (!raw) return null;

    const data = JSON.parse(raw) as BitsetData;

    if (data.policyVersion !== currentVersion) {
      await redis.send("DEL", [cacheKey]);
      return null;
    }

    return data;
  }

  /**
   * Stores a versioned permission bitset with TTL.
   */
  async setCachedBitset(
    userId: string,
    orgId: string,
    bitsetData: BitsetData,
    scopeKey?: string
  ): Promise<void> {
    const redis = await this.getRedisClient();
    const cacheKey = `${this.BITSET_PREFIX}${userId}:${orgId}:${this.buildScopeKey(scopeKey)}`;
    await redis.send("SET", [
      cacheKey,
      JSON.stringify(bitsetData),
      "EX",
      String(this.BITSET_TTL),
    ]);
  }

  /**
   * Deletes the bitset cache entry for a user and organization.
   */
  async invalidateBitset(userId: string, orgId: string): Promise<void> {
    const redis = await this.getRedisClient();
    const pattern = `${this.BITSET_PREFIX}${userId}:${orgId}:*`;

    const keys: string[] = [];
    let cursor = "0";

    do {
      const result = (await redis.send("SCAN", [
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
      await redis.send("DEL", keys);
    }
  }

  /**
   * Returns a cached permission map when present and version-aligned.
   */
  async getCachedPermissionMap(
    userId: string,
    orgId: string,
    currentVersion: number
  ): Promise<PermissionMap | null> {
    const redis = await this.getRedisClient();
    const cacheKey = `${this.PERM_MAP_PREFIX}${userId}:${orgId}`;
    const raw = await redis.get(cacheKey);

    if (!raw) return null;

    const map = JSON.parse(raw) as PermissionMap;

    if (map.policyVersion !== currentVersion) {
      await redis.send("DEL", [cacheKey]);
      return null;
    }

    return map;
  }

  /**
   * Stores a versioned permission map with TTL for frontend hydration.
   */
  async setCachedPermissionMap(
    userId: string,
    orgId: string,
    permissionMap: PermissionMap
  ): Promise<void> {
    const redis = await this.getRedisClient();
    const cacheKey = `${this.PERM_MAP_PREFIX}${userId}:${orgId}`;
    await redis.send("SET", [
      cacheKey,
      JSON.stringify(permissionMap),
      "EX",
      String(this.PERM_MAP_TTL),
    ]);
  }

  /**
   * Deletes the permission-map cache entry for a user and organization.
   */
  async invalidatePermissionMap(userId: string, orgId: string): Promise<void> {
    const redis = await this.getRedisClient();
    const cacheKey = `${this.PERM_MAP_PREFIX}${userId}:${orgId}`;
    await redis.send("DEL", [cacheKey]);
  }
}
