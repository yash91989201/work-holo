import { useDmMessageReactions } from "@/hooks/communications/dm/use-dm-reactions";
import { cn } from "@/lib/utils";

interface DmMessageReactionsProps {
  messageId: string;
  onAddReaction: (emoji: string) => void;
  onRemoveReaction: (reactionId: string) => void;
}

export function DmMessageReactions({
  messageId,
  onAddReaction,
  onRemoveReaction,
}: DmMessageReactionsProps) {
  const reactions = useDmMessageReactions(messageId);

  if (reactions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {reactions.map((reaction) => (
        <button
          className={cn(
            "flex items-center gap-1 rounded-full border px-2 py-0.5 text-sm transition-colors",
            reaction.hasCurrentUser
              ? "border-primary bg-primary/10 text-primary"
              : "border-muted bg-background hover:bg-accent"
          )}
          key={reaction.emoji}
          onClick={() => {
            if (reaction.hasCurrentUser && reaction.currentUserReactionId) {
              onRemoveReaction(reaction.currentUserReactionId);
            } else {
              onAddReaction(reaction.emoji);
            }
          }}
          title={reaction.users.map((u) => u.name).join(", ")}
          type="button"
        >
          <span>{reaction.emoji}</span>
          <span className="font-medium text-xs">{reaction.count}</span>
        </button>
      ))}
    </div>
  );
}
