import {
  and,
  eq,
  isNull,
  useLiveInfiniteQuery,
  useLiveQuery,
} from "@tanstack/react-db";
import { useParams } from "@tanstack/react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  dmAttachmentsCollection,
  dmMessagesCollection,
  usersCollection,
} from "@/db/collections";
import {
  buildOrderedDmMessages,
  insertDateSeparators,
  insertNewMessagesSeparator,
} from "@/lib/communications/dm-message";
import { useDmMessageHighlight } from "@/stores/dm-store";
import { useDmLastRead } from "./use-dm-last-read";

const SCROLL_SETTLE_DELAY_MS = 120;

export function useVirtualDmMessages() {
  const { conversationId } = useParams({
    from: "/(authenticated)/org/$slug/workspace/communication/dm/$conversationId",
  });

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const pendingDateRef = useRef<Date | undefined>(undefined);

  const {
    messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useDmMessages({ conversationId });

  const { lastReadMessageId } = useDmLastRead();

  const items = useMemo(() => {
    const withDateSeparators = insertDateSeparators(messages);
    return insertNewMessagesSeparator(withDateSeparators, lastReadMessageId);
  }, [messages, lastReadMessageId]);

  const lastMessageIdRef = useRef<string | null>(null);
  const hasDoneInitialScrollRef = useRef(false);
  const loadMoreAnchorRef = useRef<{
    prevScrollHeight: number;
    prevScrollTop: number;
  } | null>(null);
  const isAutoScrollingRef = useRef(false);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 160,
    overscan: 25,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  const [showScrollButton, setShowScrollButton] = useState(false);
  const { highlightedAt, highlightedMessageId, clearHighlightedMessage } =
    useDmMessageHighlight();

  // Initial scroll to bottom or to new messages separator
  useEffect(() => {
    const el = scrollRef.current;
    if (!(conversationId && el)) return;
    if (isLoading) return;
    if (messages.length === 0) return;
    if (hasDoneInitialScrollRef.current) return;

    hasDoneInitialScrollRef.current = true;

    const newMessagesSeparatorIndex = items.findIndex(
      (item) => "type" in item && item.type === "new-messages-separator"
    );

    requestAnimationFrame(() => {
      if (newMessagesSeparatorIndex === -1) {
        virtualizer.scrollToOffset(el.scrollHeight, { align: "end" });
      } else {
        virtualizer.scrollToIndex(newMessagesSeparatorIndex, {
          align: "start",
        });
      }
    });
  }, [conversationId, isLoading, messages.length, items, virtualizer]);

  // Auto-scroll on new messages
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || messages.length === 0) return;

    const lastMessage = messages.at(-1);
    if (lastMessage === undefined) return;

    if (lastMessageIdRef.current === null) {
      lastMessageIdRef.current = lastMessage.id;
      return;
    }

    if (lastMessage.id === lastMessageIdRef.current) return;

    lastMessageIdRef.current = lastMessage.id;

    if (!hasDoneInitialScrollRef.current) return;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

    if (distanceFromBottom < 500) {
      isAutoScrollingRef.current = true;
      setShowScrollButton(false);

      setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, 1000);

      requestAnimationFrame(() => {
        virtualizer.scrollToOffset(el.scrollHeight, {
          align: "end",
          behavior: "smooth",
        });
      });
    }
  }, [messages, virtualizer]);

  // Restore scroll position after loading older messages
  // biome-ignore lint/correctness/useExhaustiveDependencies: Need to track message count changes
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (isFetchingNextPage) return;
    if (!loadMoreAnchorRef.current) return;

    const frameId = requestAnimationFrame(() => {
      const anchor = loadMoreAnchorRef.current;
      if (!anchor) return;

      const newScrollHeight = el.scrollHeight;
      const diff = newScrollHeight - anchor.prevScrollHeight;
      const newScrollTop = anchor.prevScrollTop + diff;

      virtualizer.scrollToOffset(newScrollTop, { align: "start" });
      loadMoreAnchorRef.current = null;
    });

    return () => cancelAnimationFrame(frameId);
  }, [isFetchingNextPage, messages.length, virtualizer]);

  // Scroll handler for infinite scroll
  const handleScroll = useEffectEvent(() => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollThreshold = el.clientHeight * 0.1;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

    if (isAutoScrollingRef.current && distanceFromBottom <= 50) {
      isAutoScrollingRef.current = false;
    }

    if (!isAutoScrollingRef.current) {
      setShowScrollButton(distanceFromBottom > 100);
    }

    if (!hasNextPage || isFetchingNextPage || loadMoreAnchorRef.current) return;

    const firstItem = virtualizer.getVirtualItems()[0];
    if (!firstItem) return;

    if (firstItem.index === 0 && el.scrollTop <= scrollThreshold) {
      loadMoreAnchorRef.current = {
        prevScrollHeight: el.scrollHeight,
        prevScrollTop: el.scrollTop,
      };
      fetchNextPage();
    }
  });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => handleScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Handle highlighted message scroll
  // biome-ignore lint/correctness/useExhaustiveDependencies: checking of highlightedAt is required
  useEffect(() => {
    if (!highlightedMessageId) return;

    const targetIndex = items.findIndex((item) => {
      if (
        "type" in item &&
        (item.type === "date-separator" ||
          item.type === "new-messages-separator")
      )
        return false;
      return item.id === highlightedMessageId;
    });

    if (targetIndex === -1) return;

    isAutoScrollingRef.current = true;
    setShowScrollButton(false);

    const frameId = requestAnimationFrame(() => {
      virtualizer.scrollToIndex(targetIndex, {
        align: "center",
        behavior: "auto",
      });
    });

    const settleScrollTimeout = window.setTimeout(() => {
      virtualizer.scrollToIndex(targetIndex, {
        align: "center",
        behavior: "auto",
      });
    }, SCROLL_SETTLE_DELAY_MS);

    const resetAutoScrollTimeout = window.setTimeout(() => {
      isAutoScrollingRef.current = false;
    }, 800);

    const timeoutId = window.setTimeout(() => {
      clearHighlightedMessage();
    }, 1200);

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(settleScrollTimeout);
      window.clearTimeout(timeoutId);
      window.clearTimeout(resetAutoScrollTimeout);
    };
  }, [
    clearHighlightedMessage,
    highlightedAt,
    highlightedMessageId,
    items,
    virtualizer,
  ]);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      virtualizer.scrollToOffset(el.scrollHeight, {
        align: "end",
        behavior: "smooth",
      });
    });
  }, [virtualizer]);

  // Date filter state
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);

  const findIndexForDate = useCallback(
    (date: Date) => {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);

      return items.findIndex((item) => {
        if (
          "type" in item &&
          (item.type === "date-separator" ||
            item.type === "new-messages-separator")
        ) {
          return false;
        }
        const messageDate = new Date(item.createdAt);
        messageDate.setHours(0, 0, 0, 0);
        return messageDate >= targetDate;
      });
    },
    [items]
  );

  const dateRange = useMemo(() => {
    if (messages.length === 0) {
      return { minDate: undefined, maxDate: undefined };
    }

    const dates = messages.map((msg) => new Date(msg.createdAt));
    return {
      minDate: new Date(Math.min(...dates.map((d) => d.getTime()))),
      maxDate: new Date(Math.max(...dates.map((d) => d.getTime()))),
    };
  }, [messages]);

  const scrollToDate = useCallback(
    (date: Date | undefined) => {
      setFilterDate(date);

      if (!date) {
        pendingDateRef.current = undefined;
        scrollToBottom();
        return;
      }

      pendingDateRef.current = date;
      const index = findIndexForDate(date);

      if (index !== -1) {
        requestAnimationFrame(() => {
          virtualizer.scrollToIndex(index, {
            align: "start",
            behavior: "smooth",
          });
        });
        pendingDateRef.current = undefined;
        return;
      }

      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [
      fetchNextPage,
      findIndexForDate,
      hasNextPage,
      isFetchingNextPage,
      scrollToBottom,
      virtualizer,
    ]
  );

  useEffect(() => {
    const pendingDate = pendingDateRef.current;
    if (!pendingDate) return;

    const index = findIndexForDate(pendingDate);

    if (index !== -1) {
      requestAnimationFrame(() => {
        virtualizer.scrollToIndex(index, {
          align: "start",
          behavior: "smooth",
        });
      });
      pendingDateRef.current = undefined;
      return;
    }

    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
      return;
    }

    pendingDateRef.current = undefined;
  }, [
    fetchNextPage,
    findIndexForDate,
    hasNextPage,
    isFetchingNextPage,
    virtualizer,
  ]);

  return {
    scrollRef,
    virtualizer,
    virtualItems,
    totalSize,
    items,
    messages,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    showScrollButton,
    scrollToBottom,
    filterDate,
    scrollToDate,
    dateRange,
    highlightedMessageId,
  };
}

