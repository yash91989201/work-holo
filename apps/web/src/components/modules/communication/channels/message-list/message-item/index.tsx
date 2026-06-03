import {
  IconCornerDownRight,
  IconMessageReply,
  IconPencil,
  IconPinFilled,
  IconTrash,
} from "@tabler/icons-react";
import { eq, useLiveQuery } from "@tanstack/react-db";
import type { MessageWithSenderType } from "@work-holo/api/lib/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@work-holo/ui/components/avatar";
import { Badge } from "@work-holo/ui/components/badge";
import { Button } from "@work-holo/ui/components/button";
import { useMemo } from "react";
import {
  attachmentsCollection,
  channelsCollection,
  messagesCollection,
  usersCollection,
} from "@/db/collections";
import { useMessageMutations } from "@/hooks/communications/use-message-mutations";
import { useAuthedSession } from "@/hooks/use-authed-session";
import {
  buildMessageWithAttachments,
  type MessageWithSender,
} from "@/lib/communications/message";
import { cn, formatMessageTimestamp } from "@/lib/utils";
import {
  useChannelComposerFocus,
  useChannelMessageHighlight,
  useChannelReplyState,
  useChannelThreadReplyState,
  useMaximizedMessageComposerActions,
  useMentionsSidebar,
  useMessageThreadSidebar,
} from "@/stores/channel-store";
import { stripHtmlToText, truncateText } from "@/utils/message-utils";
import { MessageActions } from "./message-actions";
import { MessageContent } from "./message-content";
import { MessageReactions } from "./message-reactions";
import { MessageReadReceipts } from "./message-read-receipts";

interface MessageItemProps {
  isHighlighted?: boolean;
  isPinnedMessage?: boolean;
  isThreadMessage?: boolean;
  message: MessageWithSenderType;
}

function ReplyPreview({
  replyToMessageId,
  isOwnMessage,
}: {
  replyToMessageId: string;
  isOwnMessage: boolean;
}) {
  const { highlightMessage } = useChannelMessageHighlight();
  const { data: replyRows } = useLiveQuery(
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
        .where(({ message }) => eq(message.id, replyToMessageId))
        .select(({ message, sender, attachment }) => ({
          id: message.id,
          content: message.content,
          senderName: sender.name,
          isDeleted: message.isDeleted,
          deletedAt: message.deletedAt,
          attachmentId: attachment?.id ?? null,
        })),
    [replyToMessageId]
  );

  const replyData = useMemo(() => {
    if (!replyRows || replyRows.length === 0) return null;

    const first = replyRows[0];
    if (!first) return null;

    const hasAttachment = replyRows.some(
      (r) => r.attachmentId !== null && r.attachmentId !== undefined
    );

    return {
      id: first.id,
      content: first.content,
      senderName: first.senderName,
      isDeleted: first.isDeleted || first.deletedAt !== null,
      hasAttachment,
    };
  }, [replyRows]);

  const handleReplyPreviewClick = () => {
    highlightMessage(replyToMessageId);
  };

  if (!replyData || replyData.isDeleted) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-md border-muted-foreground/40 border-l-2 bg-muted/60 px-3 py-1.5 text-muted-foreground text-xs",
          isOwnMessage && "ml-auto"
        )}
      >
        <IconTrash className="size-3 shrink-0" />
        <span className="italic">Original message was deleted</span>
      </div>
    );
  }

  const getDisplayContent = () => {
    if (replyData.content) {
      const plainText = stripHtmlToText(replyData.content);
      return truncateText(plainText, 80);
    }
    return replyData.hasAttachment ? "📎 Attachment" : "";
  };

  return (
    <Button
      className={cn(
        "flex h-auto max-w-full items-center justify-start gap-2 rounded-md border-primary/60 border-t-0 border-r-0 border-b-0 border-l-2 bg-muted/60 px-3 py-1.5 text-left transition-colors hover:bg-muted",
        isOwnMessage && "ml-auto"
      )}
      onClick={handleReplyPreviewClick}
      variant="ghost"
    >
      <div className="min-w-0 flex-1">
        <span className="block font-medium text-foreground text-xs">
          {replyData.senderName}
        </span>
        <p className="truncate text-muted-foreground text-xs">
          {getDisplayContent()}
        </p>
      </div>
    </Button>
  );
}

