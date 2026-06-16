import type { db as Db } from "@work-holo/db";
import { organization } from "@work-holo/db/schema/auth";
import { pushSubscriptionTable, user } from "@work-holo/db/schema/index";
import { eq } from "drizzle-orm";
import { log } from "evlog";
import webpush from "web-push";

const TAG = "notification:push";

interface HandlePushDeliveryParams {
  actorId: string;
  db: typeof Db;
  eventType: string;
  metadata: Record<string, unknown>;
  notificationId: string;
  orgId: string;
  playSound: boolean;
  targetUserId: string;
}

async function getActorName(params: HandlePushDeliveryParams): Promise<string> {
  const { metadata, actorId, db } = params;

  const nameFromMeta =
    (metadata.senderName as string | undefined) ??
    (metadata.replySenderName as string | undefined) ??
    (metadata.reactorName as string | undefined) ??
    (metadata.mentionedByName as string | undefined);

  if (nameFromMeta) {
    return nameFromMeta;
  }

  const [actor] = await db
    .select({ name: user.name })
    .from(user)
    .where(eq(user.id, actorId))
    .limit(1);

  return actor?.name ?? "Someone";
}

function getActionText(eventType: string): string {
  switch (eventType) {
    case "channel_message":
      return "sent a message";
    case "channel_reply":
      return "replied to a thread";
    case "channel_reaction":
      return "reacted to your message";
    case "channel_mention":
      return "mentioned you";
    case "dm_message":
      return "sent you a message";
    case "dm_reply":
      return "replied to your message";
    case "dm_reaction":
      return "reacted to your message";
    default:
      return "sent a notification";
  }
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

function buildDeepLinkUrl(
  metadata: Record<string, unknown>,
  orgSlug: string | null
): string {
  const channelId = metadata.channelId as string | undefined;
  const conversationId = metadata.conversationId as string | undefined;

  if (channelId) {
    return orgSlug
      ? `/org/${orgSlug}/workspace/communication/channels/${channelId}`
      : `/channels/${channelId}`;
  }

  if (conversationId) {
    return orgSlug
      ? `/org/${orgSlug}/workspace/communication/dm/${conversationId}`
      : `/dm/${conversationId}`;
  }

  return "/";
}

function resolvePushEntity(
  metadata: Record<string, unknown>,
  eventType: string
): {
  entityId: string;
  entityType: "channel" | "dm_conversation" | "event_type";
} {
  const channelId = metadata.channelId;
  if (typeof channelId === "string") {
    return { entityType: "channel", entityId: channelId };
  }

  const conversationId = metadata.conversationId;
  if (typeof conversationId === "string") {
    return { entityType: "dm_conversation", entityId: conversationId };
  }

  return { entityType: "event_type", entityId: eventType };
}

export async function handlePushDelivery(
  params: HandlePushDeliveryParams
): Promise<void> {
  const {
    notificationId,
    targetUserId,
    eventType,
    metadata,
    db,
    orgId,
    playSound,
  } = params;

  const subscriptions = await db
    .select()
    .from(pushSubscriptionTable)
    .where(eq(pushSubscriptionTable.userId, targetUserId));

  if (subscriptions.length === 0) {
    log.info(TAG, `No push subscriptions for user ${targetUserId}, skipping`);
    return;
  }

  const actorName = await getActorName(params);
  const orgSlug = await getOrgSlug(db, orgId);
  const actionText = getActionText(eventType);
  const messagePreview = (metadata.messagePreview as string | undefined) ?? "";
  const pushEntity = resolvePushEntity(metadata, eventType);

  const title = `${actorName} ${actionText}`;
  const body =
    messagePreview.length > 100
      ? `${messagePreview.slice(0, 97)}...`
      : messagePreview;

  const pushPayload = JSON.stringify({
    title,
    body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    notificationId,
    eventType,
    entityType: pushEntity.entityType,
    entityId: pushEntity.entityId,
    actorName,
    messagePreview,
    playSound,
    tag: `notification-${eventType}-${pushEntity.entityId}`,
    data: {
      url: buildDeepLinkUrl(metadata, orgSlug),
      notificationId,
      type: eventType,
      entityType: pushEntity.entityType,
      entityId: pushEntity.entityId,
      playSound,
    },
  });

  const results = await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          pushPayload
        );
      } catch (error: unknown) {
        if (
          error &&
          typeof error === "object" &&
          "statusCode" in error &&
          (error.statusCode === 410 || error.statusCode === 404)
        ) {
          log.info(
            TAG,
            `Removing stale subscription ${sub.id} (status: ${error.statusCode})`
          );
          await db
            .delete(pushSubscriptionTable)
            .where(eq(pushSubscriptionTable.id, sub.id));
          return;
        }
        throw error;
      }
    })
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  if (failed > 0) {
    log.error({
      tag: TAG,
      message: `Push delivery for notification ${notificationId}: ${succeeded} succeeded, ${failed} failed`,
    });
    for (const result of results) {
      if (result.status === "rejected") {
        log.error({
          tag: TAG,
          message: "Push error",
          reason: result.reason,
        });
      }
    }
  } else {
    log.info(
      TAG,
      `Push delivered to ${succeeded} device(s) for notification ${notificationId}`
    );
  }
}
