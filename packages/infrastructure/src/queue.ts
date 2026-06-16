import amqp, {
  type Channel,
  type ChannelModel,
  type ConsumeMessage,
  type Options,
  type RecoveringChannelModel,
} from "amqplib";
import { log } from "evlog";

export const QUEUES = {
  READ_RECEIPTS: "read_receipts",
  NOTIFICATIONS: "notifications",
  SEARCH_INDEXING: "search_indexing",
} as const;

export type QueueName = keyof typeof QUEUES;

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
  /** Maximum reconnect backoff in ms (default 30000). */
  maxReconnectDelayMs?: number;
  /** Initial reconnect backoff in ms (default 1000). */
  reconnectDelayMs?: number;
  url: string;
}

/**
 * Consumer callback. Receives the message plus the live channel so ack/nack
 * always target the current (post-reconnect) channel rather than a stale ref.
 */
export type ConsumerHandler = (
  msg: ConsumeMessage,
  channel: Channel
) => void | Promise<void>;

export interface ConsumerOptions {
  /** Skip explicit acks (default false). */
  noAck?: boolean;
  /** Max unacked messages delivered to this channel at once. */
  prefetch?: number;
}

interface ConsumerRegistration {
  handler: ConsumerHandler;
  options: ConsumerOptions;
  queue: QueueName;
}

/**
 * Per-queue declarations. Adding a new queue is a single entry here plus a key
 * in {@link QUEUES} — assertion and re-assertion on reconnect happen for free.
 */
const QUEUE_DECLARATIONS: Record<QueueName, Options.AssertQueue> = {
  READ_RECEIPTS: {
    durable: true,
    arguments: { "x-message-ttl": 3_600_000, "x-max-length": 10_000 },
  },
  NOTIFICATIONS: {
    durable: true,
    arguments: { "x-message-ttl": 3_600_000, "x-max-length": 50_000 },
  },
  SEARCH_INDEXING: {
    durable: true,
    arguments: { "x-max-length": 50_000 },
  },
};

const DEFAULT_RECONNECT_DELAY_MS = 1000;
const DEFAULT_MAX_RECONNECT_DELAY_MS = 30_000;

// Heartbeat keeps the socket active (so intermediaries don't reap it as idle)
// and lets the broker detect a dead peer within ~2 missed intervals. Without
// it, drops only surface as "Unexpected close" after a TCP timeout.
const DEFAULT_HEARTBEAT_SECONDS = 30;

const TAG = "rabbitmq";

