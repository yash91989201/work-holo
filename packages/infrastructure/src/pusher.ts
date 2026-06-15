import { log } from "evlog";
import Pusher from "pusher";

export interface PusherConfig {
  appId: string;
  host: string;
  key: string;
  port?: number;
  secret: string;
  useTLS: boolean;
}

const TAG = "pusher";

let instance: Pusher | null = null;

/**
 * Pusher connection manager.
 *
 * The Pusher SDK is a stateless HTTP client, so this is a simple construct-once
 * singleton kept on the same lifecycle shape as the other services.
 */
export const PusherClient = {
  connect(config: PusherConfig): Pusher {
    if (!instance) {
      instance = new Pusher({
        appId: config.appId,
        key: config.key,
        secret: config.secret,
        host: config.host,
        port: config.port?.toString(),
        useTLS: config.useTLS,
      });
      log.info(TAG, "initialized");
    }
    return instance;
  },

  getClient(): Pusher {
    if (!instance) {
      throw new Error(
        "Pusher client not initialized. Call PusherClient.connect() first."
      );
    }
    return instance;
  },

  isConnected(): boolean {
    return instance !== null;
  },

  close(): void {
    instance = null;
    log.info(TAG, "closed");
  },
};
