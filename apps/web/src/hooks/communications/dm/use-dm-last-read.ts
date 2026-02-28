import { and, eq, useLiveQuery } from "@tanstack/react-db";
import { useParams } from "@tanstack/react-router";
import { dmConversationReadsCollection } from "@/db/collections";
import { useAuthedSession } from "@/hooks/use-authed-session";

export function useDmLastRead() {
  const { conversationId } = useParams({
    from: "/(authenticated)/org/$slug/workspace/communication/dm/$conversationId",
  });

  const { user } = useAuthedSession();
  const userId = user.id;

  const { data: readResult } = useLiveQuery(
    (q) =>
      q
        .from({ read: dmConversationReadsCollection })
        .where(({ read }) =>
          and(eq(read.conversationId, conversationId), eq(read.userId, userId))
        )
        .select(({ read }) => ({
          lastReadMessageId: read.lastReadMessageId,
          lastReadAt: read.lastReadAt,
        })),
    [conversationId, userId]
  );

  const readRecord = readResult?.[0];

  return {
    lastReadMessageId: readRecord?.lastReadMessageId,
    lastReadAt: readRecord?.lastReadAt,
  };
}
