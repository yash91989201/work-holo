import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconEdit,
  IconMoodPlus,
  IconPinFilled,
  IconTrashFilled,
} from "@tabler/icons-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@work-holo/ui/components/alert-dialog";
import { Button } from "@work-holo/ui/components/button";
import { ButtonGroup } from "@work-holo/ui/components/button-group";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@work-holo/ui/components/emoji-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@work-holo/ui/components/popover";
import { cn } from "@/lib/utils";

const QUICK_REACTIONS = ["👍", "😂", "🎉", "👀"] as const;

interface MessageActionsProps {
  canEdit: boolean;
  canInlineReply?: boolean;
  canPin: boolean;
  canReply: boolean;
  className?: string;
  isOwnMessage: boolean;
  isPinned: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onInlineReply?: () => void;
  onPin: () => void;
  onReact: (emoji: string) => void;
  onReply: () => void;
}

export function MessageActions({
  isOwnMessage,
  canEdit,
  canInlineReply,
  canPin,
  isPinned,
  canReply,
  onEdit,
  onInlineReply,
  onReply,
  onDelete,
  onPin,
  onReact,
  className,
}: MessageActionsProps) {
  return (
    <div className="flex flex-col gap-1">
      <ButtonGroup
        className={cn(
          "z-10 rounded-md border bg-background shadow-sm",
          className
        )}
      >
        <Popover>
          <PopoverTrigger
            render={
              <Button
                size="icon-sm"
                title="Add reaction"
                type="button"
                variant="ghost"
              >
                <IconMoodPlus className="h-3.5 w-3.5" />
                <span className="sr-only">Add reaction</span>
              </Button>
            }
          />
          <PopoverContent align="center" side="left" sideOffset={8}>
            <EmojiPicker
              onEmojiSelect={(emoji) => {
                onReact(emoji.emoji);
              }}
            >
              <EmojiPickerSearch placeholder="Search emoji..." />
              <EmojiPickerContent className="max-h-70 overflow-y-auto" />
              <EmojiPickerFooter />
            </EmojiPicker>
          </PopoverContent>
        </Popover>

        {QUICK_REACTIONS.map((emoji) => (
          <Button
            aria-label={`React with ${emoji}`}
            key={emoji}
            onClick={() => onReact(emoji)}
            size="icon-sm"
            title={`React with ${emoji}`}
            variant="ghost"
          >
            {emoji}
          </Button>
        ))}

        {canInlineReply && onInlineReply && (
          <Button
            aria-label="Reply inline"
            onClick={onInlineReply}
            size="icon-sm"
            title="Reply inline"
            variant="ghost"
          >
            <IconArrowForwardUp className="h-3.5 w-3.5" />
          </Button>
        )}

        {canReply && (
          <Button
            aria-label="Reply"
            onClick={onReply}
            size="icon-sm"
            title="Reply in thread"
            variant="ghost"
          >
            <IconArrowBackUp className="h-3.5 w-3.5" />
          </Button>
        )}

        {canEdit && (
          <Button
            aria-label="Edit"
            onClick={onEdit}
            size="icon-sm"
            title="Edit message"
            variant="ghost"
          >
            <IconEdit className="h-3.5 w-3.5" />
          </Button>
        )}

        {canPin && (
          <Button
            aria-label={isPinned ? "Unpin message" : "Pin message"}
            className={cn({ "text-primary": isPinned })}
            onClick={onPin}
            size="icon-sm"
            title={isPinned ? "Unpin message" : "Pin message"}
            variant="ghost"
          >
            <IconPinFilled
              className={cn("h-3.5 w-3.5", { "fill-current": isPinned })}
            />
          </Button>
        )}

        {isOwnMessage && <DeleteMessage onDelete={onDelete} />}
      </ButtonGroup>
    </div>
  );
}

function DeleteMessage({ onDelete }: { onDelete: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            aria-label="Delete message"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            size="icon-sm"
            title="Delete message"
            variant="ghost"
          >
            <IconTrashFilled className="h-3.5 w-3.5" />
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Message</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this message? Deleting this message
            will also delete any related mentions, reactions, images or
            attachments
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
