import { useParams } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import {
  dmConversationReadsCollection,
  dmMessagesCollection,
} from "@/db/collections";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { useDmLastRead } from "./use-dm-last-read";
import { useDmMessageMutations } from "./use-dm-message-mutations";

interface UseMarkDmMessagesReadOptions {
  debounceMs?: number;
  enabled?: boolean;
}

/**
 * Hook to mark visible DM messages as read with debouncing
 */
export function useMarkDmMessagesRead(
  visibleMessageIds: Set<string>,
  options: UseMarkDmMessagesReadOptions = {}
) {
  const { debounceMs = 1000, enabled = true } = options;

  const { conversationId } = useParams({
    from: "/(authenticated)/org/$slug/workspace/communication/dm/$conversationId",
  });

  const { user } = useAuthedSession();
  const userId = user.id;

  const { lastReadMessageId } = useDmLastRead();
  const { markMessagesAsRead } = useDmMessageMutations();

  const processedMessagesRef = useRef<Set<string>>(new Set());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingMessagesRef = useRef<Set<string>>(new Set());

  // Build lookup map for fast read checks
  const messageReadLookupRef = useRef<Map<string, Set<string>>>(new Map());

  useEffect(() => {
    const lookup = new Map<string, Set<string>>();

    // For DMs, we track based on conversation read records
    for (const read of dmConversationReadsCollection.values()) {
      if (read.lastReadMessageId) {
        if (!lookup.has(read.lastReadMessageId)) {
          lookup.set(read.lastReadMessageId, new Set());
        }
        lookup.get(read.lastReadMessageId)?.add(read.userId);
      }
    }

    messageReadLookupRef.current = lookup;
  }, [conversationId]);

  useEffect(() => {
    if (!enabled || visibleMessageIds.size === 0) {
      return;
    }

    // Get the lastReadMessage's createdAt timestamp for watermark comparison
    let lastReadMessageCreatedAt: Date | null = null;
    if (lastReadMessageId) {
      const lastReadMessage = dmMessagesCollection.get(lastReadMessageId);
      if (lastReadMessage) {
        lastReadMessageCreatedAt = new Date(lastReadMessage.createdAt);
      }
    }

    // Find messages that are visible but haven't been processed yet
    const unreadMessages = Array.from(visibleMessageIds).filter((messageId) => {
      // Skip own messages
      const message = dmMessagesCollection.get(messageId);
      if (message?.senderId === userId) {
        return false;
      }

      // Check if already processed in this session
      if (processedMessagesRef.current.has(messageId)) {
        return false;
      }

      // Check if already read in local collection
      const reads = messageReadLookupRef.current.get(messageId) || new Set();
      const isAlreadyRead = reads.has(userId);

      if (isAlreadyRead) {
        return false;
      }

      // Check if message was created before or at the last read timestamp
      if (
        lastReadMessageCreatedAt &&
        message &&
        new Date(message.createdAt) <= lastReadMessageCreatedAt
      ) {
        return false;
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

      // Call optimistic action
      markMessagesAsRead({
        conversationId,
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
    conversationId,
    userId,
    debounceMs,
    lastReadMessageId,
  ]);

  // Reset processed messages when conversation changes
  useEffect(() => {
    processedMessagesRef.current.clear();
    pendingMessagesRef.current.clear();

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, [conversationId]);

  return {
    processedCount: processedMessagesRef.current.size,
  };
}
