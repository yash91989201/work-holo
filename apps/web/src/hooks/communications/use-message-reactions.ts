import { eq, useLiveQuery } from "@tanstack/react-db";
import { useMemo } from "react";
import { messageReactionsCollection, usersCollection } from "@/db/collections";

interface ReactionUser {
  id: string;
  image: string | undefined;
  name: string;
}

interface GroupedReaction {
  count: number;
  currentUserReactionId?: string;
  emoji: string;
  hasCurrentUser: boolean;
  userIds: string[];
  users: ReactionUser[];
}

export function useMessageReactions(messageId: string, userId: string) {
  const { data: reactions } = useLiveQuery(
    (q) =>
      q
        .from({ reaction: messageReactionsCollection })
        .innerJoin({ user: usersCollection }, ({ reaction, user }) =>
          eq(reaction.userId, user.id)
        )
        .where(({ reaction }) => eq(reaction.messageId, messageId))
        .select(({ reaction, user }) => ({
          reaction,
          user: {
            id: user.id,
            name: user.name,
            image: user.image,
          },
        })),
    [messageId]
  );

  const groupedReactions = useMemo(() => {
    const groups = new Map<string, GroupedReaction>();

    for (const item of reactions) {
      const existing = groups.get(item.reaction.reaction);
      if (existing) {
        existing.count += 1;
        existing.userIds.push(item.reaction.userId);
        existing.users.push(item.user);
        if (item.reaction.userId === userId) {
          existing.hasCurrentUser = true;
          existing.currentUserReactionId = item.reaction.id;
        }
      } else {
        groups.set(item.reaction.reaction, {
          emoji: item.reaction.reaction,
          count: 1,
          userIds: [item.reaction.userId],
          users: [item.user],
          hasCurrentUser: item.reaction.userId === userId,
          currentUserReactionId:
            item.reaction.userId === userId ? item.reaction.id : undefined,
        });
      }
    }

    return Array.from(groups.values()).sort((a, b) => b.count - a.count);
  }, [reactions, userId]);

  return groupedReactions;
}
