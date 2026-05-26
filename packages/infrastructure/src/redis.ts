import { RedisClient } from "bun";

export interface RedisConfig {
  url: string;
}

let client: RedisClient | null = null;

// biome-ignore lint/complexity/noStaticOnlyClass: Singleton pattern with encapsulated state
export class Redis {
  static async connect({ url }: RedisConfig): Promise<RedisClient> {
    if (!client) {
      client = new RedisClient(url);

      client.onconnect = () => {
        console.log("[redis] connected");
      };

      client.onclose = (err) => {
        console.error("[redis] connection closed:", err);
      };
    }

    return await Redis.getClient();
  }

  static async getClient(): Promise<RedisClient> {
    if (!client) {
      throw new Error(
        "Redis client not connected. Call Redis.connect() first."
      );
    }

    if (!client.connected) {
      await client.connect();
    }

    return client;
  }
}
