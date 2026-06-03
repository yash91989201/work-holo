// AUTO-GENERATED FILE. DO NOT EDIT.
// Run `bun run generate:types` to refresh
import type { z } from "zod";
import type {
  AccountInsertSchema,
  AccountSchema,
  AccountUpdateSchema,
  AttachmentInsertSchema,
  AttachmentSchema,
  AttachmentUpdateSchema,
  AttendanceInsertSchema,
  AttendanceSchema,
  AttendanceUpdateSchema,
  ChannelInsertSchema,
  ChannelMemberInsertSchema,
  ChannelMemberSchema,
  ChannelMemberUpdateSchema,
  ChannelReadInsertSchema,
  ChannelReadProcessedWatermarkInsertSchema,
  ChannelReadProcessedWatermarkSchema,
  ChannelReadProcessedWatermarkUpdateSchema,
  ChannelReadSchema,
  ChannelReadUpdateSchema,
  ChannelSchema,
  ChannelTypeSchema,
  ChannelUpdateSchema,
  DmAttachmentInsertSchema,
  DmAttachmentSchema,
  DmAttachmentUpdateSchema,
  DmConversationInsertSchema,
  DmConversationMuteInsertSchema,
  DmConversationMuteSchema,
  DmConversationMuteUpdateSchema,
  DmConversationReadInsertSchema,
  DmConversationReadSchema,
  DmConversationReadUpdateSchema,
  DmConversationSchema,
  DmConversationUpdateSchema,
  DmMessageInsertSchema,
  DmMessageReactionInsertSchema,
  DmMessageReactionSchema,
  DmMessageReactionUpdateSchema,
  DmMessageReadInsertSchema,
  DmMessageReadSchema,
  DmMessageReadUpdateSchema,
  DmMessageSchema,
  DmMessageUpdateSchema,
  InvitationInsertSchema,
  InvitationSchema,
  InvitationUpdateSchema,
  MemberInsertSchema,
  MemberSchema,
  MemberUpdateSchema,
  MessageInsertSchema,
  MessageMentionInsertSchema,
  MessageMentionSchema,
  MessageMentionUpdateSchema,
  MessageReactionInsertSchema,
  MessageReactionSchema,
  MessageReactionUpdateSchema,
  MessageReadInsertSchema,
  MessageReadSchema,
  MessageReadSummaryInsertSchema,
  MessageReadSummarySchema,
  MessageReadSummaryUpdateSchema,
  MessageSchema,
  MessageUpdateSchema,
  NotificationInsertSchema,
  NotificationPreferenceInsertSchema,
  NotificationPreferenceSchema,
  NotificationPreferenceUpdateSchema,
  NotificationSchema,
  NotificationSoundPreferenceInsertSchema,
  NotificationSoundPreferenceSchema,
  NotificationSoundPreferenceUpdateSchema,
  NotificationSoundPresetInsertSchema,
  NotificationSoundPresetSchema,
  NotificationSoundPresetUpdateSchema,
  NotificationUpdateSchema,
  OrganizationInsertSchema,
  OrganizationSchema,
  OrganizationUpdateSchema,
  PendingEmailDigestInsertSchema,
  PendingEmailDigestSchema,
  PendingEmailDigestUpdateSchema,
  PushSubscriptionInsertSchema,
  PushSubscriptionSchema,
  PushSubscriptionUpdateSchema,
  SessionInsertSchema,
  SessionSchema,
  SessionUpdateSchema,
  TeamInsertSchema,
  TeamMemberInsertSchema,
  TeamMemberSchema,
  TeamMemberUpdateSchema,
  TeamSchema,
  TeamUpdateSchema,
  UserInsertSchema,
  UserSchema,
  UserUpdateSchema,
  VerificationInsertSchema,
  VerificationSchema,
  VerificationUpdateSchema,
  WorkBlockInsertSchema,
  WorkBlockSchema,
  WorkBlockUpdateSchema,
} from "./schemas/db-tables";

