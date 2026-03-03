import { beforeEach, describe, expect, mock, test } from "bun:test";
import type { NotificationDomainEvent } from "../types";

const sendToQueueMock = mock(() => true);
const getQueueClientMock = mock(() => ({
  sendToQueue: sendToQueueMock,
}));

mock.module("@work-holo/infrastructure", () => ({
  PusherClient: {
    getClient: mock(() => ({ trigger: mock(async () => true) })),
  },
  QUEUES: {
    NOTIFICATIONS: "notifications",
  },
  Queue: {
    getClient: getQueueClientMock,
  },
}));

import { notificationTable } from "@work-holo/db/schema/index";
import { Queue } from "@work-holo/infrastructure";
import { NotificationService } from "../notification.service";

function createInsertDbMock(notificationId: string | null) {
  const returning = mock(async () =>
    notificationId ? [{ id: notificationId }] : ([] as Array<{ id: string }>)
  );
  const values = mock(() => ({ returning }));
  const insert = mock(() => ({ values }));

  return {
    db: { insert },
    insert,
    returning,
    values,
  };
}

function createEvent(overrides: Partial<NotificationDomainEvent> = {}) {
  return {
    actorId: "actor-1",
    entityId: "entity-1",
    entityType: "message",
    metadata: {
      channelId: "channel-1",
      channelName: "general",
      messagePreview: "hello",
      senderId: "actor-1",
      senderName: "Alice",
    },
    orgId: "org-1",
    targetUserId: "user-2",
    type: "channel_message",
    ...overrides,
  } as NotificationDomainEvent;
}

describe("NotificationService.emit", () => {
  beforeEach(() => {
    sendToQueueMock.mockClear();
    getQueueClientMock.mockClear();
  });

  test("inserts notification row and publishes queue message", async () => {
    const { db, insert, values, returning } = createInsertDbMock("notif-1");
    const queueClient = Queue.getClient();
    const service = new NotificationService({
      db: db as never,
      orgId: "org-1",
      queueClient,
      userId: "viewer-1",
    });

    await service.emit(createEvent());

    expect(insert).toHaveBeenCalledWith(notificationTable);
    expect(values).toHaveBeenCalledTimes(1);
    expect(returning).toHaveBeenCalledTimes(1);
    expect(sendToQueueMock).toHaveBeenCalledTimes(1);
    expect(sendToQueueMock).toHaveBeenCalledWith(
      "notifications",
      expect.any(Uint8Array),
      expect.objectContaining({
        persistent: true,
        timestamp: expect.any(Number),
      })
    );
  });

  test("skips self-notifications when actor matches service user", async () => {
    const { db, insert } = createInsertDbMock("notif-1");
    const service = new NotificationService({
      db: db as never,
      orgId: "org-1",
      queueClient: Queue.getClient(),
      userId: "actor-1",
    });

    await service.emit(createEvent({ actorId: "actor-1" }));

    expect(insert).not.toHaveBeenCalled();
    expect(sendToQueueMock).not.toHaveBeenCalled();
  });

  test("deduplicates duplicate events within 30-second window", async () => {
    const { db } = createInsertDbMock("notif-1");
    const service = new NotificationService({
      db: db as never,
      orgId: "org-1",
      queueClient: Queue.getClient(),
      userId: "viewer-1",
    });

    const originalNow = Date.now;

    try {
      Date.now = mock(() => 1000);

      await service.emit(createEvent());
      await service.emit(createEvent());

      expect(sendToQueueMock).toHaveBeenCalledTimes(1);

      Date.now = mock(() => 31_500);
      await service.emit(createEvent());

      expect(sendToQueueMock).toHaveBeenCalledTimes(2);
    } finally {
      Date.now = originalNow;
    }
  });
});
