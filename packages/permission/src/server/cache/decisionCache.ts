import type { CachedDecision } from "../../core/types";
import { getPolicyVersion } from "../authorization/enforcer";
import { getRedisClient } from "../config";

const CACHE_PREFIX = "perm:";
const CACHE_TTL_SECONDS = 300;

function buildCacheKey(
  userId: string,
  orgId: string,
  permissionKey: string
): string {
  return `${CACHE_PREFIX}${userId}:${orgId}:${permissionKey}`;
}

export async function getCachedDecision(
  userId: string,
  orgId: string,
  permissionKey: string
): Promise<CachedDecision | null> {
  const redis = await getRedisClient();
  const key = buildCacheKey(userId, orgId, permissionKey);
  const raw = await redis.get(key);

  if (!raw) return null;

  const cached = JSON.parse(raw) as CachedDecision;
  const currentVersion = await getPolicyVersion(orgId);

  if (cached.policyVersion !== currentVersion) {
    await redis.send("DEL", [key]);
    return null;
  }

  return cached;
}

export async function setCachedDecision(
  userId: string,
  orgId: string,
  permissionKey: string,
  allowed: boolean
): Promise<void> {
  const redis = await getRedisClient();
  const key = buildCacheKey(userId, orgId, permissionKey);
  const currentVersion = await getPolicyVersion(orgId);

  const decision: CachedDecision = {
    allowed,
    policyVersion: currentVersion,
    cachedAt: Date.now(),
  };

  await redis.send("SET", [
    key,
    JSON.stringify(decision),
    "EX",
    String(CACHE_TTL_SECONDS),
  ]);
}

export async function invalidateUserCache(
  userId: string,
  orgId: string
): Promise<void> {
  const redis = await getRedisClient();
  const pattern = `${CACHE_PREFIX}${userId}:${orgId}:*`;

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

export async function invalidateOrgCache(orgId: string): Promise<void> {
  const redis = await getRedisClient();
  const pattern = `${CACHE_PREFIX}*:${orgId}:*`;

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
