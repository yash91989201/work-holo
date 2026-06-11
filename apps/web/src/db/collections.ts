import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { BasicIndex, createCollection } from "@tanstack/react-db";
import {
  AccountSchema,
  AttachmentSchema,
  AttendanceSchema,
  ChannelMemberSchema,
  ChannelReadProcessedWatermarkSchema,
  ChannelReadSchema,
  ChannelSchema,
  DmAttachmentSchema,
  DmConversationMuteSchema,
  DmConversationReadSchema,
  DmConversationSchema,
  DmMessageReactionSchema,
  DmMessageReadSchema,
  DmMessageSchema,
  InvitationSchema,
  MemberSchema,
  MessageMentionSchema,
  MessageReactionSchema,
  MessageReadSchema,
  MessageReadSummarySchema,
  MessageSchema,
  NotificationPreferenceSchema,
  NotificationSchema,
  NotificationSoundPreferenceSchema,
  NotificationSoundPresetSchema,
  OrganizationSchema,
  PendingEmailDigestSchema,
  SessionSchema,
  TeamMemberSchema,
  TeamSchema,
  UserSchema,
  VerificationSchema,
} from "@work-holo/db/lib/schemas/db-tables";
import { ELECTRIC_SHAPE_BASE_URL, fetchClient } from "@/lib/electric";

