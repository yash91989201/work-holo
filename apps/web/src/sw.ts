/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener("install", (_event: ExtendableEvent) => {
  console.log("[Service Worker] Installing");
  sw.skipWaiting();
});

sw.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(sw.clients.claim());
});

interface PushPayloadData {
  notificationId?: string;
  type?: string;
  url?: string;
}

interface PushPayload {
  actorId?: string;
  actorName?: string;
  badge?: string;
  body?: string;
  channelName?: string;
  data?: PushPayloadData;
  entityId?: string;
  entityType?: string;
  eventType?: string;
  icon?: string;
  messagePreview?: string;
  notificationId?: string;
  tag?: string;
  timestamp?: string;
  title?: string;
}

function getNotificationTitle(payload: PushPayload): string {
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

function getNotificationBody(payload: PushPayload): string {
  if (payload.body) {
    return payload.body;
  }

  const preview = payload.messagePreview ?? "";
  return preview.length > 100 ? `${preview.slice(0, 97)}...` : preview;
}

function getNotificationTag(payload: PushPayload): string {
  if (payload.tag) {
    return payload.tag;
  }

  const eventType = payload.eventType ?? "unknown";
  const entityId = payload.entityId ?? payload.notificationId ?? "";
  return `notification-${eventType}-${entityId}`;
}

function getNotificationUrl(payload: PushPayload): string {
  if (payload.data?.url) {
    return payload.data.url;
  }

  return "/";
}

function isMentionEvent(payload: PushPayload): boolean {
  const eventType = payload.eventType ?? payload.data?.type ?? "";
  return eventType === "channel_mention";
}

sw.addEventListener("push", (event: PushEvent) => {
  if (!event.data) {
    return;
  }

  try {
    const data = event.data.json() as PushPayload;

    const title = getNotificationTitle(data);
    const body = getNotificationBody(data);
    const url = getNotificationUrl(data);

    const options: NotificationOptions = {
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
      silent: false,
    };

    if ("vibrate" in Notification.prototype) {
      (options as unknown as { vibrate: number[] }).vibrate = [200, 100, 200];
    }

    event.waitUntil(
      (async () => {
        await sw.registration.showNotification(title, options);

        // Ask open clients to play a sound (Chromium on Linux does not play sounds for notifications)
        const clients = await sw.clients.matchAll({
          type: "window",
          includeUncontrolled: true,
        });
        for (const client of clients) {
          client.postMessage({
            type: "PLAY_NOTIFICATION_SOUND",
            payload: {
              hasMention: isMentionEvent(data),
            },
          });
        }
      })()
    );
  } catch (error) {
    console.error("[Service Worker] Error showing notification:", error);
  }
});

sw.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();

  const notificationData = event.notification.data as
    | PushPayloadData
    | undefined;
  const urlToOpen = notificationData?.url ?? "/";

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
