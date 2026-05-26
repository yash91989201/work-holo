import type { Channel } from "pusher-js";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { getPusherClient } from "@/lib/pusher";
import {
  REPLY_PREVIEW_TRUNCATE_LENGTH,
  stripHtmlToText,
  truncateText,
} from "@/utils/message-utils";

interface NotificationPayload {
  actorId: string;
  actorName: string;
  channelName: string | null;
  entityId: string | null;
  entityType: string | null;
  eventType: string;
  messagePreview: string | null;
  notificationId: string;
  playSound?: boolean;
  timestamp: string;
}

export interface NotificationContext {
  entityId?: string;
  entityType?: "channel" | "dm";
}

export interface NotificationEvent {
  actorName: string;
  channelName: string | null;
  eventType: string;
}

function buildActionUrl(
  slug: string,
  entityType: string | null,
  entityId: string | null
): string | null {
  if (!(entityType && entityId)) return null;

  if (entityType === "channel") {
    return `/org/${slug}/workspace/communication/channels/${entityId}`;
  }
  if (entityType === "dm_conversation") {
    return `/org/${slug}/workspace/communication/dm/${entityId}`;
  }
  return null;
}

function buildToastTitle(payload: NotificationPayload): string {
  if (payload.channelName) {
    return `${payload.actorName} in #${payload.channelName}`;
  }
  return payload.actorName;
}

function buildToastDescription(
  messagePreview: string | null
): string | undefined {
  if (!messagePreview) {
    return;
  }

  const plainText = stripHtmlToText(messagePreview);
  if (!plainText) {
    return;
  }

  return truncateText(plainText, REPLY_PREVIEW_TRUNCATE_LENGTH);
}

function mapNotificationEntityType(
  entityType: string | null
): NotificationContext["entityType"] | null {
  if (entityType === "channel") {
    return "channel";
  }

  if (entityType === "dm_conversation") {
    return "dm";
  }

  return null;
}

function shouldSkipForActiveContext(
  context: NotificationContext | undefined,
  payload: NotificationPayload
): boolean {
  if (document.visibilityState !== "visible") {
    return false;
  }

  const mappedEntityType = mapNotificationEntityType(payload.entityType);
  if (!(context?.entityId && mappedEntityType)) {
    return false;
  }

  return (
    context.entityId === payload.entityId &&
    context.entityType === mappedEntityType
  );
}

export function useNotificationPusher(
  orgSlug: string,
  currentContext?: NotificationContext,
  onNotification?: (event: NotificationEvent) => void
) {
  const { user } = useAuthedSession();
  const channelRef = useRef<Channel | null>(null);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const currentContextRef = useRef(currentContext);
  currentContextRef.current = currentContext;
  const onNotificationRef = useRef(onNotification);
  onNotificationRef.current = onNotification;

  useEffect(() => {
    if (!user?.id) return;

    const pusher = getPusherClient();
    const channelName = `private-user-${user.id}`;
    const channel = pusher.subscribe(channelName);
    channelRef.current = channel;

    const handleNotification = (data: NotificationPayload) => {
      if (seenIdsRef.current.has(data.notificationId)) return;
      seenIdsRef.current.add(data.notificationId);

      if (seenIdsRef.current.size > 500) {
        const entries = Array.from(seenIdsRef.current);
        seenIdsRef.current = new Set(entries.slice(-250));
      }

      if (shouldSkipForActiveContext(currentContextRef.current, data)) {
        return;
      }

      const actionUrl = buildActionUrl(orgSlug, data.entityType, data.entityId);

      toast(buildToastTitle(data), {
        description: buildToastDescription(data.messagePreview),
        action: actionUrl
          ? {
              label: "View",
              onClick: () => {
                window.location.href = actionUrl;
              },
            }
          : undefined,
        duration: 5000,
      });

      onNotificationRef.current?.({
        actorName: data.actorName,
        channelName: data.channelName,
        eventType: data.eventType,
      });
    };

    channel.bind("notification:new", handleNotification);

    return () => {
      channel.unbind("notification:new", handleNotification);
      pusher.unsubscribe(channelName);
      channelRef.current = null;
    };
  }, [user?.id, orgSlug]);
}
