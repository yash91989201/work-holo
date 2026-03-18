import { RedisClient } from "bun";

export interface RedisConfig {
  url: string;
}

let client: RedisClient | null = null;
let connectPromise: Promise<RedisClient> | null = null;
let lastConfig: RedisConfig | null = null;
let isClosed = false;
let connectGeneration = 0;

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
    isClosed = false;
    lastConfig = config;

    if (client?.connected) return client;
    if (connectPromise) return await connectPromise;

    const attemptGeneration = ++connectGeneration;
    const pendingConnect = (async () => {
      const c = createClient(config.url);
      try {
        await c.connect();

        if (isClosed || attemptGeneration !== connectGeneration) {
          c.close();
          throw new Error("Redis connection attempt was closed or superseded.");
        }

        client = c;
        return c;
      } catch (err) {
        console.error("[redis] initial connect failed:", err);
        client = null;
        if (attemptGeneration === connectGeneration) {
          connectPromise = null;
        }
        throw err;
      }
    })();

    connectPromise = pendingConnect;
    return await pendingConnect;
  }

  static async getClient(): Promise<RedisClient> {
    if (client?.connected) {
      return client;
    }

    if (isClosed) {
      throw new Error(
        "Redis client is closed. Call Redis.connect() to reconnect."
      );
    }

    if (connectPromise) {
      return await connectPromise;
    }

    if (lastConfig && !isClosed) {
      return await Redis.connect(lastConfig);
    }

    throw new Error("Redis client not connected. Call Redis.connect() first.");
  }

  static close(): void {
    connectGeneration += 1;

    if (client) {
      client.close();
    }

    client = null;
    connectPromise = null;
    isClosed = true;
  }

  static reset(): void {
    connectGeneration += 1;
    client = null;
    connectPromise = null;
    lastConfig = null;
    isClosed = false;
  }

  static setClient(c: RedisClient): void {
    connectGeneration += 1;
    client = c;
    connectPromise = null;
    isClosed = false;
  }
}
