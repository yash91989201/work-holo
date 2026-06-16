import type { db as Db } from "@work-holo/db";
import { organization, user } from "@work-holo/db/schema/auth";
import {
  notificationPreferenceTable,
  pendingEmailDigestTable,
} from "@work-holo/db/schema/notification";
import {
  DmNotificationEmail,
  MentionNotificationEmail,
  ReactionNotificationEmail,
  ReplyNotificationEmail,
  type SendEmailOptions,
  sendEmail,
} from "@work-holo/email";
import type { NotificationQueueMessage } from "@work-holo/infrastructure";
import { and, eq, isNull } from "drizzle-orm";
import { log } from "evlog";
import type { Transporter } from "nodemailer";
import { createElement } from "react";

const TAG = "notification:email";

type EmailDigestInterval = "immediate" | "15min" | "hourly" | "daily";

type TemplateType = "mention" | "reply" | "reaction" | "dm";

const EVENT_TYPE_TEMPLATE_MAP: Record<string, TemplateType> = {
  channel_mention: "mention",
  channel_reply: "reply",
  dm_reply: "reply",
  channel_reaction: "reaction",
  dm_reaction: "reaction",
  dm_message: "dm",
  channel_message: "dm",
};

interface EmailDeliveryParams {
  db: typeof Db;
  fromAddress: string;
  message: NotificationQueueMessage;
  transport: Transporter;
}

const DIGEST_INTERVAL_OFFSETS: Record<string, number> = {
  "15min": 15 * 60 * 1000,
  hourly: 60 * 60 * 1000,
};

async function getEmailDigestInterval(
  db: typeof Db,
  userId: string,
  orgId: string,
  eventType: string
): Promise<EmailDigestInterval> {
  const [preference] = await db
    .select({
      emailDigestInterval: notificationPreferenceTable.emailDigestInterval,
    })
    .from(notificationPreferenceTable)
    .where(
      and(
        eq(notificationPreferenceTable.userId, userId),
        eq(notificationPreferenceTable.orgId, orgId),
        eq(
          notificationPreferenceTable.eventType,
          eventType as "channel_message"
        ),
        eq(notificationPreferenceTable.deliveryChannel, "email"),
        isNull(notificationPreferenceTable.entityType),
        isNull(notificationPreferenceTable.entityId)
      )
    )
    .limit(1);

  return (
    (preference?.emailDigestInterval as EmailDigestInterval) ?? "immediate"
  );
}

async function getUserEmailInfo(
  db: typeof Db,
  userId: string
): Promise<{ email: string; name: string } | null> {
  const [result] = await db
    .select({ email: user.email, name: user.name })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (!result?.email) {
    return null;
  }

  return { email: result.email, name: result.name };
}

function computeScheduledAt(interval: EmailDigestInterval): Date {
  const now = new Date();
  const offset = DIGEST_INTERVAL_OFFSETS[interval];

  if (offset) {
    return new Date(now.getTime() + offset);
  }

  if (interval === "daily") {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    return tomorrow;
  }

  return now;
}

function buildMentionEmail(
  metadata: Record<string, string>,
  recipientName: string,
  recipientEmail: string,
  fromAddress: string
): SendEmailOptions {
  return {
    to: recipientEmail,
    from: fromAddress,
    subject: `${metadata.mentionedByName ?? "Someone"} mentioned you in #${metadata.channelName ?? "a channel"}`,
    react: createElement(MentionNotificationEmail, {
      recipientName,
      mentionedBy: metadata.mentionedByName ?? "Someone",
      channelName: metadata.channelName ?? "unknown",
      messagePreview: metadata.messagePreview ?? "",
      messageUrl: metadata.messageUrl ?? "#",
    }),
  };
}

function buildReplyEmail(
  metadata: Record<string, string>,
  recipientName: string,
  recipientEmail: string,
  fromAddress: string
): SendEmailOptions {
  return {
    to: recipientEmail,
    from: fromAddress,
    subject: `${metadata.replySenderName ?? "Someone"} replied to your message`,
    react: createElement(ReplyNotificationEmail, {
      recipientName,
      repliedBy: metadata.replySenderName ?? "Someone",
      channelName: metadata.channelName ?? "DM",
      originalMessagePreview: metadata.originalMessagePreview ?? "",
      replyPreview: metadata.messagePreview ?? "",
      threadUrl: metadata.threadUrl ?? "#",
    }),
  };
}

function buildReactionEmail(
  metadata: Record<string, string>,
  recipientName: string,
  recipientEmail: string,
  fromAddress: string
): SendEmailOptions {
  return {
    to: recipientEmail,
    from: fromAddress,
    subject: `${metadata.reactorName ?? "Someone"} reacted to your message`,
    react: createElement(ReactionNotificationEmail, {
      recipientName,
      reactedBy: metadata.reactorName ?? "Someone",
      emoji: metadata.emoji ?? "👍",
      channelName: metadata.channelName ?? "DM",
      messagePreview: metadata.messagePreview ?? "",
      messageUrl: metadata.messageUrl ?? "#",
    }),
  };
}

