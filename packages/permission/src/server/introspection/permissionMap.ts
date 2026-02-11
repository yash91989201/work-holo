import {
  permissionSnapshotTable,
  policyVersionTable,
} from "@work-holo/db/schema/authorization";
import { and, desc, eq } from "drizzle-orm";
import type { PermissionMap } from "../../core/types";
import { PERMISSIONS } from "../../dsl/vocabulary";
import { getCasbinEnforcer, getPolicyVersion } from "../authorization/enforcer";
import { getDb, getRedisClient } from "../config";

const SNAPSHOT_CACHE_PREFIX = "perm_map:";
const SNAPSHOT_TTL_SECONDS = 600;

async function getLatestVersionId(orgId: string): Promise<string | null> {
  const db = getDb();
  const row = await db.query.policyVersionTable.findFirst({
    where: and(
      eq(policyVersionTable.organizationId, orgId),
      eq(policyVersionTable.status, "compiled")
    ),
    orderBy: [desc(policyVersionTable.version)],
    columns: { id: true },
  });
  return row?.id ?? null;
}

async function loadSnapshotFromDb(
  userId: string,
  orgId: string
): Promise<PermissionMap | null> {
  const db = getDb();
  const row = await db.query.permissionSnapshotTable.findFirst({
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

async function computePermissionMap(
  userId: string,
  orgId: string
): Promise<PermissionMap> {
  const enforcer = await getCasbinEnforcer();
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

  const currentVersion = await getPolicyVersion(orgId);
  return {
    userId,
    orgId,
    policyVersion: currentVersion,
    permissions,
    computedAt: Date.now(),
  };
}

async function saveSnapshot(
  userId: string,
  orgId: string,
  permissionMap: PermissionMap
): Promise<void> {
  const db = getDb();
  const versionId = await getLatestVersionId(orgId);
  if (!versionId) return;

  const existing = await db.query.permissionSnapshotTable.findFirst({
    where: and(
      eq(permissionSnapshotTable.userId, userId),
      eq(permissionSnapshotTable.organizationId, orgId)
    ),
    columns: { id: true },
  });

  if (existing) {
    await db
      .update(permissionSnapshotTable)
      .set({
        policyVersionId: versionId,
        bitset: "",
        permissionMap: JSON.stringify(permissionMap),
        computedAt: new Date(),
      })
      .where(eq(permissionSnapshotTable.id, existing.id));
  } else {
    await db.insert(permissionSnapshotTable).values({
      userId,
      organizationId: orgId,
      policyVersionId: versionId,
      bitset: "",
      permissionMap: JSON.stringify(permissionMap),
    });
  }
}

async function cachePermissionMap(
  userId: string,
  orgId: string,
  permissionMap: PermissionMap
): Promise<void> {
  const redis = await getRedisClient();
  const cacheKey = `${SNAPSHOT_CACHE_PREFIX}${userId}:${orgId}`;
  await redis.send("SET", [
    cacheKey,
    JSON.stringify(permissionMap),
    "EX",
    String(SNAPSHOT_TTL_SECONDS),
  ]);
}

async function getCachedPermissionMap(
  userId: string,
  orgId: string
): Promise<PermissionMap | null> {
  const redis = await getRedisClient();
  const cacheKey = `${SNAPSHOT_CACHE_PREFIX}${userId}:${orgId}`;
  const raw = await redis.get(cacheKey);

  if (!raw) return null;

  const map = JSON.parse(raw) as PermissionMap;

  const currentVersion = await getPolicyVersion(orgId);
  if (map.policyVersion !== currentVersion) {
    await redis.send("DEL", [cacheKey]);
    return null;
  }

  return map;
}

export async function buildPermissionMap(
  userId: string,
  orgId: string
): Promise<PermissionMap> {
  const cached = await getCachedPermissionMap(userId, orgId);
  if (cached) return cached;

  const dbSnapshot = await loadSnapshotFromDb(userId, orgId);
  const policyVersion = await getPolicyVersion(orgId);
  if (dbSnapshot && dbSnapshot.policyVersion === policyVersion) {
    await cachePermissionMap(userId, orgId, dbSnapshot);
    return dbSnapshot;
  }

  const permissionMap = await computePermissionMap(userId, orgId);

  await Promise.all([
    saveSnapshot(userId, orgId, permissionMap),
    cachePermissionMap(userId, orgId, permissionMap),
  ]);

  return permissionMap;
}

export async function invalidatePermissionMap(
  userId: string,
  orgId: string
): Promise<void> {
  const redis = await getRedisClient();
  const cacheKey = `${SNAPSHOT_CACHE_PREFIX}${userId}:${orgId}`;
  await redis.send("DEL", [cacheKey]);
}
