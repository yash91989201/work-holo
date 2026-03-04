import type { db as Db } from "@work-holo/db";
import { organization } from "@work-holo/db/schema/auth";
import { pushSubscriptionTable, user } from "@work-holo/db/schema/index";
import { eq } from "drizzle-orm";
import webpush from "web-push";

interface HandlePushDeliveryParams {
  actorId: string;
  db: typeof Db;
  eventType: string;
  metadata: Record<string, unknown>;
  notificationId: string;
  orgId: string;
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

export async function handlePushDelivery(
  params: HandlePushDeliveryParams
): Promise<void> {
  const { notificationId, targetUserId, eventType, metadata, db, orgId } =
    params;

  const subscriptions = await db
    .select()
    .from(pushSubscriptionTable)
    .where(eq(pushSubscriptionTable.userId, targetUserId));

  if (subscriptions.length === 0) {
    console.log(
      `[Push Handler] No push subscriptions for user ${targetUserId}, skipping`
    );
    return;
  }

  const actorName = await getActorName(params);
  const orgSlug = await getOrgSlug(db, orgId);
  const actionText = getActionText(eventType);
  const messagePreview = (metadata.messagePreview as string | undefined) ?? "";
  const entityId =
    (metadata.channelId as string | undefined) ??
    (metadata.conversationId as string | undefined) ??
    "";

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
    tag: `notification-${eventType}-${entityId}`,
    data: {
      url: buildDeepLinkUrl(metadata, orgSlug),
      notificationId,
      type: eventType,
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
          console.log(
            `[Push Handler] Removing stale subscription ${sub.id} (status: ${error.statusCode})`
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
    console.error(
      `[Push Handler] Push delivery for notification ${notificationId}: ${succeeded} succeeded, ${failed} failed`
    );
    for (const result of results) {
      if (result.status === "rejected") {
        console.error("[Push Handler] Push error:", result.reason);
      }
    }
  } else {
    console.log(
      `[Push Handler] Push delivered to ${succeeded} device(s) for notification ${notificationId}`
    );
  }
}
