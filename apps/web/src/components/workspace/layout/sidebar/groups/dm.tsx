import { IconMessageCircle, IconPlus, IconVolume3 } from "@tabler/icons-react";
import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { DmUserPicker } from "@/components/modules/communication/dm/user-picker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useDmConversations } from "@/hooks/communications/dm/use-dm-conversations";
import { useDmUnreadCount } from "@/hooks/communications/dm/use-dm-unread-count";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils";

const DmGroup = () => {
  const { state, isMobile } = useSidebar();
  const { user } = useAuthedSession();
  const { conversations } = useDmConversations();
  const { getUnreadCount } = useDmUnreadCount(conversations, user.id);

  const { slug } = useParams({
    from: "/(authenticated)/org/$slug",
  });

  const dmParams = useParams({
    from: "/(authenticated)/org/$slug/workspace/communication/dm/$conversationId",
    shouldThrow: false,
  });
  const activeConversationId = dmParams?.conversationId;

  const [hoverOpen, setHoverOpen] = useState(false);

  const isPopover = state === "collapsed" && !isMobile;

  if (isPopover) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Direct Messages</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenuItem>
            <Collapsible>
              <HoverCard
                closeDelay={100}
                onOpenChange={setHoverOpen}
                open={hoverOpen}
                openDelay={50}
              >
                <HoverCardTrigger asChild>
                  <CollapsibleTrigger asChild>
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
                  </CollapsibleTrigger>
                </HoverCardTrigger>
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
                    <SidebarMenuSub
                      className={cn(
                        isPopover && "mx-0 border-none p-1.5",
                        !isPopover && "border-gray-700",
                        "gap-1.5"
                      )}
                      role="menu"
                    >
                      {conversations.length === 0 ? (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton className="cursor-default text-muted-foreground [&>svg]:size-3">
                            <IconMessageCircle />
                            <span>No conversations yet</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ) : (
                        conversations.map((conversation) => {
                          const unreadCount = getUnreadCount(conversation.id);
                          return (
                            <SidebarMenuSubItem key={conversation.id}>
                              <SidebarMenuSubButton
                                asChild
                                className="[&>svg]:size-3"
                                isActive={
                                  conversation.id === activeConversationId
                                }
                              >
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
                                        conversation.otherParticipant?.image ??
                                        undefined
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
                                  {!conversation.isMuted && unreadCount > 0 && (
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
            </Collapsible>
          </SidebarMenuItem>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Direct Messages</SidebarGroupLabel>
      <SidebarGroupAction asChild>
        <DmUserPicker />
      </SidebarGroupAction>
      <SidebarGroupContent className="space-y-1.5">
        {conversations.length === 0 ? (
          <SidebarMenuItem>
            <SidebarMenuButton
              className="cursor-default text-muted-foreground"
              disabled
            >
              <IconMessageCircle />
              <span>No conversations yet</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : (
          conversations.map((conversation) => {
            const unreadCount = getUnreadCount(conversation.id);
            return (
              <SidebarMenuItem key={conversation.id}>
                <SidebarMenuButton
                  asChild
                  isActive={conversation.id === activeConversationId}
                >
                  <Link
                    params={{
                      slug,
                      conversationId: conversation.id,
                    }}
                    to="/org/$slug/workspace/communication/dm/$conversationId"
                  >
                    <Avatar className="size-4">
                      <AvatarImage
                        src={conversation.otherParticipant?.image ?? undefined}
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
                </SidebarMenuButton>
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
                <HoverCardTrigger asChild>
                  <CollapsibleTrigger asChild>
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
                  </CollapsibleTrigger>
                </HoverCardTrigger>
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
