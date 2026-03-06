import { createOptimisticAction, eq, useLiveQuery } from "@tanstack/react-db";
import type { MarkNotificationAsReadInputType } from "@work-holo/api/lib/types";
import { useState } from "react";
import { notificationsCollection } from "@/db/collections";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { orpcClient } from "@/utils/orpc";

export type NotificationFilter = "all" | "unread" | "read";

export const TAB_UNREAD_COUNT_CHANGED_EVENT =
  "work-holo:tab-unread-count-changed";

function getUnreadCountSnapshot(userId: string): number {
  let count = 0;

  notificationsCollection.forEach((notification) => {
    if (notification.userId === userId && notification.status === "unread") {
      count += 1;
    }
  });

  return count;
}

function emitUnreadCountChanged(userId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<{ unreadCount: number }>(TAB_UNREAD_COUNT_CHANGED_EVENT, {
      detail: { unreadCount: getUnreadCountSnapshot(userId) },
    })
  );
}

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

  const unreadCount = notifications.filter(
    (notification) => notification.status === "unread"
  ).length;

  const markNotificationAsRead = createOptimisticAction({
    onMutate: ({ notificationId }: MarkNotificationAsReadInputType) => {
      notificationsCollection.update(notificationId, (draft) => {
        draft.status = "read";
        draft.readAt = new Date();
      });

      emitUnreadCountChanged(user.id);
    },
    mutationFn: async ({ notificationId }: MarkNotificationAsReadInputType) => {
      const { txid } = await orpcClient.notification.markAsRead({
        notificationId,
      });

      await notificationsCollection.utils.awaitTxId(txid);
      emitUnreadCountChanged(user.id);
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

      emitUnreadCountChanged(user.id);
    },
    mutationFn: async () => {
      const { txid } = await orpcClient.notification.markAllAsRead({});

      await notificationsCollection.utils.awaitTxId(txid);
      emitUnreadCountChanged(user.id);
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
