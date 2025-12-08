import { createOptimisticAction, eq, useLiveQuery } from "@tanstack/react-db";
import { useRouterState } from "@tanstack/react-router";
import type { MarkNotificationAsReadInputType } from "@work-holo/api/lib/types";
import { useEffect, useRef } from "react";
import { messagesCollection, notificationsCollection } from "@/db/collections";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { orpcClient } from "@/utils/orpc";

export function useNotifications() {
  const { user } = useAuthedSession();

  const { data, isLoading } = useLiveQuery(
    (q) =>
      q
        .from({ notification: notificationsCollection })
        .where(({ notification }) => eq(notification.userId, user.id))
        .orderBy(({ notification }) => notification.createdAt, "desc"),
    [user.id]
  );

  const notifications = data ?? [];

  const activeChannelId = useRouterState({
    select: (state) => {
      const path = state.location.pathname;
      const match = path.match(
        /\/communication\/channels\/(?<channelId>[^/]+)/
      );

      return match?.groups?.channelId ?? null;
    },
  });

  const unreadCount = notifications.filter(
    (notification) => notification.status === "unread"
  ).length;

  const seenNotificationIdsRef = useRef<Set<string>>(new Set());
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    if (isLoading) return;

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
      const audio = new Audio("/assets/sounds/notify.webm");
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

  return {
    notifications,
    unreadCount,
    isLoading,
    markNotificationAsRead,
  };
}
