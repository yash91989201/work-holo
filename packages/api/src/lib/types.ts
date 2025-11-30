// AUTO-GENERATED FILE. DO NOT EDIT.
// Run `bun run generate:types` to refresh
import type { z } from "zod";

import type { AddReactionInput } from "@work-holo/api/lib/schemas/message";
import type { ArchiveChannelInput } from "@work-holo/api/lib/schemas/channel";
import type { AttachmentInput } from "@work-holo/api/lib/schemas/message";
import type { AttachmentOutput } from "@work-holo/api/lib/schemas/attachment";
import type { AttachmentTypeSchema } from "@work-holo/api/lib/schemas/attachment";
import type { AttachmentWithChannelOutput } from "@work-holo/api/lib/schemas/attachment";
import type { AttachmentWithMessageOutput } from "@work-holo/api/lib/schemas/attachment";
import type { AttachmentsListOutput } from "@work-holo/api/lib/schemas/attachment";
import type { AttachmentsWithChannelListOutput } from "@work-holo/api/lib/schemas/attachment";
import type { AttachmentsWithMessageListOutput } from "@work-holo/api/lib/schemas/attachment";
import type { ChannelJoinRequestInput } from "@work-holo/api/lib/schemas/channel";
import type { ChannelJoinRequestOutput } from "@work-holo/api/lib/schemas/channel";
import type { ChannelMemberOutput } from "@work-holo/api/lib/schemas/channel";
import type { ChannelMembersListOutput } from "@work-holo/api/lib/schemas/channel";
import type { ChannelOutput } from "@work-holo/api/lib/schemas/channel";
import type { ChannelWithCreatorOutput } from "@work-holo/api/lib/schemas/channel";
import type { ChannelWithStatsOutput } from "@work-holo/api/lib/schemas/channel";
import type { ChannelsListOutput } from "@work-holo/api/lib/schemas/channel";
import type { CreateAnnouncementNotificationInput } from "@work-holo/api/lib/schemas/notification";
import type { CreateAttachmentInput } from "@work-holo/api/lib/schemas/attachment";
import type { CreateBulkAttachmentsInput } from "@work-holo/api/lib/schemas/attachment";
import type { CreateBulkNotificationsInput } from "@work-holo/api/lib/schemas/notification";
import type { CreateChannelInput } from "@work-holo/api/lib/schemas/channel";
import type { CreateChannelInviteNotificationInput } from "@work-holo/api/lib/schemas/notification";
import type { CreateChannelOutput } from "@work-holo/api/lib/schemas/channel";
import type { CreateMessageInput } from "@work-holo/api/lib/schemas/message";
import type { CreateMessageOutput } from "@work-holo/api/lib/schemas/message";
import type { CreateNotificationInput } from "@work-holo/api/lib/schemas/notification";
import type { CreateSystemNotificationInput } from "@work-holo/api/lib/schemas/notification";
import type { DeleteAttachmentInput } from "@work-holo/api/lib/schemas/attachment";
import type { DeleteAttachmentOutput } from "@work-holo/api/lib/schemas/attachment";
import type { DeleteChannelInput } from "@work-holo/api/lib/schemas/channel";
import type { DeleteMessageInput } from "@work-holo/api/lib/schemas/message";
import type { DeleteNotificationInput } from "@work-holo/api/lib/schemas/notification";
import type { DeletechannelOutput } from "@work-holo/api/lib/schemas/channel";
import type { DismissNotificationInput } from "@work-holo/api/lib/schemas/notification";
import type { FeatureSchema } from "@work-holo/api/lib/schemas/module";
import type { GetAttachmentInput } from "@work-holo/api/lib/schemas/attachment";
import type { GetChannelAttachmentsInput } from "@work-holo/api/lib/schemas/attachment";
import type { GetChannelInput } from "@work-holo/api/lib/schemas/channel";
import type { GetChannelMessagesInput } from "@work-holo/api/lib/schemas/message";
import type { GetChannelMessagesOutput } from "@work-holo/api/lib/schemas/message";
import type { GetChannelOutput } from "@work-holo/api/lib/schemas/channel";
import type { GetChannelsInput } from "@work-holo/api/lib/schemas/channel";
import type { GetDirectMessagesInput } from "@work-holo/api/lib/schemas/message";
import type { GetMenionUsersInput } from "@work-holo/api/lib/schemas/message";
import type { GetMenionUsersOutput } from "@work-holo/api/lib/schemas/message";
import type { GetMessageAttachmentsInput } from "@work-holo/api/lib/schemas/attachment";
import type { GetMessageInput } from "@work-holo/api/lib/schemas/message";
import type { GetMessageOutput } from "@work-holo/api/lib/schemas/message";
import type { GetMultipleMessageAttachmentsInput } from "@work-holo/api/lib/schemas/attachment";
import type { GetNotificationsInput } from "@work-holo/api/lib/schemas/notification";
import type { GetPinnedMessagesInput } from "@work-holo/api/lib/schemas/message";
import type { GetPinnedMessagesOutput } from "@work-holo/api/lib/schemas/message";
import type { GetRecentAttachmentsInput } from "@work-holo/api/lib/schemas/attachment";
import type { GetStorageStatsInput } from "@work-holo/api/lib/schemas/attachment";
import type { GetThreadMessagesInput } from "@work-holo/api/lib/schemas/message";
import type { GetUnreadCountInput } from "@work-holo/api/lib/schemas/message";
import type { GetUserAttachmentsInput } from "@work-holo/api/lib/schemas/attachment";
import type { IsChannelMemberInput } from "@work-holo/api/lib/schemas/channel";
import type { IsChannelMemberOutput } from "@work-holo/api/lib/schemas/channel";
import type { JoinChannelInput } from "@work-holo/api/lib/schemas/channel";
import type { LeaveChannelInput } from "@work-holo/api/lib/schemas/channel";
import type { ListChannelMembersInput } from "@work-holo/api/lib/schemas/channel";
import type { ListChannelMembersOutput } from "@work-holo/api/lib/schemas/channel";
import type { ListChannelsInput } from "@work-holo/api/lib/schemas/channel";
import type { ListChannelsOutput } from "@work-holo/api/lib/schemas/channel";
import type { ListJoinRequestInput } from "@work-holo/api/lib/schemas/channel";
import type { ListJoinRequestOutput } from "@work-holo/api/lib/schemas/channel";
import type { ListTeamsInput } from "@work-holo/api/lib/schemas/team";
import type { ListTeamsOutput } from "@work-holo/api/lib/schemas/team";
import type { MarkMessageAsReadInput } from "@work-holo/api/lib/schemas/message";
import type { MarkMultipleAsReadInput } from "@work-holo/api/lib/schemas/notification";
import type { MarkNotificationAsReadInput } from "@work-holo/api/lib/schemas/notification";
import type { MemberAttendanceStatusOutput } from "@work-holo/api/lib/schemas/attendance";
import type { MemberPunchInInput } from "@work-holo/api/lib/schemas/attendance";
import type { MemberPunchInOutput } from "@work-holo/api/lib/schemas/attendance";
import type { MemberPunchOutInput } from "@work-holo/api/lib/schemas/attendance";
import type { MemberPunchOutOutput } from "@work-holo/api/lib/schemas/attendance";
import type { MessageAttachmentOutput } from "@work-holo/api/lib/schemas/message";
import type { MessageOutput } from "@work-holo/api/lib/schemas/message";
import type { MessageTypeSchema } from "@work-holo/api/lib/schemas/message";
import type { MessageWithSenderSchema } from "@work-holo/api/lib/schemas/message";
import type { MessagesListOutput } from "@work-holo/api/lib/schemas/message";
import type { ModifyChannelMembersInput } from "@work-holo/api/lib/schemas/channel";
import type { ModuleSchema } from "@work-holo/api/lib/schemas/module";
import type { NotificationOutput } from "@work-holo/api/lib/schemas/notification";
import type { NotificationStatusSchema } from "@work-holo/api/lib/schemas/notification";
import type { NotificationTypeSchema } from "@work-holo/api/lib/schemas/notification";
import type { NotificationsListOutput } from "@work-holo/api/lib/schemas/notification";
import type { PinMessageInput } from "@work-holo/api/lib/schemas/message";
import type { PinMessageOutput } from "@work-holo/api/lib/schemas/message";
import type { RecentAttachmentOutput } from "@work-holo/api/lib/schemas/attachment";
import type { RecentAttachmentsListOutput } from "@work-holo/api/lib/schemas/attachment";
import type { RemoveChannelMemberInput } from "@work-holo/api/lib/schemas/channel";
import type { RemoveReactionInput } from "@work-holo/api/lib/schemas/message";
import type { RoleSchema } from "@work-holo/api/lib/schemas/module";
import type { SearchAttachmentsInput } from "@work-holo/api/lib/schemas/attachment";
import type { SearchMessageOutput } from "@work-holo/api/lib/schemas/message";
import type { SearchMessagesInput } from "@work-holo/api/lib/schemas/message";
import type { SearchMessagesListOutput } from "@work-holo/api/lib/schemas/message";
import type { SearchUsersInput } from "@work-holo/api/lib/schemas/message";
import type { SearchUsersOutput } from "@work-holo/api/lib/schemas/message";
import type { StorageStatsOutput } from "@work-holo/api/lib/schemas/attachment";
import type { SuccessOutput } from "@work-holo/api/lib/schemas/channel";
import type { ThreadMessageOutput } from "@work-holo/api/lib/schemas/message";
import type { UnPinMessageInput } from "@work-holo/api/lib/schemas/message";
import type { UnPinMessageOutput } from "@work-holo/api/lib/schemas/message";
import type { UnreadCountOutput } from "@work-holo/api/lib/schemas/message";
import type { UpdateAttachmentInput } from "@work-holo/api/lib/schemas/attachment";
import type { UpdateChannelInput } from "@work-holo/api/lib/schemas/channel";
import type { UpdateChannelMemberInput } from "@work-holo/api/lib/schemas/channel";
import type { UpdateMessageInput } from "@work-holo/api/lib/schemas/message";
import type { UpdateMessageOutput } from "@work-holo/api/lib/schemas/message";

