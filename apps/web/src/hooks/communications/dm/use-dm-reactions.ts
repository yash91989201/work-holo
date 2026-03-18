import { createOptimisticAction, eq, useLiveQuery } from "@tanstack/react-db";
import { useMemo } from "react";
import { dmReactionsCollection, usersCollection } from "@/db/collections";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { orpcClient } from "@/utils/orpc";

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

export function useDmMessageReactions(messageId: string) {
  const { user } = useAuthedSession();
  const userId = user.id;

  const { data: reactions } = useLiveQuery(
    (q) =>
      q
        .from({ reaction: dmReactionsCollection })
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
      const existing = groups.get(item.reaction.emoji);
      if (existing) {
        existing.count += 1;
        existing.userIds.push(item.reaction.userId);
        existing.users.push(item.user);
        if (item.reaction.userId === userId) {
          existing.hasCurrentUser = true;
          existing.currentUserReactionId = item.reaction.id;
        }
      } else {
        groups.set(item.reaction.emoji, {
          emoji: item.reaction.emoji,
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

export function useDmReactionMutations() {
  const { user } = useAuthedSession();

  const toggleReaction = createOptimisticAction({
    onMutate: ({ messageId, emoji }: { messageId: string; emoji: string }) => {
      const existingReaction = Array.from(dmReactionsCollection.values()).find(
        (r) =>
          r.messageId === messageId && r.userId === user.id && r.emoji === emoji
      );

      if (existingReaction) {
        // Remove existing reaction
        dmReactionsCollection.delete(existingReaction.id);
      } else {
        // Add new reaction
        dmReactionsCollection.insert({
          id: crypto.randomUUID().toString(),
          messageId,
          userId: user.id,
          emoji,
          createdAt: new Date(),
        });
      }
    },
    mutationFn: async ({
      messageId,
      emoji,
    }: {
      messageId: string;
      emoji: string;
    }) => {
      const { txid } = await orpcClient.communication.dm.toggleReaction({
        messageId,
        emoji,
      });

      await dmReactionsCollection.utils.awaitTxId(txid);
    },
  });

  return { toggleReaction };
}
