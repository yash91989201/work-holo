import { IconBroadcast } from "@tabler/icons-react";
import { Link, useParams } from "@tanstack/react-router";
import { ChevronRight, CircleAlert, Hash } from "lucide-react";
import { Suspense, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useChannelUnreadCounts } from "@/hooks/communications/use-channel-unread-counts";
import { useUserChannels } from "@/hooks/communications/use-user-channels";
import { cn } from "@/lib/utils";

function NavChannelsInner() {
  const { state, isMobile } = useSidebar();
  const { channels } = useUserChannels();
  const { getUnreadCount } = useChannelUnreadCounts();

  const { slug } = useParams({
    from: "/(authenticated)/org/$slug",
  });

  const params = useParams({
    from: "/(authenticated)/org/$slug/(modules)/communication/channels/$id",
    shouldThrow: false,
  });

  const [open, setOpen] = useState(false);

  const isPopover = state === "collapsed" && !isMobile;

  if (channels.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
          Channels
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="No Channels">
              {isPopover ? <CircleAlert /> : "No Channels"}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (isPopover) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
          Channels
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenuItem>
            <Collapsible>
              <HoverCard
                closeDelay={100}
                onOpenChange={setOpen}
                open={open}
                openDelay={50}
              >
                <HoverCardTrigger asChild>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      aria-expanded="false"
                      aria-haspopup="true"
                      aria-label="Channels"
                    >
                      <IconBroadcast aria-hidden="true" />
                      <span className="sr-only text-balance text-sm">
                        Channels
                      </span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </HoverCardTrigger>
                <HoverCardContent
                  align="start"
                  aria-label="Channels list"
                  className="w-fit min-w-56 p-0"
                  role="menu"
                  side="right"
                  sideOffset={8}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3 border-b p-3">
                      <span className="text-balance text-sm">Channels</span>
                    </div>
                    <SidebarMenuSub
                      className={cn(
                        isPopover && "mx-0 border-none p-1.5",
                        !isPopover && "border-gray-700"
                      )}
                      role="menu"
                    >
                      {channels.map((channel) => {
                        const unreadCount = getUnreadCount(channel.id);
                        return (
                          <SidebarMenuSubItem key={channel.id}>
                            <SidebarMenuSubButton
                              asChild
                              className="[&>svg]:size-3"
                              isActive={channel.id === params?.id}
                            >
                              <Link
                                onClick={() => setOpen(false)}
                                params={{ slug, id: channel.id }}
                                to="/org/$slug/communication/channels/$id"
                              >
                                <Hash />
                                <span className="flex-1">{channel.name}</span>
                                {unreadCount > 0 && (
                                  <Badge
                                    className="ml-auto h-5 w-5 shrink-0 items-center justify-center rounded-full p-0"
                                    variant="default"
                                  >
                                    {unreadCount}
                                  </Badge>
                                )}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </Collapsible>
          </SidebarMenuItem>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  // Expanded Sidebar
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
        Channels
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenuItem>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                aria-expanded="false"
                aria-haspopup={channels.length ? "true" : undefined}
                aria-label="Channels"
              >
                <IconBroadcast aria-hidden="true" />
                <span>Channels</span>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleTrigger asChild>
              <SidebarMenuAction
                aria-label="Toggle Channels submenu"
                className="cursor-pointer hover:bg-transparent data-[state=open]:rotate-90"
              >
                <ChevronRight aria-hidden="true" />
                <span className="sr-only">Toggle</span>
              </SidebarMenuAction>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {channels.map((channel) => {
                  const unreadCount = getUnreadCount(channel.id);
                  return (
                    <SidebarMenuSubItem key={channel.id}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={channel.id === params?.id}
                      >
                        <Link
                          params={{ slug, id: channel.id }}
                          to="/org/$slug/communication/channels/$id"
                        >
                          <Hash />
                          <span className="flex-1">{channel.name}</span>
                          {unreadCount > 0 && (
                            <Badge
                              className="ml-auto h-5 w-5 shrink-0 items-center justify-center rounded-full p-0"
                              variant="default"
                            >
                              {unreadCount}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuItem>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function NavChannels() {
  return (
    <Suspense fallback={<NavChannelsLoadingFallback />}>
      <NavChannelsInner />
    </Suspense>
  );
}

function NavChannelsLoadingFallback() {
  const { channels } = useUserChannels();
  const { state, isMobile } = useSidebar();
  const isPopover = state === "collapsed" && !isMobile;

  if (channels.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="No Channels">
          {isPopover ? <CircleAlert /> : "No Channels"}
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton aria-label="Channels" disabled>
        <IconBroadcast aria-hidden="true" />
        {!isPopover && <span>Channels</span>}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
