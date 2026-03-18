import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import z from "zod";
import { attendanceTable, workBlockTable } from "../../schema/attendance";
import {
  account,
  invitation,
  member,
  organization,
  session,
  team,
  teamMember,
  user,
  verification,
} from "../../schema/auth";
import {
  attachmentTable,
  channelMemberTable,
  channelReadProcessedWatermarkTable,
  channelReadTable,
  channelTable,
  messageMentionTable,
  messageReactionTable,
  messageReadSummaryTable,
  messageReadTable,
  messageTable,
} from "../../schema/channel";
import {
  dmAttachmentTable,
  dmConversationMuteTable,
  dmConversationReadTable,
  dmConversationTable,
  dmMessageReactionTable,
  dmMessageReadTable,
  dmMessageTable,
} from "../../schema/direct-message";
import {
  notificationPreferenceTable,
  notificationSoundPreferenceTable,
  notificationSoundPresetTable,
  notificationTable,
  pendingEmailDigestTable,
  pushSubscriptionTable,
} from "../../schema/notification";

export const AccountSchema = createSelectSchema(account);
export const UserSchema = createSelectSchema(user, {
  image: z.url().nullable().optional(),
  username: z.string().nullable().optional(),
  displayUsername: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  phoneNumberVerified: z.boolean().nullable().optional(),
  role: z.string().nullable().optional(),
  banned: z.boolean().nullable().optional(),
  banReason: z.string().nullable().optional(),
  banExpires: z.date().nullable().optional(),
  twoFactorEnabled: z.boolean().nullable().optional(),
});
export const SessionSchema = createSelectSchema(session);
export const InvitationSchema = createSelectSchema(invitation);
export const MemberSchema = createSelectSchema(member);
export const OrganizationSchema = createSelectSchema(organization);
export const TeamSchema = createSelectSchema(team);
export const TeamMemberSchema = createSelectSchema(teamMember);
export const VerificationSchema = createSelectSchema(verification);
export const AttendanceSchema = createSelectSchema(attendanceTable);
export const WorkBlockSchema = createSelectSchema(workBlockTable);

export const AccountUpdateSchema = createUpdateSchema(account);
export const UserUpdateSchema = createUpdateSchema(user);
export const SessionUpdateSchema = createUpdateSchema(session);
export const InvitationUpdateSchema = createUpdateSchema(invitation);
export const MemberUpdateSchema = createUpdateSchema(member);
export const OrganizationUpdateSchema = createUpdateSchema(organization);
export const TeamUpdateSchema = createUpdateSchema(team);
export const TeamMemberUpdateSchema = createUpdateSchema(teamMember);
export const VerificationUpdateSchema = createUpdateSchema(verification);
export const AttendanceUpdateSchema = createUpdateSchema(attendanceTable);
export const WorkBlockUpdateSchema = createUpdateSchema(workBlockTable);

export const AccountInsertSchema = createInsertSchema(account);
export const UserInsertSchema = createInsertSchema(user);
export const SessionInsertSchema = createInsertSchema(session);
export const InvitationInsertSchema = createInsertSchema(invitation);
export const MemberInsertSchema = createInsertSchema(member);
export const OrganizationInsertSchema = createInsertSchema(organization);
export const TeamInsertSchema = createInsertSchema(team);
export const TeamMemberInsertSchema = createInsertSchema(teamMember);
export const VerificationInsertSchema = createInsertSchema(verification);
export const AttendanceInsertSchema = createInsertSchema(attendanceTable);
export const WorkBlockInsertSchema = createInsertSchema(workBlockTable);

export const ChannelSchema = createSelectSchema(channelTable);
export const ChannelMemberSchema = createSelectSchema(channelMemberTable);
export const MessageMentionSchema = createSelectSchema(messageMentionTable);
export const MessageReactionSchema = createSelectSchema(messageReactionTable);
export const MessageSchema = createSelectSchema(messageTable);
export const AttachmentSchema = createSelectSchema(attachmentTable);
export const MessageReadSchema = createSelectSchema(messageReadTable);

export const ChannelUpdateSchema = createUpdateSchema(channelTable);
export const ChannelMemberUpdateSchema = createUpdateSchema(channelMemberTable);
export const MessageMentionUpdateSchema =
  createUpdateSchema(messageMentionTable);
export const MessageReactionUpdateSchema =
  createUpdateSchema(messageReactionTable);
export const MessageUpdateSchema = createUpdateSchema(messageTable);
export const AttachmentUpdateSchema = createUpdateSchema(attachmentTable);

export const ChannelInsertSchema = createInsertSchema(channelTable);
export const ChannelMemberInsertSchema = createInsertSchema(channelMemberTable);
export const MessageMentionInsertSchema =
  createInsertSchema(messageMentionTable);
export const MessageReactionInsertSchema =
  createInsertSchema(messageReactionTable);
export const MessageInsertSchema = createInsertSchema(messageTable);
export const AttachmentInsertSchema = createInsertSchema(attachmentTable);
export const MessageReadInsertSchema = createInsertSchema(messageReadTable);

