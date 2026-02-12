import { getRedisClient } from "@work-holo/api/lib/redis";
import { auth } from "@work-holo/auth";
import { db } from "@work-holo/db";
import type {
  AuthorizationEngine,
  CacheManager,
  PermissionEventManager,
  PermissionMapManager,
  PermissionService,
  PolicyManager,
} from "@work-holo/permission";
import type { RedisClient } from "bun";
import type { Context as HonoContext } from "hono";

export type CreateContextOptions = {
  context: HonoContext;
  permissionManagers: {
    authorizationEngine: AuthorizationEngine;
    cacheManager: CacheManager;
    policyManager: PolicyManager;
    eventManager: PermissionEventManager;
    permissionMapManager: PermissionMapManager;
  };
};

export type Context = {
  headers: Headers;
  session: Awaited<ReturnType<typeof auth.api.getSession>>;
  db: typeof db;
  redis: RedisClient;
  permission?: PermissionService;
  orgId?: string;
  orgMembership?: {
    memberId: string;
    role: string;
  };
  permissionManagers: {
    authorizationEngine: AuthorizationEngine;
    cacheManager: CacheManager;
    policyManager: PolicyManager;
    eventManager: PermissionEventManager;
    permissionMapManager: PermissionMapManager;
  };
};

export type ElectricContext = Omit<Context, "redis" | "permissionManagers">;

export async function createContext({
  context,
  permissionManagers,
}: CreateContextOptions): Promise<Context> {
  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  });

  const redis = await getRedisClient();

  return {
    headers: context.req.raw.headers,
    session,
    db,
    redis,
    permissionManagers,
  };
}

export async function createElectricContext({
  context,
}: {
  context: HonoContext;
}): Promise<ElectricContext> {
  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  });

  return {
    headers: context.req.raw.headers,
    session,
    db,
  };
}