export type AddReactionInputType = z.infer<typeof AddReactionInput>;
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
export type ChannelJoinRequestInputType = z.infer<
  typeof ChannelJoinRequestInput
>;
export type ChannelJoinRequestOutputType = z.infer<
  typeof ChannelJoinRequestOutput
>;
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
export type DeleteMessageInputType = z.infer<typeof DeleteMessageInput>;
export type DeleteNotificationInputType = z.infer<
  typeof DeleteNotificationInput
>;
export type DeletechannelOutputType = z.infer<typeof DeletechannelOutput>;
export type DismissNotificationInputType = z.infer<
  typeof DismissNotificationInput
>;
export type FeatureType = z.infer<typeof FeatureSchema>;
export type GetAttachmentInputType = z.infer<typeof GetAttachmentInput>;
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
export type GetChannelOutputType = z.infer<typeof GetChannelOutput>;
export type GetChannelsInputType = z.infer<typeof GetChannelsInput>;
export type GetDirectMessagesInputType = z.infer<typeof GetDirectMessagesInput>;
export type GetMenionUsersInputType = z.infer<typeof GetMenionUsersInput>;
export type GetMenionUsersOutputType = z.infer<typeof GetMenionUsersOutput>;
export type GetMessageAttachmentsInputType = z.infer<
  typeof GetMessageAttachmentsInput
