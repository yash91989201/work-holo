import Pusher from "pusher";

export interface PusherConfig {
  appId: string;
  host: string;
  key: string;
  port?: number;
  secret: string;
  useTLS: boolean;
}

let instance: Pusher | null = null;

// biome-ignore lint/complexity/noStaticOnlyClass: Singleton pattern with encapsulated state
export class PusherClient {
  static connect(config: PusherConfig): Pusher {
    instance = new Pusher({
      appId: config.appId,
      key: config.key,
      secret: config.secret,
      host: config.host,
      port: config.port?.toString(),
      useTLS: config.useTLS,
    });
    return instance;
  }

  static getClient(): Pusher {
    if (!instance) {
      throw new Error(
        "Pusher client not initialized. Call PusherClient.connect() first."
      );
    }
    return instance;
  }

  static reset(): void {
    instance = null;
  }

  static setClient(p: Pusher): void {
    instance = p;
  }
}
