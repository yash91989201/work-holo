import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { create } from "zustand";
import { useDmPresence } from "@/hooks/communications/dm/use-dm-presence";
import { useAuthedSession } from "@/hooks/use-authed-session";
import type { DmMessageWithSender } from "@/lib/communications/dm-message";
import { queryUtils } from "@/utils/orpc";

interface DmParticipant {
  email: string;
  id: string;
  image?: string | null | undefined;
  isOnline: boolean;
  name: string;
}

interface InfoSidebarState {
  isOpen: boolean;
}

type MaximizedMessageComposerResult =
  | { action: "submit" }
  | { action: "cancel"; content?: string | null };

type MaximizedComposerCompleteCallback = (
  result: MaximizedMessageComposerResult
) => void;

interface MaximizedMessageComposerState {
  content: string | null;
  isOpen: boolean;
  messageId: string | null;
  onComplete?: MaximizedComposerCompleteCallback;
  parentMessageId: string | null;
}

interface MessageThreadState {
  isOpen: boolean;
  messageId: string | null;
}

interface PinnedMessagesState {
  isOpen: boolean;
}

interface HighlightedMessageState {
  messageId: string | null;
  triggeredAt: number | null;
}

interface ComposerFocusState {
  main: (() => void) | null;
  thread: (() => void) | null;
}

interface ReplyingToMessageState {
  message: DmMessageWithSender | null;
}

interface DmState {
  clearHighlightedMessage: () => void;
  clearReplyingToMessage: () => void;
  clearThreadReplyingToMessage: () => void;
  closeInfoSidebar: () => void;
  closeMaximizedMessageComposer: () => void;
  closeMessageThread: () => void;
  closePinnedMessages: () => void;
  composerFocus: ComposerFocusState;
  focusMainComposer: () => void;
  focusThreadComposer: () => void;
  highlightedMessage: HighlightedMessageState;
  highlightMessage: (messageId: string) => void;
  infoSidebar: InfoSidebarState;
  maximizedMessageComposer: MaximizedMessageComposerState;
  messageThread: MessageThreadState;
  openInfoSidebar: () => void;
  openMaximizedMessageComposer: (
    config?: OpenMaximizedMessageComposerConfig
  ) => void;
  openMessageThread: (messageId: string) => void;
  openPinnedMessages: () => void;
  pinnedMessages: PinnedMessagesState;
  replyingToMessage: ReplyingToMessageState;
  setMainComposerFocus: (handler: (() => void) | null) => void;
  setReplyingToMessage: (message: DmMessageWithSender) => void;
  setThreadComposerFocus: (handler: (() => void) | null) => void;
  setThreadReplyingToMessage: (message: DmMessageWithSender) => void;
  threadReplyingToMessage: ReplyingToMessageState;
}

interface OpenMaximizedMessageComposerConfig {
  content?: string | null;
  messageId?: string | null;
  onComplete?: MaximizedComposerCompleteCallback;
  parentMessageId?: string | null;
}

const defaultMaximizedComposerState: MaximizedMessageComposerState = {
  isOpen: false,
  messageId: null,
  content: null,
  parentMessageId: null,
  onComplete: undefined,
};

