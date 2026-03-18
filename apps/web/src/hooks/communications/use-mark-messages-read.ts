import { useParams } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { messageReadCollection, messagesCollection } from "@/db/collections";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { useChannelLastRead } from "./use-channel-last-read";
import { useMessageMutations } from "./use-message-mutations";

interface UseMarkMessagesReadOptions {
  /**
   * Debounce delay in milliseconds
   * Default: 1000ms (1 second)
   */
  debounceMs?: number;
  /**
   * Whether to enable marking messages as read
   */
  enabled?: boolean;
}

/**
 * Hook to mark visible messages as read with debouncing
 * Automatically calls the API when visible messages change
 * Only marks messages created after the user's last read message (watermark)
 */
export function useMarkMessagesRead(
  visibleMessageIds: Set<string>,
  options: UseMarkMessagesReadOptions = {}
) {
  const { debounceMs = 1000, enabled = true } = options;

  const { channelId } = useParams({
    from: "/(authenticated)/org/$slug/workspace/communication/channels/$channelId",
  });

  const { user } = useAuthedSession();
  const userId = user.id;

  const { lastReadMessageId } = useChannelLastRead();
  const { markMessagesAsRead } = useMessageMutations();

  // Track messages that have been sent to API
  const processedMessagesRef = useRef<Set<string>>(new Set());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingMessagesRef = useRef<Set<string>>(new Set());

  // Build lookup map for fast O(1) read checks
  // Maps messageId -> Set of userIds who have read it
  const messageReadLookupRef = useRef<Map<string, Set<string>>>(new Map());

  // Build lookup map from collection on mount/channel change
  // biome-ignore lint/correctness/useExhaustiveDependencies: Need to track channel changes
  useEffect(() => {
    const lookup = new Map<string, Set<string>>();

    for (const read of messageReadCollection.values()) {
      if (!lookup.has(read.messageId)) {
        lookup.set(read.messageId, new Set());
      }
      lookup.get(read.messageId)?.add(read.userId);
    }

    messageReadLookupRef.current = lookup;
  }, [channelId]); // Rebuild when channel changes

  // biome-ignore lint/correctness/useExhaustiveDependencies: Need to track channel changes
  useEffect(() => {
    if (!enabled || visibleMessageIds.size === 0) {
      return;
    }

    // Get the lastReadMessage's createdAt timestamp for watermark comparison
    let lastReadMessageCreatedAt: Date | null = null;
    if (lastReadMessageId) {
      const lastReadMessage = messagesCollection.get(lastReadMessageId);
      if (lastReadMessage) {
        lastReadMessageCreatedAt = new Date(lastReadMessage.createdAt);
      }
    }

    // Find messages that are visible but haven't been processed yet
    const unreadMessages = Array.from(visibleMessageIds).filter((messageId) => {
      // Check if already processed in this session
      if (processedMessagesRef.current.has(messageId)) {
        return false;
      }

      // Check if already read in local collection (synced from DB)
      const reads = messageReadLookupRef.current.get(messageId) || new Set();
      const isAlreadyRead = reads.has(userId);

      if (isAlreadyRead) {
        return false;
      }

      // Check if message was created before or at the last read message's timestamp
      // If we have a watermark, skip messages created before it (they're already covered)
      if (lastReadMessageCreatedAt) {
        const message = messagesCollection.get(messageId);
        if (
          message &&
          new Date(message.createdAt) <= lastReadMessageCreatedAt
        ) {
          // Message is at or before the watermark, already covered
          return false;
        }
      }

      return true;
    });

    if (unreadMessages.length === 0) {
      return;
    }

    // Add to pending messages
    for (const messageId of unreadMessages) {
      pendingMessagesRef.current.add(messageId);
    }

    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set up new debounce timer
    debounceTimerRef.current = setTimeout(() => {
      const messagesToMark = Array.from(pendingMessagesRef.current);

      if (messagesToMark.length === 0) {
        return;
      }

      // Mark as processed immediately to avoid duplicate calls
      for (const messageId of messagesToMark) {
        processedMessagesRef.current.add(messageId);
      }

      // Clear pending messages
      pendingMessagesRef.current.clear();

      // Call optimistic action to mark messages as read
      markMessagesAsRead({
        channelId,
        messageIds: messagesToMark,
        userId,
      });
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    visibleMessageIds,
    enabled,
    channelId,
    userId,
    debounceMs,
    lastReadMessageId,
  ]);

  // Reset processed messages when channel changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: Need to track channel changes
  useEffect(() => {
    processedMessagesRef.current.clear();
    pendingMessagesRef.current.clear();

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, [channelId]);

  return {
    processedCount: processedMessagesRef.current.size,
  };
}
