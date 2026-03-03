import { db } from "@work-holo/db";
import { createEmailTransport } from "@work-holo/email";
import { env } from "@work-holo/env/notification-worker";
import {
  type NotificationQueueMessage,
  PusherClient,
  QUEUES,
  Queue,
} from "@work-holo/infrastructure";
import type { Channel } from "amqplib";
import webpush from "web-push";
import { startDigestProcessor } from "./lib/digest-processor";
import { handleEmailDelivery as sendEmailNotification } from "./lib/handlers/email";
import { handlePushDelivery as sendPushNotifications } from "./lib/handlers/push";

webpush.setVapidDetails(
  env.VAPID_SUBJECT,
  env.VAPID_PUBLIC_KEY,
  env.VAPID_PRIVATE_KEY
);

const emailTransport = createEmailTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

const PREFETCH_COUNT = 5;
const DEDUP_WINDOW_MS = 30_000;

const recentlyProcessedNotifications = new Map<string, number>();

const getDedupKey = (message: NotificationQueueMessage): string =>
  `${message.targetUserId}:${message.eventType}:${message.entityId}`;

const isDuplicateNotification = (
  message: NotificationQueueMessage
): boolean => {
  const now = Date.now();

  for (const [key, timestamp] of recentlyProcessedNotifications) {
    if (now - timestamp > DEDUP_WINDOW_MS) {
      recentlyProcessedNotifications.delete(key);
    }
  }

  const dedupKey = getDedupKey(message);
  const lastProcessedAt = recentlyProcessedNotifications.get(dedupKey);

  if (lastProcessedAt && now - lastProcessedAt <= DEDUP_WINDOW_MS) {
    return true;
  }

  recentlyProcessedNotifications.set(dedupKey, now);
  return false;
};

function handleSoundDelivery(message: NotificationQueueMessage): Promise<void> {
  console.log(
    `[Notification Worker] Sound delivery placeholder (Task 11) for notification ${message.notificationId}`
  );
  return Promise.resolve();
}

async function handlePushDelivery(
  message: NotificationQueueMessage
): Promise<void> {
  await sendPushNotifications({
    actorId: message.actorId,
    db,
    eventType: message.eventType,
    metadata: message.metadata,
    notificationId: message.notificationId,
    targetUserId: message.targetUserId,
  });
}

async function handleEmailDelivery(
  message: NotificationQueueMessage
): Promise<void> {
  await sendEmailNotification({
    db,
    transport: emailTransport,
    fromAddress: env.SMTP_FROM,
    message,
  });
}

async function handleMessage(message: NotificationQueueMessage): Promise<void> {
  if (isDuplicateNotification(message)) {
    console.log(
      `[Notification Worker] Duplicate message skipped within ${DEDUP_WINDOW_MS / 1000}s window:`,
      {
        targetUserId: message.targetUserId,
        eventType: message.eventType,
        entityId: message.entityId,
      }
    );
    return;
  }

  const deliveryPromises = message.deliveryChannels.map(async (channel) => {
    switch (channel) {
      case "sound":
        await handleSoundDelivery(message);
        return;
      case "push":
        await handlePushDelivery(message);
        return;
      case "email":
        await handleEmailDelivery(message);
        return;
      default:
        console.warn(
          `[Notification Worker] Unsupported delivery channel "${channel}" for notification ${message.notificationId}`
        );
    }
  });

  const results = await Promise.allSettled(deliveryPromises);

  for (const result of results) {
    if (result.status === "rejected") {
      throw result.reason;
    }
  }
}

class QueueWorker {
  private channel: Channel | null = null;

  async connect(): Promise<void> {
    await Queue.connect({ url: env.RABBITMQ_URL });
    this.channel = Queue.getClient();
    console.log("Connected to RabbitMQ successfully");
  }

  async consume(): Promise<void> {
    if (!this.channel) {
      throw new Error("Channel not initialized");
    }

    await this.channel.prefetch(PREFETCH_COUNT);

    console.log(
      `Starting to consume messages from queue: ${QUEUES.NOTIFICATIONS}`
    );
    console.log(`Prefetch count: ${PREFETCH_COUNT}`);

    await this.channel.consume(
      QUEUES.NOTIFICATIONS,
      async (msg) => {
        if (!msg) return;

        try {
          const content = msg.content.toString();
          const message: NotificationQueueMessage = JSON.parse(content);

          await handleMessage(message);

          if (this.channel) {
            this.channel.ack(msg);
          }
        } catch (error) {
          console.error(
            "[Notification Worker] Error processing message:",
            error
          );

          if (this.channel) {
            this.channel.nack(msg, false, true);
          }
        }
      },
      {
        noAck: false,
      }
    );

    console.log("Worker is now consuming messages. Press CTRL+C to exit.\n");
  }

  async close(): Promise<void> {
    console.log("\n===========================================");
    console.log("Shutting down worker gracefully...");
    console.log("===========================================");

    await Queue.close();
    this.channel = null;
    console.log("RabbitMQ connection closed successfully");
  }
}

async function startWorker() {
  console.log("===========================================");
  console.log("Notification Worker Starting...");
  console.log("===========================================");
  console.log(`Environment: ${env.ENV}`);
  console.log(`RabbitMQ URL: ${env.RABBITMQ_URL}`);
  console.log(`Prefetch Count: ${PREFETCH_COUNT}`);
  console.log("===========================================\n");

  const worker = new QueueWorker();

  PusherClient.connect({
    appId: env.PUSHER_APP_ID,
    host: env.PUSHER_HOST,
    key: env.PUSHER_APP_KEY,
    port: env.PUSHER_PORT,
    secret: env.PUSHER_APP_SECRET,
    useTLS: env.ENV === "production",
  });
  console.log("Pusher client initialized");

  const digestIntervalId = startDigestProcessor(
    db,
    emailTransport,
    env.SMTP_FROM
  );
  console.log("Email digest processor started");

  try {
    await worker.connect();
    await worker.consume();

    const shutdown = async () => {
      clearInterval(digestIntervalId);
      await worker.close();
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    process.on("uncaughtException", (error) => {
      console.error("Uncaught exception:", error);
      shutdown();
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled rejection at:", promise, "reason:", reason);
      shutdown();
    });
  } catch (error) {
    console.error("Failed to start worker:", error);
    process.exit(1);
  }
}

startWorker().catch((error) => {
  console.error("[Notification Worker] Failed to start:", error);
  process.exit(1);
});