>;
export type GetMessageInputType = z.infer<typeof GetMessageInput>;
export type GetMessageOutputType = z.infer<typeof GetMessageOutput>;
export type GetMultipleMessageAttachmentsInputType = z.infer<
  typeof GetMultipleMessageAttachmentsInput
>;
export type GetNotificationsInputType = z.infer<typeof GetNotificationsInput>;
export type GetPinnedMessagesInputType = z.infer<typeof GetPinnedMessagesInput>;
export type GetPinnedMessagesOutputType = z.infer<
  typeof GetPinnedMessagesOutput
>;
export type GetRecentAttachmentsInputType = z.infer<
  typeof GetRecentAttachmentsInput
>;
export type GetStorageStatsInputType = z.infer<typeof GetStorageStatsInput>;
export type GetThreadMessagesInputType = z.infer<typeof GetThreadMessagesInput>;
export type GetUnreadCountInputType = z.infer<typeof GetUnreadCountInput>;
export type GetUserAttachmentsInputType = z.infer<
  typeof GetUserAttachmentsInput
>;
export type IsChannelMemberInputType = z.infer<typeof IsChannelMemberInput>;
export type IsChannelMemberOutputType = z.infer<typeof IsChannelMemberOutput>;
export type JoinChannelInputType = z.infer<typeof JoinChannelInput>;
export type LeaveChannelInputType = z.infer<typeof LeaveChannelInput>;
export type ListChannelMembersInputType = z.infer<
  typeof ListChannelMembersInput
