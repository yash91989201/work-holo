// AUTO-GENERATED FILE. DO NOT EDIT.
// Run `bun run generate:types` to refresh
import type { z } from "zod";
import type {
  AttendanceRecordWithUserSchema,
  AttendanceSelectSchema,
  GetAttendanceDetailInput,
  GetAttendanceDetailOutput,
  GetAttendanceStatsInput,
  GetAttendanceStatsOutput,
  ListAttendanceRecordsInput,
  ListAttendanceRecordsOutput,
} from "./schemas/admin-attendance";
import type {
  InvitationSelectSchema,
  ListInvitationsInput,
  ListInvitationsOutput,
} from "./schemas/admin-invitation";
import type {
  ListMembersInput,
  ListMembersOutput,
  MemberSelectSchema,
  MemberWithUserSchema,
  UserSelectSchema,
} from "./schemas/admin-member";
import type {
  AttachmentOutput,
  AttachmentsListOutput,
  AttachmentsWithChannelListOutput,
  AttachmentsWithMessageListOutput,
  AttachmentTypeSchema,
  AttachmentWithChannelOutput,
  AttachmentWithMessageOutput,
  ChannelFileOutput,
  ChannelFilesListOutput,
  CreateAttachmentInput,
  CreateBulkAttachmentsInput,
  DeleteAttachmentInput,
  DeleteAttachmentOutput,
  GetAttachmentInput,
  GetChannelAttachmentsInput,
  GetMessageAttachmentsInput,
  GetMultipleMessageAttachmentsInput,
  GetRecentAttachmentsInput,
  GetStorageStatsInput,
  GetUpdateAttachmentUploadUrlInput,
  GetUpdateAttachmentUploadUrlOutput,
  GetUserAttachmentsInput,
  ListChannelFilesInput,
  RecentAttachmentOutput,
  RecentAttachmentsListOutput,
  SearchAttachmentsInput,
  StorageStatsOutput,
  UpdateAttachmentInput,
  UpdateAttachmentOutput,
} from "./schemas/attachment";
import type {
  AddBreakDurationInput,
  AddBreakDurationOutput,
  AttendanceAnalyticsInput,
  AttendanceAnalyticsOutput,
  GetTodayInput,
  GetTodayOutput,
  MemberAttendanceStatusOutput,
  MemberPunchInInput,
  MemberPunchInOutput,
  MemberPunchOutInput,
  MemberPunchOutOutput,
} from "./schemas/attendance";
import type { AdminRoleSchema } from "./schemas/auth";
import type {
  ArchiveChannelInput,
  ChannelMemberOutput,
  ChannelMembersListOutput,
  ChannelOutput,
  ChannelsListOutput,
  ChannelWithCreatorOutput,
  ChannelWithStatsOutput,
  CreateChannelInput,
  CreateChannelOutput,
  DeleteChannelInput,
  DeletechannelOutput,
  GetChannelInput,
  GetChannelOutput,
  GetChannelsInput,
  GetChannelUnreadCountsInput,
  GetChannelUnreadCountsOutput,
  IsChannelMemberInput,
  IsChannelMemberOutput,
  JoinChannelInput,
  LeaveChannelInput,
  ListChannelMembersInput,
  ListChannelMembersOutput,
  ListChannelsInput,
  ListChannelsOutput,
  ModifyChannelMembersInput,
  RemoveChannelMemberInput,
  SuccessOutput,
  UpdateChannelInput,
  UpdateChannelMemberInput,
} from "./schemas/channel";
import type {
  CreateDmConversationInput,
  DeleteDmMessageInput,
  DmAttachmentInput,
  EditDmMessageInput,
  GetDmConversationInput,
  GetDmConversationsInput,
  GetDmMessagesInput,
  MarkDmReadInput,
  MuteDmConversationInput,
  SearchDmMessagesInput,
  SearchDmMessagesOutput,
  SendDmMessageInput,
  ToggleDmPinInput,
  ToggleDmReactionInput,
  UnmuteDmConversationInput,
} from "./schemas/dm";
import type {
  AddReactionInput,
  AddReactionOutput,
  AttachmentInput,
  CreateMessageInput,
  CreateMessageOutput,
  DeleteMessageInput,
  DeleteMessageOutput,
  GetAllMessageReadersInput,
  GetAllMessageReadersOutput,
  GetChannelMessagesInput,
  GetChannelMessagesOutput,
  GetDirectMessagesInput,
  GetMenionUsersInput,
  GetMenionUsersOutput,
  GetMessageInput,
  GetMessageOutput,
  GetMessageUnreadCountInput,
  GetPinnedMessagesInput,
  GetPinnedMessagesOutput,
  GetThreadMessagesInput,
  MarkAllMentionsSeenInput,
  MarkAllMentionsSeenOutput,
  MarkMentionSeenInput,
  MarkMentionSeenOutput,
  MarkMessageAsReadInput,
  MarkMessagesAsReadInput,
  MarkMessagesAsReadOutput,
  MessageAttachmentOutput,
  MessageOutput,
  MessagesListOutput,
  MessageTypeSchema,
  MessageWithSenderSchema,
  PinMessageInput,
  PinMessageOutput,
  ReactionOutput,
  RemoveReactionInput,
  RemoveReactionOutput,
  SearchMessageOutput,
  SearchMessagesInput,
  SearchMessagesListOutput,
  SearchUsersInput,
  SearchUsersOutput,
  ThreadMessageOutput,
  UnPinMessageInput,
  UnPinMessageOutput,
  UnreadCountOutput,
  UpdateMessageInput,
  UpdateMessageOutput,
} from "./schemas/message";
import type { FeatureSchema, ModuleSchema, RoleSchema } from "./schemas/module";
import type {
  ConfigurableDeliveryChannelSchema,
  CreateAnnouncementNotificationInput,
  CreateBulkNotificationsInput,
  CreateChannelInviteNotificationInput,
  CreateNotificationInput,
  CreateSystemNotificationInput,
  DeleteNotificationInput,
  DismissNotificationInput,
  DismissNotificationOutput,
  GetChannelMuteStatusInput,
  GetChannelMuteStatusOutput,
  GetNotificationsInput,
  GetNotificationUnreadCountInput,
  GetPreferencesInput,
  GetPreferencesOutput,
  GetUnreadCountOutput,
  MarkAllNotificationsAsReadInput,
  MarkAllNotificationsAsReadOutput,
  MarkMultipleAsReadInput,
  MarkNotificationAsReadInput,
  MarkNotificationAsReadOutput,
  MuteEntityTypeSchema,
  NotificationActorSchema,
  NotificationEventTypeEnumSchema,
  NotificationOutput,
  NotificationPreferenceItemSchema,
  NotificationStatusSchema,
  NotificationsListOutput,
  NotificationTypeSchema,
  PreferenceChannelsSchema,
  PreferenceOverrideSchema,
  ToggleChannelMuteInput,
  ToggleChannelMuteOutput,
  UpdateBulkPreferencesInput,
  UpdateBulkPreferencesOutput,
  UpdatePreferenceInput,
  UpdatePreferenceOutput,
} from "./schemas/notification";
import type {
  GetOrgPresenceInput,
  GetOrgPresenceOutput,
  HeartbeatInput,
  HeartbeatOutput,
  ManualStatusSchema,
  PresenceDataSchema,
  PresenceStatusSchema,
  SetManualStatusInput,
  SetManualStatusOutput,
} from "./schemas/presence";
import type {
  RemovePushSubscriptionInput,
  SavePushSubscriptionInput,
} from "./schemas/push-subscription";
import type {
  BucketSchema,
  DeleteFileInput,
  DeleteFileOutput,
  DeleteFilesInput,
  DeleteFilesOutput,
  GetUploadUrlInput,
  GetUploadUrlOutput,
} from "./schemas/storage";
import type {
  AddMemberInput,
  AddMemberOutput,
  ListTeamsInput,
  ListTeamsOutput,
  RemoveMemberInput,
  RemoveMemberOutput,
} from "./schemas/team";
import type {
  EndBlockInput,
  EndBlockOutput,
  GetActiveBlockInput,
  GetActiveBlockOutput,
  ListBlocksInput,
  ListBlocksOutput,
  StartBlockInput,
  StartBlockOutput,
} from "./schemas/work-block";

