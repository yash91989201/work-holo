import { env } from "@work-holo/env/web";
import Pusher from "pusher-js";
import { orpcClient } from "@/utils/orpc";

export type { Channel, PresenceChannel } from "pusher-js";

let pusherClient: Pusher | null = null;

export function getPusherClient(): Pusher {
  if (pusherClient) {
    return pusherClient;
  }

  pusherClient = new Pusher(env.VITE_PUSHER_KEY, {
    wsHost: env.VITE_PUSHER_HOST,
    wsPort: env.VITE_PUSHER_PORT,
    wssPort: env.VITE_PUSHER_PORT,
    forceTLS: false,
    disableStats: true,
    // TODO: temporary change to add xhr_streaming to make it work with coolify. change later
    enabledTransports: ["ws", "wss", "xhr_streaming"],
    cluster: "mt1",
    authorizer: (channel) => ({
      authorize: async (socketId, callback) => {
        try {
          const response = await orpcClient.realtime.authorize({
            socketId,
            channelName: channel.name,
          });
          callback(null, response);
        } catch (error) {
          callback(error as Error, null);
        }
      },
    }),
  });

  return pusherClient;
}

export function disconnectPusher(): void {
  if (pusherClient) {
    pusherClient.disconnect();
    pusherClient = null;
  }
}
