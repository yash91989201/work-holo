import { describe, expect, mock, test } from "bun:test";
import type { NotificationQueueMessage } from "@work-holo/infrastructure";

const sendNotificationMock = mock(async () => undefined);
const triggerMock = mock(async () => undefined);

mock.module("web-push", () => ({
  default: {
    sendNotification: sendNotificationMock,
  },
}));

mock.module("@work-holo/infrastructure", () => ({
  PusherClient: {
    getClient: () => ({ trigger: triggerMock }),
  },
}));

mock.module("@work-holo/email", () => ({
  DmNotificationEmail: () => null,
  MentionNotificationEmail: () => null,
  ReactionNotificationEmail: () => null,
  ReplyNotificationEmail: () => null,
  sendEmail: async (
    transport: { sendMail: (input: unknown) => Promise<void> },
    options: unknown
  ) => {
    await transport.sendMail(options);
  },
}));

import { handleEmailDelivery } from "../../lib/handlers/email";
import { handlePushDelivery } from "../../lib/handlers/push";
import { handlePusherDelivery } from "../../lib/handlers/pusher";

function createMessage(
  overrides: Partial<NotificationQueueMessage> = {}
): NotificationQueueMessage {
  return {
    actorId: "actor-1",
    deliveryChannels: ["push", "email"],
    entityId: "entity-1",
    entityType: "message",
    eventType: "channel_message",
    metadata: {
      channelId: "channel-1",
      channelName: "general",
      messagePreview: "hello world",
      senderName: "Alice",
    },
    notificationId: "notif-1",
    orgId: "org-1",
    targetUserId: "user-1",
    ...overrides,
  };
}

function createPushDbMock(subscriptions: Record<string, string>[]) {
  const where = mock(async () => subscriptions);
  const from = mock(() => ({ where }));
  const select = mock(() => ({ from }));

  return {
    db: { select },
    select,
    where,
  };
}

function createEmailDbMock(selectResults: Record<string, unknown>[][]) {
  const queue = [...selectResults];

  const where = mock(() => ({
    limit: mock(async () => queue.shift() ?? []),
  }));
  const from = mock(() => ({ where }));
  const select = mock(() => ({ from }));
  const values = mock(async () => undefined);
  const insert = mock(() => ({ values }));

  return {
    db: { insert, select },
    insert,
    values,
  };
}

describe("notification worker handlers", () => {
  test("push handler sends web push payload", async () => {
    sendNotificationMock.mockClear();
    const { db } = createPushDbMock([
      {
        auth: "auth-key",
        endpoint: "https://example.com/push",
        id: "sub-1",
        p256dh: "p256dh-key",
      },
    ]);

    await handlePushDelivery({
      actorId: "actor-1",
      db: db as never,
      eventType: "channel_message",
      metadata: {
        channelId: "channel-1",
        messagePreview: "Hello from test",
        senderName: "Alice",
      },
      notificationId: "notif-1",
      targetUserId: "user-1",
    });

    expect(sendNotificationMock).toHaveBeenCalledTimes(1);
  });

  test("email handler triggers nodemailer transport sendMail", async () => {
    const sendMail = mock(async () => undefined);
    const transport = { sendMail };
    const { db } = createEmailDbMock([
      [{ email: "target@example.com", name: "Target User" }],
      [{ emailDigestInterval: "immediate" }],
    ]);

    await handleEmailDelivery({
      db: db as never,
      fromAddress: "noreply@example.com",
      message: createMessage(),
      transport: transport as never,
    });

    expect(sendMail).toHaveBeenCalledTimes(1);
  });

  test("pusher handler triggers realtime event", async () => {
    triggerMock.mockClear();

    await handlePusherDelivery({
      actorId: "actor-1",
      eventType: "channel_message",
      metadata: {
        actorName: "Alice",
        messagePreview: "Hello",
      },
      notificationId: "notif-1",
      targetUserId: "user-1",
    });

    expect(triggerMock).toHaveBeenCalledTimes(1);
    expect(triggerMock).toHaveBeenCalledWith(
      "private-user-user-1",
      "notification:new",
      expect.objectContaining({
        actorId: "actor-1",
        eventType: "channel_message",
        notificationId: "notif-1",
      })
    );
  });

  test("email handler respects digest preference and queues batched email", async () => {
    const sendMail = mock(async () => undefined);
    const { db, insert, values } = createEmailDbMock([
      [{ email: "target@example.com", name: "Target User" }],
      [{ emailDigestInterval: "hourly" }],
    ]);

    await handleEmailDelivery({
      db: db as never,
      fromAddress: "noreply@example.com",
      message: createMessage(),
      transport: { sendMail } as never,
    });

    expect(sendMail).not.toHaveBeenCalled();
    expect(insert).toHaveBeenCalledTimes(1);
    expect(values).toHaveBeenCalledTimes(1);
  });
});
