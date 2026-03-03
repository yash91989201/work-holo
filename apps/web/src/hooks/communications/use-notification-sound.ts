import { eq, useLiveQuery } from "@tanstack/react-db";
import { useParams } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { messagesCollection, notificationsCollection } from "@/db/collections";
import { useAuthedSession } from "@/hooks/use-authed-session";

export function useNotificationSound() {
  const { user } = useAuthedSession();

  const { data: notifications, isLoading } = useLiveQuery(
    (q) =>
      q
        .from({ notification: notificationsCollection })
        .where(({ notification }) => eq(notification.userId, user.id))
        .where(({ notification }) => eq(notification.status, "unread"))
        .orderBy(({ notification }) => notification.createdAt, "desc"),
    [user.id]
  );

  const activeChannelId =
    useParams({
      from: "/(authenticated)/org/$slug/workspace/communication/channels/$channelId",
      shouldThrow: false,
    })?.channelId ?? null;

  const seenNotificationIdsRef = useRef<Set<string>>(new Set());
  const isFirstLoadRef = useRef(true);

  // Play sound when service worker requests it (Chromium on Linux won't play system sound)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== "PLAY_NOTIFICATION_SOUND") return;
      const hasMention = Boolean(event.data?.payload?.hasMention);
      const soundPath = hasMention
        ? "/assets/sounds/mention.webm"
        : "/assets/sounds/notify.webm";

      const audio = new Audio(soundPath);
      audio.play().catch((error) => {
        console.error("Error playing notification sound:", error);
      });
    };

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", handleMessage);
      return () => {
        navigator.serviceWorker.removeEventListener("message", handleMessage);
      };
    }

    return;
  }, []);

  useEffect(() => {
    if (isLoading || !notifications) return;

    const seenIds = seenNotificationIdsRef.current;
    const newNotifications = notifications.filter(
      (notification) => !seenIds.has(notification.id)
    );

    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
      newNotifications.forEach((notification) => {
        seenIds.add(notification.id);
      });
      return;
    }

    const shouldPlaySound = newNotifications.some((notification) => {
      if (
        notification.type === "channel_mention" &&
        activeChannelId &&
        notification.entityId
      ) {
        const message = messagesCollection.get(notification.entityId);
        if (message?.channelId === activeChannelId) {
          return false;
        }
      }
      return true;
    });

    if (shouldPlaySound && newNotifications.length > 0) {
      const hasMentionNotification = newNotifications.some(
        (notification) => notification.type === "channel_mention"
      );
      const soundPath = hasMentionNotification
        ? "/assets/sounds/mention.webm"
        : "/assets/sounds/notify.webm";

      const audio = new Audio(soundPath);
      audio.play().catch((error) => {
        console.error("Error playing notification sound:", error);
      });
    }

    newNotifications.forEach((notification) => {
      seenIds.add(notification.id);
    });
  }, [activeChannelId, isLoading, notifications]);
}
