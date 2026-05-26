import { and, eq, useLiveQuery } from "@tanstack/react-db";
import { useCallback, useMemo } from "react";
import { dmConversationReadsCollection } from "@/db/collections";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { orpcClient, queryClient, queryUtils } from "@/utils/orpc";

interface DmReadReceipt {
  messageId: string;
  readAt: string;
  userId: string;
}

/**
 * Hook for DM read receipts.
 * Uses Electric SQL to sync read status in real-time.
 */
export function useDmReadReceipts(conversationId: string | null) {
  const { user } = useAuthedSession();

  // Get read receipts from Electric SQL collection
  const { data: readRecords = [] } = useLiveQuery(
    (q) =>
      q
        .from({ read: dmConversationReadsCollection })
        .where(({ read }) =>
          and(
            eq(read.conversationId, conversationId ?? ""),
            eq(read.userId, user.id)
          )
        )
        .select(({ read }) => read),
    [conversationId, user.id]
  );

  const readReceipts = useMemo(() => {
    const receiptsMap = new Map<string, DmReadReceipt[]>();

    for (const record of readRecords) {
      if (record.lastReadMessageId) {
        const receipt: DmReadReceipt = {
          messageId: record.lastReadMessageId,
          userId: record.userId,
          readAt: record.lastReadAt?.toISOString() ?? new Date().toISOString(),
        };

        const existing = receiptsMap.get(record.lastReadMessageId) ?? [];
        receiptsMap.set(record.lastReadMessageId, [...existing, receipt]);
      }
    }

    return receiptsMap;
  }, [readRecords]);

  const markRead = useCallback(
    async (messageId: string) => {
      if (!conversationId) return;

      try {
        await orpcClient.communication.dm.markRead({
          conversationId,
          messageId,
        });

        // Invalidate conversation queries to refresh unread counts
        queryClient.invalidateQueries({
          queryKey: queryUtils.communication.dm.getConversations.queryKey({
            input: {},
          }),
        });
      } catch (error) {
        console.error("Failed to mark DM message as read:", error);
      }
    },
    [conversationId]
  );

  const getReceiptsForMessage = useCallback(
    (messageId: string): DmReadReceipt[] => readReceipts.get(messageId) ?? [],
    [readReceipts]
  );

  const isMessageReadBy = useCallback(
    (messageId: string, userId: string): boolean => {
      const receipts = readReceipts.get(messageId);
      return receipts?.some((r) => r.userId === userId) ?? false;
    },
    [readReceipts]
  );

  return {
    readReceipts,
    markRead,
    getReceiptsForMessage,
    isMessageReadBy,
  };
}
