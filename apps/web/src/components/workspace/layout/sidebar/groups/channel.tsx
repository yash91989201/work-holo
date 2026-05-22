import {
  IconAlertCircleFilled,
  IconBroadcast,
  IconHash,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { Link, useParams } from "@tanstack/react-router";
import { Badge } from "@work-holo/ui/components/badge";
import { Button } from "@work-holo/ui/components/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@work-holo/ui/components/hover-card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@work-holo/ui/components/input-group";
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
} from "@work-holo/ui/components/sidebar";
import { Spinner } from "@work-holo/ui/components/spinner";
import { useState } from "react";
import { CreateChannelForm } from "@/components/modules/communication/channels/create-channel-form";
import { useChannelUnreadCounts } from "@/hooks/communications/use-channel-unread-counts";
import { useUserChannels } from "@/hooks/communications/use-user-channels";
import { Can } from "@/lib/permission";
import { cn } from "@/lib/utils";

const ChannelSearchInput = ({
  query,
  onQueryChange,
  isPending,
  autoFocus,
}: {
  query: string;
  onQueryChange: (val: string) => void;
  isPending: boolean;
  autoFocus?: boolean;
}) => (
  <InputGroup>
    <InputGroupAddon align="inline-start">
      {isPending ? <Spinner /> : <IconSearch className="size-3.5" />}
    </InputGroupAddon>
    <InputGroupInput
      autoFocus={autoFocus}
      className="h-7 text-xs"
      onChange={(e) => onQueryChange(e.target.value)}
      placeholder="Search channels…"
      value={query}
    />
    {query && (
      <InputGroupAddon align="inline-end" className="py-0">
        <InputGroupButton
          aria-label="Clear search"
          onClick={() => onQueryChange("")}
          size="icon-xs"
        >
          <IconX className="size-3" />
        </InputGroupButton>
      </InputGroupAddon>
    )}
  </InputGroup>
);

const ChannelGroup = () => {
  const { state, isMobile } = useSidebar();
  const { channels } = useUserChannels();
  const { getUnreadCount } = useChannelUnreadCounts();

  const [query, setQuery] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const [debouncedQuery] = useDebouncedValue(query, { wait: 300 });
  const normalizedQuery = debouncedQuery.trim().toLowerCase();

  const isPending = query !== debouncedQuery;

  const { slug } = useParams({
    from: "/(authenticated)/org/$slug",
  });

  const params = useParams({
    from: "/(authenticated)/org/$slug/workspace/communication/channels/$channelId",
    shouldThrow: false,
  });

  const isPopover = state === "collapsed" && !isMobile;

  const filteredChannels = normalizedQuery
    ? channels.filter((c) => c.name.toLowerCase().includes(normalizedQuery))
    : channels;

  const showSearch = channels.length > 2;

  if (isPopover) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Channels</SidebarGroupLabel>
        <SidebarGroupContent>
          <HoverCard>
            <HoverCardTrigger
              render={
                <SidebarMenuButton aria-label="Channels">
                  <IconBroadcast />
                  <span className="sr-only">Channels</span>
                </SidebarMenuButton>
              }
            />
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
                    <CreateChannelForm />
                  </Can>
                </div>
                {showSearch && (
                  <div className="p-3">
                    <ChannelSearchInput
                      isPending={isPending}
                      onQueryChange={setQuery}
                      query={query}
                    />
                  </div>
                )}
                <SidebarMenuSub
                  className={cn("mx-0 gap-1.5 border-none p-1.5")}
                >
                  {filteredChannels.length === 0 ? (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton className="cursor-default text-muted-foreground [&>svg]:size-3">
                        <IconAlertCircleFilled />
                        <span>
                          {normalizedQuery
                            ? "No channels found"
                            : "No channels yet"}
                        </span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ) : (
                    filteredChannels.map((channel) => {
                      const unreadCount = getUnreadCount(channel.id);
                      return (
                        <SidebarMenuSubItem key={channel.id}>
                          <SidebarMenuSubButton
                            className="[&>svg]:size-3"
                            isActive={channel.id === params?.channelId}
                            render={
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
                            }
                          />
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
      <div className="flex items-center">
        <SidebarGroupLabel className="flex-1">Channels</SidebarGroupLabel>
        <div className="flex items-center gap-0.75">
          {showSearch && (
            <Button
              aria-label={searchVisible ? "Close search" : "Search channels"}
              className="size-5 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setSearchVisible((v) => {
                  if (v) setQuery("");
                  return !v;
                });
              }}
              size="icon-sm"
              variant="ghost"
            >
              {searchVisible ? (
                <IconX className="size-3.5" />
              ) : (
                <IconSearch className="size-3.5" />
              )}
            </Button>
          )}
          <Can permission={(p) => p.channel.create}>
            <SidebarGroupAction
              className="static translate-y-0"
              render={<CreateChannelForm />}
            />
          </Can>
        </div>
      </div>
      {searchVisible && (
        <div className="px-2 pb-1.5">
          <ChannelSearchInput
            autoFocus
            isPending={isPending}
            onQueryChange={setQuery}
            query={query}
          />
        </div>
      )}
      <SidebarGroupContent className="space-y-1.5">
        {filteredChannels.length === 0 ? (
          <SidebarMenuItem>
            <SidebarMenuButton
              className="cursor-default text-muted-foreground"
              disabled
            >
              <IconAlertCircleFilled />
              <span>
                {normalizedQuery ? "No channels found" : "No channels yet"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : (
          filteredChannels.map((channel) => {
            const unreadCount = getUnreadCount(channel.id);
            return (
              <SidebarMenuItem key={channel.id}>
                <SidebarMenuButton
                  isActive={channel.id === params?.channelId}
                  render={
                    <Link
                      params={{ slug, channelId: channel.id }}
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
                  }
                />
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
