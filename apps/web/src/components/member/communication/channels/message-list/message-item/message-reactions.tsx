import { Button } from "@/components/ui/button";
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
        <Button
          className={cn(
            "gap-1.5 rounded-full px-2 py-0.5 text-xs",
            reaction.hasCurrentUser
              ? "border-primary/50 bg-primary/10 hover:bg-primary/20"
              : "bg-background hover:bg-muted"
          )}
          key={reaction.emoji}
          onClick={() => {
            if (reaction.hasCurrentUser && reaction.currentUserReactionId) {
              onRemoveReaction(reaction.currentUserReactionId);
            } else {
              onAddReaction(reaction.emoji);
            }
          }}
          size="sm"
          type="button"
          variant="outline"
        >
          <span className="text-base leading-none">{reaction.emoji}</span>
          <span className="font-medium">{reaction.count}</span>
        </Button>
      ))}
    </div>
  );
}
