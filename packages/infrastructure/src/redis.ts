import { RedisClient } from "bun";

export interface RedisConfig {
  url: string;
}

let client: RedisClient | null = null;
let connectPromise: Promise<RedisClient> | null = null;

function createClient(url: string): RedisClient {
  const c = new RedisClient(url);

  c.onconnect = () => {
    console.log("[redis] connected");
  };

  c.onclose = (err) => {
    console.error("[redis] connection closed:", err);
    client = null;
    connectPromise = null;
  };

  return c;
}

// biome-ignore lint/complexity/noStaticOnlyClass: Singleton pattern with encapsulated state
export class Redis {
  static async connect(config: RedisConfig): Promise<RedisClient> {
    if (client?.connected) return client;
    if (connectPromise) return connectPromise;

    connectPromise = (async () => {
      const c = createClient(config.url);
      try {
        await c.connect();
        client = c;
        return c;
      } catch (err) {
        console.error("[redis] initial connect failed:", err);
        client = null;
        connectPromise = null;
        throw err;
      }
    })();

    return connectPromise;
  }

  static getClient(): RedisClient {
    if (!client?.connected) {
      throw new Error(
        "Redis client not connected. Call Redis.connect() first."
      );
    }
    return client;
  }

  static close(): void {
    if (client) {
      client.close();
      client = null;
      connectPromise = null;
    }
  }

  static reset(): void {
    client = null;
    connectPromise = null;
  }

  static setClient(c: RedisClient): void {
    client = c;
    connectPromise = null;
  }
}
