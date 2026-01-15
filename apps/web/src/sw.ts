/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener("install", (_event: ExtendableEvent) => {
	console.log("[Service Worker] Installing");
	sw.skipWaiting();
});

sw.addEventListener("activate", (event: ExtendableEvent) => {
	event.waitUntil(sw.clients.claim());
});

sw.addEventListener("push", (event: PushEvent) => {
	if (!event.data) {
		return;
	}

	try {
		const data = event.data.json();

		const options: NotificationOptions = {
			body: data.body,
			icon: data.icon,
			badge: data.badge,
			tag: data.tag,
			data: data.data,
			requireInteraction: false,
			silent: false,
		};

		if ("vibrate" in Notification.prototype) {
			(options as unknown as { vibrate: number[] }).vibrate = [200, 100, 200];
		}

		event.waitUntil(
			(async () => {
				await sw.registration.showNotification(data.title, options);

				// Ask open clients to play a sound (Chromium on Linux does not play sounds for notifications)
				const clients = await sw.clients.matchAll({
					type: "window",
					includeUncontrolled: true,
				});
				for (const client of clients) {
					client.postMessage({
						type: "PLAY_NOTIFICATION_SOUND",
						payload: {
							hasMention: data?.data?.type === "mention",
						},
					});
				}
			})()
		);
	} catch (error) {
		console.error("[Service Worker] Error showing notification:", error);
	}
});

// Handle notification clicks
sw.addEventListener("notificationclick", (event: NotificationEvent) => {
	event.notification.close();

	const urlToOpen = event.notification.data.url as string;

	event.waitUntil(handleNotificationClick(urlToOpen));
});

async function handleNotificationClick(urlToOpen: string) {
	try {
		const clientList = await sw.clients.matchAll({
			type: "window",
			includeUncontrolled: true,
		});

		const existingClient = await focusExistingClient(clientList, urlToOpen);
		if (existingClient) {
			return;
		}

		if (sw.clients.openWindow) {
			await sw.clients.openWindow(urlToOpen);
		}
	} catch (error) {
		console.error("[Service Worker] Click handler error:", error);
	}
}

async function focusExistingClient(
	clientList: readonly WindowClient[],
	urlToOpen: string
) {
	for (const client of clientList) {
		if (client.url.includes(sw.location.origin)) {
			await client.focus();
			if ("navigate" in client) {
				try {
					await client.navigate(urlToOpen);
				} catch (navError) {
					console.warn("[Service Worker] Navigation failed:", navError);
				}
			}
			return true;
		}
	}
	return false;
}