export type AddBreakDurationInputType = z.infer<typeof AddBreakDurationInput>;
export type AddBreakDurationOutputType = z.infer<typeof AddBreakDurationOutput>;
export type AddMemberInputType = z.infer<typeof AddMemberInput>;
export type AddMemberOutputType = z.infer<typeof AddMemberOutput>;
export type AddReactionInputType = z.infer<typeof AddReactionInput>;
export type AddReactionOutputType = z.infer<typeof AddReactionOutput>;
export type AdminRoleType = z.infer<typeof AdminRoleSchema>;
export type ArchiveChannelInputType = z.infer<typeof ArchiveChannelInput>;
export type AttachmentInputType = z.infer<typeof AttachmentInput>;
export type AttachmentOutputType = z.infer<typeof AttachmentOutput>;
export type AttachmentTypeType = z.infer<typeof AttachmentTypeSchema>;
export type AttachmentWithChannelOutputType = z.infer<
  typeof AttachmentWithChannelOutput
>;
export type AttachmentWithMessageOutputType = z.infer<
  typeof AttachmentWithMessageOutput
>;
export type AttachmentsListOutputType = z.infer<typeof AttachmentsListOutput>;
export type AttachmentsWithChannelListOutputType = z.infer<
  typeof AttachmentsWithChannelListOutput
