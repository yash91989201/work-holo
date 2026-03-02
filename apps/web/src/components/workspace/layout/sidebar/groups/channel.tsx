import {
  IconAlertCircleFilled,
  IconBroadcast,
  IconHash,
  IconPlus,
} from "@tabler/icons-react";
import { Link, useParams } from "@tanstack/react-router";
import { CreateChannelForm } from "@/components/modules/communication/channels/create-channel-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useChannelUnreadCounts } from "@/hooks/communications/use-channel-unread-counts";
import { useUserChannels } from "@/hooks/communications/use-user-channels";
import { Can } from "@/lib/permission";
import { cn } from "@/lib/utils";

const ChannelGroup = () => {
  const { state, isMobile } = useSidebar();
  const { channels } = useUserChannels();
  const { getUnreadCount } = useChannelUnreadCounts();

  const { slug } = useParams({
    from: "/(authenticated)/org/$slug",
  });

  const params = useParams({
    from: "/(authenticated)/org/$slug/workspace/communication/channels/$channelId",
    shouldThrow: false,
  });

  const isPopover = state === "collapsed" && !isMobile;

  if (isPopover) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Channels</SidebarGroupLabel>
        <SidebarGroupContent>
          <HoverCard>
            <HoverCardTrigger asChild>
              <SidebarMenuButton aria-label="Channels">
                <IconBroadcast />
                <span className="sr-only">Channels</span>
              </SidebarMenuButton>
            </HoverCardTrigger>
            <HoverCardContent
              align="start"
              className="w-fit min-w-56 p-0"
              side="right"
              sideOffset={8}
            >
              <div className="flex flex-col">
                <div className="flex items-center justify-between gap-3 border-b p-3">
                  <span className="text-balance text-sm">Channels</span>
                  <Can permission={(p) => p.channel.create}>
                    <CreateChannelForm
                      trigger={
                        <Button size="icon-sm" variant="ghost">
                          <IconPlus />
                        </Button>
                      }
                    />
                  </Can>
                </div>
                <SidebarMenuSub
                  className={cn("mx-0 gap-1.5 border-none p-1.5")}
                >
                  {channels.length === 0 ? (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton className="cursor-default text-muted-foreground [&>svg]:size-3">
                        <IconAlertCircleFilled />
                        <span>No channels yet</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ) : (
                    channels.map((channel) => {
                      const unreadCount = getUnreadCount(channel.id);
                      return (
                        <SidebarMenuSubItem key={channel.id}>
                          <SidebarMenuSubButton
                            asChild
                            className="[&>svg]:size-3"
                            isActive={channel.id === params?.channelId}
                          >
                            <Link
                              params={{
                                slug,
                                channelId: channel.id,
                              }}
                              to="/org/$slug/workspace/communication/channels/$channelId"
                            >
                              <IconHash className="shrink-0" />
                              <span className="flex-1 truncate">
                                {channel.name}
                              </span>
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
                    })
                  )}
                </SidebarMenuSub>
              </div>
            </HoverCardContent>
          </HoverCard>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Channels</SidebarGroupLabel>
      <Can permission={(p) => p.channel.create}>
        <SidebarGroupAction>
          <CreateChannelForm />
        </SidebarGroupAction>
      </Can>
      <SidebarGroupContent className="space-y-1.5">
        {channels.length === 0 ? (
          <SidebarMenuItem>
            <SidebarMenuButton
              className="cursor-default text-muted-foreground"
              disabled
            >
              <IconAlertCircleFilled />
              <span>No channels yet</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : (
          channels.map((channel) => {
            const unreadCount = getUnreadCount(channel.id);
            return (
              <SidebarMenuItem key={channel.id}>
                <SidebarMenuButton
                  asChild
                  isActive={channel.id === params?.channelId}
                >
                  <Link
                    params={{
                      slug,
                      channelId: channel.id,
                    }}
                    to="/org/$slug/workspace/communication/channels/$channelId"
                  >
                    <IconHash />
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
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

const ChannelGroupSkeleton = () => {
  const { state, isMobile } = useSidebar();
  const isPopover = state === "collapsed" && !isMobile;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton aria-label="Channels" disabled>
        {!isPopover && <span>Channels</span>}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

ChannelGroup.Fallback = ChannelGroupSkeleton;

export { ChannelGroup };
