import { and, eq, isNull, useLiveQuery } from "@tanstack/react-db";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  channelMembersCollection,
  channelsCollection,
  messagesCollection,
  usersCollection,
} from "@/db/collections";
import { useAuthedSession } from "@/hooks/use-authed-session";
import type { MessageWithSender } from "@/lib/communications/message";
import { buildMessageWithAttachments } from "@/lib/communications/message";
import { queryUtils } from "@/utils/orpc";

/**
 * Hook to get recent messages across all channels the user is a member of
 * Returns top 5 most recent non-deleted, non-thread messages
 */
export function useRecentMessages() {
  const { user } = useAuthedSession();
  const userId = user.id;

  const { data, isLoading } = useLiveQuery(
    (q) =>
      q
        .from({ message: messagesCollection })
        .innerJoin({ sender: usersCollection }, ({ message, sender }) =>
          eq(message.senderId, sender.id)
        )
        .innerJoin({ channel: channelsCollection }, ({ message, channel }) =>
          eq(message.channelId, channel.id)
        )
        .innerJoin(
          { channelMember: channelMembersCollection },
          ({ channel, channelMember }) =>
            eq(channelMember.channelId, channel.id)
        )
        .where(({ message, channelMember }) =>
          and(
            eq(message.isDeleted, false),
            eq(channelMember.userId, userId),
            isNull(message.parentMessageId)
          )
        )
        .orderBy(({ message }) => message.createdAt, "desc")
        .select(({ message, sender, channel }) => ({
          message,
          sender,
          channel,
        })),
    [userId]
  );

  const messages = useMemo<MessageWithSender[]>(() => {
    if (!(data && Array.isArray(data) && userId)) {
      return [];
    }

    const map = new Map<string, MessageWithSender>();
    const orderedMessages: MessageWithSender[] = [];

    for (const { message, sender, channel } of data) {
      if (message.senderId === userId) continue;
      if (!map.has(message.id)) {
        const entry = buildMessageWithAttachments(message, sender, channel);
        map.set(message.id, entry);
        orderedMessages.push(entry);
      }
    }

    // Return only the top 5 most recent messages
    return orderedMessages.slice(0, 5);
  }, [data, userId]);

  // Get total unread count across all channels
  const { data: unreadCounts } = useSuspenseQuery(
    queryUtils.communication.channel.getUnreadCounts.queryOptions({
      input: {},
      refetchInterval: 10_000, // Refetch every 10 seconds
    })
  );

  const totalUnreadCount = useMemo(
    () => unreadCounts.reduce((sum, item) => sum + item.unreadCount, 0),
    [unreadCounts]
  );

  return {
    messages,
    isLoading,
    totalUnreadCount,
  };
}
