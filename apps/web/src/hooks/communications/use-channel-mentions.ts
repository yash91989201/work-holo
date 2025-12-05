import { and, eq, isNull, useLiveQuery } from "@tanstack/react-db";
import { useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useRef } from "react";
import {
  attachmentsCollection,
  channelMembersCollection,
  channelsCollection,
  messagesCollection,
  usersCollection,
} from "@/db/collections";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { buildMessageWithAttachments } from "@/lib/communications/message";
import { extractMentionIdsFromContent } from "@/lib/mentions";

export function useChannelMentions() {
  const { id: currentChannelId } = useParams({
    from: "/(authenticated)/org/$slug/(member)/(base-modules)/communication/channels/$id",
  });

  const { user } = useAuthedSession();
  const userId = user.id;

  const { data, isLoading } = useLiveQuery(
    (q) =>
      q
        .from({ message: messagesCollection })
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
        .where(({ message, channelMember }) =>
          and(isNull(message.deletedAt), eq(channelMember.userId, userId))
        )
        .orderBy(({ message }) => message.createdAt, "desc")
        .select(({ message, sender, attachment, channel }) => ({
          message,
          sender,
          attachment,
          channel,
        })),
    [userId]
  );

  const mentions = useMemo(() => {
    if (!(data && Array.isArray(data) && userId)) {
      return [];
    }

    const map = new Map<
      string,
      ReturnType<typeof buildMessageWithAttachments> & {
        channel: { id: string; name: string };
      }
    >();

    for (const { message, sender, attachment, channel } of data) {
      let entry = map.get(message.id);

      if (!entry) {
        entry = {
          ...buildMessageWithAttachments(message, sender),
          channel: { id: channel.id, name: channel.name },
        };
        map.set(message.id, entry);
      }

      if (attachment) {
        entry.attachments.push(attachment);
      }
    }

    const getMentionIds = (
      content: string | null,
      mentions?: string[] | null
    ) => {
      if (Array.isArray(mentions) && mentions.length > 0) {
        return mentions;
      }
      return extractMentionIdsFromContent(content) ?? [];
    };

    return Array.from(map.values())
      .filter((message) => {
        const mentionIds = getMentionIds(
          message.content ?? null,
          message.mentions
        );
        if (!mentionIds.length) return false;
        if (!Array.isArray(message.mentions) || message.mentions.length === 0) {
          message.mentions = mentionIds.length ? mentionIds : null;
        }
        return mentionIds.includes(userId);
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [data, userId]);

  const mentionCount = mentions.length;

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
    isLoading,
    currentChannelId,
  };
}
