import { db } from "@work-holo/db";
import { createEmailTransport } from "@work-holo/email";
import { env } from "@work-holo/env/notification-worker";
import {
  type NotificationQueueMessage,
  PusherClient,
  QUEUES,
  Queue,
} from "@work-holo/infrastructure";
import { log } from "evlog";
import webpush from "web-push";
import { startDigestProcessor } from "./lib/digest-processor";
import { handleEmailDelivery as sendEmailNotification } from "./lib/handlers/email";
import { handlePushDelivery as sendPushNotifications } from "./lib/handlers/push";
import { handlePusherDelivery } from "./lib/handlers/pusher";
import { startHealthServer, stopHealthServer } from "./lib/health";

const TAG = "notification";

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
let emailDeliveryDisabled = false;

const recentlyProcessedNotifications = new Map<string, number>();

const getDedupKey = (message: NotificationQueueMessage): string =>
  message.notificationId;

const isDuplicateNotification = (
  message: NotificationQueueMessage
): boolean => {
  const now = Date.now();

  for (const [key, timestamp] of recentlyProcessedNotifications) {
    if (now - timestamp > DEDUP_WINDOW_MS) {
      recentlyProcessedNotifications.delete(key);
    }
  }

  const lastProcessedAt = recentlyProcessedNotifications.get(
    getDedupKey(message)
  );

  if (lastProcessedAt && now - lastProcessedAt <= DEDUP_WINDOW_MS) {
    return true;
  }

  return false;
};

const markNotificationProcessed = (message: NotificationQueueMessage): void => {
  recentlyProcessedNotifications.set(getDedupKey(message), Date.now());
};

function resolveRealtimeEntity(message: NotificationQueueMessage): {
  entityId: string;
  entityType: "channel" | "dm_conversation" | "event_type";
} {
  const channelId = message.metadata.channelId;
  if (typeof channelId === "string") {
    return { entityType: "channel", entityId: channelId };
  }

  const conversationId = message.metadata.conversationId;
  if (typeof conversationId === "string") {
    return { entityType: "dm_conversation", entityId: conversationId };
  }

  return { entityType: "event_type", entityId: message.entityId };
}

async function handleRealtimeDelivery(
  message: NotificationQueueMessage,
  playSound: boolean
): Promise<void> {
  const realtimeEntity = resolveRealtimeEntity(message);

  await handlePusherDelivery({
    actorId: message.actorId,
    entityId: realtimeEntity.entityId,
    entityType: realtimeEntity.entityType,
    eventType: message.eventType,
    metadata: message.metadata,
    notificationId: message.notificationId,
    playSound,
    targetUserId: message.targetUserId,
  });
}

async function handlePushDelivery(
  message: NotificationQueueMessage,
  playSound: boolean
): Promise<void> {
  await sendPushNotifications({
    actorId: message.actorId,
    db,
    eventType: message.eventType,
    metadata: message.metadata,
    notificationId: message.notificationId,
    orgId: message.orgId,
    playSound,
    targetUserId: message.targetUserId,
  });
}

async function handleEmailDelivery(
  message: NotificationQueueMessage
): Promise<void> {
  if (emailDeliveryDisabled) {
    return;
  }

  try {
    await sendEmailNotification({
      db,
      transport: emailTransport,
      fromAddress: env.SMTP_FROM,
      message,
    });
  } catch (error) {
    const errorText = String(error);
    const isDnsResolutionError =
      errorText.includes("ENOTFOUND") || errorText.includes("getaddrinfo");

    if (isDnsResolutionError) {
      emailDeliveryDisabled = true;
      log.warn({
        tag: TAG,
        message: "Email delivery disabled due to SMTP DNS resolution failure",
        smtpHost: env.SMTP_HOST,
        error: error instanceof Error ? error.message : errorText,
      });
      return;
    }

    throw error;
  }
}

