import { and, eq, useLiveQuery } from "@tanstack/react-db";
import { useMemo } from "react";
import {
  dmConversationReadsCollection,
  dmMessagesCollection,
} from "@/db/collections";
import { useAuthedSession } from "@/hooks/use-authed-session";

interface DmUnreadState {
  conversationId: string;
  isMuted: boolean;
  unreadCount: number;
}

/**
 * Hook to track unread DM message counts using Electric SQL.
 * Muted conversations always return 0.
 * Real-time updates are automatically synced via Electric SQL.
 */
export function useDmUnreadCount(
  conversations: Array<{
    id: string;
    isMuted: boolean;
  }>,
  currentUserId: string | null
) {
  const { user } = useAuthedSession();

  // Get read receipts from Electric SQL
  const { data: readRecords = [] } = useLiveQuery(
    (q) =>
      q
        .from({ read: dmConversationReadsCollection })
        .where(({ read }) => eq(read.userId, user.id))
        .select(({ read }) => read),
    [user.id]
  );

  // Get all messages for these conversations
  const conversationIds = conversations.map((c) => c.id);
  const { data: messages = [] } = useLiveQuery(
    (q) =>
      q
        .from({ message: dmMessagesCollection })
        .where(({ message }) =>
          and(
            eq(message.isDeleted, false),
            conversationIds.length > 0
              ? // Use OR condition for multiple conversations
                conversationIds
                  .map((id) => eq(message.conversationId, id))
                  .reduce((acc, curr) => acc || curr)
              : eq(message.conversationId, "")
          )
        )
        .select(({ message }) => ({
          id: message.id,
          conversationId: message.conversationId,
          createdAt: message.createdAt,
          senderId: message.senderId,
        })),
    [conversationIds.join(",")]
  );

  const unreadState = useMemo(() => {
    const stateMap = new Map<string, DmUnreadState>();

    for (const convo of conversations) {
      const readRecord = readRecords.find((r) => r.conversationId === convo.id);
      const lastReadAt = readRecord?.lastReadAt;

      // Count unread messages
      const conversationMessages = messages.filter(
        (m) => m.conversationId === convo.id && m.senderId !== currentUserId // Don't count own messages
      );

      const unreadCount = lastReadAt
        ? conversationMessages.filter(
            (m) => new Date(m.createdAt) > new Date(lastReadAt)
          ).length
        : conversationMessages.length;

      stateMap.set(convo.id, {
        conversationId: convo.id,
        unreadCount: convo.isMuted ? 0 : unreadCount,
        isMuted: convo.isMuted,
      });
    }

    return stateMap;
  }, [conversations, readRecords, messages, currentUserId]);

  const getUnreadCount = (conversationId: string): number => {
    const state = unreadState.get(conversationId);
    if (!state || state.isMuted) return 0;
    return state.unreadCount;
  };

  const getTotalUnreadCount = (): number => {
    let total = 0;
    for (const state of unreadState.values()) {
      if (!state.isMuted) {
        total += state.unreadCount;
      }
    }
    return total;
  };

  return {
    unreadState,
    getUnreadCount,
    getTotalUnreadCount,
  };
}
