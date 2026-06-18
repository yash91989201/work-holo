import { db } from "@work-holo/db";
import { env } from "@work-holo/env/read-receipt";
import {
  QUEUES,
  Queue,
  type ReadReceiptQueueMessage,
} from "@work-holo/infrastructure";
import { log } from "evlog";
import { startHealthServer, stopHealthServer } from "./lib/health";
import {
  cleanupMemberCountCache,
  processChannelReadReceiptsNow,
} from "./lib/processor";

const TAG = "read-receipt";

// Queue configuration
const PREFETCH_COUNT = Number(env.PREFETCH_COUNT ?? 5);
const CACHE_CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes

const processingChannels = new Set<string>();

/**
 * Handle incoming queue messages
 */
async function handleMessage(message: ReadReceiptQueueMessage): Promise<void> {
  if (message.type === "process_channel") {
    const channelMessage = message;
    const channelId = channelMessage.channelId;

    // Skip if already processing this channel
    if (processingChannels.has(channelId)) {
      log.info(
        TAG,
        `Channel ${channelId} is already being processed, skipping duplicate message`
      );
      return; // Will ack the message automatically
    }

    processingChannels.add(channelId);

    const strategy =
      channelMessage.memberCount <= env.MAX_MEMBERS_FOR_DETAILED_TRACKING
        ? "detailed"
        : "aggregated";

    log.info(
      TAG,
      `Processing read receipts for channel: ${channelId} (${channelMessage.memberCount} members, ${strategy} tracking)`
    );

    try {
      const result = await processChannelReadReceiptsNow(
        db,
        channelId,
        channelMessage.memberCount
      );

      log.info({
        tag: TAG,
        message: `Successfully processed channel ${channelId}`,
        strategy,
        messagesProcessed: result.messagesProcessed,
        summariesUpdated: result.summariesUpdated,
      });
    } catch (error) {
      log.error({
        tag: TAG,
        message: `Error processing channel ${channelId}`,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error; // Rethrow to trigger retry mechanism
    } finally {
      // Always remove from processing set
      processingChannels.delete(channelId);
    }
  } else {
    log.warn({ tag: TAG, message: "Unknown message type", type: message.type });
  }
}

/**
 * RabbitMQ connection manager
 */
class QueueWorker {
  private cleanupIntervalId: NodeJS.Timeout | null = null;

  /**
   * Connect to RabbitMQ and create channel
   */
  async connect(): Promise<void> {
    Queue.connect({ url: env.RABBITMQ_URL });
    await Queue.whenReady();
    log.info(TAG, "Connected to RabbitMQ successfully");
  }

  /**
   * Start consuming messages from the queue
   */
  async consume(): Promise<void> {
    log.info(
      TAG,
      `Starting to consume messages from queue: ${QUEUES.READ_RECEIPTS}`
    );
    log.info(TAG, `Prefetch count: ${PREFETCH_COUNT}`);

    await Queue.consume(
      "READ_RECEIPTS",
      async (msg, channel) => {
        try {
          const message: ReadReceiptQueueMessage = JSON.parse(
            msg.content.toString()
          );

          // Ack immediately after parsing to avoid RabbitMQ timeout during processing
          channel.ack(msg);
          await handleMessage(message);
        } catch (error) {
          log.error({
            tag: TAG,
            message: "Error processing message",
            error: error instanceof Error ? error.message : String(error),
          });
        }
      },
      { prefetch: PREFETCH_COUNT, noAck: false }
    );

    log.info(TAG, "Worker is now consuming messages. Press CTRL+C to exit.");
  }

  /**
   * Start periodic cache cleanup
   */
  startCacheCleanup(): void {
    this.cleanupIntervalId = setInterval(() => {
      cleanupMemberCountCache();
      log.info(TAG, "Member count cache cleanup completed");
    }, CACHE_CLEANUP_INTERVAL);

    log.info(
      TAG,
      `Member count cache cleanup scheduled every ${CACHE_CLEANUP_INTERVAL / 1000 / 60} minutes`
    );
  }

  /**
   * Close connection and cleanup
   */
  async close(): Promise<void> {
    log.info({ tag: TAG, message: "Shutting down worker gracefully" });

    // Clear cache cleanup interval
    if (this.cleanupIntervalId) {
      clearInterval(this.cleanupIntervalId);
      this.cleanupIntervalId = null;
      log.info(TAG, "Cache cleanup interval cleared");
    }

    await Queue.close();
    log.info(TAG, "RabbitMQ connection closed successfully");
  }
}

/**
 * Start the worker
 */
async function startWorker() {
  log.info({
    tag: TAG,
    message: "Read Receipt Worker Starting",
    environment: env.ENV,
    rabbitmqUrl: env.RABBITMQ_URL,
    prefetchCount: PREFETCH_COUNT,
    batchSize: env.READ_RECEIPT_BATCH_SIZE,
    maxMembersForDetailedTracking: env.MAX_MEMBERS_FOR_DETAILED_TRACKING,
  });

  const worker = new QueueWorker();

  try {
    startHealthServer(env.HEALTH_PORT);

    await worker.connect();

    // Start consuming messages
    await worker.consume();

    // Start periodic cache cleanup
    worker.startCacheCleanup();

    // Setup graceful shutdown
    const shutdown = async () => {
      stopHealthServer();
      await worker.close();
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    // Handle uncaught errors
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

// Start the worker
startWorker().catch((error) => {
  log.error({
    tag: TAG,
    message: "Failed to start",
    error: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
});
