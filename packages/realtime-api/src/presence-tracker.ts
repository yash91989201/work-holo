import type { RedisAdapter } from "./redis";

export interface PresenceState {
  connectionId: string;
  state: Record<string, unknown>;
}

export class PresenceTracker {
  private readonly redis: RedisAdapter;

  constructor(redis: RedisAdapter) {
    this.redis = redis;
  }

  async track(
    room: string,
    connectionId: string,
    state: Record<string, unknown>
  ): Promise<void> {
    const key = `presence:${room}`;
    const presenceData = JSON.stringify({ connectionId, state });
    await this.redis.setHash(key, connectionId, presenceData);
  }

  async getPresence(
    room: string,
    connectionId: string
  ): Promise<PresenceState | null> {
    const key = `presence:${room}`;
    const presenceMap = await this.redis.getHash(key);
    const data = presenceMap[connectionId];

    if (!data) {
      return null;
    }

    return JSON.parse(data) as PresenceState;
  }

  async untrack(room: string, connectionId: string): Promise<void> {
    const key = `presence:${room}`;
    await this.redis.deleteHashField(key, connectionId);
  }

  async getPresences(room: string): Promise<PresenceState[]> {
    const key = `presence:${room}`;
    const presenceMap = await this.redis.getHash(key);

    return Object.values(presenceMap).map((data) => {
      const parsed = JSON.parse(data) as PresenceState;
      return parsed;
    });
  }

  async cleanupConnection(
    connectionId: string,
    rooms: string[]
  ): Promise<void> {
    for (const room of rooms) {
      await this.untrack(room, connectionId);
    }
  }
}
