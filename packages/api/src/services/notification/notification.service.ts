import type { db as Db } from "@work-holo/db";
import { notificationTable } from "@work-holo/db/schema/index";
import {
  type NotificationQueueMessage,
  QUEUES,
  Queue,
} from "@work-holo/infrastructure";
import { isMuted, resolveDeliveryChannels } from "./preference-resolver";
import type {
  NotificationDomainEvent,
  NotificationServiceInterface,
} from "./types";

type NotificationServiceConstructor = {
  userId: string;
  db: typeof Db;
  orgId: string;
};

const DEDUP_WINDOW_MS = 30_000;

export class NotificationService implements NotificationServiceInterface {
  readonly userId: string;
  readonly orgId: string;
  readonly db: typeof Db;

  private readonly recentlyEmitted = new Map<string, number>();

  private normalizeMetadata(metadata: unknown): Record<string, unknown> {
    if (typeof metadata === "string") {
      try {
        const parsed = JSON.parse(metadata);
        if (parsed && typeof parsed === "object") {
          return parsed as Record<string, unknown>;
        }
      } catch {
        return {};
      }
      return {};
    }

    if (metadata && typeof metadata === "object") {
      return metadata as Record<string, unknown>;
    }

    return {};
  }

  private getPreferenceScopeEntity(metadata: Record<string, unknown>): {
    entityId: string | null;
    entityType: "channel" | "dm_conversation" | null;
  } {
    const metadataFields = metadata as {
      channelId?: unknown;
      conversationId?: unknown;
    };

    if (typeof metadataFields.channelId === "string") {
      return {
        entityType: "channel",
        entityId: metadataFields.channelId,
      };
    }

    if (typeof metadataFields.conversationId === "string") {
      return {
        entityType: "dm_conversation",
        entityId: metadataFields.conversationId,
      };
    }

    return {
      entityType: null,
      entityId: null,
    };
  }

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

  constructor({ userId, db, orgId }: NotificationServiceConstructor) {
    this.userId = userId;
    this.db = db;
    this.orgId = orgId;
  }

  async emit(event: NotificationDomainEvent): Promise<void> {
    if (event.targetUserId === this.userId) {
      return;
    }

    if (this.isDuplicate(event)) {
      return;
    }

    const normalizedMetadata = this.normalizeMetadata(event.metadata);
    const preferenceScope = this.getPreferenceScopeEntity(normalizedMetadata);

    if (preferenceScope.entityType && preferenceScope.entityId) {
      const muted = await isMuted({
        userId: event.targetUserId,
        entityType: preferenceScope.entityType,
        entityId: preferenceScope.entityId,
        db: this.db,
      });

      if (muted) {
        return;
      }
    }

    const configurableChannels = await resolveDeliveryChannels({
      userId: event.targetUserId,
      orgId: event.orgId,
      eventType: event.type,
      entityType: preferenceScope.entityType,
      entityId: preferenceScope.entityId,
      db: this.db,
    });

    if (configurableChannels.length === 0) {
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
        metadata: normalizedMetadata,
        status: "unread",
        title: "Notification",
      })
      .returning({ id: notificationTable.id });

    if (!notification) {
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
      metadata: normalizedMetadata,
      deliveryChannels: ["realtime", ...configurableChannels],
    };

    const published = Queue.publish("NOTIFICATIONS", payload);

    if (!published) {
      throw new Error(
        `Failed to publish notification ${notification.id} to ${QUEUES.NOTIFICATIONS}`
      );
    }
  }

  async emitBulk(events: NotificationDomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.emit(event);
    }
  }
}
