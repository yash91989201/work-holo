import { and, eq, useLiveQuery } from "@tanstack/react-db";
import { useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useRef } from "react";
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

export function useChannelMentions() {
  const { id: currentChannelId } = useParams({
    from: "/(authenticated)/org/$slug/(modules)/communication/channels/$id",
  });

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
        )
        .orderBy(({ mention }) => mention.createdAt, "desc")
        .select(({ mention, message, sender, attachment, channel }) => ({
          mention,
          message,
          sender,
          attachment,
          channel,
        })),
    [userId, currentChannelId]
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

  const prevMentionCountRef = useRef(mentionCount);
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    if (isLoading) return;

    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
      prevMentionCountRef.current = mentionCount;
      return;
    }

    if (mentionCount > prevMentionCountRef.current) {
      const audio = new Audio("/assets/sounds/mention.webm");
      audio.play().catch((error) => {
        console.error("Error playing mention sound:", error);
      });
    }

    prevMentionCountRef.current = mentionCount;
  }, [mentionCount, isLoading]);

  return {
    mentions,
    mentionCount,
    unreadMentionCount,
    isLoading,
    currentChannelId,
  };
}