>;
export type AttachmentsWithMessageListOutputType = z.infer<
  typeof AttachmentsWithMessageListOutput
>;
export type AttendanceAnalyticsInputType = z.infer<
  typeof AttendanceAnalyticsInput
>;
export type AttendanceAnalyticsOutputType = z.infer<
  typeof AttendanceAnalyticsOutput
>;
export type AttendanceRecordWithUserType = z.infer<
  typeof AttendanceRecordWithUserSchema
>;
export type AttendanceSelectType = z.infer<typeof AttendanceSelectSchema>;
export type BucketType = z.infer<typeof BucketSchema>;
export type ChannelFileOutputType = z.infer<typeof ChannelFileOutput>;
export type ChannelFilesListOutputType = z.infer<typeof ChannelFilesListOutput>;
export type ChannelMemberOutputType = z.infer<typeof ChannelMemberOutput>;
export type ChannelMembersListOutputType = z.infer<
  typeof ChannelMembersListOutput
>;
export type ChannelOutputType = z.infer<typeof ChannelOutput>;
export type ChannelWithCreatorOutputType = z.infer<
  typeof ChannelWithCreatorOutput
>;
export type ChannelWithStatsOutputType = z.infer<typeof ChannelWithStatsOutput>;
export type ChannelsListOutputType = z.infer<typeof ChannelsListOutput>;
export type ConfigurableDeliveryChannelType = z.infer<
  typeof ConfigurableDeliveryChannelSchema
>;
export type CreateAnnouncementNotificationInputType = z.infer<
  typeof CreateAnnouncementNotificationInput
>;
export type CreateAttachmentInputType = z.infer<typeof CreateAttachmentInput>;
export type CreateBulkAttachmentsInputType = z.infer<
  typeof CreateBulkAttachmentsInput
>;
export type CreateBulkNotificationsInputType = z.infer<
  typeof CreateBulkNotificationsInput
>;
export type CreateChannelInputType = z.infer<typeof CreateChannelInput>;
export type CreateChannelInviteNotificationInputType = z.infer<
  typeof CreateChannelInviteNotificationInput
>;
export type CreateChannelOutputType = z.infer<typeof CreateChannelOutput>;
export type CreateDmConversationInputType = z.infer<
  typeof CreateDmConversationInput
>;
export type CreateMessageInputType = z.infer<typeof CreateMessageInput>;
export type CreateMessageOutputType = z.infer<typeof CreateMessageOutput>;
export type CreateNotificationInputType = z.infer<
  typeof CreateNotificationInput
>;
export type CreateSystemNotificationInputType = z.infer<
  typeof CreateSystemNotificationInput
