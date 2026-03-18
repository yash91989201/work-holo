import { useDebouncedValue } from "@tanstack/react-pacer";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
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
  const previousRawSearchKeyRef = useRef<string>("");
  const [cursor, setCursor] = useState<string | null>(null);
  const [aggregatedResults, setAggregatedResults] = useState<SearchResult[]>(
    []
  );
  const [aggregatedTotal, setAggregatedTotal] = useState(0);

  const trimmedQuery = query.trim();
  const [debouncedQuery] = useDebouncedValue(trimmedQuery, { wait: 300 });
  const isDebouncing =
    enabled && trimmedQuery.length > 0 && trimmedQuery !== debouncedQuery;
  const shouldSearch = enabled && debouncedQuery.length > 0;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const rawSearchKey = `${channelId}:${query.trim()}`;

    if (previousRawSearchKeyRef.current === rawSearchKey) {
      return;
    }

    previousRawSearchKeyRef.current = rawSearchKey;

    setCursor(null);
    setAggregatedResults([]);
    setAggregatedTotal(0);
  }, [channelId, query, enabled]);

  useEffect(() => {
    if (!enabled) {
      previousRawSearchKeyRef.current = "";
      setCursor(null);
      setAggregatedResults([]);
      setAggregatedTotal(0);
    }
  }, [enabled]);

  const { data } = useQuery(
    queryUtils.communication.message.search.queryOptions({
      input: {
        channelId,
        query: debouncedQuery,
        limit: 20,
        ...(cursor ? { cursor } : {}),
      },
      enabled: shouldSearch,
    })
  );

  useEffect(() => {
    if (!data || isDebouncing) {
      return;
    }

    setAggregatedTotal(data.total ?? 0);
    setAggregatedResults((previousResults) => {
      const incomingResults = data.messages ?? [];

      if (!cursor) {
        return incomingResults;
      }

      const mergedResults = [...previousResults, ...incomingResults];
      const seenMessageIds = new Set<string>();

      return mergedResults.filter((message) => {
        if (seenMessageIds.has(message.id)) {
          return false;
        }

        seenMessageIds.add(message.id);
        return true;
      });
    });
  }, [data, cursor, isDebouncing]);

  const isLoading = isDebouncing || (shouldSearch && !data);
  const results = shouldSearch && !isDebouncing ? aggregatedResults : [];
  const hasMore = shouldSearch && !isDebouncing && data?.nextCursor != null;
  const total = shouldSearch && !isDebouncing ? aggregatedTotal : 0;

  const loadMore = () => {
    if (isLoading) {
      return;
    }

    if (data?.nextCursor != null) {
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
