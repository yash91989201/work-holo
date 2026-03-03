import { PusherClient } from "@work-holo/infrastructure";

interface PusherDeliveryParams {
  actorId: string;
  eventType: string;
  metadata: Record<string, unknown>;
  notificationId: string;
  targetUserId: string;
}

export async function handlePusherDelivery(
  params: PusherDeliveryParams
): Promise<void> {
  const { actorId, eventType, metadata, notificationId, targetUserId } = params;

  const channel = `private-user-${targetUserId}`;

  const payload = {
    actorId,
    actorName: (metadata.actorName as string) ?? "Unknown",
    channelName: (metadata.channelName as string) ?? null,
    entityId: (metadata.entityId as string) ?? null,
    entityType: (metadata.entityType as string) ?? null,
    eventType,
    messagePreview: (metadata.messagePreview as string) ?? null,
    notificationId,
    timestamp: new Date().toISOString(),
  };

  try {
    await PusherClient.getClient().trigger(
      channel,
      "notification:new",
      payload
    );

    console.log(
      `[Notification Worker] Pusher event sent on ${channel} for notification ${notificationId}`
    );
  } catch (error) {
    console.error(
      `[Notification Worker] Failed to send Pusher event for notification ${notificationId}:`,
      error
    );
    throw error;
  }
}