export type AccountInsertType = z.infer<typeof AccountInsertSchema>;
export type AccountType = z.infer<typeof AccountSchema>;
export type AccountUpdateType = z.infer<typeof AccountUpdateSchema>;
export type AttachmentInsertType = z.infer<typeof AttachmentInsertSchema>;
export type AttachmentType = z.infer<typeof AttachmentSchema>;
export type AttachmentUpdateType = z.infer<typeof AttachmentUpdateSchema>;
export type AttendanceInsertType = z.infer<typeof AttendanceInsertSchema>;
export type AttendanceType = z.infer<typeof AttendanceSchema>;
export type AttendanceUpdateType = z.infer<typeof AttendanceUpdateSchema>;
export type ChannelInsertType = z.infer<typeof ChannelInsertSchema>;
export type ChannelMemberInsertType = z.infer<typeof ChannelMemberInsertSchema>;
export type ChannelMemberType = z.infer<typeof ChannelMemberSchema>;
export type ChannelMemberUpdateType = z.infer<typeof ChannelMemberUpdateSchema>;
export type ChannelReadInsertType = z.infer<typeof ChannelReadInsertSchema>;
export type ChannelReadProcessedWatermarkInsertType = z.infer<
  typeof ChannelReadProcessedWatermarkInsertSchema
>;
export type ChannelReadProcessedWatermarkType = z.infer<
  typeof ChannelReadProcessedWatermarkSchema
>;
export type ChannelReadProcessedWatermarkUpdateType = z.infer<
  typeof ChannelReadProcessedWatermarkUpdateSchema
>;
export type ChannelReadType = z.infer<typeof ChannelReadSchema>;
export type ChannelReadUpdateType = z.infer<typeof ChannelReadUpdateSchema>;
export type ChannelType = z.infer<typeof ChannelSchema>;
export type ChannelTypeType = z.infer<typeof ChannelTypeSchema>;
export type ChannelUpdateType = z.infer<typeof ChannelUpdateSchema>;
export type DmAttachmentInsertType = z.infer<typeof DmAttachmentInsertSchema>;
export type DmAttachmentType = z.infer<typeof DmAttachmentSchema>;
export type DmAttachmentUpdateType = z.infer<typeof DmAttachmentUpdateSchema>;
export type DmConversationInsertType = z.infer<
  typeof DmConversationInsertSchema
>;
export type DmConversationMuteInsertType = z.infer<
  typeof DmConversationMuteInsertSchema
>;
export type DmConversationMuteType = z.infer<typeof DmConversationMuteSchema>;
export type DmConversationMuteUpdateType = z.infer<
  typeof DmConversationMuteUpdateSchema
>;
export type DmConversationReadInsertType = z.infer<
  typeof DmConversationReadInsertSchema
>;
export type DmConversationReadType = z.infer<typeof DmConversationReadSchema>;
export type DmConversationReadUpdateType = z.infer<
  typeof DmConversationReadUpdateSchema
>;
export type DmConversationType = z.infer<typeof DmConversationSchema>;
export type DmConversationUpdateType = z.infer<
  typeof DmConversationUpdateSchema
>;
export type DmMessageInsertType = z.infer<typeof DmMessageInsertSchema>;
export type DmMessageReactionInsertType = z.infer<
  typeof DmMessageReactionInsertSchema
>;
export type DmMessageReactionType = z.infer<typeof DmMessageReactionSchema>;
export type DmMessageReactionUpdateType = z.infer<
  typeof DmMessageReactionUpdateSchema
>;
export type DmMessageReadInsertType = z.infer<typeof DmMessageReadInsertSchema>;
export type DmMessageReadType = z.infer<typeof DmMessageReadSchema>;
export type DmMessageReadUpdateType = z.infer<typeof DmMessageReadUpdateSchema>;
export type DmMessageType = z.infer<typeof DmMessageSchema>;
export type DmMessageUpdateType = z.infer<typeof DmMessageUpdateSchema>;
export type InvitationInsertType = z.infer<typeof InvitationInsertSchema>;
export type InvitationType = z.infer<typeof InvitationSchema>;
export type InvitationUpdateType = z.infer<typeof InvitationUpdateSchema>;
export type MemberInsertType = z.infer<typeof MemberInsertSchema>;
export type MemberType = z.infer<typeof MemberSchema>;
export type MemberUpdateType = z.infer<typeof MemberUpdateSchema>;
export type MessageInsertType = z.infer<typeof MessageInsertSchema>;
export type MessageMentionInsertType = z.infer<
  typeof MessageMentionInsertSchema
>;
export type MessageMentionType = z.infer<typeof MessageMentionSchema>;
export type MessageMentionUpdateType = z.infer<
  typeof MessageMentionUpdateSchema
>;
export type MessageReactionInsertType = z.infer<
  typeof MessageReactionInsertSchema
