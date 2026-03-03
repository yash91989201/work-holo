import type { db as Db } from "@work-holo/db";
import { notificationTable } from "@work-holo/db/schema/index";
import {
  type NotificationQueueMessage,
  QUEUES,
  type Queue,
} from "@work-holo/infrastructure";
import { resolveDeliveryChannels } from "./preference-resolver";
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

const DEDUP_WINDOW_MS = 30_000;

export class NotificationService implements NotificationServiceInterface {
  readonly userId: string;
  readonly orgId: string;
  readonly db: typeof Db;

  private readonly queueClient: ReturnType<typeof Queue.getClient>;
  private readonly recentlyEmitted = new Map<string, number>();

  private getDedupKey(event: NotificationDomainEvent): string {
    return `${event.targetUserId}:${event.type}:${event.entityId}`;
  }

  private isDuplicate(event: NotificationDomainEvent): boolean {
    const now = Date.now();

    for (const [key, timestamp] of this.recentlyEmitted) {
      if (now - timestamp > DEDUP_WINDOW_MS) {
        this.recentlyEmitted.delete(key);
      }
    }

    const dedupKey = this.getDedupKey(event);
    const lastEmittedAt = this.recentlyEmitted.get(dedupKey);

    if (lastEmittedAt && now - lastEmittedAt <= DEDUP_WINDOW_MS) {
      return true;
    }

    this.recentlyEmitted.set(dedupKey, now);
    return false;
  }

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
    if (event.targetUserId === this.userId) {
      return;
    }

    if (this.isDuplicate(event)) {
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

    const deliveryChannels = await resolveDeliveryChannels({
      userId: event.targetUserId,
      orgId: event.orgId,
      eventType: event.type,
      entityType: event.entityType,
      entityId: event.entityId,
      db: this.db,
    });

    if (deliveryChannels.length === 0) {
      return;
    }

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