>;
export type DeleteAttachmentInputType = z.infer<typeof DeleteAttachmentInput>;
export type DeleteAttachmentOutputType = z.infer<typeof DeleteAttachmentOutput>;
export type DeleteChannelInputType = z.infer<typeof DeleteChannelInput>;
export type DeleteDmMessageInputType = z.infer<typeof DeleteDmMessageInput>;
export type DeleteFileInputType = z.infer<typeof DeleteFileInput>;
export type DeleteFileOutputType = z.infer<typeof DeleteFileOutput>;
export type DeleteFilesInputType = z.infer<typeof DeleteFilesInput>;
export type DeleteFilesOutputType = z.infer<typeof DeleteFilesOutput>;
export type DeleteMessageInputType = z.infer<typeof DeleteMessageInput>;
export type DeleteMessageOutputType = z.infer<typeof DeleteMessageOutput>;
export type DeleteNotificationInputType = z.infer<
  typeof DeleteNotificationInput
>;
export type DeletechannelOutputType = z.infer<typeof DeletechannelOutput>;
export type DismissNotificationInputType = z.infer<
  typeof DismissNotificationInput
>;
export type DismissNotificationOutputType = z.infer<
  typeof DismissNotificationOutput
>;
export type DmAttachmentInputType = z.infer<typeof DmAttachmentInput>;
export type EditDmMessageInputType = z.infer<typeof EditDmMessageInput>;
export type EndBlockInputType = z.infer<typeof EndBlockInput>;
export type EndBlockOutputType = z.infer<typeof EndBlockOutput>;
export type FeatureType = z.infer<typeof FeatureSchema>;
export type GetActiveBlockInputType = z.infer<typeof GetActiveBlockInput>;
export type GetActiveBlockOutputType = z.infer<typeof GetActiveBlockOutput>;
export type GetAllMessageReadersInputType = z.infer<
  typeof GetAllMessageReadersInput
>;
export type GetAllMessageReadersOutputType = z.infer<
  typeof GetAllMessageReadersOutput
>;
export type GetAttachmentInputType = z.infer<typeof GetAttachmentInput>;
export type GetAttendanceDetailInputType = z.infer<
  typeof GetAttendanceDetailInput
>;
export type GetAttendanceDetailOutputType = z.infer<
  typeof GetAttendanceDetailOutput
>;
export type GetAttendanceStatsInputType = z.infer<
  typeof GetAttendanceStatsInput
>;
export type GetAttendanceStatsOutputType = z.infer<
  typeof GetAttendanceStatsOutput
>;
export type GetChannelAttachmentsInputType = z.infer<
  typeof GetChannelAttachmentsInput
>;
export type GetChannelInputType = z.infer<typeof GetChannelInput>;
export type GetChannelMessagesInputType = z.infer<
  typeof GetChannelMessagesInput
>;
export type GetChannelMessagesOutputType = z.infer<
  typeof GetChannelMessagesOutput
>;
export type GetChannelMuteStatusInputType = z.infer<
  typeof GetChannelMuteStatusInput
>;
export type GetChannelMuteStatusOutputType = z.infer<
  typeof GetChannelMuteStatusOutput
>;
export type GetChannelOutputType = z.infer<typeof GetChannelOutput>;
export type GetChannelUnreadCountsInputType = z.infer<
  typeof GetChannelUnreadCountsInput
>;
export type GetChannelUnreadCountsOutputType = z.infer<
  typeof GetChannelUnreadCountsOutput
>;
export type GetChannelsInputType = z.infer<typeof GetChannelsInput>;
export type GetDirectMessagesInputType = z.infer<typeof GetDirectMessagesInput>;
export type GetDmConversationInputType = z.infer<typeof GetDmConversationInput>;
export type GetDmConversationsInputType = z.infer<
  typeof GetDmConversationsInput
>;
export type GetDmMessagesInputType = z.infer<typeof GetDmMessagesInput>;
export type GetMenionUsersInputType = z.infer<typeof GetMenionUsersInput>;
export type GetMenionUsersOutputType = z.infer<typeof GetMenionUsersOutput>;
export type GetMessageAttachmentsInputType = z.infer<
  typeof GetMessageAttachmentsInput