function buildDmEmail(
  metadata: Record<string, string>,
  recipientName: string,
  recipientEmail: string,
  fromAddress: string
): SendEmailOptions {
  return {
    to: recipientEmail,
    from: fromAddress,
    subject: `New message from ${metadata.senderName ?? "Someone"}`,
    react: createElement(DmNotificationEmail, {
      recipientName,
      senderName: metadata.senderName ?? "Someone",
      messagePreview: metadata.messagePreview ?? "",
      conversationUrl: metadata.conversationUrl ?? "#",
    }),
  };
}

const TEMPLATE_BUILDERS: Record<
  TemplateType,
  (
    metadata: Record<string, string>,
    recipientName: string,
    recipientEmail: string,
    fromAddress: string
  ) => SendEmailOptions
> = {
  mention: buildMentionEmail,
  reply: buildReplyEmail,
  reaction: buildReactionEmail,
  dm: buildDmEmail,
};

function buildImmediateEmailOptions(
  message: NotificationQueueMessage,
  metadata: Record<string, string>,
  recipientName: string,
  recipientEmail: string,
  fromAddress: string
): SendEmailOptions | null {
  const templateType = EVENT_TYPE_TEMPLATE_MAP[message.eventType];
  if (!templateType) {
    return null;
  }

  const builder = TEMPLATE_BUILDERS[templateType];
  return builder(metadata, recipientName, recipientEmail, fromAddress);
}

async function getOrgSlug(
  db: typeof Db,
  orgId: string
): Promise<string | null> {
  const [org] = await db
    .select({ slug: organization.slug })
    .from(organization)
    .where(eq(organization.id, orgId))
    .limit(1);

  return org?.slug ?? null;
}

function getConversationUrl(
  orgSlug: string | null,
  conversationId: string | null
): string {
  if (!(orgSlug && conversationId)) {
    return "#";
  }

  return `/org/${orgSlug}/workspace/communication/dm/${conversationId}`;
}

function getChannelMessageUrl(
  orgSlug: string | null,
  channelId: string | null
): string {
  if (!(orgSlug && channelId)) {
    return "#";
  }

  return `/org/${orgSlug}/workspace/communication/channels/${channelId}`;
}

function buildTemplateMetadata(
  message: NotificationQueueMessage,
  orgSlug: string | null
): Record<string, string> {
  const metadata = message.metadata as Record<string, string | undefined>;
  const channelId = metadata.channelId ?? null;
  const conversationId = metadata.conversationId ?? null;
  const channelUrl = getChannelMessageUrl(orgSlug, channelId);
  const conversationUrl = getConversationUrl(orgSlug, conversationId);
  const messageUrl = channelId === null ? conversationUrl : channelUrl;
  let threadUrl = "#";

  if (channelId !== null) {
    threadUrl = channelUrl;
  } else if (conversationId !== null) {
    threadUrl = conversationUrl;
  }

  return {
    ...metadata,
    messageUrl,
    threadUrl,
    conversationUrl,
    originalMessagePreview:
      metadata.originalMessagePreview ?? metadata.messagePreview ?? "",
  } as Record<string, string>;
}

export async function handleEmailDelivery(
  params: EmailDeliveryParams
): Promise<void> {
  const { db, fromAddress, message, transport } = params;

  const userInfo = await getUserEmailInfo(db, message.targetUserId);
  if (!userInfo) {
    log.info(
      TAG,
      `User ${message.targetUserId} has no email address, skipping`
    );
    return;
  }

  const interval = await getEmailDigestInterval(
    db,
    message.targetUserId,
    message.orgId,
    message.eventType
  );

  if (interval === "immediate") {
    const orgSlug = await getOrgSlug(db, message.orgId);
    const templateMetadata = buildTemplateMetadata(message, orgSlug);

    const emailOptions = buildImmediateEmailOptions(
      message,
      templateMetadata,
      userInfo.name,
      userInfo.email,
      fromAddress
    );

    if (!emailOptions) {
      log.warn(
        TAG,
        `No template mapping for event type "${message.eventType}"`
      );
      return;
    }

    await sendEmail(transport, emailOptions);
    log.info(
      TAG,
      `Immediate email sent for notification ${message.notificationId} to ${userInfo.email}`
    );
    return;
  }

  const scheduledAt = computeScheduledAt(interval);

  await db.insert(pendingEmailDigestTable).values({
    userId: message.targetUserId,
    orgId: message.orgId,
    notificationId: message.notificationId,
    scheduledAt,
    sent: false,
  });

  log.info(
    TAG,
    `Batched email for notification ${message.notificationId} (interval: ${interval}, scheduled: ${scheduledAt.toISOString()})`
  );
}
