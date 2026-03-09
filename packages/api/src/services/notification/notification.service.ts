import type { db as Db } from "@work-holo/db";
import { organization } from "@work-holo/db/schema/auth";
import { notificationTable } from "@work-holo/db/schema/index";
import {
  type NotificationQueueMessage,
  QUEUES,
  Queue,
} from "@work-holo/infrastructure";
import { eq } from "drizzle-orm";
import { isMuted, resolveDeliveryChannels } from "./preference-resolver";
import type {
  NotificationDomainEvent,
  NotificationServiceInterface,
} from "./types";

type NotificationServiceConstructor = {
  userId: string;
  db: typeof Db;
};

export class NotificationService implements NotificationServiceInterface {
  readonly userId: string;
  readonly db: typeof Db;

  private getMetadataString(
    metadata: Record<string, unknown>,
    key: string
  ): string | null {
    const value = metadata[key];

    if (typeof value !== "string") {
      return null;
    }

    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return null;
    }

    return trimmed;
  }

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

  private async getOrgSlug(orgId: string): Promise<string | null> {
    const [org] = await this.db
      .select({ slug: organization.slug })
      .from(organization)
      .where(eq(organization.id, orgId))
      .limit(1);

    return org?.slug ?? null;
  }

  private buildTitle(
    eventType: NotificationDomainEvent["type"],
    metadata: Record<string, unknown>
  ): string {
    const actorName =
      this.getMetadataString(metadata, "senderName") ??
      this.getMetadataString(metadata, "replySenderName") ??
      this.getMetadataString(metadata, "reactorName") ??
      this.getMetadataString(metadata, "mentionedByName") ??
      "Someone";

    const channelName =
      this.getMetadataString(metadata, "channelName") ?? "a channel";

    switch (eventType) {
      case "channel_message":
        return `${actorName} sent a message in #${channelName}`;
      case "channel_reply":
        return `${actorName} replied in #${channelName}`;
      case "channel_reaction":
        return `${actorName} reacted in #${channelName}`;
      case "channel_mention":
        return `${actorName} mentioned you in #${channelName}`;
      case "channel_direct_reply":
        return `${actorName} replied to your message in #${channelName}`;
      case "dm_message":
        return `New message from ${actorName}`;
      case "dm_reply":
        return `${actorName} replied to your message`;
      case "dm_direct_reply":
        return `${actorName} replied to your message`;
      case "dm_reaction":
        return `${actorName} reacted to your message`;
      default:
        return "Notification";
    }
  }

  private buildActionUrl(
    metadata: Record<string, unknown>,
    orgSlug: string | null
  ): string | null {
    const channelId = this.getMetadataString(metadata, "channelId");
    if (channelId) {
      return orgSlug
        ? `/org/${orgSlug}/workspace/communication/channels/${channelId}`
        : `/channels/${channelId}`;
    }

    const conversationId = this.getMetadataString(metadata, "conversationId");
    if (conversationId) {
      return orgSlug
        ? `/org/${orgSlug}/workspace/communication/dm/${conversationId}`
        : `/dm/${conversationId}`;
    }

    return null;
  }

  private async buildPersistedNotification(
    event: NotificationDomainEvent,
    metadata: Record<string, unknown>
  ): Promise<{
    title: string;
    message: string | null;
    actionUrl: string | null;
  }> {
    const orgSlug = await this.getOrgSlug(event.orgId);

    return {
      title: this.buildTitle(event.type, metadata),
      message: this.getMetadataString(metadata, "messagePreview"),
      actionUrl: this.buildActionUrl(metadata, orgSlug),
    };
  }

  constructor({ userId, db }: NotificationServiceConstructor) {
    this.userId = userId;
    this.db = db;
  }

  async emit(event: NotificationDomainEvent): Promise<void> {
    if (event.targetUserId === this.userId) {
      return;
    }

    const normalizedMetadata = this.normalizeMetadata(event.metadata);
    const preferenceScope = this.getPreferenceScopeEntity(normalizedMetadata);
    const persistedNotification = await this.buildPersistedNotification(
      event,
      normalizedMetadata
    );

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
        title: persistedNotification.title,
        message: persistedNotification.message,
        actionUrl: persistedNotification.actionUrl,
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
