import { and, eq, or, useLiveQuery } from "@tanstack/react-db";
import { useMemo } from "react";
import {
  dmConversationMutesCollection,
  dmConversationReadsCollection,
  dmConversationsCollection,
  dmMessagesCollection,
  usersCollection,
} from "@/db/collections";
import { useAuthedSession } from "@/hooks/use-authed-session";

export function useDmConversations() {
  const { session } = useAuthedSession();
  const userId = session.userId;
  const organizationId = session.activeOrganizationId;

  const { data: conversations = [] } = useLiveQuery((q) => {
    if (!organizationId) {
      throw new Error("No active organization");
    }

    return q
      .from({ conversation: dmConversationsCollection })
      .where(({ conversation }) =>
        and(
          eq(conversation.organizationId, organizationId),
          or(
            eq(conversation.participantOneId, userId),
            eq(conversation.participantTwoId, userId)
          )
        )
      )
      .select(({ conversation }) => ({ ...conversation }));
  });

  const { data: users = [] } = useLiveQuery((q) =>
    q.from({ user: usersCollection }).select(({ user }) => ({ ...user }))
  );

  const { data: reads = [] } = useLiveQuery(
    (q) =>
      q
        .from({ read: dmConversationReadsCollection })
        .where(({ read }) => eq(read.userId, userId))
        .select(({ read }) => ({ ...read })),
    [userId]
  );

  const { data: mutes = [] } = useLiveQuery(
    (q) =>
      q
        .from({ mute: dmConversationMutesCollection })
        .where(({ mute }) => eq(mute.userId, userId))
        .select(({ mute }) => ({ ...mute })),
    [userId]
  );

  const { data: allMessages = [] } = useLiveQuery((q) =>
    q
      .from({ message: dmMessagesCollection })
      .select(({ message }) => ({ ...message }))
  );

  const enrichedConversations = useMemo(() => {
    const userMap = new Map(users.map((u) => [u.id, u]));
    const readMap = new Map(reads.map((r) => [r.conversationId, r]));
    const muteSet = new Set(mutes.map((m) => m.conversationId));

    return conversations
      .map((conversation) => {
        const otherParticipantId =
          conversation.participantOneId === userId
            ? conversation.participantTwoId
            : conversation.participantOneId;

        const otherParticipant = userMap.get(otherParticipantId);

        const readRecord = readMap.get(conversation.id);
        const lastReadAt = readRecord?.lastReadAt;

        const conversationMessages = allMessages.filter(
          (m) => m.conversationId === conversation.id && !m.isDeleted
        );

        const unreadCount = lastReadAt
          ? conversationMessages.filter(
              (m) => new Date(m.createdAt) > new Date(lastReadAt)
            ).length
          : conversationMessages.length;

        const lastMessage = conversationMessages.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

        const lastMessageSender = lastMessage
          ? userMap.get(lastMessage.senderId)
          : undefined;

        return {
          ...conversation,
          otherParticipant: otherParticipant ?? null,
          unreadCount,
          isMuted: muteSet.has(conversation.id),
          lastMessage: lastMessage
            ? { ...lastMessage, sender: lastMessageSender ?? null }
            : null,
        };
      })
      .sort((a, b) => {
        const aTime = a.lastMessage
          ? new Date(a.lastMessage.createdAt).getTime()
          : new Date(a.createdAt).getTime();
        const bTime = b.lastMessage
          ? new Date(b.lastMessage.createdAt).getTime()
          : new Date(b.createdAt).getTime();
        return bTime - aTime;
      });
  }, [conversations, users, reads, mutes, allMessages, userId]);

  return { conversations: enrichedConversations };
}
