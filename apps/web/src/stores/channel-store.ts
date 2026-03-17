import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { create } from "zustand";
import { useChannelPresence } from "@/hooks/communications/use-channel-presence";
import type { MessageWithSender } from "@/lib/communications/message";
import { queryUtils } from "@/utils/orpc";

interface ChannelMember {
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

interface OpenMaximizedMessageComposerConfig {
  content?: string | null;
  messageId?: string | null;
  onComplete?: MaximizedComposerCompleteCallback;
  parentMessageId?: string | null;
}

interface MessageThreadState {
  isOpen: boolean;
  messageId: string | null;
}

interface PinnedMessagesState {
  isOpen: boolean;
}

interface MentionsSidebarState {
  isOpen: boolean;
}

interface ReplyingToMessageState {
  message: MessageWithSender | null;
}

interface SearchSidebarState {
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

interface ChannelState {
  clearHighlightedMessage: () => void;
  clearReplyingToMessage: () => void;
  clearThreadReplyingToMessage: () => void;
  closeInfoSidebar: () => void;
  closeMaximizedMessageComposer: () => void;
  closeMentionsSidebar: () => void;
  closeMessageThread: () => void;
  closePinnedMessages: () => void;
  composerFocus: ComposerFocusState;
  focusMainComposer: () => void;
  focusThreadComposer: () => void;
  highlightedMessage: HighlightedMessageState;
  highlightMessage: (messageId: string) => void;
  infoSidebar: InfoSidebarState;
  maximizedMessageComposer: MaximizedMessageComposerState;
  mentionsSidebar: MentionsSidebarState;
  messageThread: MessageThreadState;
  openInfoSidebar: () => void;
  openMaximizedMessageComposer: (
    config?: OpenMaximizedMessageComposerConfig
  ) => void;
  openMentionsSidebar: () => void;
  openMessageThread: (messageId: string) => void;
  openPinnedMessages: () => void;
  pinnedMessages: PinnedMessagesState;
  replyingToMessage: ReplyingToMessageState;
  setMainComposerFocus: (handler: (() => void) | null) => void;
  setReplyingToMessage: (message: MessageWithSender) => void;
  setThreadComposerFocus: (handler: (() => void) | null) => void;
  setThreadReplyingToMessage: (message: MessageWithSender) => void;
  threadReplyingToMessage: ReplyingToMessageState;
}

const defaultMaximizedComposerState: MaximizedMessageComposerState = {
  isOpen: false,
  messageId: null,
  content: null,
  parentMessageId: null,
  onComplete: undefined,
};

const useChannelStore = create<ChannelState>((set, get) => ({
  infoSidebar: { isOpen: false },
  maximizedMessageComposer: { ...defaultMaximizedComposerState },
  pinnedMessages: {
    isOpen: false,
  },
  mentionsSidebar: {
    isOpen: false,
  },
  composerFocus: {
    main: null,
    thread: null,
  },
  highlightedMessage: {
    messageId: null,
    triggeredAt: null,
  },
  messageThread: {
    messageId: null,
    isOpen: false,
  },
  replyingToMessage: {
    message: null,
  },
  threadReplyingToMessage: {
    message: null,
  },

  openInfoSidebar: () => set({ infoSidebar: { isOpen: true } }),
  closeInfoSidebar: () => set({ infoSidebar: { isOpen: false } }),

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
    set({ maximizedMessageComposer: { ...defaultMaximizedComposerState } }),

  openMessageThread: (messageId) =>
    set({ messageThread: { messageId, isOpen: true } }),
  closeMessageThread: () =>
    set({ messageThread: { messageId: null, isOpen: false } }),
  openPinnedMessages: () => set({ pinnedMessages: { isOpen: true } }),
  closePinnedMessages: () => set({ pinnedMessages: { isOpen: false } }),
  openMentionsSidebar: () => set({ mentionsSidebar: { isOpen: true } }),
  closeMentionsSidebar: () => set({ mentionsSidebar: { isOpen: false } }),
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
      highlightedMessage: { messageId: null, triggeredAt: null },
    }),
  clearReplyingToMessage: () =>
    set({
      replyingToMessage: { message: null },
    }),
  setReplyingToMessage: (message) =>
    set({
      replyingToMessage: { message },
    }),
  clearThreadReplyingToMessage: () =>
    set({
      threadReplyingToMessage: { message: null },
    }),
  setThreadReplyingToMessage: (message) =>
    set({
      threadReplyingToMessage: { message },
    }),
}));

export function useChannel(channelId: string) {
  const { data: channel } = useSuspenseQuery(
    queryUtils.communication.channel.get.queryOptions({ input: { channelId } })
  );

  const { data: membersList = [], isLoading } = useSuspenseQuery(
    queryUtils.communication.channel.listMembers.queryOptions({
      input: {
        channelId,
      },
    })
  );

  const { onlineUserIds } = useChannelPresence(channelId);

  const channelMembers = useMemo<ChannelMember[]>(
    () =>
      membersList.map((member) => ({
        ...member,
        isOnline: onlineUserIds.includes(member.id),
      })),
    [membersList, onlineUserIds]
  );

  const onlineUsersCount = onlineUserIds.length;

  return {
    channel,
    channelMembers,
    onlineUsersCount,
    isLoading,
  };
}

