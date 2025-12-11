import { createOptimisticAction, eq, useLiveQuery } from "@tanstack/react-db";
import { useParams } from "@tanstack/react-router";
import type { MarkNotificationAsReadInputType } from "@work-holo/api/lib/types";
import { useEffect, useRef, useState } from "react";
import { messagesCollection, notificationsCollection } from "@/db/collections";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { orpcClient } from "@/utils/orpc";

export type NotificationFilter = "all" | "unread" | "read";

export function useNotifications() {
  const { user } = useAuthedSession();
  const [filter, setFilter] = useState<NotificationFilter>("unread");

  const { data, isLoading } = useLiveQuery(
    (q) => {
      let query = q
        .from({ notification: notificationsCollection })
        .where(({ notification }) => eq(notification.userId, user.id));

      if (filter === "unread") {
        query = query.where(({ notification }) =>
          eq(notification.status, "unread")
        );
      } else if (filter === "read") {
        query = query.where(({ notification }) =>
          eq(notification.status, "read")
        );
      }

      return query.orderBy(
        ({ notification }) => notification.createdAt,
        "desc"
      );
    },
    [user.id, filter]
  );

  const notifications = data ?? [];

  const activeChannelId =
    useParams({
      from: "/(authenticated)/org/$slug/(modules)/communication/channels/$id",
      shouldThrow: false,
    })?.id ?? null;

  const unreadCount = notifications.filter(
    (notification) => notification.status === "unread"
  ).length;

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
    if (isLoading) return;

    const seenIds = seenNotificationIdsRef.current;
    const newNotifications = notifications.filter(
      (notification) =>
        !seenIds.has(notification.id) && notification.status === "unread"
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
        notification.type === "mention" &&
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
        (notification) => notification.type === "mention"
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

  const markNotificationAsRead = createOptimisticAction({
    onMutate: ({ notificationId }: MarkNotificationAsReadInputType) => {
      notificationsCollection.update(notificationId, (draft) => {
        draft.status = "read";
        draft.readAt = new Date();
      });
    },
    mutationFn: async ({ notificationId }: MarkNotificationAsReadInputType) => {
      const { txid } = await orpcClient.member.notification.markAsRead({
        notificationId,
      });

      await notificationsCollection.utils.awaitTxId(txid);
    },
  });

  const markAllAsRead = createOptimisticAction({
    onMutate: () => {
      // Query the collection directly to get ALL unread notifications for this user
      const notificationIdsToUpdate: string[] = [];

      notificationsCollection.forEach((notification) => {
        if (
          notification.userId === user.id &&
          notification.status === "unread"
        ) {
          notificationIdsToUpdate.push(notification.id);
        }
      });

      notificationIdsToUpdate.forEach((notificationId) => {
        notificationsCollection.update(notificationId, (draft) => {
          draft.status = "read";
          draft.readAt = new Date();
        });
      });
    },
    mutationFn: async () => {
      const { txid } = await orpcClient.member.notification.markAllAsRead({});

      await notificationsCollection.utils.awaitTxId(txid);
    },
  });

  return {
    notifications,
    unreadCount,
    isLoading,
    markNotificationAsRead,
    markAllAsRead,
    filter,
    setFilter,
  };
}
