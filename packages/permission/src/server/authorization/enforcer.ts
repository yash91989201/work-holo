import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { casbinRule } from "@work-holo/db/schema/casbin";
import { type Enforcer, newEnforcer } from "casbin";
import DrizzleAdapter from "drizzle-adapter";
import { getDb, getRedisClient } from "../config";

const currentDir = dirname(fileURLToPath(import.meta.url));
const MODEL_CONF_PATH = resolve(currentDir, "model.conf");

const POLICY_VERSION_PREFIX = "policy_version:";

let enforcerPromise: Promise<Enforcer> | null = null;
let reloadLock = false;

// In-memory cache for fast local reads (validated against Redis)
const localVersionCache = new Map<string, number>();

export function getCasbinEnforcer(): Promise<Enforcer> {
  if (!enforcerPromise) {
    enforcerPromise = (async () => {
      const db = getDb();
      const adapter = await DrizzleAdapter.newAdapter({
        db,
        table: casbinRule,
      });
      const enforcer = await newEnforcer(MODEL_CONF_PATH, adapter);
      await enforcer.loadPolicy();
      return enforcer;
    })();
  }

  return enforcerPromise;
}

export async function reloadPolicies(): Promise<void> {
  if (reloadLock) return;
  reloadLock = true;
  try {
    const enforcer = await getCasbinEnforcer();
    await enforcer.loadPolicy();
  } finally {
    reloadLock = false;
  }
}

export async function getPolicyVersion(orgId: string): Promise<number> {
  const redis = await getRedisClient();
  const key = `${POLICY_VERSION_PREFIX}${orgId}`;
  const raw = await redis.get(key);

  if (raw) {
    const version = Number.parseInt(raw, 10);
    localVersionCache.set(orgId, version);
    return version;
  }

  return localVersionCache.get(orgId) ?? 0;
}

export async function setPolicyVersion(
  orgId: string,
  version: number
): Promise<void> {
  const redis = await getRedisClient();
  const key = `${POLICY_VERSION_PREFIX}${orgId}`;
  await redis.send("SET", [key, String(version)]);
  localVersionCache.set(orgId, version);
}

export function resetEnforcer(): void {
  enforcerPromise = null;
  localVersionCache.clear();
}
