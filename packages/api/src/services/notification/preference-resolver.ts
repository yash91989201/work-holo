import type { db as Db } from "@work-holo/db";
import { channelMemberTable } from "@work-holo/db/schema/channel";
import { dmConversationMuteTable } from "@work-holo/db/schema/direct-message";
import { notificationPreferenceTable } from "@work-holo/db/schema/notification";
import { and, eq, isNull } from "drizzle-orm";
import type { EmailDigestInterval } from "./defaults";
import {
  DEFAULT_EMAIL_DIGEST_INTERVAL,
  DEFAULT_NOTIFICATION_PREFERENCES,
} from "./defaults";
import type { NotificationEventType } from "./types";

const CONFIGURABLE_CHANNELS = ["sound", "push", "email"] as const;
type ConfigurableDeliveryChannel = (typeof CONFIGURABLE_CHANNELS)[number];

function isConfigurableDeliveryChannel(
  value: string
): value is ConfigurableDeliveryChannel {
  return CONFIGURABLE_CHANNELS.some((channel) => channel === value);
}

export async function resolveDeliveryChannels(params: {
  userId: string;
  orgId: string;
  eventType: NotificationEventType;
  entityType: string | null;
  entityId: string | null;
  db: typeof Db;
}): Promise<ConfigurableDeliveryChannel[]> {
  const { userId, orgId, eventType, entityType, entityId, db } = params;

  const preferences = await db
    .select({
      deliveryChannel: notificationPreferenceTable.deliveryChannel,
      enabled: notificationPreferenceTable.enabled,
      entityType: notificationPreferenceTable.entityType,
      entityId: notificationPreferenceTable.entityId,
    })
    .from(notificationPreferenceTable)
    .where(
      and(
        eq(notificationPreferenceTable.userId, userId),
        eq(notificationPreferenceTable.orgId, orgId),
        eq(notificationPreferenceTable.eventType, eventType)
      )
    );

  const entityOverrides = new Map<ConfigurableDeliveryChannel, boolean>();
  const globalOverrides = new Map<ConfigurableDeliveryChannel, boolean>();

  for (const pref of preferences) {
    if (!isConfigurableDeliveryChannel(pref.deliveryChannel)) {
      continue;
    }

    const deliveryChannel = pref.deliveryChannel;

    const isEntityMatch =
      entityType !== null &&
      entityId !== null &&
      pref.entityType === entityType &&
      pref.entityId === entityId;

    const isGlobalOverride = pref.entityType === null && pref.entityId === null;

    if (isEntityMatch) {
      entityOverrides.set(deliveryChannel, pref.enabled);
    } else if (isGlobalOverride) {
      globalOverrides.set(deliveryChannel, pref.enabled);
    }
  }

  const staticDefaults = DEFAULT_NOTIFICATION_PREFERENCES[eventType];
  const enabledChannels: ConfigurableDeliveryChannel[] = [];

  for (const channel of CONFIGURABLE_CHANNELS) {
    const enabled =
      entityOverrides.get(channel) ??
      globalOverrides.get(channel) ??
      staticDefaults[channel];

    if (enabled) {
      enabledChannels.push(channel);
    }
  }

  return enabledChannels;
}

export async function isMuted(params: {
  userId: string;
  entityType: string;
  entityId: string;
  db: typeof Db;
}): Promise<boolean> {
  const { userId, entityType, entityId, db } = params;

  if (entityType === "channel") {
    const [member] = await db
      .select({ isMuted: channelMemberTable.isMuted })
      .from(channelMemberTable)
      .where(
        and(
          eq(channelMemberTable.channelId, entityId),
          eq(channelMemberTable.userId, userId)
        )
      );

    return member?.isMuted ?? false;
  }

  if (entityType === "dm_conversation") {
    const [mute] = await db
      .select({ id: dmConversationMuteTable.id })
      .from(dmConversationMuteTable)
      .where(
        and(
          eq(dmConversationMuteTable.conversationId, entityId),
          eq(dmConversationMuteTable.userId, userId)
        )
      );

    return mute !== undefined;
  }

  return false;
}

export async function getEmailDigestInterval(params: {
  userId: string;
  orgId: string;
  db: typeof Db;
}): Promise<EmailDigestInterval> {
  const { userId, orgId, db } = params;

  const [preference] = await db
    .select({
      emailDigestInterval: notificationPreferenceTable.emailDigestInterval,
    })
    .from(notificationPreferenceTable)
    .where(
      and(
        eq(notificationPreferenceTable.userId, userId),
        eq(notificationPreferenceTable.orgId, orgId),
        eq(notificationPreferenceTable.deliveryChannel, "email"),
        isNull(notificationPreferenceTable.entityType),
        isNull(notificationPreferenceTable.entityId)
      )
    )
    .limit(1);

  if (preference?.emailDigestInterval) {
    return preference.emailDigestInterval as EmailDigestInterval;
  }

  return DEFAULT_EMAIL_DIGEST_INTERVAL;
}