const useDmStore = create<DmState>((set, get) => ({
  infoSidebar: { isOpen: false },
  maximizedMessageComposer: { ...defaultMaximizedComposerState },
  pinnedMessages: { isOpen: false },
  composerFocus: {
    main: null,
    thread: null,
  },
  searchSidebar: { isOpen: false },
  highlightedMessage: {
    messageId: null,
    triggeredAt: null,
  },
  replyingToMessage: {
    message: null,
  },
  threadReplyingToMessage: {
    message: null,
  },
  messageThread: {
    messageId: null,
    isOpen: false,
  },

  openInfoSidebar: () =>
    set({
      infoSidebar: {
        isOpen: true,
      },
    }),
  closeInfoSidebar: () =>
    set({
      infoSidebar: {
        isOpen: false,
      },
    }),

  openMaximizedMessageComposer: (config = {}) =>
    set({
      maximizedMessageComposer: {
        ...defaultMaximizedComposerState,
        isOpen: true,
        content: config.content ?? null,
        messageId: config.messageId ?? null,
        parentMessageId: config.parentMessageId ?? null,
        onComplete: config.onComplete,
      },
    }),

  closeMaximizedMessageComposer: () =>
    set({
      maximizedMessageComposer: {
        ...defaultMaximizedComposerState,
      },
    }),

  openMessageThread: (messageId) =>
    set({
      messageThread: {
        messageId,
        isOpen: true,
      },
    }),
  closeMessageThread: () =>
    set({
      messageThread: {
        messageId: null,
        isOpen: false,
      },
    }),
  openPinnedMessages: () =>
    set({
      pinnedMessages: {
        isOpen: true,
      },
    }),
  closePinnedMessages: () =>
    set({
      pinnedMessages: {
        isOpen: false,
      },
    }),
  setMainComposerFocus: (handler) =>
    set((state) => ({
      composerFocus: {
        ...state.composerFocus,
        main: handler,
      },
    })),
  setThreadComposerFocus: (handler) =>
    set((state) => ({
      composerFocus: {
        ...state.composerFocus,
        thread: handler,
      },
    })),
  focusMainComposer: () => {
    get().composerFocus.main?.();
  },
  focusThreadComposer: () => {
    get().composerFocus.thread?.();
  },
  highlightMessage: (messageId) =>
    set({
      highlightedMessage: {
        messageId,
        triggeredAt: Date.now(),
      },
    }),
  clearHighlightedMessage: () =>
    set({
      highlightedMessage: {
        messageId: null,
        triggeredAt: null,
      },
    }),
  setReplyingToMessage: (message) =>
    set({
      replyingToMessage: {
        message,
      },
    }),
  clearReplyingToMessage: () =>
    set({
      replyingToMessage: {
        message: null,
      },
    }),
  setThreadReplyingToMessage: (message) =>
    set({
      threadReplyingToMessage: {
        message,
      },
    }),
  clearThreadReplyingToMessage: () =>
    set({
      threadReplyingToMessage: {
        message: null,
      },
    }),
}));

export function useDmConversation(conversationId: string) {
  const { data: conversation } = useSuspenseQuery(
    queryUtils.communication.dm.getConversation.queryOptions({
      input: { conversationId },
    })
  );

  const { isUserOnline } = useDmPresence(conversationId);

  const { user } = useAuthedSession();

  const currentUserId = user.id;

  const otherParticipant = useMemo<DmParticipant | null>(() => {
    if (!(conversation && currentUserId)) return null;

    const other =
      conversation.participantOneId === currentUserId
        ? conversation.participantTwo
        : conversation.participantOne;

    if (!other) return null;

    return {
      ...other,
      isOnline: isUserOnline(other.id),
    };
  }, [conversation, currentUserId, isUserOnline]);

  return {
    conversation,
    otherParticipant,
  };
}

export function useDmInfoSidebar() {
  const isOpen = useDmStore((state) => state.infoSidebar.isOpen);
  const openInfoSidebar = useDmStore((state) => state.openInfoSidebar);
  const closeInfoSidebar = useDmStore((state) => state.closeInfoSidebar);

  const toggleInfoSidebar = () =>
    isOpen ? closeInfoSidebar() : openInfoSidebar();

  return { isOpen, openInfoSidebar, closeInfoSidebar, toggleInfoSidebar };
}

export function useDmPinnedMessagesSidebar() {
  const isOpen = useDmStore((state) => state.pinnedMessages.isOpen);
  const openPinnedMessages = useDmStore((state) => state.openPinnedMessages);
  const closePinnedMessages = useDmStore((state) => state.closePinnedMessages);

  const togglePinnedMessages = isOpen
    ? closePinnedMessages
    : openPinnedMessages;

  return {
    isOpen,
    openPinnedMessages,
    closePinnedMessages,
    togglePinnedMessages,
  };
}