>;
export type GetMessageInputType = z.infer<typeof GetMessageInput>;
export type GetMessageOutputType = z.infer<typeof GetMessageOutput>;
export type GetMessageUnreadCountInputType = z.infer<
  typeof GetMessageUnreadCountInput
>;
export type GetMultipleMessageAttachmentsInputType = z.infer<
  typeof GetMultipleMessageAttachmentsInput
>;
export type GetNotificationUnreadCountInputType = z.infer<
  typeof GetNotificationUnreadCountInput
>;
export type GetNotificationsInputType = z.infer<typeof GetNotificationsInput>;
export type GetOrgPresenceInputType = z.infer<typeof GetOrgPresenceInput>;
export type GetOrgPresenceOutputType = z.infer<typeof GetOrgPresenceOutput>;
export type GetPinnedMessagesInputType = z.infer<typeof GetPinnedMessagesInput>;
export type GetPinnedMessagesOutputType = z.infer<
  typeof GetPinnedMessagesOutput
>;
export type GetPreferencesInputType = z.infer<typeof GetPreferencesInput>;
export type GetPreferencesOutputType = z.infer<typeof GetPreferencesOutput>;
export type GetRecentAttachmentsInputType = z.infer<
  typeof GetRecentAttachmentsInput
>;
export type GetStorageStatsInputType = z.infer<typeof GetStorageStatsInput>;
export type GetThreadMessagesInputType = z.infer<typeof GetThreadMessagesInput>;
export type GetTodayInputType = z.infer<typeof GetTodayInput>;
export type GetTodayOutputType = z.infer<typeof GetTodayOutput>;
export type GetUnreadCountOutputType = z.infer<typeof GetUnreadCountOutput>;
export type GetUpdateAttachmentUploadUrlInputType = z.infer<
  typeof GetUpdateAttachmentUploadUrlInput
>;
export type GetUpdateAttachmentUploadUrlOutputType = z.infer<
  typeof GetUpdateAttachmentUploadUrlOutput
>;
export type GetUploadUrlInputType = z.infer<typeof GetUploadUrlInput>;
export type GetUploadUrlOutputType = z.infer<typeof GetUploadUrlOutput>;
export type GetUserAttachmentsInputType = z.infer<
  typeof GetUserAttachmentsInput
>;
export type HeartbeatInputType = z.infer<typeof HeartbeatInput>;
export type HeartbeatOutputType = z.infer<typeof HeartbeatOutput>;
export type InvitationSelectType = z.infer<typeof InvitationSelectSchema>;
export type IsChannelMemberInputType = z.infer<typeof IsChannelMemberInput>;
export type IsChannelMemberOutputType = z.infer<typeof IsChannelMemberOutput>;
export type JoinChannelInputType = z.infer<typeof JoinChannelInput>;
export type LeaveChannelInputType = z.infer<typeof LeaveChannelInput>;
export type ListAttendanceRecordsInputType = z.infer<
  typeof ListAttendanceRecordsInput
>;
export type ListAttendanceRecordsOutputType = z.infer<
  typeof ListAttendanceRecordsOutput
>;
export type ListBlocksInputType = z.infer<typeof ListBlocksInput>;
export type ListBlocksOutputType = z.infer<typeof ListBlocksOutput>;
export type ListChannelFilesInputType = z.infer<typeof ListChannelFilesInput>;
export type ListChannelMembersInputType = z.infer<
  typeof ListChannelMembersInput
>;
export type ListChannelMembersOutputType = z.infer<
  typeof ListChannelMembersOutput
>;
export type ListChannelsInputType = z.infer<typeof ListChannelsInput>;
export type ListChannelsOutputType = z.infer<typeof ListChannelsOutput>;
export type ListInvitationsInputType = z.infer<typeof ListInvitationsInput>;
export type ListInvitationsOutputType = z.infer<typeof ListInvitationsOutput>;
export type ListMembersInputType = z.infer<typeof ListMembersInput>;
export type ListMembersOutputType = z.infer<typeof ListMembersOutput>;
export type ListTeamsInputType = z.infer<typeof ListTeamsInput>;
export type ListTeamsOutputType = z.infer<typeof ListTeamsOutput>;
export type ManualStatusType = z.infer<typeof ManualStatusSchema>;
export type MarkAllMentionsSeenInputType = z.infer<
  typeof MarkAllMentionsSeenInput
