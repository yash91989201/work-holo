import type { db as dbClient } from "@work-holo/db";
import type { RedisClient } from "bun";

export type Database = typeof dbClient;

export type PusherLike = {
  trigger(channel: string, event: string, data: unknown): Promise<unknown>;
};

export type PermissionConfig = {
  db: Database;
  getRedisClient: () => Promise<RedisClient>;
  pusher?: PusherLike;
};

let _config: PermissionConfig | null = null;

export function initPermission(config: PermissionConfig): void {
  _config = config;
}

export function getConfig(): PermissionConfig {
  if (!_config) {
    throw new Error(
      "Permission system not initialized. Call initPermission() first."
    );
  }
  return _config;
}

export function getDb(): Database {
  return getConfig().db;
}

export function getRedisClient(): Promise<RedisClient> {
  return getConfig().getRedisClient();
}

export function getPusher(): PusherLike | undefined {
  return getConfig().pusher;
}
