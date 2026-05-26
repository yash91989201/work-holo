import { IconArrowBackUp, IconCheck } from "@tabler/icons-react";
import { eq, useLiveQuery } from "@tanstack/react-db";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@work-holo/ui/components/avatar";
import { Badge } from "@work-holo/ui/components/badge";
import { Button } from "@work-holo/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@work-holo/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@work-holo/ui/components/dropdown-menu";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@work-holo/ui/components/item";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { channelReadCollection } from "@/db/collections";
import { useMessageMutations } from "@/hooks/communications/use-message-mutations";
import { useRecentMessages } from "@/hooks/communications/use-recent-messages";
import { useAuthedSession } from "@/hooks/use-authed-session";
import {
  useChannelMessageHighlight,
  useMentionsSidebar,
  useMessageThreadSidebar,
} from "@/stores/channel-store";
import { formatTimeAgo, getAvatarColor, getInitials } from "@/utils";

export function RecentMessages() {
  const { messages, isLoading, totalUnreadCount } = useRecentMessages();
  const { user } = useAuthedSession();
  const navigate = useNavigate();
  const { slug } = useParams({ from: "/(authenticated)/org/$slug" });
  const { addReaction, markMessagesAsRead } = useMessageMutations();
  const { openMessageThread } = useMessageThreadSidebar();
  const { highlightMessage } = useChannelMessageHighlight();
  const { isOpen: isMentionSidebarOpen, closeMentionsSidebar } =
    useMentionsSidebar();

  const { data: channelReads = [] } = useLiveQuery(
    (q) =>
      q
        .from({ channelRead: channelReadCollection })
        .where(({ channelRead }) => eq(channelRead.userId, user.id))
        .select(({ channelRead }) => channelRead),
    [user.id]
  );

  const channelReadMap = new Map(
    channelReads.map((channelRead) => [channelRead.channelId, channelRead])
  );

  const isMessageRead = (message: (typeof messages)[number]) => {
    const channelRead = channelReadMap.get(message.channel.id);
    const lastReadAt = channelRead?.lastReadAt;

    if (!lastReadAt) {
      return false;
    }

    return new Date(message.createdAt) <= new Date(lastReadAt);
  };

  const handleMarkAsRead = (messageId: string, channelId: string) => {
    markMessagesAsRead({
      channelId,
      messageIds: [messageId],
      userId: user.id,
    });
  };

  const handleReply = (messageId: string, channelId: string) => {
    if (isMentionSidebarOpen) {
      closeMentionsSidebar();
    }

    handleMarkAsRead(messageId, channelId);
    highlightMessage(messageId);
    openMessageThread(messageId);

    navigate({
      to: "/org/$slug/workspace/communication/channels/$channelId",
      params: {
        slug,
        channelId,
      },
    });
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    addReaction({ messageId, emoji });
  };

  const quickReactions = ["👍", "❤", "😂", "🎉", "🚀", "👀"] as const;

  return (
    <Card
      className="min-w-0 gap-0 overflow-hidden rounded-2xl p-0"
      variant="neumorphic"
    >
      <CardHeader className="border-b px-6 pt-5 pb-4">
        <CardTitle className="font-semibold text-lg">Recent Messages</CardTitle>
        {totalUnreadCount > 0 && (
          <CardAction>
            <Badge className="border-0 bg-red-100 font-semibold text-red-600 hover:bg-red-100">
              {totalUnreadCount} New
            </Badge>
          </CardAction>
        )}
      </CardHeader>

      <CardContent className="px-2 py-1">
        <ItemGroup>
          {isLoading &&
            (["sk-msg-0", "sk-msg-1", "sk-msg-2"] as const).map((key) => (
              <Item key={key} size="sm" variant="default">
                <ItemMedia variant="default">
                  <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                </ItemMedia>
                <ItemContent>
                  <ItemHeader>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-8" />
                  </ItemHeader>
                  <Skeleton className="h-3 w-full" />
                </ItemContent>
              </Item>
            ))}

          {!isLoading && messages.length === 0 && (
            <div className="py-8 text-center text-muted-foreground text-sm">
              No recent messages
            </div>
          )}

          {!isLoading &&
            messages.length > 0 &&
            messages.map((msg) =>
              (() => {
                const messageIsRead = isMessageRead(msg);
                const hasThread = msg.threadCount > 0;

                return (
                  <Item
                    className="group/item hover:bg-muted/50"
                    key={msg.id}
                    size="sm"
                    variant="default"
                  >
                    <ItemMedia variant="default">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage
                          alt={msg.sender.name || "User"}
                          src={msg.sender.image ?? undefined}
                        />
                        <AvatarFallback
                          className={`text-white text-xs ${getAvatarColor(msg.sender.name || "?")}`}
                        >
                          {getInitials(msg.sender.name || "?")}
                        </AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemHeader>
                        <ItemTitle>{msg.sender.name}</ItemTitle>
                        <span className="shrink-0 text-muted-foreground text-xs">
                          {formatTimeAgo(new Date(msg.createdAt))}
                        </span>
                      </ItemHeader>
                      <ItemDescription>
                        {parse(
                          DOMPurify.sanitize(msg.content || "", {
                            ADD_ATTR: [
                              "target",
                              "rel",
                              "data-url",
                              "data-type",
                            ],
                          })
                        )}
                      </ItemDescription>
                      <ItemActions className="mt-2 gap-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                className="h-7 rounded-md px-2 text-[11px]"
                                size="sm"
                                type="button"
                                variant="ghost"
                              >
                                React
                              </Button>
                            }
                          />
                          <DropdownMenuContent
                            align="start"
                            className="w-auto p-1"
                          >
                            <div className="flex items-center gap-1">
                              {quickReactions.map((emoji) => (
                                <DropdownMenuItem
                                  className="h-8 w-8 cursor-pointer justify-center rounded-md p-0 text-base"
                                  key={emoji}
                                  onClick={() =>
                                    handleAddReaction(msg.id, emoji)
                                  }
                                >
                                  {emoji}
                                </DropdownMenuItem>
                              ))}
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                          className="h-7 gap-1 rounded-md px-2 text-[11px]"
                          onClick={() => handleReply(msg.id, msg.channel.id)}
                          size="sm"
                          type="button"
                          variant="ghost"
                        >
                          <IconArrowBackUp className="h-3.5 w-3.5" />
                          {hasThread ? "Open thread" : "Reply"}
                        </Button>
                        {!messageIsRead && (
                          <Button
                            className="h-7 gap-1 rounded-md px-2 text-[11px]"
                            onClick={() =>
                              handleMarkAsRead(msg.id, msg.channel.id)
                            }
                            size="sm"
                            type="button"
                            variant="ghost"
                          >
                            <IconCheck className="h-3.5 w-3.5" />
                            Mark read
                          </Button>
                        )}
                      </ItemActions>
                    </ItemContent>
                  </Item>
                );
              })()
            )}
        </ItemGroup>
      </CardContent>

      <CardFooter className="justify-center border-t py-2">
        <Button
          className="font-semibold text-sm text-violet-600 uppercase tracking-wider hover:bg-transparent hover:text-violet-700"
          type="button"
          variant="ghost"
        >
          View All Messages
        </Button>
      </CardFooter>
    </Card>
  );
}
