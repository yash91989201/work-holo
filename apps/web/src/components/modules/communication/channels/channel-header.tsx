import {
  IconAt,
  IconInfoCircleFilled,
  IconPinFilled,
  IconX,
} from "@tabler/icons-react";
import { Link, useParams } from "@tanstack/react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChannelMentions } from "@/hooks/communications/use-channel-mentions";
import {
  useChannelInfoSidebar,
  useMentionsSidebar,
  usePinnedMessagesSidebar,
} from "@/stores/channel-store";

export function ChannelHeader() {
  const { slug } = useParams({
    from: "/(authenticated)/org/$slug",
  });

  const channelParams = useParams({
    from: "/(authenticated)/org/$slug/workspace/teams/$teamId/(modules)/communication/channels/$channelId",
  });

  const { toggleInfoSidebar } = useChannelInfoSidebar();
  const { isOpen, togglePinnedMessages } = usePinnedMessagesSidebar();
  const { isOpen: mentionsOpen, toggleMentionsSidebar } = useMentionsSidebar();
  const { unreadMentionCount } = useChannelMentions();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) supports-backdrop-filter:bg-background/60">
      <div className="flex w-full items-center gap-1 px-3 lg:gap-2">
        <div className="ml-auto flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="relative"
                onClick={toggleMentionsSidebar}
                size="icon-sm"
                variant={mentionsOpen ? "secondary" : "ghost"}
              >
                <IconAt />
                {unreadMentionCount > 0 && (
                  <span className="pointer-events-none absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 font-semibold text-[10px] text-destructive-foreground leading-none">
                    {unreadMentionCount > 99 ? "99+" : unreadMentionCount}
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mentions</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={togglePinnedMessages}
                size="icon-sm"
                variant={isOpen ? "secondary" : "ghost"}
              >
                <IconPinFilled />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isOpen ? "Close pinned messages" : "View pinned messages"}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={toggleInfoSidebar}
                size="icon-sm"
                variant="ghost"
              >
                <IconInfoCircleFilled />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Channel Info</TooltipContent>
          </Tooltip>

          <Link
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            params={{ slug, teamId: channelParams.teamId }}
            to="/org/$slug/workspace/teams/$teamId/communication/channels"
          >
            <IconX />
          </Link>
        </div>
      </div>
    </header>
  );
}
