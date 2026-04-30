import {
  IconMessageCircle,
  IconPlus,
  IconSearch,
  IconVolume3,
  IconX,
} from "@tabler/icons-react";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { Link, useParams } from "@tanstack/react-router";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@work-holo/ui/components/avatar";
import { Badge } from "@work-holo/ui/components/badge";
import { Button } from "@work-holo/ui/components/button";
import {
  Collapsible,
  CollapsibleTrigger,
} from "@work-holo/ui/components/collapsible";
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
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { Spinner } from "@work-holo/ui/components/spinner";
import { useState } from "react";
import { DmUserPicker } from "@/components/modules/communication/dm/user-picker";
import { useDmConversations } from "@/hooks/communications/dm/use-dm-conversations";
import { useDmUnreadCount } from "@/hooks/communications/dm/use-dm-unread-count";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils";

const DmSearchInput = ({
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
    <InputGroupAddon align="inline-start" className="py-0">
      {isPending ? <Spinner /> : <IconSearch className="size-3.5" />}
    </InputGroupAddon>
    <InputGroupInput
      autoFocus={autoFocus}
      className="h-7 text-xs"
      onChange={(e) => onQueryChange(e.target.value)}
      placeholder="Search messages…"
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

const DmGroup = () => {
  const { state, isMobile } = useSidebar();
  const { user } = useAuthedSession();
  const { conversations } = useDmConversations();
  const { getUnreadCount } = useDmUnreadCount(conversations, user.id);

  const [query, setQuery] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const [hoverOpen, setHoverOpen] = useState(false);
  const [debouncedQuery] = useDebouncedValue(query, { wait: 300 });

  const isPending = query !== debouncedQuery;

  const { slug } = useParams({
    from: "/(authenticated)/org/$slug",
  });

  const dmParams = useParams({
    from: "/(authenticated)/org/$slug/workspace/communication/dm/$conversationId",
    shouldThrow: false,
  });
  const activeConversationId = dmParams?.conversationId;

  const isPopover = state === "collapsed" && !isMobile;

  const filteredConversations = debouncedQuery.trim()
    ? conversations.filter((c) =>
        (c.otherParticipant?.name ?? "")
          .toLowerCase()
          .includes(debouncedQuery.toLowerCase())
      )
    : conversations;

  const showSearch = conversations.length > 2;

  if (isPopover) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Direct Messages</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenuItem>
            <Collapsible>
              <HoverCard onOpenChange={setHoverOpen} open={hoverOpen}>
                <HoverCardTrigger
                  render={
                    <CollapsibleTrigger
                      render={
                        <SidebarMenuButton
                          aria-expanded="false"
                          aria-haspopup="true"
                          aria-label="Direct Messages"
                        >
                          <IconMessageCircle aria-hidden="true" />
                          <span className="sr-only text-balance text-sm">
                            Direct Messages
                          </span>
                        </SidebarMenuButton>
                      }
                    />
                  }
                />
                <HoverCardContent
                  align="start"
                  aria-label="Direct messages list"
                  className="w-fit min-w-56 p-0"
                  role="menu"
                  side="right"
                  sideOffset={8}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between gap-3 border-b p-3">
                      <span className="text-balance text-sm">
                        Direct Messages
                      </span>
                      <DmUserPicker />
                    </div>
                    {showSearch && (
                      <div className="p-3">
                        <DmSearchInput
                          isPending={isPending}
                          onQueryChange={setQuery}
                          query={query}
                        />
                      </div>
                    )}
                    <SidebarMenuSub
                      className={cn("mx-0 gap-1.5 border-none p-1.5")}
                      role="menu"
                    >
                      {filteredConversations.length === 0 ? (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton className="cursor-default text-muted-foreground [&>svg]:size-3">
                            <IconMessageCircle />
                            <span>
                              {debouncedQuery
                                ? "No conversations found"
                                : "No conversations yet"}
                            </span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ) : (
                        filteredConversations.map((conversation) => {
                          const unreadCount = getUnreadCount(conversation.id);
                          return (
                            <SidebarMenuSubItem key={conversation.id}>
                              <SidebarMenuSubButton
                                className="[&>svg]:size-3"
                                isActive={
                                  conversation.id === activeConversationId
                                }
                                render={
                                  <Link
                                    onClick={() => setHoverOpen(false)}
                                    params={{
                                      slug,
                                      conversationId: conversation.id,
                                    }}
                                    to="/org/$slug/workspace/communication/dm/$conversationId"
                                  >
                                    <Avatar className="size-4">
                                      <AvatarImage
                                        src={
                                          conversation.otherParticipant
                                            ?.image ?? undefined
                                        }
                                      />
                                      <AvatarFallback className="text-[8px]">
                                        {getInitials(
                                          conversation.otherParticipant?.name
                                        )}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="flex-1 truncate">
                                      {conversation.otherParticipant?.name ??
                                        "Unknown"}
                                    </span>
                                    {conversation.isMuted && (
                                      <IconVolume3
                                        aria-label="Muted"
                                        className="size-3 text-muted-foreground"
                                      />
                                    )}
                                    {!conversation.isMuted &&
                                      unreadCount > 0 && (
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
            </Collapsible>
          </SidebarMenuItem>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <div className="flex items-center">
        <SidebarGroupLabel className="flex-1">
          Direct Messages
        </SidebarGroupLabel>
        <div className="flex items-center gap-0.75">
          {showSearch && (
            <Button
              aria-label={searchVisible ? "Close search" : "Search messages"}
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
          <SidebarGroupAction
            className="translate-y-0"
            render={<DmUserPicker />}
          />
        </div>
      </div>
      {searchVisible && (
        <div className="px-2 pb-1.5">
          <DmSearchInput
            autoFocus
            isPending={isPending}
            onQueryChange={setQuery}
            query={query}
          />
        </div>
      )}
      <SidebarGroupContent className="space-y-1.5">
        {filteredConversations.length === 0 ? (
          <SidebarMenuItem>
            <SidebarMenuButton
              className="cursor-default text-muted-foreground"
              disabled
            >
              <IconMessageCircle />
              <span>
                {debouncedQuery
                  ? "No conversations found"
                  : "No conversations yet"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : (
          filteredConversations.map((conversation) => {
            const unreadCount = getUnreadCount(conversation.id);
            return (
              <SidebarMenuItem key={conversation.id}>
                <SidebarMenuButton
                  isActive={conversation.id === activeConversationId}
                  render={
                    <Link
                      params={{
                        slug,
                        conversationId: conversation.id,
                      }}
                      to="/org/$slug/workspace/communication/dm/$conversationId"
                    >
                      <Avatar className="size-4">
                        <AvatarImage
                          src={
                            conversation.otherParticipant?.image ?? undefined
                          }
                        />
                        <AvatarFallback className="text-[8px]">
                          {getInitials(conversation.otherParticipant?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="flex-1 truncate">
                        {conversation.otherParticipant?.name ?? "Unknown"}
                      </span>
                      {conversation.isMuted && (
                        <IconVolume3
                          aria-label="Muted"
                          className="size-3 text-muted-foreground"
                        />
                      )}
                      {!conversation.isMuted && unreadCount > 0 && (
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

const DmGroupSkeleton = () => {
  const { state, isMobile } = useSidebar();
  const isPopover = state === "collapsed" && !isMobile;

  // Number of skeleton items to show
  const skeletonCount = 3;

  if (isPopover) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Direct Messages</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenuItem>
            <Collapsible>
              <HoverCard>
                <HoverCardTrigger
                  render={
                    <CollapsibleTrigger
                      render={
                        <SidebarMenuButton
                          aria-expanded="false"
                          aria-haspopup="true"
                          aria-label="Direct Messages"
                          disabled
                        >
                          <IconMessageCircle aria-hidden="true" />
                          <span className="sr-only text-balance text-sm">
                            Direct Messages
                          </span>
                        </SidebarMenuButton>
                      }
                    />
                  }
                />
                <HoverCardContent
                  align="start"
                  aria-label="Direct messages list"
                  className="w-fit min-w-56 p-0"
                  role="menu"
                  side="right"
                  sideOffset={8}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between gap-3 border-b p-3">
                      <span className="text-balance text-sm">
                        Direct Messages
                      </span>
                      <Button disabled size="icon-sm" variant="ghost">
                        <IconPlus />
                      </Button>
                    </div>
                    <SidebarMenuSub
                      className={cn("mx-0 border-none p-1.5")}
                      role="menu"
                    >
                      {Array.from({ length: skeletonCount }).map((_, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                        <SidebarMenuSubItem key={i}>
                          <SidebarMenuSubButton className="cursor-default [&>svg]:size-3">
                            <Skeleton className="size-4 rounded-full" />
                            <Skeleton className="h-4 w-24 flex-1" />
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
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

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Direct Messages</SidebarGroupLabel>
      <SidebarGroupAction>
        <Button disabled size="icon-sm" variant="ghost">
          <IconPlus />
        </Button>
      </SidebarGroupAction>
      <SidebarGroupContent>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
          <SidebarMenuItem key={i}>
            <SidebarMenuButton disabled>
              <Skeleton className="size-4 rounded-full" />
              <Skeleton className="h-4 w-24 flex-1" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

DmGroup.Fallback = DmGroupSkeleton;

export { DmGroup };
