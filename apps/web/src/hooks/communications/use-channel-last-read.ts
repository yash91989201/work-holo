import { and, eq, useLiveQuery } from "@tanstack/react-db";
import { useParams } from "@tanstack/react-router";
import { channelReadCollection } from "@/db/collections";
import { useAuthedSession } from "@/hooks/use-authed-session";

/**
 * Hook to get the last read message ID for the current channel and user
 */
export function useChannelLastRead() {
  const { channelId } = useParams({
    from: "/(authenticated)/org/$slug/workspace/communication/channels/$channelId",
  });

  const { user } = useAuthedSession();
  const userId = user.id;

  const { data: channelReadResult } = useLiveQuery((q) =>
    q
      .from({ cr: channelReadCollection })
      .where(({ cr }) =>
        and(eq(cr.channelId, channelId), eq(cr.userId, userId))
      )
      .select(({ cr }) => ({
        lastReadMessageId: cr.lastReadMessageId,
        lastReadAt: cr.lastReadAt,
      }))
  );

  const channelRead = channelReadResult?.[0];

  return {
    lastReadMessageId: channelRead?.lastReadMessageId,
    lastReadAt: channelRead?.lastReadAt,
  };
}
