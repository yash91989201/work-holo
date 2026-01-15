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
		// FIX: Enable ports when deploying on k3s, disabled for now to work on coolify
		wsPort: env.VITE_ENV === "development" ? env.VITE_PUSHER_PORT : undefined,
		wssPort: env.VITE_ENV === "development" ? env.VITE_PUSHER_PORT : undefined,
		forceTLS: env.VITE_ENV === "production",
		disableStats: true,
		enabledTransports: ["ws", "wss"],
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
