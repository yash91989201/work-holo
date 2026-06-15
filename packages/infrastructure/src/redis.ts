import { log } from "evlog";
import Ioredis from "ioredis";

export interface RedisConfig {
  url: string;
}

export type RedisClient = Ioredis;

const TAG = "redis";

let client: Ioredis | null = null;

export const Redis = {
  async connect({ url }: RedisConfig): Promise<Ioredis> {
    if (!client) {
      client = new Ioredis(url, {
        // TCP keepalive stops idle proxies (Coolify/Traefik) from reaping the
        // socket overnight — the morning drop. Auto-reconnect + offline queue
        // are on by default, so commands during a blip are queued, not rejected.
        keepAlive: 30_000,
      });
      client.on("connect", () => log.info(TAG, "connected"));
      client.on("error", (err) => log.error(TAG, `${err}`));
      client.on("close", () => log.warn(TAG, "connection closed"));
      client.on("reconnecting", () => log.warn(TAG, "reconnecting"));
    }
    return Redis.getClient();
  },

  async getClient(): Promise<Ioredis> {
    if (!client) {
      throw new Error(
        "Redis client not connected. Call Redis.connect() first."
      );
    }
    return client;
  },

  isConnected(): boolean {
    return client?.status === "ready";
  },

  async close(): Promise<void> {
    if (client) {
      await client.quit();
      client = null;
      log.info(TAG, "closed");
    }
  },
};