>;
export type MarkAllMentionsSeenOutputType = z.infer<
  typeof MarkAllMentionsSeenOutput
>;
export type MarkAllNotificationsAsReadInputType = z.infer<
  typeof MarkAllNotificationsAsReadInput
>;
export type MarkAllNotificationsAsReadOutputType = z.infer<
  typeof MarkAllNotificationsAsReadOutput
>;
export type MarkDmReadInputType = z.infer<typeof MarkDmReadInput>;
export type MarkMentionSeenInputType = z.infer<typeof MarkMentionSeenInput>;
export type MarkMentionSeenOutputType = z.infer<typeof MarkMentionSeenOutput>;
export type MarkMessageAsReadInputType = z.infer<typeof MarkMessageAsReadInput>;
export type MarkMessagesAsReadInputType = z.infer<
  typeof MarkMessagesAsReadInput
>;
export type MarkMessagesAsReadOutputType = z.infer<
  typeof MarkMessagesAsReadOutput
>;
export type MarkMultipleAsReadInputType = z.infer<
  typeof MarkMultipleAsReadInput
>;
export type MarkNotificationAsReadInputType = z.infer<
  typeof MarkNotificationAsReadInput
>;
export type MarkNotificationAsReadOutputType = z.infer<
  typeof MarkNotificationAsReadOutput
>;
export type MemberAttendanceStatusOutputType = z.infer<
  typeof MemberAttendanceStatusOutput
>;
export type MemberPunchInInputType = z.infer<typeof MemberPunchInInput>;
export type MemberPunchInOutputType = z.infer<typeof MemberPunchInOutput>;
export type MemberPunchOutInputType = z.infer<typeof MemberPunchOutInput>;
export type MemberPunchOutOutputType = z.infer<typeof MemberPunchOutOutput>;
export type MemberSelectType = z.infer<typeof MemberSelectSchema>;
export type MemberWithUserType = z.infer<typeof MemberWithUserSchema>;
export type MessageAttachmentOutputType = z.infer<
  typeof MessageAttachmentOutput
>;
export type MessageOutputType = z.infer<typeof MessageOutput>;
export type MessageTypeType = z.infer<typeof MessageTypeSchema>;
export type MessageWithSenderType = z.infer<typeof MessageWithSenderSchema>;
export type MessagesListOutputType = z.infer<typeof MessagesListOutput>;
export type ModifyChannelMembersInputType = z.infer<
  typeof ModifyChannelMembersInput
>;
export type ModuleType = z.infer<typeof ModuleSchema>;
export type MuteDmConversationInputType = z.infer<
  typeof MuteDmConversationInput
>;
export type MuteEntityTypeType = z.infer<typeof MuteEntityTypeSchema>;
export type NotificationActorType = z.infer<typeof NotificationActorSchema>;
export type NotificationEventTypeEnumType = z.infer<
  typeof NotificationEventTypeEnumSchema
>;
export type NotificationOutputType = z.infer<typeof NotificationOutput>;
export type NotificationPreferenceItemType = z.infer<
  typeof NotificationPreferenceItemSchema
>;
export type NotificationStatusType = z.infer<typeof NotificationStatusSchema>;
export type NotificationTypeType = z.infer<typeof NotificationTypeSchema>;
export type NotificationsListOutputType = z.infer<
  typeof NotificationsListOutput
>;
export type PinMessageInputType = z.infer<typeof PinMessageInput>;
export type PinMessageOutputType = z.infer<typeof PinMessageOutput>;
export type PreferenceChannelsType = z.infer<typeof PreferenceChannelsSchema>;
export type PreferenceOverrideType = z.infer<typeof PreferenceOverrideSchema>;
export type PresenceDataType = z.infer<typeof PresenceDataSchema>;
export type PresenceStatusType = z.infer<typeof PresenceStatusSchema>;
export type ReactionOutputType = z.infer<typeof ReactionOutput>;
export type RecentAttachmentOutputType = z.infer<typeof RecentAttachmentOutput>;
export type RecentAttachmentsListOutputType = z.infer<
  typeof RecentAttachmentsListOutput
