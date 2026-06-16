import { PusherClient } from "@work-holo/infrastructure";
import { log } from "evlog";

const TAG = "notification:pusher";

interface PusherDeliveryParams {
  actorId: string;
  entityId: string;
  entityType: string;
  eventType: string;
  metadata: Record<string, unknown>;
  notificationId: string;
  playSound: boolean;
  targetUserId: string;
}

function resolveActorName(metadata: Record<string, unknown>): string {
  const actorName =
    (metadata.senderName as string | undefined) ??
    (metadata.replySenderName as string | undefined) ??
    (metadata.reactorName as string | undefined) ??
    (metadata.mentionedByName as string | undefined);

  return actorName ?? "Someone";
}

export async function handlePusherDelivery(
  params: PusherDeliveryParams
): Promise<void> {
  const {
    actorId,
    entityId,
    entityType,
    eventType,
    metadata,
    notificationId,
    playSound,
    targetUserId,
  } = params;

  const channel = `private-user-${targetUserId}`;

  const payload = {
    actorId,
    actorName: resolveActorName(metadata),
    channelName: (metadata.channelName as string) ?? null,
    entityId,
    entityType,
    eventType,
    messagePreview: (metadata.messagePreview as string) ?? null,
    notificationId,
    playSound,
    timestamp: new Date().toISOString(),
  };

  try {
    await PusherClient.getClient().trigger(
      channel,
      "notification:new",
      payload
    );

    log.info(
      TAG,
      `Pusher event sent on ${channel} for notification ${notificationId}`
    );
  } catch (error) {
    log.error({
      tag: TAG,
      message: `Failed to send Pusher event for notification ${notificationId}`,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
