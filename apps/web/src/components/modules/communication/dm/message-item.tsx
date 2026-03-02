import {
  IconCornerDownRight,
  IconPencil,
  IconPinFilled,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDmMessageMutations } from "@/hooks/communications/dm/use-dm-message-mutations";
import { useAuthedSession } from "@/hooks/use-authed-session";
import type { DmMessageWithSender } from "@/lib/communications/dm-message";
import { cn, formatMessageTimestamp } from "@/lib/utils";
import {
  useDmMessageThreadSidebar,
  useMaximizedDmMessageComposerActions,
} from "@/stores/dm-store";
import { DmMessageActions } from "./message-actions";
import { DmMessageContent } from "./message-content";
import { DmMessageReactions } from "./message-reactions";

interface DmMessageItemProps {
  conversationId: string;
  isHighlighted?: boolean;
  isThreadMessage?: boolean;
  message: DmMessageWithSender;
}

export function DmMessageItem({
  message,
  conversationId,
  isThreadMessage = false,
  isHighlighted = false,
}: DmMessageItemProps) {
  const {
    deleteMessage,
    pinMessage,
    unPinMessage,
    addReaction,
    removeReaction,
  } = useDmMessageMutations();

  const { user } = useAuthedSession();
  const isOwnMessage = user.id === message.senderId;

  const timestamp = formatMessageTimestamp(message.createdAt);

  const { messageId, openMessageThread, closeMessageThread } =
    useDmMessageThreadSidebar();

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

  const { openMaximizedMessageComposer } =
    useMaximizedDmMessageComposerActions();

  const handleEditDialog = () => {
    openMaximizedMessageComposer({
      messageId: message.id,
      content: message.content || "",
    });
  };

  const toggleMessageThread = () => {
    if (isMessageThreadActive) {
      closeMessageThread();
    } else {
      openMessageThread(message.id);
    }
  };

  const handleReplyInThread = (parentMessageId?: string | null) => {
    if (!parentMessageId) return;
    openMessageThread(parentMessageId);
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
          <DmMessageContent isOwnMessage={isOwnMessage} message={message} />

          <div
            className={cn(
              "pointer-events-none absolute top-1 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100",
              isOwnMessage
                ? "-left-2 -translate-x-full"
                : "-right-2 translate-x-full"
            )}
          >
            <DmMessageActions
              canEdit={user.id === message.senderId && message.type === "text"}
              canPin={!isThreadMessage}
              canReply={!isThreadMessage}
              isOwnMessage={isOwnMessage}
              isPinned={message.isPinned}
              onDelete={handleDelete}
              onEdit={handleEditDialog}
              onPin={handlePin}
              onReact={handleReact}
              onReply={toggleMessageThread}
            />
          </div>
        </div>

        <DmMessageReactions
          messageId={message.id}
          onAddReaction={handleReact}
          onRemoveReaction={handleReactionClick}
        />

        {!isThreadMessage && message.parentMessageId && (
          <Button
            className="rounded-full"
            onClick={() => handleReplyInThread(message.parentMessageId)}
            size="sm"
            variant="secondary"
          >
            <IconCornerDownRight />
            <span>Reply</span>
          </Button>
        )}
      </div>
    </div>
  );
}
