import {
  IconArrowForwardUp,
  IconDots,
  IconEdit,
  IconMessageReply,
  IconPin,
  IconPinnedOff,
  IconTrash,
} from "@tabler/icons-react";
import { Button } from "@work-holo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@work-holo/ui/components/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@work-holo/ui/components/tooltip";
import { useState } from "react";

interface DmMessageActionsProps {
  canEdit: boolean;
  canInlineReply?: boolean;
  canPin: boolean;
  canReply: boolean;
  isOwnMessage: boolean;
  isPinned: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onInlineReply?: () => void;
  onPin: () => void;
  onReact: (emoji: string) => void;
  onReply: () => void;
}

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🎉"];

export function DmMessageActions({
  canEdit,
  canInlineReply,
  canPin,
  canReply,
  isOwnMessage,
  isPinned,
  onDelete,
  onEdit,
  onPin,
  onReact,
  onReply,
  onInlineReply,
}: DmMessageActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TooltipProvider delay={300}>
      <div className="flex items-center gap-0.5 rounded-lg border bg-background p-1 shadow-sm">
        {/* Quick reactions */}
        {REACTIONS.slice(0, 3).map((emoji) => (
          <Tooltip key={emoji}>
            <TooltipTrigger
              render={
                <Button
                  className="h-7 w-7 text-base"
                  onClick={() => onReact(emoji)}
                  size="icon"
                  variant="ghost"
                >
                  {emoji}
                </Button>
              }
            />
            <TooltipContent>React with {emoji}</TooltipContent>
          </Tooltip>
        ))}

        {/* More actions dropdown */}
        <DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
          <Tooltip>
            <TooltipTrigger
              render={
                <DropdownMenuTrigger
                  render={
                    <Button className="h-7 w-7" size="icon" variant="ghost">
                      <IconDots className="h-4 w-4" />
                    </Button>
                  }
                />
              }
            />
            <TooltipContent>More actions</TooltipContent>
          </Tooltip>

          <DropdownMenuContent align="end" className="w-48">
            {canInlineReply && onInlineReply && (
              <DropdownMenuItem onClick={onInlineReply}>
                <IconArrowForwardUp className="mr-2 h-4 w-4" />
                Reply
              </DropdownMenuItem>
            )}

            {canReply && (
              <DropdownMenuItem onClick={onReply}>
                <IconMessageReply className="mr-2 h-4 w-4" />
                Reply in thread
              </DropdownMenuItem>
            )}

            {canEdit && (
              <DropdownMenuItem onClick={onEdit}>
                <IconEdit className="mr-2 h-4 w-4" />
                Edit message
              </DropdownMenuItem>
            )}

            {canPin && (
              <DropdownMenuItem onClick={onPin}>
                {isPinned ? (
                  <>
                    <IconPinnedOff className="mr-2 h-4 w-4" />
                    Unpin message
                  </>
                ) : (
                  <>
                    <IconPin className="mr-2 h-4 w-4" />
                    Pin message
                  </>
                )}
              </DropdownMenuItem>
            )}

            {(canReply || canEdit || canPin) && isOwnMessage && (
              <DropdownMenuSeparator />
            )}

            {isOwnMessage && (
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={onDelete}
              >
                <IconTrash className="mr-2 h-4 w-4" />
                Delete message
              </DropdownMenuItem>
            )}

            {/* More reactions */}
            <DropdownMenuSeparator />
            <div className="grid grid-cols-6 gap-1 p-2">
              {REACTIONS.map((emoji) => (
                <button
                  className="flex h-8 items-center justify-center rounded hover:bg-accent"
                  key={emoji}
                  onClick={() => {
                    onReact(emoji);
                    setIsOpen(false);
                  }}
                  type="button"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  );
}
