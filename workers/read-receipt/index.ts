import { db } from "@work-holo/db";
import { env } from "@work-holo/env/read-receipt";
import {
  QUEUES,
  Queue,
  type ReadReceiptQueueMessage,
} from "@work-holo/infrastructure";
import type { Channel } from "amqplib";
import {
  cleanupMemberCountCache,
  processChannelReadReceiptsNow,
} from "./lib/processor";

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
      console.log(
        `Channel ${channelId} is already being processed, skipping duplicate message`
      );
      return; // Will ack the message automatically
    }

    processingChannels.add(channelId);

    const strategy =
      channelMessage.memberCount <= env.MAX_MEMBERS_FOR_DETAILED_TRACKING
        ? "detailed"
        : "aggregated";

    console.log(
      `Processing read receipts for channel: ${channelId} (${channelMessage.memberCount} members, ${strategy} tracking)`
    );

    try {
      const result = await processChannelReadReceiptsNow(
        db,
        channelId,
        channelMessage.memberCount
      );

      console.log(`Successfully processed channel ${channelId}:`, {
        strategy,
        messagesProcessed: result.messagesProcessed,
        summariesUpdated: result.summariesUpdated,
      });
    } catch (error) {
      console.error(`Error processing channel ${channelId}:`, error);
      throw error; // Rethrow to trigger retry mechanism
    } finally {
      // Always remove from processing set
      processingChannels.delete(channelId);
    }
  } else {
    console.warn("Unknown message type:", message);
  }
}

/**
 * RabbitMQ connection manager
 */
class QueueWorker {
  private channel: Channel | null = null;
  private cleanupIntervalId: NodeJS.Timeout | null = null;

  /**
   * Connect to RabbitMQ and create channel
   */
  async connect(): Promise<void> {
    await Queue.connect({ url: env.RABBITMQ_URL });
    this.channel = Queue.getClient();
    console.log("Connected to RabbitMQ successfully");
  }

  /**
   * Start consuming messages from the queue
   */
  async consume(): Promise<void> {
    if (!this.channel) {
      throw new Error("Channel not initialized");
    }

    // Set prefetch count (how many messages to process concurrently)
    await this.channel.prefetch(PREFETCH_COUNT);

    console.log(
      `Starting to consume messages from queue: ${QUEUES.READ_RECEIPTS}`
    );
    console.log(`Prefetch count: ${PREFETCH_COUNT}`);

    await this.channel.consume(
      QUEUES.READ_RECEIPTS,
      async (msg) => {
        if (!msg) return;

        try {
          const content = msg.content.toString();
          const message: ReadReceiptQueueMessage = JSON.parse(content);

          // Acknowledge the message immediately after parsing
          // This prevents RabbitMQ timeout for long-running processing
          if (this.channel) {
            this.channel.ack(msg);
          }

          // Process the message (can take as long as needed now)
          await handleMessage(message);
        } catch (error) {
          console.error("Error processing message:", error);
          // Message already acknowledged, so we just log the error
          // The watermark ensures we don't lose progress on successful processing
        }
      },
      {
        noAck: false, // Require explicit acknowledgment
      }
    );

    console.log("Worker is now consuming messages. Press CTRL+C to exit.\n");
  }

  /**
   * Start periodic cache cleanup
   */
  startCacheCleanup(): void {
    this.cleanupIntervalId = setInterval(() => {
      cleanupMemberCountCache();
      console.log("[Cache Cleanup] Member count cache cleanup completed");
    }, CACHE_CLEANUP_INTERVAL);

    console.log(
      `Member count cache cleanup scheduled every ${CACHE_CLEANUP_INTERVAL / 1000 / 60} minutes\n`
    );
  }

  /**
   * Close connection and cleanup
   */
  async close(): Promise<void> {
    console.log("\n===========================================");
    console.log("Shutting down worker gracefully...");
    console.log("===========================================");

    // Clear cache cleanup interval
    if (this.cleanupIntervalId) {
      clearInterval(this.cleanupIntervalId);
      this.cleanupIntervalId = null;
      console.log("Cache cleanup interval cleared");
    }

    await Queue.close();
    this.channel = null;
    console.log("RabbitMQ connection closed successfully");
  }
}

/**
 * Start the worker
 */
async function startWorker() {
  console.log("===========================================");
  console.log("Read Receipt Worker Starting...");
  console.log("===========================================");
  console.log(`Environment: ${env.ENV}`);
  console.log(`RabbitMQ URL: ${env.RABBITMQ_URL}`);
  console.log(`Prefetch Count: ${PREFETCH_COUNT}`);
  console.log(`Batch Size: ${env.READ_RECEIPT_BATCH_SIZE}`);
  console.log(
    `Max Members for Detailed Tracking: ${env.MAX_MEMBERS_FOR_DETAILED_TRACKING}`
  );
  console.log("===========================================\n");

  const worker = new QueueWorker();

  try {
    // Connect to RabbitMQ
    await worker.connect();

    // Start consuming messages
    await worker.consume();

    // Start periodic cache cleanup
    worker.startCacheCleanup();

    // Setup graceful shutdown
    const shutdown = async () => {
      await worker.close();
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    // Handle uncaught errors
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

// Start the worker
startWorker().catch((error) => {
  console.error("[Read Receipt Worker] Failed to start:", error);
  process.exit(1);
});
