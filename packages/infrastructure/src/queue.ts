import amqp, { type Channel, type ChannelModel } from "amqplib";

export const QUEUES = {
  READ_RECEIPTS: "read_receipts",
  NOTIFICATIONS: "notifications",
  SEARCH_INDEXING: "search_indexing",
} as const;

export interface ReadReceiptQueueMessage {
  channelId: string;
  memberCount: number;
  timestamp: string;
  type: "process_channel";
}

export interface NotificationQueueMessage {
  actorId: string;
  deliveryChannels: Array<"realtime" | "sound" | "push" | "email">;
  entityId: string;
  entityType: string;
  eventType: string;
  metadata: Record<string, unknown>;
  notificationId: string;
  orgId: string;
  targetUserId: string;
}

export interface SearchIndexQueueMessage {
  action: "upsert" | "delete";
  contentHtml?: string;
  createdAt?: string;
  hasAttachments?: boolean;
  isPinned?: boolean;
  mentionedUserIds?: string[];
  messageId: string;
  messageType?: string;
  organizationId: string;
  parentMessageId?: string | null;
  scopeId?: string;
  scopeType: "channel" | "dm";
  senderId?: string;
  senderName?: string;
  updatedAt?: string;
}

export type QueueMessage =
  | ReadReceiptQueueMessage
  | NotificationQueueMessage
  | SearchIndexQueueMessage;

export interface QueueConfig {
  url: string;
}

// biome-ignore lint/complexity/noStaticOnlyClass: Singleton pattern with encapsulated state
export class Queue {
  private static connection: ChannelModel | null = null;
  private static channel: Channel | null = null;
  private static reconnectTimeout: NodeJS.Timeout | null = null;
  private static isConnecting = false;
  private static connectionUrl = "";

  private static async setupQueues(): Promise<void> {
    if (!Queue.channel) {
      throw new Error("Channel not initialized");
    }

    await Queue.channel.assertQueue(QUEUES.READ_RECEIPTS, {
      durable: true,
      arguments: {
        "x-message-ttl": 3_600_000,
        "x-max-length": 10_000,
      },
    });

    await Queue.channel.assertQueue(QUEUES.NOTIFICATIONS, {
      durable: true,
      arguments: {
        "x-message-ttl": 3_600_000,
        "x-max-length": 50_000,
      },
    });

    await Queue.channel.assertQueue(QUEUES.SEARCH_INDEXING, {
      durable: true,
      arguments: {
        "x-max-length": 50_000,
      },
    });

    console.log("RabbitMQ queues setup completed");
  }

  private static handleConnectionError(): void {
    Queue.connection = null;
    Queue.channel = null;

    if (Queue.reconnectTimeout) {
      clearTimeout(Queue.reconnectTimeout);
    }

    console.log("Attempting to reconnect to RabbitMQ in 5 seconds...");
    Queue.reconnectTimeout = setTimeout(() => {
      Queue.connect({ url: Queue.connectionUrl }).catch((err) => {
        console.error("Reconnection failed:", err);
      });
    }, 5000);
  }

  static async connect(config: QueueConfig): Promise<void> {
    if (Queue.isConnecting) {
      console.log("Already connecting to RabbitMQ, skipping...");
      return;
    }

    if (Queue.connection && Queue.channel) {
      console.log("Already connected to RabbitMQ");
      return;
    }

    Queue.isConnecting = true;
    Queue.connectionUrl = config.url;

    try {
      console.log("Connecting to RabbitMQ...");
      Queue.connection = await amqp.connect(config.url, {
        tls: {
          rejectUnauthorized: false,
        },
      });

      Queue.connection.on("error", (err) => {
        console.error("RabbitMQ connection error:", err);
        Queue.handleConnectionError();
      });

      Queue.connection.on("close", () => {
        console.log("RabbitMQ connection closed");
        Queue.handleConnectionError();
      });

      Queue.channel = await Queue.connection.createChannel();
      console.log("Connected to RabbitMQ successfully");

      await Queue.setupQueues();

      Queue.isConnecting = false;
    } catch (error) {
      Queue.isConnecting = false;
      console.error("Failed to connect to RabbitMQ:", error);
      Queue.handleConnectionError();
      throw error;
    }
  }

  static getClient(): Channel {
    if (!Queue.channel) {
      throw new Error(
        "Queue client not initialized. Call Queue.connect() first."
      );
    }
    return Queue.channel;
  }

  static publish(queue: keyof typeof QUEUES, message: QueueMessage): boolean {
    if (!Queue.channel) {
      console.error("Cannot publish: Channel not initialized");
      Queue.connect({ url: Queue.connectionUrl }).catch((error) => {
        console.error("Failed to reconnect before publishing:", error);
      });
      return false;
    }

    try {
      const queueName = QUEUES[queue];
      const messageBuffer = Buffer.from(JSON.stringify(message));

      const sent = Queue.channel.sendToQueue(queueName, messageBuffer, {
        persistent: true,
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

  static isConnected(): boolean {
    return Queue.connection !== null && Queue.channel !== null;
  }

  static async close(): Promise<void> {
    if (Queue.reconnectTimeout) {
      clearTimeout(Queue.reconnectTimeout);
      Queue.reconnectTimeout = null;
    }

    try {
      if (Queue.channel) {
        await Queue.channel.close();
        Queue.channel = null;
      }
      if (Queue.connection) {
        await Queue.connection.close();
        Queue.connection = null;
      }
      console.log("RabbitMQ connection closed successfully");
    } catch (error) {
      console.error("Error closing RabbitMQ connection:", error);
    }
  }

  static reset(): void {
    Queue.connection = null;
    Queue.channel = null;
    Queue.isConnecting = false;
    Queue.connectionUrl = "";
    if (Queue.reconnectTimeout) {
      clearTimeout(Queue.reconnectTimeout);
      Queue.reconnectTimeout = null;
    }
  }
}
