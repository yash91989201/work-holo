/**
 * Notification event types for domain events
 * Supports channel and direct message notifications with various event types
 */

/**
 * Event type discriminator for notifications
 * Supports 9 notification event types:
 * - channel_message: New message in a channel
 * - channel_reply: Reply to a thread in channel
 * - channel_direct_reply: Inline reply to a specific message in a channel
 * - channel_reaction: Reaction added to a channel message
 * - channel_mention: User mentioned in a channel
 * - dm_message: Direct message sent
 * - dm_reply: Reply to a thread in DM
 * - dm_direct_reply: Inline reply to a specific message in a DM
 * - dm_reaction: Reaction added to a DM message
 */
export type NotificationEventType =
  | "channel_message"
  | "channel_reply"
  | "channel_direct_reply"
  | "channel_reaction"
  | "channel_mention"
  | "dm_message"
  | "dm_reply"
  | "dm_direct_reply"
  | "dm_reaction";

/**
 * Delivery channel for notifications
 * Determines how the notification is delivered to the user
 */
export type NotificationDeliveryChannel = "in_app" | "sound" | "push" | "email";

/**
 * Base notification event with common fields
 * Used as the discriminated union base
 */
interface NotificationEventBase {
  actorId: string; // User who triggered the event
  entityId: string; // ID of the message, reaction, etc.
  entityType: "message" | "reaction" | "mention"; // Type of entity
  metadata: Record<string, unknown>; // Event-specific metadata
  orgId: string; // Organization context
  targetUserId: string; // User who should receive the notification
  type: NotificationEventType;
}

/**
 * Channel message event
 * Triggered when a new message is posted in a channel
 * Metadata: { channelId, channelName, messagePreview, senderId, senderName }
 */
interface ChannelMessageEvent extends NotificationEventBase {
  metadata: {
    channelId: string;
    channelName: string;
    messagePreview: string;
    senderId: string;
    senderName: string;
  };
  type: "channel_message";
}

/**
 * Channel reply event
 * Triggered when a message receives a reply in a thread
 * Metadata: { channelId, channelName, threadId, messagePreview, replySenderId, replySenderName }
 */
interface ChannelReplyEvent extends NotificationEventBase {
  metadata: {
    channelId: string;
    channelName: string;
    threadId: string;
    messagePreview: string;
    replySenderId: string;
    replySenderName: string;
  };
  type: "channel_reply";
}

/**
 * Channel reaction event
 * Triggered when someone reacts to a message in a channel
 * Metadata: { channelId, channelName, messagePreview, reactorId, reactorName, emoji }
 */
interface ChannelReactionEvent extends NotificationEventBase {
  metadata: {
    channelId: string;
    channelName: string;
    messagePreview: string;
    reactorId: string;
    reactorName: string;
    emoji: string;
  };
  type: "channel_reaction";
}

/**
 * Channel mention event
 * Triggered when a user is mentioned in a channel
 * Metadata: { channelId, channelName, messagePreview, mentionedById, mentionedByName }
 */
interface ChannelMentionEvent extends NotificationEventBase {
  metadata: {
    channelId: string;
    channelName: string;
    messagePreview: string;
    mentionedById: string;
    mentionedByName: string;
  };
  type: "channel_mention";
}

/**
 * Direct message event
 * Triggered when a direct message is sent
 * Metadata: { conversationId, messagePreview, senderId, senderName }
 */
interface DMMessageEvent extends NotificationEventBase {
  metadata: {
    conversationId: string;
    messagePreview: string;
    senderId: string;
    senderName: string;
  };
  type: "dm_message";
}

/**
 * Direct message reply event
 * Triggered when a message receives a reply in a DM thread
 * Metadata: { conversationId, threadId, messagePreview, replySenderId, replySenderName }
 */
interface DMReplyEvent extends NotificationEventBase {
  metadata: {
    conversationId: string;
    threadId: string;
    messagePreview: string;
    replySenderId: string;
    replySenderName: string;
  };
  type: "dm_reply";
}

/**
 * Direct message reaction event
 * Triggered when someone reacts to a message in DM
 * Metadata: { conversationId, messagePreview, reactorId, reactorName, emoji }
 */
interface DMReactionEvent extends NotificationEventBase {
  metadata: {
    conversationId: string;
    messagePreview: string;
    reactorId: string;
    reactorName: string;
    emoji: string;
  };
  type: "dm_reaction";
}

/**
 * Channel direct reply event
 * Triggered when someone replies inline to a specific message in a channel
 * Metadata: { channelId, channelName, messagePreview, replySenderId, replySenderName, originalMessageId }
 */
interface ChannelDirectReplyEvent extends NotificationEventBase {
  metadata: {
    channelId: string;
    channelName: string;
    messagePreview: string;
    replySenderId: string;
    replySenderName: string;
    originalMessageId: string;
  };
  type: "channel_direct_reply";
}

/**
 * DM direct reply event
 * Triggered when someone replies inline to a specific message in a DM conversation
 * Metadata: { conversationId, messagePreview, replySenderId, replySenderName, originalMessageId }
 */
interface DMDirectReplyEvent extends NotificationEventBase {
  metadata: {
    conversationId: string;
    messagePreview: string;
    replySenderId: string;
    replySenderName: string;
    originalMessageId: string;
  };
  type: "dm_direct_reply";
}

/**
 * Discriminated union of all notification domain events
 * Type narrowing is based on the 'type' field
 *
 * @example
 * ```typescript
 * const handleEvent = (event: NotificationDomainEvent) => {
 *   switch (event.type) {
 *     case 'channel_message':
 *       // event is ChannelMessageEvent
 *       console.log(event.metadata.channelName);
 *       break;
 *     case 'dm_message':
 *       // event is DMMessageEvent
 *       console.log(event.metadata.conversationId);
 *       break;
 *   }
 * };
 * ```
 */
export type NotificationDomainEvent =
  | ChannelMessageEvent
  | ChannelReplyEvent
  | ChannelDirectReplyEvent
  | ChannelReactionEvent
  | ChannelMentionEvent
  | DMMessageEvent
  | DMReplyEvent
  | DMDirectReplyEvent
  | DMReactionEvent;

/**
 * Service interface for emitting notification domain events
 * Implementations should handle routing to appropriate delivery channels
 */
export interface NotificationServiceInterface {
  /**
   * Emit a notification event
   * The event will be processed and routed to appropriate delivery channels
   *
   * @param event The notification domain event to emit
   * @returns Promise that resolves when the event has been processed
   */
  emit(event: NotificationDomainEvent): Promise<void>;
}