async function handleMessage(message: NotificationQueueMessage): Promise<void> {
  if (isDuplicateNotification(message)) {
    log.info({
      tag: TAG,
      message: "Duplicate message skipped",
      windowSeconds: DEDUP_WINDOW_MS / 1000,
      targetUserId: message.targetUserId,
      eventType: message.eventType,
      entityId: message.entityId,
    });
    return;
  }

  const playSound = message.deliveryChannels.includes("sound");
  const normalizedChannels = message.deliveryChannels.filter(
    (channel) => channel !== "sound"
  );

  const channelsToProcess =
    normalizedChannels.length > 0
      ? normalizedChannels
      : (["realtime"] as const);

  const deliveryPromises = channelsToProcess.map(async (channel) => {
    switch (channel) {
      case "realtime":
        await handleRealtimeDelivery(message, playSound);
        return;
      case "push":
        await handlePushDelivery(message, playSound);
        return;
      case "email":
        await handleEmailDelivery(message);
        return;
      default:
        log.warn({
          tag: TAG,
          message: `Unsupported delivery channel "${channel}" for notification ${message.notificationId}`,
        });
    }
  });

  const results = await Promise.allSettled(deliveryPromises);

  let realtimeFailure: unknown = null;

  for (const [index, result] of results.entries()) {
    if (result.status !== "rejected") {
      continue;
    }

    const failedChannel = channelsToProcess[index];

    if (failedChannel === "realtime") {
      realtimeFailure = result.reason;
      continue;
    }

    log.warn({
      tag: TAG,
      message: `Non-critical ${failedChannel} delivery failed for notification ${message.notificationId}. Realtime delivery already handled; skipping retry for this channel.`,
      reason: result.reason,
    });
  }

  if (realtimeFailure) {
    throw realtimeFailure;
  }
}

class QueueWorker {
  async connect(): Promise<void> {
    Queue.connect({ url: env.RABBITMQ_URL });
    await Queue.whenReady();
    log.info(TAG, "Connected to RabbitMQ successfully");
  }

  async consume(): Promise<void> {
    log.info(
      TAG,
      `Starting to consume messages from queue: ${QUEUES.NOTIFICATIONS}`
    );
    log.info(TAG, `Prefetch count: ${PREFETCH_COUNT}`);

    await Queue.consume(
      "NOTIFICATIONS",
      async (msg, channel) => {
        try {
          const message: NotificationQueueMessage = JSON.parse(
            msg.content.toString()
          );

          await handleMessage(message);
          markNotificationProcessed(message);
          channel.ack(msg);
        } catch (error) {
          log.error({
            tag: TAG,
            message: "Error processing message",
            error: error instanceof Error ? error.message : String(error),
          });
          channel.nack(msg, false, true);
        }
      },
      { prefetch: PREFETCH_COUNT, noAck: false }
    );

    log.info(TAG, "Worker is now consuming messages. Press CTRL+C to exit.");
  }

  async close(): Promise<void> {
    log.info({ tag: TAG, message: "Shutting down worker gracefully" });

    await Queue.close();
    log.info(TAG, "RabbitMQ connection closed successfully");
  }
}

async function startWorker() {
  log.info({
    tag: TAG,
    message: "Notification Worker Starting",
    environment: env.ENV,
    rabbitmqUrl: env.RABBITMQ_URL,
    prefetchCount: PREFETCH_COUNT,
  });

  const worker = new QueueWorker();
  const isProduction = env.ENV === "production";

  PusherClient.connect({
    appId: env.PUSHER_APP_ID,
    host: env.PUSHER_HOST,
    key: env.PUSHER_APP_KEY,
    port: isProduction ? undefined : env.PUSHER_PORT,
    secret: env.PUSHER_APP_SECRET,
    useTLS: isProduction,
  });

  log.info(TAG, "Pusher client initialized");

  const digestIntervalId = startDigestProcessor(
    db,
    emailTransport,
    env.SMTP_FROM
  );
  log.info(TAG, "Email digest processor started");

  try {
    startHealthServer(env.HEALTH_PORT);

    await worker.connect();
    await worker.consume();

    const shutdown = async () => {
      stopHealthServer();
      clearInterval(digestIntervalId);
      await worker.close();
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    process.on("uncaughtException", (error) => {
      log.error({
        tag: TAG,
        message: "Uncaught exception",
        error: error instanceof Error ? error.message : String(error),
      });
      shutdown();
    });

    process.on("unhandledRejection", (reason, promise) => {
      log.error({
        tag: TAG,
        message: "Unhandled rejection",
        reason: String(reason),
        promise: String(promise),
      });
      shutdown();
    });
  } catch (error) {
    log.error({
      tag: TAG,
      message: "Failed to start worker",
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
}

startWorker().catch((error) => {
  log.error({
    tag: TAG,
    message: "Failed to start",
    error: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
});