const PAGE_SIZE = 100;

export function useDmMessages({ conversationId }: { conversationId: string }) {
  const { pages, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useLiveInfiniteQuery(
      (q) =>
        q
          .from({ message: dmMessagesCollection })
          .innerJoin({ sender: usersCollection }, ({ message, sender }) =>
            eq(message.senderId, sender.id)
          )
          .leftJoin(
            { attachment: dmAttachmentsCollection },
            ({ message, attachment }) => eq(attachment.messageId, message.id)
          )
          .where(({ message }) =>
            and(
              eq(message.conversationId, conversationId),
              isNull(message.deletedAt),
              isNull(message.parentMessageId)
            )
          )
          .orderBy(({ message }) => message.createdAt, "desc")
          .select(({ message, sender, attachment }) => ({
            message,
            sender,
            attachment: attachment ?? null,
          })),
      {
        pageSize: PAGE_SIZE,
        getNextPageParam: (lastPage, allPages) =>
          lastPage.length === PAGE_SIZE ? allPages.length : undefined,
      },
      [conversationId]
    );

  const messages = useMemo(() => buildOrderedDmMessages(pages), [pages]);

  return {
    messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  };
}

export function useDmMessageCount(conversationId: string) {
  const { data: messages = [] } = useLiveQuery(
    (q) =>
      q
        .from({ message: dmMessagesCollection })
        .where(({ message }) =>
          and(
            eq(message.conversationId, conversationId),
            isNull(message.deletedAt),
            isNull(message.parentMessageId)
          )
        )
        .select(({ message }) => ({ id: message.id })),
    [conversationId]
  );

  return messages.length;
}