function withHeartbeat(url: string): string {
  if (url.includes("heartbeat=")) {
    return url;
  }
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}heartbeat=${DEFAULT_HEARTBEAT_SECONDS}`;
}

let model: RecoveringChannelModel | null = null;
let channel: Channel | null = null;
let connecting: Promise<RecoveringChannelModel> | null = null;
let channelReady: Promise<Channel> | null = null;
let resolveChannelReady: ((ch: Channel) => void) | null = null;
let rejectChannelReady: ((err: Error) => void) | null = null;

function resetChannelReady(): void {
  channelReady = new Promise((resolve, reject) => {
    resolveChannelReady = resolve;
    rejectChannelReady = reject;
  });
}

function settleChannelReady(ch: Channel): void {
  resolveChannelReady?.(ch);
  resolveChannelReady = null;
  rejectChannelReady = null;
}

// Consumers are stored so they can be re-subscribed on every (re)connect.
// After a recovery the `setup` hook builds a fresh channel; without replaying
// these the new channel would have no consumers and messages would pile up.
const consumers: ConsumerRegistration[] = [];

async function assertQueues(ch: Channel): Promise<void> {
  for (const [name, options] of Object.entries(QUEUE_DECLARATIONS)) {
    await ch.assertQueue(QUEUES[name as QueueName], options);
  }
}

async function applyConsumer(
  ch: Channel,
  registration: ConsumerRegistration
): Promise<void> {
  const { queue, handler, options } = registration;
  if (options.prefetch != null) {
    await ch.prefetch(options.prefetch);
  }
  await ch.consume(
    QUEUES[queue],
    (msg) => {
      if (!msg) {
        return;
      }
      void Promise.resolve(handler(msg, ch)).catch((err) =>
        log.error(TAG, `consumer error on ${queue}: ${err}`)
      );
    },
    { noAck: options.noAck ?? false }
  );
}

async function applyConsumers(ch: Channel): Promise<void> {
  for (const registration of consumers) {
    await applyConsumer(ch, registration);
  }
}

function buildRecoveryOptions(cfg: QueueConfig) {
  return {
    initialDelay: cfg.reconnectDelayMs ?? DEFAULT_RECONNECT_DELAY_MS,
    maxDelay: cfg.maxReconnectDelayMs ?? DEFAULT_MAX_RECONNECT_DELAY_MS,
    factor: 2,
    jitter: 0.2,
    maxRetries: Number.POSITIVE_INFINITY,
    // Runs after every successful (re)connect: a fresh channel, queue
    // re-assertion, and consumer replay so processing self-heals after a drop.
    setup: async (m: ChannelModel) => {
      const ch = await m.createChannel();
      ch.on("error", (err) => log.error(TAG, `channel error: ${err}`));
      await assertQueues(ch);
      await applyConsumers(ch);
      channel = ch;
      settleChannelReady(ch);
    },
  };
}

function attachModelListeners(m: RecoveringChannelModel): void {
  m.on("disconnect", (err) => {
    const hadActiveChannel = channel !== null;
    channel = null;
    if (hadActiveChannel) {
      // Re-arm readiness so whenReady() waits for the next recovered channel.
      resetChannelReady();
    }
    log.warn(TAG, `disconnected: ${err}`);
  });
  m.on("reconnect-scheduled", ({ attempt, delay: delayMs }) =>
    log.warn(TAG, `reconnecting in ${delayMs}ms (attempt ${attempt})`)
  );
  m.on("error", (err) => log.error(TAG, `connection error: ${err}`));
}

/**
 * RabbitMQ connection manager with self-healing connections.
 *
 * Reconnect is delegated to amqplib's built-in `recovery`: it owns the
 * exponential backoff + jitter, and the `setup` hook re-runs on every
 * (re)connect to recreate the channel and re-assert all queues. This replaces
 * the previous hand-rolled reconnect state machine while keeping the same
 * robustness (auto-reconnect, channel recreation, queue re-assertion).
 */
export const Queue = {
  // Fire-and-forget: recovery retries in the background with backoff, so a
  // broker outage at boot never blocks startup. Publishes degrade (return
  // false) until the first connection lands and the setup hook builds a channel.
  connect(cfg: QueueConfig): void {
    if (model || connecting) {
      return;
    }

    resetChannelReady();

    connecting = amqp.connect(withHeartbeat(cfg.url), {
      recovery: buildRecoveryOptions(cfg),
      // TCP keepalive complements the AMQP heartbeat: it nudges NAT/LB layers
      // that drop idle sockets and detects half-open connections faster.
      keepAlive: true,
      keepAliveDelay: 15_000,
    });
    void connecting.then(
      (m) => {
        model = m;
        attachModelListeners(m);
        log.info(TAG, "connected");
      },
      (err) => {
        connecting = null;
        rejectChannelReady?.(
          err instanceof Error ? err : new Error(String(err))
        );
        rejectChannelReady = null;
        resolveChannelReady = null;
        channelReady = null;
        log.error(TAG, `connect failed: ${err}`);
      }
    );
  },

  /** Resolves once the first channel is ready after {@link connect}. */
  whenReady(): Promise<Channel> {
    if (channel) {
      return Promise.resolve(channel);
    }
    if (!channelReady) {
      throw new Error(
        "Queue client not initialized. Call Queue.connect() first."
      );
    }
    return channelReady;
  },

  getClient(): Channel {
    if (!channel) {
      throw new Error(
        "Queue client not initialized. Call Queue.connect() first."
      );
    }
    return channel;
  },

  isConnected(): boolean {
    return channel !== null;
  },

  /**
   * Register a consumer that survives reconnects. The handler is replayed on
   * every (re)connect against the fresh channel, so a broker drop no longer
   * silently stops message processing. Safe to call before or after connect.
   */
  async consume(
    queue: QueueName,
    handler: ConsumerHandler,
    options: ConsumerOptions = {}
  ): Promise<void> {
    const registration: ConsumerRegistration = { queue, handler, options };
    consumers.push(registration);
    // If a channel is already live, subscribe immediately; otherwise the next
    // (re)connect's setup hook will pick it up.
    if (channel) {
      await applyConsumer(channel, registration);
    }
  },

  publish(queue: QueueName, message: QueueMessage): boolean {
    if (!channel) {
      log.error(TAG, `cannot publish to ${queue}: channel unavailable`);
      return false;
    }

    try {
      const sent = channel.sendToQueue(
        QUEUES[queue],
        Buffer.from(JSON.stringify(message)),
        { persistent: true, timestamp: Date.now() }
      );

      if (!sent) {
        log.warn(
          TAG,
          `queue ${QUEUES[queue]} full or blocked — message not sent`
        );
      }
      return sent;
    } catch (err) {
      log.error(TAG, `error publishing to ${queue}: ${err}`);
      return false;
    }
  },

  async close(): Promise<void> {
    // Closing the recovering model stops the backoff loop and tears down the
    // connection + channels in one call.
    if (model) {
      try {
        await model.close();
        log.info(TAG, "closed");
      } catch (err) {
        log.error(TAG, `error during close: ${err}`);
      }
    }
    model = null;
    channel = null;
  },
};
