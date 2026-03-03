import type { db as Db } from "@work-holo/db";
import { notificationTable } from "@work-holo/db/schema/index";
import {
  type NotificationQueueMessage,
  QUEUES,
  type Queue,
} from "@work-holo/infrastructure";
import type {
  NotificationDomainEvent,
  NotificationServiceInterface,
} from "./types";

type NotificationServiceConstructor = {
  userId: string;
  db: typeof Db;
  orgId: string;
  queueClient: ReturnType<typeof Queue.getClient>;
};

export class NotificationService implements NotificationServiceInterface {
  readonly userId: string;
  readonly orgId: string;
  readonly db: typeof Db;

  private readonly queueClient: ReturnType<typeof Queue.getClient>;

  constructor({
    userId,
    db,
    orgId,
    queueClient,
  }: NotificationServiceConstructor) {
    this.userId = userId;
    this.db = db;
    this.orgId = orgId;
    this.queueClient = queueClient;
  }

  async emit(event: NotificationDomainEvent): Promise<void> {
    if (event.actorId === this.userId) {
      return;
    }

    const [notification] = await this.db
      .insert(notificationTable)
      .values({
        userId: event.targetUserId,
        type: event.type,
        actorId: event.actorId,
        orgId: event.orgId,
        entityId: event.entityId,
        entityType: event.entityType,
        metadata: event.metadata,
        status: "unread",
        title: "Notification",
      })
      .returning({ id: notificationTable.id });

    if (!notification) {
      return;
    }

    const deliveryChannels = ["sound", "push", "email"];

    const payload: NotificationQueueMessage = {
      notificationId: notification.id,
      targetUserId: event.targetUserId,
      actorId: event.actorId,
      orgId: event.orgId,
      eventType: event.type,
      entityId: event.entityId,
      entityType: event.entityType,
      metadata: event.metadata,
      deliveryChannels,
    };

    this.queueClient.sendToQueue(
      QUEUES.NOTIFICATIONS,
      Buffer.from(JSON.stringify(payload)),
      {
        persistent: true,
        timestamp: Date.now(),
      }
    );
  }

  async emitBulk(events: NotificationDomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.emit(event);
    }
  }
}
