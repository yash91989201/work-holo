import { log } from "evlog";
import { createClient, type RedisClientType } from "redis";

export interface RedisConfig {
  url: string;
}

export type RedisClient = RedisClientType;

const TAG = "redis";

let client: RedisClient | null = null;

export const Redis = {
  async connect({ url }: RedisConfig): Promise<RedisClient> {
    if (!client) {
      client = createClient({
        url,
        socket: {
          keepAlive: true,
          keepAliveInitialDelay: 30_000,
          reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
        },
        pingInterval: 30_000,
      });
      client.on("connect", () => log.info(TAG, "connected"));
      client.on("ready", () => log.info(TAG, "ready"));
      client.on("error", (err) => log.error(TAG, `${err}`));
      client.on("end", () => log.warn(TAG, "connection closed"));
      client.on("reconnecting", () => log.warn(TAG, "reconnecting"));
      await client.connect();
    }
    return Redis.getClient();
  },

  getClient(): RedisClient {
    if (!client) {
      throw new Error(
        "Redis client not connected. Call Redis.connect() first."
      );
    }
    return client;
  },

  isConnected(): boolean {
    return client?.isReady ?? false;
  },

  async close(): Promise<void> {
    if (client) {
      await client.quit();
      client = null;
      log.info(TAG, "closed");
    }
  },
};
