/**
 * Default notification preferences and configuration
 * Provides sensible defaults for notification delivery channels across all event types
 */

import type {
  NotificationDeliveryChannel,
  NotificationEventType,
} from "./types";

/**
 * Email digest interval options
 * Controls how often email digests are sent to users
 */
export type EmailDigestInterval = "immediate" | "15min" | "hourly" | "daily";

/**
 * Default email digest interval for users
 */
export const DEFAULT_EMAIL_DIGEST_INTERVAL: EmailDigestInterval = "immediate";

/**
 * Preference settings for a single delivery channel
 */
export interface NotificationPreference {
  email: boolean;
  push: boolean;
  sound: boolean;
}

/**
 * Default notification preferences for all event types and delivery channels
 *
 * Channel messages are disabled by default across all channels.
 * DM messages are enabled by default for sound and push.
 * Thread replies and mentions are enabled for most channels.
 * Reactions are selectively enabled based on context.
 */
export const DEFAULT_NOTIFICATION_PREFERENCES: Record<
  NotificationEventType,
  NotificationPreference
> = {
  channel_message: {
    sound: false,
    push: false,
    email: false,
  },
  channel_reply: {
    sound: true,
    push: true,
    email: true,
  },
  channel_reaction: {
    sound: true,
    push: false,
    email: false,
  },
  channel_mention: {
    sound: true,
    push: true,
    email: true,
  },
  channel_direct_reply: {
    sound: true,
    push: true,
    email: true,
  },
  dm_message: {
    sound: true,
    push: true,
    email: true,
  },
  dm_reply: {
    sound: true,
    push: true,
    email: true,
  },
  dm_direct_reply: {
    sound: true,
    push: true,
    email: true,
  },
  dm_reaction: {
    sound: true,
    push: false,
    email: false,
  },
};

/**
 * Get the default preference for a specific event type
 *
 * @param eventType The notification event type
 * @returns The default preference settings for that event type
 *
 * @example
 * ```typescript
 * const pref = getDefaultPreference('channel_message');
 * console.log(pref.sound); // false
 * ```
 */
export function getDefaultPreference(
  eventType: NotificationEventType
): NotificationPreference {
  return DEFAULT_NOTIFICATION_PREFERENCES[eventType];
}

/**
 * Check if a delivery channel is enabled by default for a given event type
 *
 * @param eventType The notification event type
 * @param channel The delivery channel to check
 * @returns true if the channel is enabled by default, false otherwise
 *
 * @example
 * ```typescript
 * const isEnabled = isDeliveryEnabledByDefault('channel_message', 'sound');
 * console.log(isEnabled); // false
 *
 * const isDMEnabled = isDeliveryEnabledByDefault('dm_message', 'sound');
 * console.log(isDMEnabled); // true
 * ```
 */
export function isDeliveryEnabledByDefault(
  eventType: NotificationEventType,
  channel: NotificationDeliveryChannel
): boolean {
  const preference = DEFAULT_NOTIFICATION_PREFERENCES[eventType];

  // Only sound, push, and email are configurable
  if (channel === "in_app") {
    return true; // in_app is always enabled
  }

  if (channel === "sound") {
    return preference.sound;
  }

  if (channel === "push") {
    return preference.push;
  }

  if (channel === "email") {
    return preference.email;
  }

  return false;
}
