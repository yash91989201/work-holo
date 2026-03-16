import { z } from "zod";

// Base notification types
export const NotificationTypeSchema = z.enum([
  "channel_message",
  "channel_reply",
  "channel_direct_reply",
  "channel_reaction",
  "channel_mention",
  "dm_message",
  "dm_reply",
  "dm_direct_reply",
  "dm_reaction",
]);

export const NotificationStatusSchema = z.enum(["unread", "read", "dismissed"]);

// Input schemas
export const GetNotificationsInput = z.object({
  limit: z.number().min(1).max(100).default(50),
  cursor: z.string().optional(),
  status: NotificationStatusSchema.optional(),
  orgId: z.string().optional(),
});

export const GetNotificationUnreadCountInput = z.object({
  orgId: z.string().optional(),
});

export const MarkNotificationAsReadInput = z.object({
  notificationId: z.string().min(1),
});

export const MarkNotificationAsReadOutput = z.object({
  txid: z.number(),
  success: z.literal(true),
});

export const MarkAllNotificationsAsReadInput = z.object({
  orgId: z.string().optional(),
});

export const MarkAllNotificationsAsReadOutput = z.object({
  txid: z.number(),
});

export const MarkMultipleAsReadInput = z.object({
  notificationIds: z.array(z.string().min(1)).min(1).max(100),
});

export const DismissNotificationInput = z.object({
  notificationId: z.string().min(1),
});

export const DismissNotificationOutput = z.object({
  txid: z.number(),
  success: z.literal(true),
});

export const DeleteNotificationInput = z.object({
  notificationId: z.string().min(1),
});

export const CreateNotificationInput = z.object({
  userId: z.string().min(1),
  type: NotificationTypeSchema,
  title: z.string().min(1).max(255),
  message: z.string().max(1000).optional(),
  entityId: z.string().optional(),
  entityType: z.string().optional(),
  actionUrl: z.url().optional(),
});

export const CreateBulkNotificationsInput = z.object({
  notifications: z.array(CreateNotificationInput).min(1).max(100),
});

export const CreateChannelInviteNotificationInput = z.object({
  channelId: z.string().min(1),
  invitedUserId: z.string().min(1),
});

export const CreateSystemNotificationInput = z.object({
  userIds: z.array(z.string().min(1)).min(1).max(1000),
  title: z.string().min(1).max(255),
  message: z.string().max(1000).optional(),
  actionUrl: z.url().optional(),
});

export const CreateAnnouncementNotificationInput = z.object({
  title: z.string().min(1).max(255),
  message: z.string().min(1).max(1000),
  actionUrl: z.url().optional(),
});

// Actor schema for notification responses
export const NotificationActorSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullable(),
});

// Output schemas
export const NotificationOutput = z.object({
  id: z.string(),
  type: NotificationTypeSchema,
  status: NotificationStatusSchema,
  title: z.string(),
  message: z.string().nullable(),
  entityId: z.string().nullable(),
  entityType: z.string().nullable(),
  actionUrl: z.string().nullable(),
  orgId: z.string().nullable(),
  actor: NotificationActorSchema.nullable(),
  readAt: z.date().nullable(),
  dismissedAt: z.date().nullable(),
  createdAt: z.date(),
});

export const NotificationsListOutput = z.object({
  notifications: z.array(NotificationOutput),
  nextCursor: z.string().optional(),
  hasMore: z.boolean(),
});

export const GetUnreadCountOutput = z.object({
  count: z.number(),
});

export const NotificationEventTypeEnumSchema = z.enum([
  "channel_message",
  "channel_reply",
  "channel_direct_reply",
  "channel_reaction",
  "channel_mention",
  "dm_message",
  "dm_reply",
  "dm_direct_reply",
  "dm_reaction",
]);

/** in_app is always enabled and not user-configurable */
export const ConfigurableDeliveryChannelSchema = z.enum([
  "sound",
  "push",
  "email",
]);

export const NotificationPreferenceItemSchema = z.object({
  eventType: NotificationEventTypeEnumSchema,
  deliveryChannel: ConfigurableDeliveryChannelSchema,
  enabled: z.boolean(),
  entityType: z.string().nullish(),
  entityId: z.string().nullish(),
  emailDigestInterval: z.string().nullish(),
});

export const GetPreferencesInput = z.object({});

export const PreferenceChannelsSchema = z.object({
  sound: z.boolean(),
  push: z.boolean(),
  email: z.boolean(),
});

export const PreferenceOverrideSchema = z.object({
  eventType: NotificationEventTypeEnumSchema,
  deliveryChannel: ConfigurableDeliveryChannelSchema,
  enabled: z.boolean(),
  entityType: z.string().nullable(),
  entityId: z.string().nullable(),
  emailDigestInterval: z.string().nullable(),
});

export const GetPreferencesOutput = z.object({
  global: z.record(NotificationEventTypeEnumSchema, PreferenceChannelsSchema),
  overrides: z.array(PreferenceOverrideSchema),
});

export const UpdatePreferenceInput = z.object({
  eventType: NotificationEventTypeEnumSchema,
  deliveryChannel: ConfigurableDeliveryChannelSchema,
  enabled: z.boolean(),
  entityType: z.string().nullish(),
  entityId: z.string().nullish(),
  emailDigestInterval: z.string().nullish(),
});

export const UpdatePreferenceOutput = z.object({
  success: z.literal(true),
});

export const UpdateBulkPreferencesInput = z.object({
  preferences: z.array(NotificationPreferenceItemSchema).min(1).max(100),
});

export const UpdateBulkPreferencesOutput = z.object({
  success: z.literal(true),
  updated: z.number(),
});

export const MuteEntityTypeSchema = z.enum(["channel", "dm_conversation"]);

export const GetChannelMuteStatusInput = z.object({
  entityType: MuteEntityTypeSchema,
  entityId: z.string().min(1),
});

export const GetChannelMuteStatusOutput = z.object({
  muted: z.boolean(),
});

export const ToggleChannelMuteInput = z.object({
  entityType: MuteEntityTypeSchema,
  entityId: z.string().min(1),
  muted: z.boolean(),
});

export const ToggleChannelMuteOutput = z.object({
  success: z.literal(true),
  muted: z.boolean(),
});
