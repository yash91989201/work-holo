import {
  IconArrowBackUp,
  IconEdit,
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";
import { ReactionPicker } from "./reaction-picker";

const QUICK_REACTIONS = ["👍", "😂", "🎉", "👀"] as const;

interface MessageActionsProps {
  canEdit: boolean;
  canPin: boolean;
  isPinned: boolean;
  isOwnMessage: boolean;
  canReply: boolean;
  onEdit: () => void;
  onReply: () => void;
  onDelete: () => void;
  onPin: () => void;
  onReact: (emoji: string) => void;
  className?: string;
}

export function MessageActions({
  isOwnMessage,
  canEdit,
  canPin,
  isPinned,
  canReply,
  onEdit,
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
        <ReactionPicker onSelectEmoji={onReact} />

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
      <AlertDialogTrigger asChild>
        <Button
          aria-label="Delete message"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          size="icon-sm"
          title="Delete message"
          variant="ghost"
        >
          <IconTrashFilled className="h-3.5 w-3.5" />
        </Button>
      </AlertDialogTrigger>
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
