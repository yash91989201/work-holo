/** Service worker for push notifications */

self.addEventListener("install", (_event) => {
  console.log("[Service Worker] Installing");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

function getNotificationTitle(payload) {
  if (payload.title) {
    return payload.title;
  }

  const actorName = payload.actorName ?? "Someone";
  const channelName = payload.channelName ?? "";

  switch (payload.eventType) {
    case "channel_mention":
      return `${actorName} mentioned you in #${channelName}`;
    case "channel_message":
      return `${actorName} sent a message in #${channelName}`;
    case "channel_reply":
      return `${actorName} replied in #${channelName}`;
    case "channel_reaction":
      return `${actorName} reacted in #${channelName}`;
    case "dm_message":
      return `${actorName} sent you a message`;
    case "dm_reply":
      return `${actorName} replied to your message`;
    case "dm_reaction":
      return `${actorName} reacted to your message`;
    default:
      return "New notification";
  }
}

function getNotificationBody(payload) {
  if (payload.body) {
    return payload.body;
  }

  const preview = payload.messagePreview ?? "";
  return preview.length > 100 ? `${preview.slice(0, 97)}...` : preview;
}

function getNotificationTag(payload) {
  if (payload.tag) {
    return payload.tag;
  }

  const eventType = payload.eventType ?? "unknown";
  const entityId = payload.entityId ?? payload.notificationId ?? "";
  return `notification-${eventType}-${entityId}`;
}

function getNotificationUrl(payload) {
  if (payload.data?.url) {
    return payload.data.url;
  }

  return "/";
}

function getSoundForwardPayload(payload) {
  return {
    actorId: payload.actorId,
    actorName: payload.actorName,
    channelName: payload.channelName ?? null,
    entityId: payload.entityId ?? payload.data?.entityId ?? null,
    entityType: payload.entityType ?? payload.data?.entityType ?? null,
    eventType: payload.eventType ?? payload.data?.type,
    messagePreview: payload.messagePreview ?? null,
    notificationId: payload.notificationId ?? payload.data?.notificationId,
    playSound: payload.playSound ?? payload.data?.playSound,
    timestamp: payload.timestamp,
  };
}

function getWindowClients() {
  return self.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });
}

function notifyClientsForSound(payload, clients) {
  if (clients.length === 0) {
    return;
  }

  const visibleClient = clients.find(
    (client) => client.visibilityState === "visible"
  );
  const targetClient = visibleClient ?? clients[0];

  targetClient.postMessage({
    type: "push-notification-received",
    payload,
  });
}

self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  try {
    const data = event.data.json();
    const soundPayload = getSoundForwardPayload(data);

    const title = getNotificationTitle(data);
    const body = getNotificationBody(data);
    const url = getNotificationUrl(data);

    const options = {
      body,
      icon: data.icon ?? "/favicon.ico",
      badge: data.badge ?? "/favicon.ico",
      tag: getNotificationTag(data),
      data: {
        ...data.data,
        url,
        notificationId: data.notificationId ?? data.data?.notificationId,
        type: data.eventType ?? data.data?.type,
      },
      requireInteraction: false,
      silent: soundPayload.playSound === false,
    };

    if ("vibrate" in Notification.prototype) {
      options.vibrate = [200, 100, 200];
    }

    event.waitUntil(
      (async () => {
        try {
          const windowClients = await getWindowClients();
          const shouldForwardSound =
            soundPayload.playSound !== false && windowClients.length > 0;

          await self.registration.showNotification(title, {
            ...options,
            silent: options.silent || shouldForwardSound,
          });

          if (shouldForwardSound) {
            notifyClientsForSound(soundPayload, windowClients);
          }
        } catch (asyncError) {
          console.error(
            "[Service Worker] Async push handler failure:",
            asyncError
          );
        }
      })()
    );
  } catch (error) {
    console.error("[Service Worker] Error showing notification:", error);
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const notificationData = event.notification.data;
  const urlToOpen = notificationData?.url ?? "/";

  event.waitUntil(handleNotificationClick(urlToOpen));
});

async function handleNotificationClick(urlToOpen) {
  try {
    const clientList = await self.clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    });

    const existingClient = await focusExistingClient(clientList, urlToOpen);
    if (existingClient) {
      return;
    }

    if (self.clients.openWindow) {
      await self.clients.openWindow(urlToOpen);
    }
  } catch (error) {
    console.error("[Service Worker] Click handler error:", error);
  }
}

async function focusExistingClient(clientList, urlToOpen) {
  for (const client of clientList) {
    if (client.url.includes(self.location.origin)) {
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
