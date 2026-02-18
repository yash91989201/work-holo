import { useSuspenseQuery } from "@tanstack/react-query";
import { queryUtils } from "@/utils/orpc";

/**
 * Hook to get unread message counts for all channels
 * Returns a Map of channelId -> unreadCount for quick lookups
 */
export function useChannelUnreadCounts() {
  const { data: unreadCounts } = useSuspenseQuery(
    queryUtils.communication.channel.getUnreadCounts.queryOptions({
      input: {},
      refetchInterval: 10_000, // Refetch every 10 seconds
    })
  );

  // Convert array to Map for O(1) lookups
  const unreadMap = new Map(
    unreadCounts.map((item) => [item.channelId, item.unreadCount])
  );

  return {
    unreadCounts,
    unreadMap,
    getUnreadCount: (channelId: string) => unreadMap.get(channelId) || 0,
  };
}
