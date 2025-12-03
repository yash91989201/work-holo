import { RedisClient } from "bun";
import { env } from "../env";

function createRedisClient(): RedisClient {
  return new RedisClient(env.REDIS_URL);
}

const redisClient: RedisClient = createRedisClient();

const connectionPromise: Promise<void> = (async () => {
  try {
    await redisClient.connect();
    console.log("✅ Redis connected successfully");
  } catch (err) {
    console.error("❌ Redis connection failed:", err);
    process.exit(1);
  }
})();

export async function getRedisClient(): Promise<RedisClient> {
  await connectionPromise;
  return redisClient;
}

export function closeRedisClient(): void {
  if (redisClient) {
    redisClient.close();
  }
}

export const PRESENCE_KEY_PREFIX = "presence:user:";

export function getPresenceKey(userId: string): string {
  return `${PRESENCE_KEY_PREFIX}${userId}`;
}