export const messagesCollection = createCollection(
  electricCollectionOptions({
    getKey: (m) => m.id,
    schema: MessageSchema,
    defaultIndexType: BasicIndex,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/messages`,
      params: {
        table: "message",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

// Join: message.senderId = sender.id
messagesCollection.createIndex((m) => m.senderId);
// Join: message.channelId = channel.id
messagesCollection.createIndex((m) => m.channelId);
// orderBy: message.createdAt (useMessages, usePinnedMessages)
messagesCollection.createIndex((m) => m.createdAt);
// orderBy: message.pinnedAt (usePinnedMessages)
messagesCollection.createIndex((m) => m.pinnedAt);

export const messageMentionsCollection = createCollection(
  electricCollectionOptions({
    getKey: (m) => m.id,
    schema: MessageMentionSchema,
    defaultIndexType: BasicIndex,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/message-mentions`,
      params: {
        table: "messageMention",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

// Join: mention.messageId = message.id
messageMentionsCollection.createIndex((m) => m.messageId);
// Filter: mention.mentionedUserId = user.id
messageMentionsCollection.createIndex((m) => m.mentionedUserId);

export const messageReactionsCollection = createCollection(
  electricCollectionOptions({
    getKey: (r) => r.id,
    schema: MessageReactionSchema,
    defaultIndexType: BasicIndex,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/message-reactions`,
      params: {
        table: "messageReaction",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

// Join/filter: reaction.messageId = message.id
messageReactionsCollection.createIndex((r) => r.messageId);
// Join/filter: reaction.userId = user.id
messageReactionsCollection.createIndex((r) => r.userId);

export const usersCollection = createCollection(
  electricCollectionOptions({
    schema: UserSchema,
    getKey: (m) => m.id,
    defaultIndexType: BasicIndex,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/users`,
      params: {
        table: "user",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

// Join: sender.id = message.senderId
usersCollection.createIndex((u) => u.id);

export const attachmentsCollection = createCollection(
  electricCollectionOptions({
    getKey: (m) => m.id,
    schema: AttachmentSchema,
    defaultIndexType: BasicIndex,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/attachments`,
      params: {
        table: "attachment",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

export const accountsCollection = createCollection(
  electricCollectionOptions({
    getKey: (a) => a.id,
    schema: AccountSchema,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/accounts`,
      params: {
        table: "account",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

export const sessionsCollection = createCollection(
  electricCollectionOptions({
    getKey: (s) => s.id,
    schema: SessionSchema,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/sessions`,
      params: {
        table: "session",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

export const invitationsCollection = createCollection(
  electricCollectionOptions({
    getKey: (i) => i.id,
    schema: InvitationSchema,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/invitations`,
      params: {
        table: "invitation",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

export const membersCollection = createCollection(
  electricCollectionOptions({
    getKey: (m) => m.id,
    schema: MemberSchema,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/members`,
      params: {
        table: "member",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

export const organizationsCollection = createCollection(
  electricCollectionOptions({
    getKey: (o) => o.id,
    schema: OrganizationSchema,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/organizations`,
      params: {
        table: "organization",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

export const teamsCollection = createCollection(
  electricCollectionOptions({
    getKey: (t) => t.id,
    schema: TeamSchema,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/teams`,
      params: {
        table: "team",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

export const teamMembersCollection = createCollection(
  electricCollectionOptions({
    getKey: (tm) => tm.id,
    schema: TeamMemberSchema,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/team-members`,
      params: {
        table: "teamMember",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

export const verificationsCollection = createCollection(
  electricCollectionOptions({
    getKey: (v) => v.id,
    schema: VerificationSchema,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/verifications`,
      params: {
        table: "verification",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

export const attendanceCollection = createCollection(
  electricCollectionOptions({
    getKey: (a) => a.id,
    schema: AttendanceSchema,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/attendance`,
      params: {
        table: "attendance",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

// Join: attachment.messageId = message.id
attachmentsCollection.createIndex((a) => a.messageId);

export const channelsCollection = createCollection(
  electricCollectionOptions({
    getKey: (c) => c.id,
    schema: ChannelSchema,
    defaultIndexType: BasicIndex,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/channels`,
      params: {
        table: "channel",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

// Join: channel.id = message.channelId, member.channelId = channel.id
channelsCollection.createIndex((c) => c.id);

export const channelMembersCollection = createCollection(
  electricCollectionOptions({
    getKey: (cm) => cm.id,
    schema: ChannelMemberSchema,
    defaultIndexType: BasicIndex,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/channel-members`,
      params: {
        table: "channelMember",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

export const notificationsCollection = createCollection(
  electricCollectionOptions({
    getKey: (n) => n.id,
    schema: NotificationSchema,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/notifications`,
      params: {
        table: "notification",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

export const messageReadCollection = createCollection(
  electricCollectionOptions({
    getKey: (mr) => mr.id,
    schema: MessageReadSchema,
    defaultIndexType: BasicIndex,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/message-read`,
      params: {
        table: "messageRead",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

// Join/filter: read.messageId = message.id
messageReadCollection.createIndex((mr) => mr.messageId);
// Join/filter: read.userId = user.id
messageReadCollection.createIndex((mr) => mr.userId);

// Join: member.channelId = channel.id
channelMembersCollection.createIndex((cm) => cm.channelId);

export const dmConversationsCollection = createCollection(
  electricCollectionOptions({
    getKey: (c) => c.id,
    schema: DmConversationSchema,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/dm-conversations`,
      params: {
        table: "dmConversation",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

export const dmMessagesCollection = createCollection(
  electricCollectionOptions({
    getKey: (m) => m.id,
    schema: DmMessageSchema,
    defaultIndexType: BasicIndex,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/dm-messages`,
      params: {
        table: "dmMessage",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

// Join: dmMessage.senderId = sender.id
dmMessagesCollection.createIndex((m) => m.senderId);
// Join: dmMessage.conversationId
dmMessagesCollection.createIndex((m) => m.conversationId);
// orderBy: dmMessage.createdAt (useDmMessages, useDmPinnedMessages)
dmMessagesCollection.createIndex((m) => m.createdAt);
// orderBy: dmMessage.pinnedAt (useDmPinnedMessages)
dmMessagesCollection.createIndex((m) => m.pinnedAt);

export const dmAttachmentsCollection = createCollection(
  electricCollectionOptions({
    getKey: (a) => a.id,
    schema: DmAttachmentSchema,
    defaultIndexType: BasicIndex,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/dm-attachments`,
      params: {
        table: "dmAttachment",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

// Join: dmAttachment.messageId = dmMessage.id
dmAttachmentsCollection.createIndex((a) => a.messageId);

export const dmReactionsCollection = createCollection(
  electricCollectionOptions({
    getKey: (r) => r.id,
    schema: DmMessageReactionSchema,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/dm-reactions`,
      params: {
        table: "dmMessageReaction",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

export const dmMessageReadsCollection = createCollection(
  electricCollectionOptions({
    getKey: (mr) => mr.id,
    schema: DmMessageReadSchema,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/dm-message-reads`,
      params: {
        table: "dmMessageRead",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

export const dmConversationReadsCollection = createCollection(
  electricCollectionOptions({
    getKey: (cr) => cr.id,
    schema: DmConversationReadSchema,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/dm-conversation-reads`,
      params: {
        table: "dmConversationRead",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

export const dmConversationMutesCollection = createCollection(
  electricCollectionOptions({
    getKey: (cm) => cm.id,
    schema: DmConversationMuteSchema,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/dm-conversation-mutes`,
      params: {
        table: "dmConversationMute",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

export const channelReadCollection = createCollection(
  electricCollectionOptions({
    getKey: (cr) => `${cr.channelId}-${cr.userId}`,
    schema: ChannelReadSchema,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/channel-read`,
      params: {
        table: "channelRead",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

export const messageReadSummaryCollection = createCollection(
  electricCollectionOptions({
    getKey: (mrs) => mrs.id,
    schema: MessageReadSummarySchema,
    defaultIndexType: BasicIndex,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/message-read-summary`,
      params: {
        table: "messageReadSummary",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
      transformer: (row) => {
        let recentReaders = row.recentReaders;

        if (typeof recentReaders === "string") {
          try {
            recentReaders = JSON.parse(recentReaders);
          } catch {
            recentReaders = [];
          }
        }

        return {
          ...row,
          recentReaders,
        };
      },
    },
  })
);

// where: summary.messageId (MessageReadReceipts)
messageReadSummaryCollection.createIndex((mrs) => mrs.messageId);

export const channelReadProcessedWatermarkCollection = createCollection(
  electricCollectionOptions({
    getKey: (crpw) => crpw.id,
    schema: ChannelReadProcessedWatermarkSchema,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/channel-read-processed-watermark`,
      params: {
        table: "channelReadProcessedWatermark",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

export const notificationPreferenceCollection = createCollection(
  electricCollectionOptions({
    getKey: (np) => np.id,
    schema: NotificationPreferenceSchema,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/notification-preference`,
      params: {
        table: "notificationPreference",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

export const notificationSoundPresetCollection = createCollection(
  electricCollectionOptions({
    getKey: (nsp) => nsp.id,
    schema: NotificationSoundPresetSchema,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/notification-sound-preset`,
      params: {
        table: "notificationSoundPreset",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

export const notificationSoundPreferenceCollection = createCollection(
  electricCollectionOptions({
    getKey: (nsp) => nsp.id,
    schema: NotificationSoundPreferenceSchema,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/notification-sound-preference`,
      params: {
        table: "notificationSoundPreference",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);

export const pendingEmailDigestCollection = createCollection(
  electricCollectionOptions({
    getKey: (ped) => ped.id,
    schema: PendingEmailDigestSchema,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/pending-email-digest`,
      params: {
        table: "pendingEmailDigest",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);
