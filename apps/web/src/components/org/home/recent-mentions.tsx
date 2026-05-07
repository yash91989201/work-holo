import { IconArrowBackUp, IconCheck } from "@tabler/icons-react";
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
import { ScrollArea } from "@work-holo/ui/components/scroll-area";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { useMessageMutations } from "@/hooks/communications/use-message-mutations";
import { useRecentMentions } from "@/hooks/communications/use-recent-mentions";
import { useAuthedSession } from "@/hooks/use-authed-session";
import {
  useChannelMessageHighlight,
  useMentionsSidebar,
  useMessageThreadSidebar,
} from "@/stores/channel-store";
import { formatTimeAgo, getAvatarColor, getInitials } from "@/utils";

export function RecentMentions() {
  const { mentions, isLoading, unreadMentionCount } = useRecentMentions();
  const { user } = useAuthedSession();
  const navigate = useNavigate();
  const { slug } = useParams({ from: "/(authenticated)/org/$slug" });
  const { addReaction, markMentionSeen, markMessagesAsRead } =
    useMessageMutations();
  const { openMessageThread } = useMessageThreadSidebar();
  const { highlightMessage } = useChannelMessageHighlight();
  const { isOpen: isMentionSidebarOpen, closeMentionsSidebar } =
    useMentionsSidebar();

  const handleMarkAsRead = (
    mentionId: string,
    messageId: string,
    channelId: string,
    isSeen: boolean
  ) => {
    if (!isSeen) {
      markMentionSeen({ mentionId });
    }

    markMessagesAsRead({
      channelId,
      messageIds: [messageId],
      userId: user.id,
    });
  };

  const handleReply = (mention: (typeof mentions)[number]) => {
    if (isMentionSidebarOpen) {
      closeMentionsSidebar();
    }

    handleMarkAsRead(
      mention.id,
      mention.messageId,
      mention.channel.id,
      mention.isSeen
    );
    highlightMessage(mention.messageId);
    openMessageThread(mention.messageId);

    navigate({
      to: "/org/$slug/workspace/communication/channels/$channelId",
      params: {
        slug,
        channelId: mention.channel.id,
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
        <CardTitle className="font-semibold text-lg">Recent Mentions</CardTitle>
        {unreadMentionCount > 0 && (
          <CardAction>
            <Badge className="border-0 bg-red-100 font-semibold text-red-600 hover:bg-red-100">
              {unreadMentionCount} New
            </Badge>
          </CardAction>
        )}
      </CardHeader>

      <ScrollArea className="h-96">
        <CardContent className="px-2 py-1">
          <ItemGroup>
            {isLoading &&
              (["sk-mt-0", "sk-mt-1", "sk-mt-2"] as const).map((key) => (
                <Item key={key} size="sm" variant="default">
                  <ItemMedia variant="default">
                    <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemHeader>
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-8" />
                    </ItemHeader>
                    <Skeleton className="h-3 w-full" />
                  </ItemContent>
                </Item>
              ))}

            {!isLoading && mentions.length === 0 && (
              <div className="py-12 text-center text-muted-foreground text-sm">
                No recent mentions
              </div>
            )}

            {!isLoading &&
              mentions.length > 0 &&
              mentions.map((mention) => {
                const hasThread = mention.threadCount > 0;

                return (
                  <Item
                    className="group/item hover:bg-muted/50"
                    key={mention.id}
                    size="sm"
                    variant="default"
                  >
                    <ItemMedia variant="default">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage
                          alt={mention.sender.name}
                          src={mention.sender.image ?? undefined}
                        />
                        <AvatarFallback
                          className={`text-white text-xs ${getAvatarColor(mention.sender.name)}`}
                        >
                          {getInitials(mention.sender.name)}
                        </AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemHeader>
                        <div className="flex min-w-0 flex-wrap items-center gap-1.5 overflow-hidden">
                          <ItemTitle>{mention.sender.name}</ItemTitle>
                          <span className="text-muted-foreground text-xs">
                            in
                          </span>
                          <Badge
                            className="h-5 border-violet-200 bg-violet-50 px-1.5 font-medium text-violet-600 hover:bg-violet-50 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-400"
                            variant="outline"
                          >
                            #{mention.channel.name}
                          </Badge>
                        </div>
                        <span className="shrink-0 text-muted-foreground text-xs">
                          {formatTimeAgo(new Date(mention.createdAt))}
                        </span>
                      </ItemHeader>
                      <ItemDescription>
                        {parse(
                          DOMPurify.sanitize(mention.content || "", {
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
                                    handleAddReaction(mention.messageId, emoji)
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
                          onClick={() => handleReply(mention)}
                          size="sm"
                          type="button"
                          variant="ghost"
                        >
                          <IconArrowBackUp className="h-3.5 w-3.5" />
                          {hasThread ? "Open thread" : "Reply"}
                        </Button>
                        {!mention.isSeen && (
                          <Button
                            className="h-7 gap-1 rounded-md px-2 text-[11px]"
                            onClick={() =>
                              handleMarkAsRead(
                                mention.id,
                                mention.messageId,
                                mention.channel.id,
                                mention.isSeen
                              )
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
              })}
          </ItemGroup>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
