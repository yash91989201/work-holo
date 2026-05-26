import { and, eq, useLiveQuery } from "@tanstack/react-db";
import { useMemo } from "react";
import {
  channelMembersCollection,
  channelsCollection,
  messageMentionsCollection,
  messagesCollection,
  usersCollection,
} from "@/db/collections";
import { useAuthedSession } from "@/hooks/use-authed-session";

export type RecentMention = {
  id: string;
  messageId: string;
  content: string | null;
  createdAt: Date;
  isSeen: boolean;
  threadCount: number;
  sender: {
    id: string;
    name: string;
    image: string | null;
  };
  channel: {
    id: string;
    name: string;
    teamId: string | null;
  };
};

export function useRecentMentions() {
  const { user } = useAuthedSession();
  const userId = user.id;

  const { data, isLoading } = useLiveQuery(
    (q) =>
      q
        .from({ mention: messageMentionsCollection })
        .innerJoin({ message: messagesCollection }, ({ mention, message }) =>
          eq(mention.messageId, message.id)
        )
        .innerJoin({ sender: usersCollection }, ({ message, sender }) =>
          eq(message.senderId, sender.id)
        )
        .innerJoin({ channel: channelsCollection }, ({ message, channel }) =>
          eq(message.channelId, channel.id)
        )
        .innerJoin(
          { channelMember: channelMembersCollection },
          ({ channel, channelMember }) =>
            eq(channelMember.channelId, channel.id)
        )
        .where(({ message, channelMember, mention }) =>
          and(
            eq(mention.mentionedUserId, userId),
            eq(message.isDeleted, false),
            eq(channelMember.userId, userId)
          )
        )
        .orderBy(({ mention }) => mention.createdAt, "desc")
        .select(({ mention, message, sender, channel }) => ({
          mention,
          message,
          sender,
          channel,
        })),
    [userId]
  );

  const mentions = useMemo<RecentMention[]>(() => {
    if (!(data && Array.isArray(data) && userId)) {
      return [];
    }

    const map = new Map<string, RecentMention>();
    const orderedMentions: RecentMention[] = [];

    for (const { mention, message, sender, channel } of data) {
      if (!map.has(message.id)) {
        const entry: RecentMention = {
          id: mention.id,
          messageId: message.id,
          content: message.content,
          createdAt: message.createdAt,
          isSeen: mention.isSeen,
          threadCount: message.threadCount,
          sender: {
            id: sender.id,
            name: sender.name,
            image: sender.image ?? null,
          },
          channel: {
            id: channel.id,
            name: channel.name,
            teamId: channel.teamId,
          },
        };
        map.set(message.id, entry);
        orderedMentions.push(entry);
      }
    }

    return orderedMentions.slice(0, 5);
  }, [data, userId]);

  const unreadMentionCount = useMemo(
    () => mentions.filter((m) => !m.isSeen).length,
    [mentions]
  );

  return {
    mentions,
    isLoading,
    unreadMentionCount,
  };
}