>;
export type RemoveChannelMemberInputType = z.infer<
  typeof RemoveChannelMemberInput
>;
export type RemoveMemberInputType = z.infer<typeof RemoveMemberInput>;
export type RemoveMemberOutputType = z.infer<typeof RemoveMemberOutput>;
export type RemovePushSubscriptionInputType = z.infer<
  typeof RemovePushSubscriptionInput
>;
export type RemoveReactionInputType = z.infer<typeof RemoveReactionInput>;
export type RemoveReactionOutputType = z.infer<typeof RemoveReactionOutput>;
export type RoleType = z.infer<typeof RoleSchema>;
export type SavePushSubscriptionInputType = z.infer<
  typeof SavePushSubscriptionInput
>;
export type SearchAttachmentsInputType = z.infer<typeof SearchAttachmentsInput>;
export type SearchDmMessagesInputType = z.infer<typeof SearchDmMessagesInput>;
export type SearchDmMessagesOutputType = z.infer<typeof SearchDmMessagesOutput>;
export type SearchMessageOutputType = z.infer<typeof SearchMessageOutput>;
export type SearchMessagesInputType = z.infer<typeof SearchMessagesInput>;
export type SearchMessagesListOutputType = z.infer<
  typeof SearchMessagesListOutput
>;
export type SearchUsersInputType = z.infer<typeof SearchUsersInput>;
export type SearchUsersOutputType = z.infer<typeof SearchUsersOutput>;
export type SendDmMessageInputType = z.infer<typeof SendDmMessageInput>;
export type SetManualStatusInputType = z.infer<typeof SetManualStatusInput>;
export type SetManualStatusOutputType = z.infer<typeof SetManualStatusOutput>;
export type StartBlockInputType = z.infer<typeof StartBlockInput>;
export type StartBlockOutputType = z.infer<typeof StartBlockOutput>;
export type StorageStatsOutputType = z.infer<typeof StorageStatsOutput>;
export type SuccessOutputType = z.infer<typeof SuccessOutput>;
export type ThreadMessageOutputType = z.infer<typeof ThreadMessageOutput>;
export type ToggleChannelMuteInputType = z.infer<typeof ToggleChannelMuteInput>;
export type ToggleChannelMuteOutputType = z.infer<
  typeof ToggleChannelMuteOutput
>;
export type ToggleDmPinInputType = z.infer<typeof ToggleDmPinInput>;
export type ToggleDmReactionInputType = z.infer<typeof ToggleDmReactionInput>;
export type UnPinMessageInputType = z.infer<typeof UnPinMessageInput>;
export type UnPinMessageOutputType = z.infer<typeof UnPinMessageOutput>;
export type UnmuteDmConversationInputType = z.infer<
  typeof UnmuteDmConversationInput
>;
export type UnreadCountOutputType = z.infer<typeof UnreadCountOutput>;
export type UpdateAttachmentInputType = z.infer<typeof UpdateAttachmentInput>;
export type UpdateAttachmentOutputType = z.infer<typeof UpdateAttachmentOutput>;
export type UpdateBulkPreferencesInputType = z.infer<
  typeof UpdateBulkPreferencesInput
>;
export type UpdateBulkPreferencesOutputType = z.infer<
  typeof UpdateBulkPreferencesOutput
>;
export type UpdateChannelInputType = z.infer<typeof UpdateChannelInput>;
export type UpdateChannelMemberInputType = z.infer<
  typeof UpdateChannelMemberInput
>;
export type UpdateMessageInputType = z.infer<typeof UpdateMessageInput>;
export type UpdateMessageOutputType = z.infer<typeof UpdateMessageOutput>;
export type UpdatePreferenceInputType = z.infer<typeof UpdatePreferenceInput>;
export type UpdatePreferenceOutputType = z.infer<typeof UpdatePreferenceOutput>;
export type UserSelectType = z.infer<typeof UserSelectSchema>;
