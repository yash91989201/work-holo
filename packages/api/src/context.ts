import { auth } from "@work-holo/auth";
import { db } from "@work-holo/db";
import type { RedisClient } from "bun";
import type { Context as HonoContext } from "hono";

export type CreateContextOptions = {
  context: HonoContext;
  redis: RedisClient;
};

export type Context = {
  headers: Headers;
  session: Awaited<ReturnType<typeof auth.api.getSession>>;
  db: typeof db;
  redis: RedisClient;
};

export async function createContext({
  context,
  redis,
}: CreateContextOptions): Promise<Context> {
  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  });

  return {
    headers: context.req.raw.headers,
    session,
    db,
    redis,
  };
}
