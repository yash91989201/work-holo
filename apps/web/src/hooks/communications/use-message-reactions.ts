import { eq, useLiveQuery } from "@tanstack/react-db";
import { useMemo } from "react";
import { messageReactionsCollection } from "@/db/collections";

interface GroupedReaction {
  emoji: string;
  count: number;
  userIds: string[];
  hasCurrentUser: boolean;
  currentUserReactionId?: string;
}

export function useMessageReactions(messageId: string, userId: string) {
  const { data: reactions } = useLiveQuery(
    (q) =>
      q
        .from({ reaction: messageReactionsCollection })
        .where(({ reaction }) => eq(reaction.messageId, messageId)),
    [messageId]
  );

  const groupedReactions = useMemo(() => {
    const groups = new Map<string, GroupedReaction>();

    for (const reaction of reactions) {
      const existing = groups.get(reaction.reaction);
      if (existing) {
        existing.count += 1;
        existing.userIds.push(reaction.userId);
        if (reaction.userId === userId) {
          existing.hasCurrentUser = true;
          existing.currentUserReactionId = reaction.id;
        }
      } else {
        groups.set(reaction.reaction, {
          emoji: reaction.reaction,
          count: 1,
          userIds: [reaction.userId],
          hasCurrentUser: reaction.userId === userId,
          currentUserReactionId:
            reaction.userId === userId ? reaction.id : undefined,
        });
      }
    }

    return Array.from(groups.values()).sort((a, b) => b.count - a.count);
  }, [reactions, userId]);

  return groupedReactions;
}