>;
export type ListChannelMembersOutputType = z.infer<
  typeof ListChannelMembersOutput
>;
export type ListChannelsInputType = z.infer<typeof ListChannelsInput>;
export type ListChannelsOutputType = z.infer<typeof ListChannelsOutput>;
export type ListJoinRequestInputType = z.infer<typeof ListJoinRequestInput>;
export type ListJoinRequestOutputType = z.infer<typeof ListJoinRequestOutput>;
export type ListTeamsInputType = z.infer<typeof ListTeamsInput>;
export type ListTeamsOutputType = z.infer<typeof ListTeamsOutput>;
export type MarkMessageAsReadInputType = z.infer<typeof MarkMessageAsReadInput>;
export type MarkMultipleAsReadInputType = z.infer<
  typeof MarkMultipleAsReadInput
>;
export type MarkNotificationAsReadInputType = z.infer<
  typeof MarkNotificationAsReadInput
>;
export type MemberAttendanceStatusOutputType = z.infer<
  typeof MemberAttendanceStatusOutput
>;
export type MemberPunchInInputType = z.infer<typeof MemberPunchInInput>;
export type MemberPunchInOutputType = z.infer<typeof MemberPunchInOutput>;
export type MemberPunchOutInputType = z.infer<typeof MemberPunchOutInput>;
export type MemberPunchOutOutputType = z.infer<typeof MemberPunchOutOutput>;
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
export type NotificationOutputType = z.infer<typeof NotificationOutput>;
export type NotificationStatusType = z.infer<typeof NotificationStatusSchema>;
export type NotificationTypeType = z.infer<typeof NotificationTypeSchema>;
export type NotificationsListOutputType = z.infer<
  typeof NotificationsListOutput
>;
export type PinMessageInputType = z.infer<typeof PinMessageInput>;
export type PinMessageOutputType = z.infer<typeof PinMessageOutput>;
export type RecentAttachmentOutputType = z.infer<typeof RecentAttachmentOutput>;
export type RecentAttachmentsListOutputType = z.infer<
  typeof RecentAttachmentsListOutput
>;
export type RemoveChannelMemberInputType = z.infer<
  typeof RemoveChannelMemberInput
>;
export type RemoveReactionInputType = z.infer<typeof RemoveReactionInput>;
export type RoleType = z.infer<typeof RoleSchema>;
export type SearchAttachmentsInputType = z.infer<typeof SearchAttachmentsInput>;
export type SearchMessageOutputType = z.infer<typeof SearchMessageOutput>;
export type SearchMessagesInputType = z.infer<typeof SearchMessagesInput>;
export type SearchMessagesListOutputType = z.infer<
  typeof SearchMessagesListOutput
>;
export type SearchUsersInputType = z.infer<typeof SearchUsersInput>;
export type SearchUsersOutputType = z.infer<typeof SearchUsersOutput>;
export type StorageStatsOutputType = z.infer<typeof StorageStatsOutput>;
export type SuccessOutputType = z.infer<typeof SuccessOutput>;
export type ThreadMessageOutputType = z.infer<typeof ThreadMessageOutput>;
export type UnPinMessageInputType = z.infer<typeof UnPinMessageInput>;
export type UnPinMessageOutputType = z.infer<typeof UnPinMessageOutput>;
export type UnreadCountOutputType = z.infer<typeof UnreadCountOutput>;
export type UpdateAttachmentInputType = z.infer<typeof UpdateAttachmentInput>;
export type UpdateChannelInputType = z.infer<typeof UpdateChannelInput>;
export type UpdateChannelMemberInputType = z.infer<
  typeof UpdateChannelMemberInput
>;
export type UpdateMessageInputType = z.infer<typeof UpdateMessageInput>;
export type UpdateMessageOutputType = z.infer<typeof UpdateMessageOutput>;
