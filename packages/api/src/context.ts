import { auth } from "@work-holo/auth";
import { db } from "@work-holo/db";
import { Redis } from "@work-holo/infrastructure";
import type { PermissionService } from "@work-holo/permission";
import type { Context as HonoContext } from "hono";
import type { NotificationService } from "./services/notification";
import type { StorageService } from "./services/storage";

export type CreateContextOptions = {
  context: HonoContext;
};

export type Context = {
  headers: Headers;
  session: Awaited<ReturnType<typeof auth.api.getSession>>;
  db: typeof db;
  redis: ReturnType<typeof Redis.getClient>;
  permission?: PermissionService;
  notification?: NotificationService;
  storage?: StorageService;
  orgId?: string;
  orgMembership?: {
    memberId: string;
    role: string;
  };
};

export type ElectricContext = Omit<Context, "redis">;

export async function createContext({
  context,
}: CreateContextOptions): Promise<Context> {
  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  });

  const redis = Redis.getClient();

  return {
    headers: context.req.raw.headers,
    session,
    db,
    redis,
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
