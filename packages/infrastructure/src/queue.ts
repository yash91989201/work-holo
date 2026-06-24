import amqp, { type Channel, type ChannelModel } from "amqplib";

export const QUEUES = {
  READ_RECEIPTS: "read_receipts",
  NOTIFICATIONS: "notifications",
  SEARCH_INDEXING: "search_indexing",
  CALL_RING_TIMEOUT: "call_ring_timeout",
  CALL_RING_TIMEOUT_DLX: "call_ring_timeout_dlx",
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

export interface CallRingTimeoutQueueMessage {
  callId: string;
  type: "ring_timeout";
}

export type QueueMessage =
  | ReadReceiptQueueMessage
  | NotificationQueueMessage
  | SearchIndexQueueMessage
  | CallRingTimeoutQueueMessage;

export interface QueueConfig {
  url: string;
}

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

async function setupQueues(): Promise<void> {
  if (!channel) {
    throw new Error("Channel not initialized");
  }

  await channel.assertQueue(QUEUES.READ_RECEIPTS, {
    durable: true,
    arguments: {
      "x-message-ttl": 3_600_000,
      "x-max-length": 10_000,
    },
  });

  await channel.assertQueue(QUEUES.NOTIFICATIONS, {
    durable: true,
    arguments: {
      "x-message-ttl": 3_600_000,
      "x-max-length": 50_000,
    },
  });

  await channel.assertQueue(QUEUES.SEARCH_INDEXING, {
    durable: true,
    arguments: {
      "x-max-length": 50_000,
    },
  });

  // Wait queue: messages sit here for 30s (ring window) then dead-letter to the
  // DLX queue, which the call-timeout worker consumes. Nothing consumes this
  // queue directly — TTL expiry is the delay mechanism.
  await channel.assertQueue(QUEUES.CALL_RING_TIMEOUT, {
    durable: true,
    arguments: {
      "x-message-ttl": 30_000,
      "x-dead-letter-exchange": "",
      "x-dead-letter-routing-key": QUEUES.CALL_RING_TIMEOUT_DLX,
    },
  });

  // Dead-letter destination: the worker consumes from here after the 30s delay.
  await channel.assertQueue(QUEUES.CALL_RING_TIMEOUT_DLX, {
    durable: true,
  });
}

// biome-ignore lint/complexity/noStaticOnlyClass: Singleton pattern with encapsulated state
export class Queue {
  static async connect(config: QueueConfig): Promise<void> {
    if (connection && channel) {
      return;
    }

    connection = await amqp.connect(config.url);

    connection.on("error", (err) => {
      console.error("RabbitMQ connection error:", err);
    });

    connection.on("close", () => {
      console.log("RabbitMQ connection closed");
      connection = null;
      channel = null;
    });

    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ successfully");

    await setupQueues();
  }

  static getClient(): Channel {
    if (!channel) {
      throw new Error(
        "Queue client not initialized. Call Queue.connect() first."
      );
    }
    return channel;
  }

  static publish(queue: keyof typeof QUEUES, message: QueueMessage): boolean {
    if (!channel) {
      console.error("Cannot publish: Channel not initialized");
      return false;
    }

    try {
      const queueName = QUEUES[queue];
      const messageBuffer = Buffer.from(JSON.stringify(message));

      const sent = channel.sendToQueue(queueName, messageBuffer, {
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

  static async close(): Promise<void> {
    try {
      if (channel) {
        await channel.close();
        channel = null;
      }
      if (connection) {
        await connection.close();
        connection = null;
      }
      console.log("RabbitMQ connection closed successfully");
    } catch (error) {
      console.error("Error closing RabbitMQ connection:", error);
    }
  }
}