export const ChannelTypeSchema = ChannelSchema.shape.type;
export const ChannelReadSchema = createSelectSchema(channelReadTable);
export const ChannelReadUpdateSchema = createUpdateSchema(channelReadTable);
export const ChannelReadInsertSchema = createInsertSchema(channelReadTable);

export const MessageReadSummarySchema = createSelectSchema(
  messageReadSummaryTable
);

export const MessageReadSummaryUpdateSchema = createUpdateSchema(
  messageReadSummaryTable
);
export const MessageReadSummaryInsertSchema = createInsertSchema(
  messageReadSummaryTable
);

export const ChannelReadProcessedWatermarkSchema = createSelectSchema(
  channelReadProcessedWatermarkTable
);
export const ChannelReadProcessedWatermarkUpdateSchema = createUpdateSchema(
  channelReadProcessedWatermarkTable
);
export const ChannelReadProcessedWatermarkInsertSchema = createInsertSchema(
  channelReadProcessedWatermarkTable
);

// Notification schemas
export const NotificationSchema = createSelectSchema(notificationTable);
export const NotificationUpdateSchema = createUpdateSchema(notificationTable);
export const NotificationInsertSchema = createInsertSchema(notificationTable);

// Notification Preference schemas
export const NotificationPreferenceSchema = createSelectSchema(
  notificationPreferenceTable
);
export const NotificationPreferenceUpdateSchema = createUpdateSchema(
  notificationPreferenceTable
);
export const NotificationPreferenceInsertSchema = createInsertSchema(
  notificationPreferenceTable
);

// Notification Sound Preset schemas
export const NotificationSoundPresetSchema = createSelectSchema(
  notificationSoundPresetTable
);
export const NotificationSoundPresetUpdateSchema = createUpdateSchema(
  notificationSoundPresetTable
);
export const NotificationSoundPresetInsertSchema = createInsertSchema(
  notificationSoundPresetTable
);

// Notification Sound Preference schemas
export const NotificationSoundPreferenceSchema = createSelectSchema(
  notificationSoundPreferenceTable
);
export const NotificationSoundPreferenceUpdateSchema = createUpdateSchema(
  notificationSoundPreferenceTable
);
export const NotificationSoundPreferenceInsertSchema = createInsertSchema(
  notificationSoundPreferenceTable
);

// Pending Email Digest schemas
export const PendingEmailDigestSchema = createSelectSchema(
  pendingEmailDigestTable
);
export const PendingEmailDigestUpdateSchema = createUpdateSchema(
  pendingEmailDigestTable
);
export const PendingEmailDigestInsertSchema = createInsertSchema(
  pendingEmailDigestTable
);

// Push Subscription schemas
export const PushSubscriptionSchema = createSelectSchema(pushSubscriptionTable);
export const PushSubscriptionUpdateSchema = createUpdateSchema(
  pushSubscriptionTable
);
export const PushSubscriptionInsertSchema = createInsertSchema(
  pushSubscriptionTable
);

// Direct Message schemas
export const DmConversationSchema = createSelectSchema(dmConversationTable);
export const DmMessageSchema = createSelectSchema(dmMessageTable);
export const DmAttachmentSchema = createSelectSchema(dmAttachmentTable);
export const DmMessageReactionSchema = createSelectSchema(
  dmMessageReactionTable
);
export const DmMessageReadSchema = createSelectSchema(dmMessageReadTable);
export const DmConversationReadSchema = createSelectSchema(
  dmConversationReadTable
);
export const DmConversationMuteSchema = createSelectSchema(
  dmConversationMuteTable
);

export const DmConversationUpdateSchema =
  createUpdateSchema(dmConversationTable);
export const DmMessageUpdateSchema = createUpdateSchema(dmMessageTable);
export const DmAttachmentUpdateSchema = createUpdateSchema(dmAttachmentTable);
export const DmMessageReactionUpdateSchema = createUpdateSchema(
  dmMessageReactionTable
);
export const DmMessageReadUpdateSchema = createUpdateSchema(dmMessageReadTable);
export const DmConversationReadUpdateSchema = createUpdateSchema(
  dmConversationReadTable
);
export const DmConversationMuteUpdateSchema = createUpdateSchema(
  dmConversationMuteTable
);

export const DmConversationInsertSchema =
  createInsertSchema(dmConversationTable);
export const DmMessageInsertSchema = createInsertSchema(dmMessageTable);
export const DmAttachmentInsertSchema = createInsertSchema(dmAttachmentTable);
export const DmMessageReactionInsertSchema = createInsertSchema(
  dmMessageReactionTable
);
export const DmMessageReadInsertSchema = createInsertSchema(dmMessageReadTable);
export const DmConversationReadInsertSchema = createInsertSchema(
  dmConversationReadTable
);
export const DmConversationMuteInsertSchema = createInsertSchema(
  dmConversationMuteTable
);