>;
export type MessageReactionType = z.infer<typeof MessageReactionSchema>;
export type MessageReactionUpdateType = z.infer<
  typeof MessageReactionUpdateSchema
>;
export type MessageReadInsertType = z.infer<typeof MessageReadInsertSchema>;
export type MessageReadSummaryInsertType = z.infer<
  typeof MessageReadSummaryInsertSchema
>;
export type MessageReadSummaryType = z.infer<typeof MessageReadSummarySchema>;
export type MessageReadSummaryUpdateType = z.infer<
  typeof MessageReadSummaryUpdateSchema
>;
export type MessageReadType = z.infer<typeof MessageReadSchema>;
export type MessageType = z.infer<typeof MessageSchema>;
export type MessageUpdateType = z.infer<typeof MessageUpdateSchema>;
export type NotificationInsertType = z.infer<typeof NotificationInsertSchema>;
export type NotificationPreferenceInsertType = z.infer<
  typeof NotificationPreferenceInsertSchema
>;
export type NotificationPreferenceType = z.infer<
  typeof NotificationPreferenceSchema
>;
export type NotificationPreferenceUpdateType = z.infer<
  typeof NotificationPreferenceUpdateSchema
>;
export type NotificationSoundPreferenceInsertType = z.infer<
  typeof NotificationSoundPreferenceInsertSchema
>;
export type NotificationSoundPreferenceType = z.infer<
  typeof NotificationSoundPreferenceSchema
>;
export type NotificationSoundPreferenceUpdateType = z.infer<
  typeof NotificationSoundPreferenceUpdateSchema
>;
export type NotificationSoundPresetInsertType = z.infer<
  typeof NotificationSoundPresetInsertSchema
>;
export type NotificationSoundPresetType = z.infer<
  typeof NotificationSoundPresetSchema
>;
export type NotificationSoundPresetUpdateType = z.infer<
  typeof NotificationSoundPresetUpdateSchema
>;
export type NotificationType = z.infer<typeof NotificationSchema>;
export type NotificationUpdateType = z.infer<typeof NotificationUpdateSchema>;
export type OrganizationInsertType = z.infer<typeof OrganizationInsertSchema>;
export type OrganizationType = z.infer<typeof OrganizationSchema>;
export type OrganizationUpdateType = z.infer<typeof OrganizationUpdateSchema>;
export type PendingEmailDigestInsertType = z.infer<
  typeof PendingEmailDigestInsertSchema
>;
export type PendingEmailDigestType = z.infer<typeof PendingEmailDigestSchema>;
export type PendingEmailDigestUpdateType = z.infer<
  typeof PendingEmailDigestUpdateSchema
>;
export type PushSubscriptionInsertType = z.infer<
  typeof PushSubscriptionInsertSchema
>;
export type PushSubscriptionType = z.infer<typeof PushSubscriptionSchema>;
export type PushSubscriptionUpdateType = z.infer<
  typeof PushSubscriptionUpdateSchema
>;
export type SessionInsertType = z.infer<typeof SessionInsertSchema>;
export type SessionType = z.infer<typeof SessionSchema>;
export type SessionUpdateType = z.infer<typeof SessionUpdateSchema>;
export type TeamInsertType = z.infer<typeof TeamInsertSchema>;
export type TeamMemberInsertType = z.infer<typeof TeamMemberInsertSchema>;
export type TeamMemberType = z.infer<typeof TeamMemberSchema>;
export type TeamMemberUpdateType = z.infer<typeof TeamMemberUpdateSchema>;
export type TeamType = z.infer<typeof TeamSchema>;
export type TeamUpdateType = z.infer<typeof TeamUpdateSchema>;
export type UserInsertType = z.infer<typeof UserInsertSchema>;
export type UserType = z.infer<typeof UserSchema>;
export type UserUpdateType = z.infer<typeof UserUpdateSchema>;
export type VerificationInsertType = z.infer<typeof VerificationInsertSchema>;
export type VerificationType = z.infer<typeof VerificationSchema>;
export type VerificationUpdateType = z.infer<typeof VerificationUpdateSchema>;
export type WorkBlockInsertType = z.infer<typeof WorkBlockInsertSchema>;
export type WorkBlockType = z.infer<typeof WorkBlockSchema>;
export type WorkBlockUpdateType = z.infer<typeof WorkBlockUpdateSchema>;
