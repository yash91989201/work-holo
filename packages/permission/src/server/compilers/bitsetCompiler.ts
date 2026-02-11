import {
  policyOverrideTable,
  roleAssignmentTable,
  rolePermissionTable,
} from "@work-holo/db/schema/authorization";
import { and, eq, gt, isNull, or } from "drizzle-orm";
import type { BitsetData } from "../../core/types";
import { PERMISSION_BY_KEY, TOTAL_PERMISSIONS } from "../../dsl/vocabulary";
import { getPolicyVersion } from "../authorization/enforcer";
import { getDb, getRedisClient } from "../config";

const BITSET_CACHE_PREFIX = "bitset:";
const BITSET_TTL_SECONDS = 600;

function createEmptyBitset(): Uint8Array {
  return new Uint8Array(Math.ceil(TOTAL_PERMISSIONS / 8));
}

function setBit(bitset: Uint8Array, index: number): void {
  const byteIndex = Math.floor(index / 8);
  const bitPosition = index % 8;
  if (byteIndex < bitset.length) {
    bitset[byteIndex] = (bitset[byteIndex] ?? 0) | (1 << bitPosition);
  }
}

function bitsetToHex(bitset: Uint8Array): string {
  return Array.from(bitset)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function getUserPermissionKeys(
  userId: string,
  orgId: string
): Promise<Set<string>> {
  const db = getDb();
  const permissionKeys = new Set<string>();

  const assignments = await db.query.roleAssignmentTable.findMany({
    where: eq(roleAssignmentTable.userId, userId),
    columns: { roleTemplateId: true },
    with: {
      roleTemplate: {
        columns: { id: true },
      },
    },
  });

  const templateIds = assignments.map((a) => a.roleTemplateId);

  for (const templateId of templateIds) {
    const rolePerms = await db.query.rolePermissionTable.findMany({
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

  const overrides = await db.query.policyOverrideTable.findMany({
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

export async function compileBitset(
  userId: string,
  orgId: string
): Promise<BitsetData> {
  const permissionKeys = await getUserPermissionKeys(userId, orgId);
  const bitset = createEmptyBitset();

  for (const key of permissionKeys) {
    const entry = PERMISSION_BY_KEY.get(key);
    if (entry) {
      setBit(bitset, entry.bitIndex);
    }
  }

  const currentVersion = await getPolicyVersion(orgId);
  const data: BitsetData = {
    bitset: bitsetToHex(bitset),
    policyVersion: currentVersion,
    compiledAt: Date.now(),
  };

  const redis = await getRedisClient();
  const cacheKey = `${BITSET_CACHE_PREFIX}${userId}:${orgId}`;
  await redis.send("SET", [
    cacheKey,
    JSON.stringify(data),
    "EX",
    String(BITSET_TTL_SECONDS),
  ]);

  return data;
}

export async function getCachedBitset(
  userId: string,
  orgId: string
): Promise<BitsetData | null> {
  const redis = await getRedisClient();
  const cacheKey = `${BITSET_CACHE_PREFIX}${userId}:${orgId}`;
  const raw = await redis.get(cacheKey);

  if (!raw) return null;

  const data = JSON.parse(raw) as BitsetData;

  const currentVersion = await getPolicyVersion(orgId);
  if (data.policyVersion !== currentVersion) {
    await redis.send("DEL", [cacheKey]);
    return null;
  }

  return data;
}

export async function getOrCompileBitset(
  userId: string,
  orgId: string
): Promise<BitsetData> {
  const cached = await getCachedBitset(userId, orgId);
  if (cached) return cached;
  return compileBitset(userId, orgId);
}

export async function invalidateBitset(
  userId: string,
  orgId: string
): Promise<void> {
  const redis = await getRedisClient();
  const cacheKey = `${BITSET_CACHE_PREFIX}${userId}:${orgId}`;
  await redis.send("DEL", [cacheKey]);
}
