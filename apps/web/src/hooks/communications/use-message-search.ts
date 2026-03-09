import { useDebouncedValue } from "@tanstack/react-pacer";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { queryUtils } from "@/utils/orpc";

interface UseMessageSearchOptions {
  channelId: string;
  enabled?: boolean;
  query: string;
}

interface SearchResult {
  channelId: string;
  content: string | null;
  createdAt: Date;
  highlights: string[];
  id: string;
  parentMessageId: string | null;
  sender: {
    name: string;
    email: string;
    image: string | null;
  };
  senderId: string;
  type: string;
}

interface UseMessageSearchResult {
  hasMore: boolean;
  isLoading: boolean;
  loadMore: () => void;
  results: SearchResult[];
  total: number;
}

export function useMessageSearch({
  channelId,
  query,
  enabled = true,
}: UseMessageSearchOptions): UseMessageSearchResult {
  const [cursor, setCursor] = useState<string | null>(null);

  // Debounce the query using TanStack Pacer
  const [debouncedQuery] = useDebouncedValue(query, { wait: 300 });

  const { data, isLoading } = useQuery(
    queryUtils.communication.message.search.queryOptions({
      input: {
        channelId,
        query: debouncedQuery,
        limit: 20,
        ...(cursor ? { cursor } : {}),
      },
      enabled: enabled && debouncedQuery.length > 0,
    })
  );

  const results = useMemo(() => data?.messages ?? [], [data]);
  const hasMore = data?.nextCursor != null;
  const total = data?.total ?? 0;

  const loadMore = () => {
    if (data?.nextCursor) {
      setCursor(data.nextCursor);
    }
  };

  return {
    results,
    isLoading,
    hasMore,
    loadMore,
    total,
  };
}