export function useChannelInfoSidebar() {
  const isOpen = useChannelStore((state) => state.infoSidebar.isOpen);
  const openInfoSidebar = useChannelStore((state) => state.openInfoSidebar);
  const closeInfoSidebar = useChannelStore((state) => state.closeInfoSidebar);

  const toggleInfoSidebar = () =>
    isOpen ? closeInfoSidebar() : openInfoSidebar();

  return { isOpen, openInfoSidebar, closeInfoSidebar, toggleInfoSidebar };
}

export function usePinnedMessagesSidebar() {
  const isOpen = useChannelStore((state) => state.pinnedMessages.isOpen);

  const openPinnedMessages = useChannelStore(
    (state) => state.openPinnedMessages
  );

  const closePinnedMessages = useChannelStore(
    (state) => state.closePinnedMessages
  );

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

export function useMentionsSidebar() {
  const isOpen = useChannelStore((state) => state.mentionsSidebar.isOpen);

  const openMentionsSidebar = useChannelStore(
    (state) => state.openMentionsSidebar
  );

  const closeMentionsSidebar = useChannelStore(
    (state) => state.closeMentionsSidebar
  );

  const toggleMentionsSidebar = isOpen
    ? closeMentionsSidebar
    : openMentionsSidebar;

  return {
    isOpen,
    openMentionsSidebar,
    closeMentionsSidebar,
    toggleMentionsSidebar,
  };
}

export function useChannelMessageHighlight() {
  const highlightedMessageId = useChannelStore(
    (state) => state.highlightedMessage.messageId
  );
  const highlightedAt = useChannelStore(
    (state) => state.highlightedMessage.triggeredAt
  );
  const highlightMessage = useChannelStore((state) => state.highlightMessage);
  const clearHighlightedMessage = useChannelStore(
    (state) => state.clearHighlightedMessage
  );

  return {
    highlightedMessageId,
    highlightedAt,
    highlightMessage,
    clearHighlightedMessage,
  };
}

export function useMessageThreadSidebar() {
  const isOpen = useChannelStore((state) => state.messageThread.isOpen);
  const messageId = useChannelStore(
    (state) => state.messageThread.messageId
  ) as string;
  const openMessageThread = useChannelStore((state) => state.openMessageThread);
  const closeMessageThread = useChannelStore(
    (state) => state.closeMessageThread
  );

  return {
    isOpen,
    messageId,
    openMessageThread,
    closeMessageThread,
  };
}

export function useMaximizedMessageComposer() {
  const isOpen = useChannelStore(
    (state) => state.maximizedMessageComposer.isOpen
  );

  const content = useChannelStore(
    (state) => state.maximizedMessageComposer.content
  );

  const messageId = useChannelStore(
    (state) => state.maximizedMessageComposer.messageId
  );

  const parentMessageId = useChannelStore(
    (state) => state.maximizedMessageComposer.parentMessageId
  );

  const onComplete = useChannelStore(
    (state) => state.maximizedMessageComposer.onComplete
  );

  const openMaximizedMessageComposer = useChannelStore(
    (state) => state.openMaximizedMessageComposer
  );

  const closeMaximizedMessageComposer = useChannelStore(
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

export function useMaximizedMessageComposerActions() {
  const openMaximizedMessageComposer = useChannelStore(
    (state) => state.openMaximizedMessageComposer
  );

  return { openMaximizedMessageComposer };
}

export function useChannelReplyState() {
  const replyingToMessage = useChannelStore(
    (state) => state.replyingToMessage.message
  );
  const setReplyingToMessage = useChannelStore(
    (state) => state.setReplyingToMessage
  );
  const clearReplyingToMessage = useChannelStore(
    (state) => state.clearReplyingToMessage
  );

  return {
    replyingToMessage,
    setReplyingToMessage,
    clearReplyingToMessage,
  };
}

export function useChannelComposerFocus() {
  const setMainComposerFocus = useChannelStore(
    (state) => state.setMainComposerFocus
  );
  const setThreadComposerFocus = useChannelStore(
    (state) => state.setThreadComposerFocus
  );
  const focusMainComposer = useChannelStore((state) => state.focusMainComposer);
  const focusThreadComposer = useChannelStore(
    (state) => state.focusThreadComposer
  );

  return {
    setMainComposerFocus,
    setThreadComposerFocus,
    focusMainComposer,
    focusThreadComposer,
  };
}

export function useChannelThreadReplyState() {
  const replyingToMessage = useChannelStore(
    (state) => state.threadReplyingToMessage.message
  );
  const setReplyingToMessage = useChannelStore(
    (state) => state.setThreadReplyingToMessage
  );
  const clearReplyingToMessage = useChannelStore(
    (state) => state.clearThreadReplyingToMessage
  );

  return {
    replyingToMessage,
    setReplyingToMessage,
    clearReplyingToMessage,
  };
}
