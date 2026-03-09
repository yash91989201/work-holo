import {
  IconInfoCircleFilled,
  IconPinFilled,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDmConversations } from "@/hooks/communications/dm/use-dm-conversations";
import { useDmPresence } from "@/hooks/communications/dm/use-dm-presence";
import { cn } from "@/lib/utils";
import {
  useDmInfoSidebar,
  useDmPinnedMessagesSidebar,
  useDmSearchSidebar,
} from "@/stores/dm-store";

export function DmConversationHeader() {
  const { conversationId } = useParams({
    from: "/(authenticated)/org/$slug/workspace/communication/dm/$conversationId",
  });
  const { slug } = useParams({ from: "/(authenticated)/org/$slug" });
  const navigate = useNavigate();

  const { conversations } = useDmConversations();
  const { isUserOnline } = useDmPresence(conversationId);
  const { isOpen: isPinsOpen, togglePinnedMessages } =
    useDmPinnedMessagesSidebar();
  const { isOpen: isInfoOpen, toggleInfoSidebar } = useDmInfoSidebar();
  const { isOpen: isSearchOpen, toggleSearchSidebar } = useDmSearchSidebar();

  const conversation = conversations.find((c) => c.id === conversationId);
  const otherParticipant = conversation?.otherParticipant;
  const isOnline = otherParticipant ? isUserOnline(otherParticipant.id) : false;

  const handleClose = () => {
    navigate({
      to: "/org/$slug/workspace/communication/dm",
      params: { slug },
    });
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="flex w-full items-center gap-3 px-3">
        {/* User info */}
        {otherParticipant && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  alt={otherParticipant.name}
                  src={otherParticipant.image || undefined}
                />
                <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 font-medium text-primary text-xs">
                  {otherParticipant.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  "absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-background",
                  isOnline ? "bg-emerald-500" : "bg-muted-foreground/40"
                )}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm leading-tight">
                {otherParticipant.name}
              </span>
              <span className="text-muted-foreground text-xs">
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="ml-auto flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={toggleSearchSidebar}
                size="icon-sm"
                variant={isSearchOpen ? "secondary" : "ghost"}
              >
                <IconSearch />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isSearchOpen ? "Close search" : "Search messages"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={togglePinnedMessages}
                size="icon-sm"
                variant={isPinsOpen ? "secondary" : "ghost"}
              >
                <IconPinFilled />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isPinsOpen ? "Close pinned messages" : "View pinned messages"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={toggleInfoSidebar}
                size="icon-sm"
                variant={isInfoOpen ? "secondary" : "ghost"}
              >
                <IconInfoCircleFilled />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Conversation Info</TooltipContent>
          </Tooltip>

          <Button onClick={handleClose} size="icon-sm" variant="ghost">
            <IconX />
          </Button>
        </div>
      </div>
    </header>
  );
}