export function useDmMessageHighlight() {
  const highlightedMessageId = useDmStore(
    (state) => state.highlightedMessage.messageId
  );
  const highlightedAt = useDmStore(
    (state) => state.highlightedMessage.triggeredAt
  );
  const highlightMessage = useDmStore((state) => state.highlightMessage);
  const clearHighlightedMessage = useDmStore(
    (state) => state.clearHighlightedMessage
  );

  return {
    highlightedMessageId,
    highlightedAt,
    highlightMessage,
    clearHighlightedMessage,
  };
}

export function useDmReplyState() {
  const replyingToMessage = useDmStore(
    (state) => state.replyingToMessage.message
  );
  const setReplyingToMessage = useDmStore(
    (state) => state.setReplyingToMessage
  );
  const clearReplyingToMessage = useDmStore(
    (state) => state.clearReplyingToMessage
  );

  return {
    replyingToMessage,
    setReplyingToMessage,
    clearReplyingToMessage,
  };
}

export function useDmThreadReplyState() {
  const replyingToMessage = useDmStore(
    (state) => state.threadReplyingToMessage.message
  );
  const setReplyingToMessage = useDmStore(
    (state) => state.setThreadReplyingToMessage
  );
  const clearReplyingToMessage = useDmStore(
    (state) => state.clearThreadReplyingToMessage
  );

  return {
    replyingToMessage,
    setReplyingToMessage,
    clearReplyingToMessage,
  };
}

export function useDmComposerFocus() {
  const setMainComposerFocus = useDmStore(
    (state) => state.setMainComposerFocus
  );
  const setThreadComposerFocus = useDmStore(
    (state) => state.setThreadComposerFocus
  );
  const focusMainComposer = useDmStore((state) => state.focusMainComposer);
  const focusThreadComposer = useDmStore((state) => state.focusThreadComposer);

  return {
    setMainComposerFocus,
    setThreadComposerFocus,
    focusMainComposer,
    focusThreadComposer,
  };
}

export function useDmMessageThreadSidebar() {
  const isOpen = useDmStore((state) => state.messageThread.isOpen);
  const messageId = useDmStore((state) => state.messageThread.messageId);
  const openMessageThread = useDmStore((state) => state.openMessageThread);
  const closeMessageThread = useDmStore((state) => state.closeMessageThread);

  return {
    isOpen,
    messageId,
    openMessageThread,
    closeMessageThread,
  };
}

export function useMaximizedDmMessageComposer() {
  const isOpen = useDmStore((state) => state.maximizedMessageComposer.isOpen);
  const content = useDmStore((state) => state.maximizedMessageComposer.content);
  const messageId = useDmStore(
    (state) => state.maximizedMessageComposer.messageId
  );
  const parentMessageId = useDmStore(
    (state) => state.maximizedMessageComposer.parentMessageId
  );
  const onComplete = useDmStore(
    (state) => state.maximizedMessageComposer.onComplete
  );
  const openMaximizedMessageComposer = useDmStore(
    (state) => state.openMaximizedMessageComposer
  );
  const closeMaximizedMessageComposer = useDmStore(
    (state) => state.closeMaximizedMessageComposer
  );

  return {
    isOpen,
    content,
    messageId,
    parentMessageId,
    onComplete,
    openMaximizedMessageComposer,
    closeMaximizedMessageComposer,
  };
}

export function useMaximizedDmMessageComposerActions() {
  const openMaximizedMessageComposer = useDmStore(
    (state) => state.openMaximizedMessageComposer
  );

  return { openMaximizedMessageComposer };
}

// Legacy exports for backward compatibility during migration
export const useDMStore = useDmStore;
export const useDMThread = useDmMessageThreadSidebar;
export const useDMPins = useDmPinnedMessagesSidebar;
export const useDMInfo = useDmInfoSidebar;
export const useDMHighlightedMessage = useDmMessageHighlight;
