import { RedisClient } from "bun";
import { env } from "../env";

let client: RedisClient | null = null;
let connectPromise: Promise<RedisClient> | null = null;

function createClient(): RedisClient {
  const c = new RedisClient(env.REDIS_URL);

  c.onconnect = () => {
    console.log("[redis] connected");
  };

  c.onclose = (err) => {
    console.error("[redis] connection closed:", err);
    // Mark as unusable so we create a new one next time
    client = null;
    connectPromise = null;
  };

  return c;
}

function connectClient() {
  if (client?.connected) return client;
  if (connectPromise) return connectPromise;

  connectPromise = (async () => {
    const c = createClient();
    try {
      await c.connect();
      client = c;
      return c;
    } catch (err) {
      console.error("[redis] initial connect failed:", err);
      // Important: don’t keep a broken client/promise around
      client = null;
      connectPromise = null;
      throw err;
    }
  })();

  return connectPromise;
}

export async function getRedisClient(): Promise<RedisClient> {
  return await connectClient();
}

export function closeRedisClient(): void {
  if (client) {
    client.close();
    client = null;
    connectPromise = null;
  }
}

export const PRESENCE_KEY_PREFIX = "presence:user:";

export function getPresenceKey(userId: string): string {
  return `${PRESENCE_KEY_PREFIX}${userId}`;
}
