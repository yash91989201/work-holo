import { getRedisClient } from "@work-holo/api/lib/redis";
import { auth } from "@work-holo/auth";
import { db } from "@work-holo/db";
import type { RedisClient } from "bun";
import type { Context as HonoContext } from "hono";

export type CreateContextOptions = {
  context: HonoContext;
};

export type Context = {
  headers: Headers;
  session: Awaited<ReturnType<typeof auth.api.getSession>>;
  db: typeof db;
  redis: RedisClient;
};

export type ElectricContext = Omit<Context, "redis">;

export async function createContext({
  context,
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
  };
}

export async function createElectricContext({
  context,
}: CreateContextOptions): Promise<ElectricContext> {
  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  });

  return {
    headers: context.req.raw.headers,
    session,
    db,
  };
}
