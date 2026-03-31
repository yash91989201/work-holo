import { and, eq, isNull, useLiveInfiniteQuery } from "@tanstack/react-db";
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
  attachmentsCollection,
  channelsCollection,
  messagesCollection,
  usersCollection,
} from "@/db/collections";
import {
  buildOrderedMessages,
  insertDateSeparators,
  insertNewMessagesSeparator,
} from "@/lib/communications/message";
import { useChannelMessageHighlight } from "@/stores/channel-store";
import { useChannelLastRead } from "./use-channel-last-read";

export function useVirtualMessages() {
  const { channelId } = useParams({
    from: "/(authenticated)/org/$slug/workspace/communication/channels/$channelId",
  });

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const pendingDateRef = useRef<Date | undefined>(undefined);

  const {
    messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useMessages({ channelId });

  const { lastReadMessageId } = useChannelLastRead();

  const items = useMemo(() => {
    const withDateSeparators = insertDateSeparators(messages);
    return insertNewMessagesSeparator(withDateSeparators, lastReadMessageId);
  }, [messages, lastReadMessageId]);

  const lastMessageIdRef = useRef<string | null>(null);

  // Track if we've done the initial scroll-to-bottom
  const hasDoneInitialScrollRef = useRef(false);

  // Anchor info for preserving scroll when loading older pages
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
    useChannelMessageHighlight();

  // Initial scroll to bottom or to new messages separator
  useEffect(() => {
    const el = scrollRef.current;
    if (!(channelId && el)) return;
    if (isLoading) return;
    if (messages.length === 0) return;
    if (hasDoneInitialScrollRef.current) return;

    hasDoneInitialScrollRef.current = true;

    // Check if there's a new messages separator
    const newMessagesSeparatorIndex = items.findIndex(
      (item) => "type" in item && item.type === "new-messages-separator"
    );

    requestAnimationFrame(() => {
      if (newMessagesSeparatorIndex === -1) {
        // No new messages, scroll to bottom
        virtualizer.scrollToOffset(el.scrollHeight, { align: "end" });
      } else {
        // Scroll to new messages separator
        virtualizer.scrollToIndex(newMessagesSeparatorIndex, {
          align: "start",
        });
      }
    });
  }, [channelId, isLoading, messages.length, items, virtualizer]);

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

  // After older messages are fetched and rendered, restore scroll position
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

  // ✅ Stable scroll handler using useEffectEvent
  const handleScroll = useEffectEvent(() => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollThreshold = el.clientHeight * 0.1;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

    if (isAutoScrollingRef.current && distanceFromBottom <= 50) {
      isAutoScrollingRef.current = false;
    }

    // Show button when not at the bottom (with 100px threshold)
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

  // Infinite scroll: attach DOM listener with proper cleanup
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      handleScroll();
    };

    el.addEventListener("scroll", onScroll, { passive: true });

    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <checking of highlighted as is required>
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

    if (targetIndex === -1) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
        return;
      }

      const timeoutId = window.setTimeout(() => {
        clearHighlightedMessage();
      }, 800);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }

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
    }, 120);

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
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
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

  // Calculate min and max dates from messages
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

  // Scroll to date handler
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
    // DOM
    scrollRef,

    // virtualization
    virtualizer,
    virtualItems,
    totalSize,

    // data
    items,
    messages,

    // status flags
    isLoading,
    isFetchingNextPage,
    hasNextPage,

    // scroll actions
    showScrollButton,
    scrollToBottom,

    // date filter
    filterDate,
    scrollToDate,
    dateRange,

    highlightedMessageId,
  };
}

const PAGE_SIZE = 100;

export function useMessages({ channelId }: { channelId: string }) {
  const { pages, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useLiveInfiniteQuery(
      (q) =>
        q
          .from({ message: messagesCollection })
          .innerJoin({ sender: usersCollection }, ({ message, sender }) =>
            eq(message.senderId, sender.id)
          )
          .leftJoin(
            { attachment: attachmentsCollection },
            ({ message, attachment }) => eq(attachment.messageId, message.id)
          )
          .innerJoin({ channel: channelsCollection }, ({ message, channel }) =>
            eq(message.channelId, channel.id)
          )
          .where(({ message }) =>
            and(
              eq(message.channelId, channelId),
              isNull(message.deletedAt),
              isNull(message.parentMessageId)
            )
          )
          .orderBy(({ message }) => message.createdAt, "desc")
          .select(({ message, sender, attachment, channel }) => ({
            message,
            sender,
            attachment,
            channel,
          })),
      {
        pageSize: PAGE_SIZE,
        getNextPageParam: (lastPage, allPages) =>
          lastPage.length === PAGE_SIZE ? allPages.length : undefined,
      },
      [channelId]
    );

  const messages = useMemo(() => buildOrderedMessages(pages), [pages]);

  return {
    messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  };
}
