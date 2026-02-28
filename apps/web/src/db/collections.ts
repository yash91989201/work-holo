import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";
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
  NotificationSchema,
  OrganizationSchema,
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

export const messageMentionsCollection = createCollection(
  electricCollectionOptions({
    getKey: (m) => m.id,
    schema: MessageMentionSchema,
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

export const messageReactionsCollection = createCollection(
  electricCollectionOptions({
    getKey: (r) => r.id,
    schema: MessageReactionSchema,
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

export const usersCollection = createCollection(
  electricCollectionOptions({
    schema: UserSchema,
    getKey: (m) => m.id,
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

export const attachmentsCollection = createCollection(
  electricCollectionOptions({
    getKey: (m) => m.id,
    schema: AttachmentSchema,
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

export const channelsCollection = createCollection(
  electricCollectionOptions({
    getKey: (c) => c.id,
    schema: ChannelSchema,
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

export const channelMembersCollection = createCollection(
  electricCollectionOptions({
    getKey: (cm) => cm.id,
    schema: ChannelMemberSchema,
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

// ============================================================
// Direct Message Collections
// ============================================================

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

export const dmAttachmentsCollection = createCollection(
  electricCollectionOptions({
    getKey: (a) => a.id,
    schema: DmAttachmentSchema,
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
