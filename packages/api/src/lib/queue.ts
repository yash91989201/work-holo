import amqp, { type Channel, type ChannelModel } from "amqplib";

// Queue names
export const QUEUES = {
  READ_RECEIPTS: "read_receipts",
} as const;

// Message types
export interface ReadReceiptQueueMessage {
  type: "process_channel";
  channelId: string;
  memberCount: number;
  timestamp: string;
}

export type QueueMessage = ReadReceiptQueueMessage;

class QueueClient {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;
  connectionString: string;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isConnecting = false;

  constructor(connectionString: string) {
    this.connectionString = connectionString;
  }

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
      console.log("Connecting to RabbitMQ...");
      this.connection = await amqp.connect(this.connectionString, {
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

      // Setup queues
      await this.setupQueues();

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
   * Setup all required queues
   */
  private async setupQueues(): Promise<void> {
    if (!this.channel) {
      throw new Error("Channel not initialized");
    }

    // Create read receipts queue with durability
    await this.channel.assertQueue(QUEUES.READ_RECEIPTS, {
      durable: true, // Queue survives broker restart
      arguments: {
        "x-message-ttl": 3_600_000, // Messages expire after 1 hour
        "x-max-length": 10_000, // Max 10k messages in queue
      },
    });

    console.log("RabbitMQ queues setup completed");
  }

  /**
   * Publish a message to a queue
   */
  publish(queue: keyof typeof QUEUES, message: QueueMessage): boolean {
    if (!this.channel) {
      console.error("Cannot publish: Channel not initialized");
      this.connect().catch((error) => {
        console.error("Failed to reconnect before publishing:", error);
      });
      return false;
    }

    try {
      const queueName = QUEUES[queue];
      const messageBuffer = Buffer.from(JSON.stringify(message));

      const sent = this.channel.sendToQueue(queueName, messageBuffer, {
        persistent: true, // Message survives broker restart
        timestamp: Date.now(),
      });

      if (!sent) {
        console.warn(
          `Failed to send message to queue ${queueName}: Queue full or blocked`
        );
      }

      return sent;
    } catch (error) {
      console.error(`Error publishing message to ${queue}:`, error);
      return false;
    }
  }

  /**
   * Close connection
   */
  async close(): Promise<void> {
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

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connection !== null && this.channel !== null;
  }
}

// Singleton instance
let queueClient: QueueClient | null = null;

/**
 * Initialize the queue client
 */
export function initializeQueueClient(
  connectionString = "amqp://admin:admin@localhost:5672"
): QueueClient {
  if (!queueClient) {
    queueClient = new QueueClient(connectionString);
    queueClient.connect().catch((error) => {
      console.error("Failed to initialize queue connection:", error);
    });
    return queueClient;
  }

  if (!queueClient.isConnected()) {
    queueClient.connect().catch((error) => {
      console.error("Failed to reconnect queue client:", error);
    });
  }
  return queueClient;
}

/**
 * Get the queue client instance
 */
export function getQueueClient(): QueueClient {
  if (!queueClient) {
    throw new Error(
      "Queue client not initialized. Call initializeQueueClient first."
    );
  }
  return queueClient;
}

/**
 * Cleanup queue client
 */
export async function cleanupQueueClient(): Promise<void> {
  if (queueClient) {
    await queueClient.close();
    queueClient = null;
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Received SIGINT, closing queue connection...");
  await cleanupQueueClient();
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM, closing queue connection...");
  await cleanupQueueClient();
});
