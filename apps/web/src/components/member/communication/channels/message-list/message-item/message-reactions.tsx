import { Badge } from "@/components/ui/badge";
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
        <Badge
          className={cn(
            "cursor-pointer gap-1 font-medium transition-colors",
            reaction.hasCurrentUser
              ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"
              : "hover:bg-accent"
          )}
          key={reaction.emoji}
          onClick={() => {
            if (reaction.hasCurrentUser && reaction.currentUserReactionId) {
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
      ))}
    </div>
  );
}
