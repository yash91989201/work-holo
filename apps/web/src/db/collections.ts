import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";
import {
  AccountSchema,
  AttachmentSchema,
  AttendanceSchema,
  ChannelJoinRequestSchema,
  ChannelMemberSchema,
  ChannelSchema,
  InvitationSchema,
  MemberSchema,
  MessageReadSchema,
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

export const channelJoinRequestsCollection = createCollection(
  electricCollectionOptions({
    getKey: (cjr) => cjr.id,
    schema: ChannelJoinRequestSchema,
    shapeOptions: {
      url: `${ELECTRIC_SHAPE_BASE_URL}/channel-join-requests`,
      params: {
        table: "channelJoinRequest",
      },
      fetchClient,
      parser: {
        timestamptz: (s: string) => new Date(s),
      },
    },
  })
);