export function MessageItem({
  message,
  isThreadMessage = false,
  isHighlighted = false,
}: MessageItemProps) {
  const {
    deleteMessage,
    pinMessage,
    unPinMessage,
    addReaction,
    removeReaction,
  } = useMessageMutations();

  const { user } = useAuthedSession();
  const isOwnMessage = user.id === message.senderId;

  const timestamp = formatMessageTimestamp(message.createdAt);

  const { messageId, openMessageThread, closeMessageThread } =
    useMessageThreadSidebar();

  const { setReplyingToMessage } = useChannelReplyState();
  const { setReplyingToMessage: setThreadReplyingToMessage } =
    useChannelThreadReplyState();
  const { focusMainComposer, focusThreadComposer } = useChannelComposerFocus();

  const isMessageThreadActive = messageId === message.id;

  const handleDelete = () => {
    deleteMessage({ messageId: message.id });
  };

  const handlePin = () => {
    if (message.isPinned) {
      unPinMessage({ messageId: message.id });
    } else {
      pinMessage({ messageId: message.id });
    }
  };

  const handleReact = (emoji: string) => {
    addReaction({ messageId: message.id, emoji });
  };

  const handleReactionClick = (reactionId: string) => {
    removeReaction({ reactionId });
  };

  const { openMaximizedMessageComposer } = useMaximizedMessageComposerActions();

  const { isOpen: isMentionSidebarOpen, closeMentionsSidebar } =
    useMentionsSidebar();

  const handleEditDialog = () => {
    openMaximizedMessageComposer({
      messageId: message.id,
      content: message.content || "",
    });
  };

  const toggleMessageThread = () => {
    if (isMentionSidebarOpen) {
      closeMentionsSidebar();
    }

    if (isMessageThreadActive) {
      closeMessageThread();
    } else {
      openMessageThread(message.id);
    }
  };

  const handleReplyInThread = (parentMessageId?: string | null) => {
    if (!parentMessageId) return;

    if (isMentionSidebarOpen) {
      closeMentionsSidebar();
    }

    openMessageThread(parentMessageId);
  };

  const handleInlineReply = () => {
    const channel = channelsCollection.get(message.channelId);
    if (!channel) {
      return;
    }

    const normalizedMessage: MessageWithSender = {
      ...buildMessageWithAttachments(message, message.sender, channel),
      attachments: [...(message.attachments ?? [])],
    };

    if (isThreadMessage) {
      setThreadReplyingToMessage(normalizedMessage);
      focusThreadComposer();
    } else {
      setReplyingToMessage(normalizedMessage);
      focusMainComposer();
    }
  };

  return (
    <div
      className={cn(
        "group relative flex w-full gap-4 rounded-lg px-4 py-2 transition-colors hover:bg-muted/50",
        isOwnMessage && "flex-row-reverse",
        {
          "bg-accent/50": isMessageThreadActive,
          "animate-[pulse_0.2s_ease-in-out_3] bg-primary/10": isHighlighted,
        }
      )}
      data-message-id={message.id}
    >
      {/* Avatar */}
      <div className="shrink-0 pt-0.5">
        <Avatar
          className={cn("h-9 w-9", {
            "h-7 w-7": isThreadMessage,
          })}
        >
          <AvatarImage
            alt={message.sender.name}
            src={message.sender.image || undefined}
          />
          <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 font-medium text-primary text-xs">
            {message.sender.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div
        className={cn(
          "relative flex max-w-[50%] flex-col gap-2",
          isOwnMessage ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "flex flex-wrap items-baseline gap-x-2 gap-y-1",
            isOwnMessage && "flex-row-reverse"
          )}
        >
          <span className="font-semibold text-foreground text-sm">
            {message.sender.name}
          </span>

          <span className="text-muted-foreground text-xs">
            {timestamp.formatted}
          </span>

          {message.isEdited && (
            <Badge variant="secondary">
              <IconPencil className="size-3" />
            </Badge>
          )}

          {message.isPinned && (
            <Badge variant="secondary">
              <IconPinFilled className="size-3" />
            </Badge>
          )}

          {message.threadCount > 0 && (
            <Badge
              className="cursor-pointer select-none"
              onClick={toggleMessageThread}
              title={isMessageThreadActive ? "Close thread" : "Open thread"}
              variant={isMessageThreadActive ? "default" : "secondary"}
            >
              <span>{message.threadCount}</span>
              <IconCornerDownRight className="h-2.5 w-2.5" />
            </Badge>
          )}
        </div>

        <div className="relative w-full">
          {message.replyToMessageId && (
            <div className="mb-1">
              <ReplyPreview
                isOwnMessage={isOwnMessage}
                replyToMessageId={message.replyToMessageId}
              />
            </div>
          )}
          <MessageContent isOwnMessage={isOwnMessage} message={message} />

          <div
            className={cn(
              "pointer-events-none absolute top-1 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100",
              isOwnMessage
                ? "-left-2 -translate-x-full"
                : "-right-2 translate-x-full"
            )}
          >
            <MessageActions
              canEdit={user.id === message.senderId && message.type === "text"}
              canInlineReply={true}
              canPin={!isThreadMessage}
              canReply={!isThreadMessage}
              isOwnMessage={isOwnMessage}
              isPinned={message.isPinned}
              onDelete={handleDelete}
              onEdit={handleEditDialog}
              onInlineReply={handleInlineReply}
              onPin={handlePin}
              onReact={handleReact}
              onReply={toggleMessageThread}
            />
          </div>
        </div>

        <MessageReactions
          messageId={message.id}
          onAddReaction={handleReact}
          onRemoveReaction={handleReactionClick}
        />

        {isOwnMessage && (
          <MessageReadReceipts
            isOwnMessage={isOwnMessage}
            messageId={message.id}
            userId={user.id}
          />
        )}

        {!isThreadMessage && message.parentMessageId && (
          <Button
            className="rounded-full"
            onClick={() => handleReplyInThread(message.parentMessageId)}
            size="sm"
            variant="secondary"
          >
            <IconMessageReply />
            <span>Reply</span>
          </Button>
        )}
      </div>
    </div>
  );
}
