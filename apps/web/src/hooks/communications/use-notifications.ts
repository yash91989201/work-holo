import { createOptimisticAction, eq, useLiveQuery } from "@tanstack/react-db";
import { useRouterState } from "@tanstack/react-router";
import type { MarkNotificationAsReadInputType } from "@work-holo/api/lib/types";
import { useEffect, useRef } from "react";
import { messagesCollection, notificationsCollection } from "@/db/collections";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { orpcClient } from "@/utils/orpc";

const CHANNEL_PATH_REGEX = /\/communication\/channels\/(?<channelId>[^/]+)/;

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
      const match = path.match(CHANNEL_PATH_REGEX);

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

    const isTabFocused =
      typeof document !== "undefined" &&
      document.visibilityState === "visible" &&
      document.hasFocus();

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
        if (isTabFocused && message?.channelId === activeChannelId) {
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

      if (isTabFocused) {
        // Tab is focused - play audio normally
        const audio = new Audio(soundPath);
        audio.play().catch((error) => {
          console.error("Error playing notification sound:", error);
        });
      } else if (
        typeof Notification !== "undefined" &&
        Notification.permission === "granted"
      ) {
        // Tab is not focused - use desktop notification with sound
        const notificationTitle = hasMentionNotification
          ? "New Mention"
          : "New Notification";
        const notificationBody =
          newNotifications.length === 1
            ? "You have a new notification"
            : `You have ${newNotifications.length} new notifications`;

        new Notification(notificationTitle, {
          body: notificationBody,
          icon: "/favicon.ico",
          tag: "work-holo-notification",
          silent: false,
        });
      }
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
