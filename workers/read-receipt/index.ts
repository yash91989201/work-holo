import { db } from "@work-holo/db";
import amqp, { type Channel, type ChannelModel } from "amqplib";
import { env } from "./env";
import {
  cleanupMemberCountCache,
  processChannelReadReceiptsNow,
} from "./lib/processor";

// Queue configuration
const QUEUE_NAME = "read_receipts";
const PREFETCH_COUNT = Number(env.PREFETCH_COUNT ?? 5);
const CACHE_CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes

const processingChannels = new Set<string>();

// Message types
interface ReadReceiptQueueMessage {
  type: "process_channel";
  channelId: string;
  memberCount: number;
  timestamp: string;
}

type QueueMessage = ReadReceiptQueueMessage;

/**
 * Handle incoming queue messages
 */
async function handleMessage(message: QueueMessage): Promise<void> {
  if (message.type === "process_channel") {
    const channelMessage = message as ReadReceiptQueueMessage;
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
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private cleanupIntervalId: NodeJS.Timeout | null = null;

  /**
   * Connect to RabbitMQ and create channel
   */
  async connect(): Promise<void> {
    if (this.isConnecting) {
      console.log("Already connecting to RabbitMQ, skipping...");
      return;
    }

    if (this.connection && this.channel) {
      console.log("Already connected to RabbitMQ");
      return;
    }

    this.isConnecting = true;

    try {
      console.log(`Connecting to RabbitMQ: ${env.RABBITMQ_URL}`);
      this.connection = await amqp.connect(env.RABBITMQ_URL, {
        tls: {
          rejectUnauthorized: false,
        },
      });

      this.connection.on("error", (err) => {
        console.error("RabbitMQ connection error:", err);
        this.handleConnectionError();
      });

      this.connection.on("close", () => {
        console.log("RabbitMQ connection closed");
        this.handleConnectionError();
      });

      this.channel = await this.connection.createChannel();
      console.log("Connected to RabbitMQ successfully");

      // Setup queue
      await this.setupQueue();

      this.isConnecting = false;
    } catch (error) {
      this.isConnecting = false;
      console.error("Failed to connect to RabbitMQ:", error);
      this.handleConnectionError();
      throw error;
    }
  }

  /**
   * Handle connection errors and attempt reconnection
   */
  private handleConnectionError(): void {
    this.connection = null;
    this.channel = null;

    // Clear existing reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    // Attempt to reconnect after 5 seconds
    console.log("Attempting to reconnect to RabbitMQ in 5 seconds...");
    this.reconnectTimeout = setTimeout(() => {
      this.connect().catch((err) => {
        console.error("Reconnection failed:", err);
      });
    }, 5000);
  }

  /**
   * Setup the read receipts queue
   */
  private async setupQueue(): Promise<void> {
    if (!this.channel) {
      throw new Error("Channel not initialized");
    }

    // Create read receipts queue with durability
    await this.channel.assertQueue(QUEUE_NAME, {
      durable: true, // Queue survives broker restart
      arguments: {
        "x-message-ttl": 3_600_000, // Messages expire after 1 hour
        "x-max-length": 10_000, // Max 10k messages in queue
      },
    });

    console.log(`Queue "${QUEUE_NAME}" setup completed`);
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

    console.log(`Starting to consume messages from queue: ${QUEUE_NAME}`);
    console.log(`Prefetch count: ${PREFETCH_COUNT}`);

    await this.channel.consume(
      QUEUE_NAME,
      async (msg) => {
        if (!msg) return;

        try {
          const content = msg.content.toString();
          const message: QueueMessage = JSON.parse(content);

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

    // Clear reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = null;
      }
      if (this.connection) {
        await this.connection.close();
        this.connection = null;
      }
      console.log("RabbitMQ connection closed successfully");
    } catch (error) {
      console.error("Error closing RabbitMQ connection:", error);
    }
  }
}

/**
 * Start the worker
 */
async function startWorker() {
  console.log("===========================================");
  console.log("Read Receipt Worker Starting...");
  console.log("===========================================");
  console.log(`Environment: ${env.NODE_ENV}`);
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
