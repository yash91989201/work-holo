import {
  and,
  createOptimisticAction,
  eq,
  useLiveQuery,
} from "@tanstack/react-db";
import { useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  attachmentsCollection,
  channelMembersCollection,
  channelsCollection,
  messageMentionsCollection,
  messagesCollection,
  usersCollection,
} from "@/db/collections";
import { useAuthedSession } from "@/hooks/use-authed-session";
import type { MessageWithSender } from "@/lib/communications/message";
import { buildMessageWithAttachments } from "@/lib/communications/message";
import { orpcClient } from "@/utils/orpc";

type MentionRecord = {
  id: string;
  messageId: string;
  mentionedById: string;
  mentionedUserId: string;
  isSeen: boolean;
  createdAt: Date;
};

type MentionWithRelations = MessageWithSender & {
  channel: { id: string; name: string };
  mention: MentionRecord;
};

export type MentionFilter = "all" | "unseen" | "seen";

export function useChannelMentions() {
  const { channelId: currentChannelId } = useParams({
    from: "/(authenticated)/org/$slug/workspace/communication/channels/$channelId",
  });

  const { user } = useAuthedSession();
  const userId = user.id;
  const [filter, setFilter] = useState<MentionFilter>("all");

  const { data, isLoading } = useLiveQuery(
    (q) => {
      let query = q
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
        .leftJoin(
          { attachment: attachmentsCollection },
          ({ message, attachment }) => eq(attachment.messageId, message.id)
        )
        .where(({ message, channelMember, mention }) =>
          and(
            eq(message.isDeleted, false),
            eq(message.channelId, currentChannelId),
            eq(channelMember.userId, userId),
            eq(mention.mentionedUserId, userId)
          )
        );

      if (filter === "unseen") {
        query = query.where(({ mention }) => eq(mention.isSeen, false));
      } else if (filter === "seen") {
        query = query.where(({ mention }) => eq(mention.isSeen, true));
      }

      return query
        .orderBy(({ mention }) => mention.createdAt, "desc")
        .select(({ mention, message, sender, attachment, channel }) => ({
          mention,
          message,
          sender,
          attachment,
          channel,
        }));
    },
    [userId, currentChannelId, filter]
  );

  const mentions = useMemo<MentionWithRelations[]>(() => {
    if (!(data && Array.isArray(data) && userId)) {
      return [];
    }

    const map = new Map<string, MentionWithRelations>();

    const orderedMentions: MentionWithRelations[] = [];

    for (const { mention, message, sender, attachment, channel } of data) {
      let entry = map.get(message.id);

      if (!entry) {
        entry = {
          ...buildMessageWithAttachments(message, sender, channel),
          mention,
        };
        map.set(message.id, entry);
        orderedMentions.push(entry);
      }

      if (attachment) {
        entry.attachments.push(attachment);
      }
    }

    return orderedMentions;
  }, [data, userId]);

  const mentionCount = mentions.length;
  const unreadMentionCount = mentions.filter(
    (mention) => !mention.mention.isSeen
  ).length;

  const markAllMentionsSeen = createOptimisticAction({
    onMutate: () => {
      // Query the collection directly to get ALL unseen mentions for this user in this channel
      const mentionIdsToUpdate: string[] = [];

      messageMentionsCollection.forEach((mention) => {
        if (mention.mentionedUserId !== userId || mention.isSeen) {
          return;
        }

        // Check if the mention's message is in the current channel
        const message = messagesCollection.get(mention.messageId);
        if (
          message &&
          message.channelId === currentChannelId &&
          !message.isDeleted
        ) {
          mentionIdsToUpdate.push(mention.id);
        }
      });

      mentionIdsToUpdate.forEach((mentionId) => {
        messageMentionsCollection.update(mentionId, (draft) => {
          draft.isSeen = true;
        });
      });
    },
    mutationFn: async () => {
      const { txid } =
        await orpcClient.communication.message.markAllMentionsSeen({
          channelId: currentChannelId,
        });

      await messageMentionsCollection.utils.awaitTxId(txid);
    },
  });

  return {
    mentions,
    mentionCount,
    unreadMentionCount,
    isLoading,
    currentChannelId,
    markAllMentionsSeen,
    filter,
    setFilter,
  };
}
