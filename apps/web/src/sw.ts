/// <reference lib="webworker" />

declare let self: ServiceWorkerGlobalScope;

console.log("[Service Worker] Script loaded");

// Install event
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing");
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating");
  event.waitUntil(self.clients.claim());
});

// Handle push notifications
self.addEventListener("push", (event: PushEvent) => {
  console.log("[Service Worker] Push received:", event);

  if (!event.data) {
    console.log("[Service Worker] Push event has no data");
    return;
  }

  try {
    const data = event.data.json();
    console.log("[Service Worker] Push data:", data);

    // Build notification options
    const options: NotificationOptions = {
      body: data.body || "You have a new notification",
      icon: data.icon || "/favicon.ico",
      badge: data.badge || "/favicon.ico",
      tag: data.tag || `notification-${Date.now()}`,
      data: data.data || {},
      requireInteraction: false,
      silent: false,
    };

    // Add vibrate only if supported
    if ("vibrate" in Notification.prototype) {
      options.vibrate = [200, 100, 200];
    }

    console.log("[Service Worker] Showing notification");

    event.waitUntil(
      (async () => {
        await self.registration.showNotification(
          data.title || "Work Holo",
          options
        );

        // Ask open clients to play a sound (Chromium on Linux does not play sounds for notifications)
        const clients = await self.clients.matchAll({
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
self.addEventListener("notificationclick", (event: NotificationEvent) => {
  console.log("[Service Worker] Notification clicked");

  event.notification.close();

  const notificationData = event.notification.data;

  // Determine URL to open
  let urlToOpen = "/";

  if (notificationData?.type === "mention" && notificationData?.channelId) {
    urlToOpen = `/communication/channels/${notificationData.channelId}`;
    if (notificationData?.messageId) {
      urlToOpen += `?messageId=${notificationData.messageId}`;
    }
  }

  event.waitUntil(
    (async () => {
      try {
        const clientList = await self.clients.matchAll({
          type: "window",
          includeUncontrolled: true,
        });

        // Focus existing window or open new one
        for (const client of clientList) {
          if (client.url.includes(self.location.origin)) {
            await client.focus();
            if ("navigate" in client) {
              try {
                await (client as WindowClient).navigate(urlToOpen);
              } catch (navError) {
                console.warn("[Service Worker] Navigation failed:", navError);
              }
            }
            return;
          }
        }

        // No window open, open new one
        if (self.clients.openWindow) {
          await self.clients.openWindow(urlToOpen);
        }
      } catch (error) {
        console.error("[Service Worker] Click handler error:", error);
      }
    })()
  );
});

// Handle notification close
self.addEventListener("notificationclose", (event: NotificationEvent) => {
  console.log("[Service Worker] Notification closed");
});

console.log("[Service Worker] All event listeners registered");
