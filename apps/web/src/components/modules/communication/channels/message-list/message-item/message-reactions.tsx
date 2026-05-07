import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@work-holo/ui/components/avatar";
import { Badge } from "@work-holo/ui/components/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@work-holo/ui/components/hover-card";
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@work-holo/ui/components/item";
import { ScrollArea } from "@work-holo/ui/components/scroll-area";
import { Separator } from "@work-holo/ui/components/separator";
import { useMessageReactions } from "@/hooks/communications/use-message-reactions";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { cn } from "@/lib/utils";

interface MessageReactionsProps {
  messageId: string;
  onAddReaction: (emoji: string) => void;
  onRemoveReaction: (reactionId: string) => void;
}

export function MessageReactions({
  messageId,
  onAddReaction,
  onRemoveReaction,
}: MessageReactionsProps) {
  const { user } = useAuthedSession();

  const reactions = useMessageReactions(messageId, user.id);

  if (reactions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {reactions.map((reaction) => (
        <HoverCard key={reaction.emoji}>
          <HoverCardTrigger
            delay={300}
            render={
              <Badge
                className={cn(
                  "cursor-pointer gap-1 font-medium transition-colors",
                  reaction.hasCurrentUser
                    ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"
                    : "hover:bg-accent"
                )}
                onClick={() => {
                  if (
                    reaction.hasCurrentUser &&
                    reaction.currentUserReactionId
                  ) {
                    onRemoveReaction(reaction.currentUserReactionId);
                  } else {
                    onAddReaction(reaction.emoji);
                  }
                }}
                variant="outline"
              >
                <span className="text-sm leading-none">{reaction.emoji}</span>
                <span className="text-xs">{reaction.count}</span>
              </Badge>
            }
          />
          <HoverCardContent align="start" className="w-64 p-0">
            <Item>
              <ItemTitle>Reacted with {reaction.emoji}</ItemTitle>
            </Item>
            <Separator />
            <ScrollArea className="max-h-80">
              <div className="p-2">
                {reaction.users.map((user) => (
                  <Item className="p-1.5" key={user.id}>
                    <ItemMedia>
                      <Avatar className="size-8">
                        <AvatarImage alt={user.name} src={user.image} />
                        <AvatarFallback>
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="text-sm">{user.name}</ItemTitle>
                    </ItemContent>
                  </Item>
                ))}
              </div>
            </ScrollArea>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
}
