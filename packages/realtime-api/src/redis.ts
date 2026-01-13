import Redis from "ioredis";

export interface PubSubMessage {
  room: string;
  event: string;
  payload: Record<string, unknown>;
  senderId?: string;
}

export class RedisAdapter {
  private readonly pubClient: Redis;
  private readonly subClient: Redis;
  private readonly subscriptions = new Map<
    string,
    Set<(msg: PubSubMessage) => void>
  >();

  constructor(redisUrl: string) {
    this.pubClient = new Redis(redisUrl);
    this.subClient = new Redis(redisUrl);

    this.subClient.on("message", (channel: string, message: string) => {
      const callbacks = this.subscriptions.get(channel);
      if (callbacks) {
        try {
          const parsed = JSON.parse(message) as PubSubMessage;
          for (const cb of callbacks) {
            cb(parsed);
          }
        } catch (error) {
          console.error("Failed to parse Redis message:", error);
        }
      }
    });
  }

  async publish(room: string, message: PubSubMessage): Promise<void> {
    await this.pubClient.publish(`room:${room}`, JSON.stringify(message));
  }

  async subscribe(
    room: string,
    callback: (msg: PubSubMessage) => void
  ): Promise<void> {
    const channel = `room:${room}`;

    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Set());
      await this.subClient.subscribe(channel);
    }

    const callbacks = this.subscriptions.get(channel);
    if (callbacks) {
      callbacks.add(callback);
    }
  }

  async unsubscribe(
    room: string,
    callback: (msg: PubSubMessage) => void
  ): Promise<void> {
    const channel = `room:${room}`;
    const callbacks = this.subscriptions.get(channel);

    if (callbacks) {
      callbacks.delete(callback);

      if (callbacks.size === 0) {
        this.subscriptions.delete(channel);
        await this.subClient.unsubscribe(channel);
      }
    }
  }

  async disconnect(): Promise<void> {
    await this.pubClient.quit();
    await this.subClient.quit();
  }

  async setHash(key: string, field: string, value: string): Promise<void> {
    await this.pubClient.hset(key, field, value);
  }

  async getHash(key: string): Promise<Record<string, string>> {
    return await this.pubClient.hgetall(key);
  }

  async deleteHashField(key: string, field: string): Promise<void> {
    await this.pubClient.hdel(key, field);
  }
}
