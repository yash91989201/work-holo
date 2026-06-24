import { db } from "@work-holo/db";
import { callParticipantTable, callTable } from "@work-holo/db/schema/index";
import { env } from "@work-holo/env/call-timeout";
import {
  type CallRingTimeoutQueueMessage,
  PusherClient,
  QUEUES,
  Queue,
} from "@work-holo/infrastructure";
import type { Channel } from "amqplib";
import { eq } from "drizzle-orm";

const PREFETCH_COUNT = Number(env.PREFETCH_COUNT ?? 10);

/**
 * Fired 30s after a DM call is initiated. If the call is still `ringing`
 * (nobody accepted, caller didn't cancel), mark it missed and notify both
 * parties. If it was already answered/rejected/cancelled, this is a no-op.
 */
async function handleMessage(
  message: CallRingTimeoutQueueMessage
): Promise<void> {
  if (message.type !== "ring_timeout") {
    console.warn("Unknown message type:", message);
    return;
  }

  const call = await db.query.callTable.findFirst({
    where: eq(callTable.id, message.callId),
  });

  if (!call) {
    console.log(`Call ${message.callId} not found, skipping`);
    return;
  }

  if (call.status !== "ringing") {
    console.log(
      `Call ${message.callId} is ${call.status}, not ringing — no timeout action`
    );
    return;
  }

  await db
    .update(callTable)
    .set({ status: "missed" })
    .where(eq(callTable.id, message.callId));

  const participants = await db
    .select({ userId: callParticipantTable.userId })
    .from(callParticipantTable)
    .where(eq(callParticipantTable.callId, message.callId));

  const pusher = PusherClient.getClient();
  for (const p of participants) {
    await pusher.trigger(`private-user-${p.userId}`, "call.missed", {
      callId: message.callId,
    });
  }

  console.log(`Call ${message.callId} marked missed (ring timeout)`);
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
      `Starting to consume messages from queue: ${QUEUES.CALL_RING_TIMEOUT_DLX}`
    );

    await this.channel.consume(
      QUEUES.CALL_RING_TIMEOUT_DLX,
      async (msg) => {
        if (!msg) {
          return;
        }

        try {
          const content = msg.content.toString();
          const message: CallRingTimeoutQueueMessage = JSON.parse(content);

          if (this.channel) {
            this.channel.ack(msg);
          }

          await handleMessage(message);
        } catch (error) {
          console.error("Error processing message:", error);
        }
      },
      { noAck: false }
    );

    console.log("Worker is now consuming messages. Press CTRL+C to exit.\n");
  }

  async close(): Promise<void> {
    console.log("\nShutting down call-timeout worker gracefully...");
    await Queue.close();
    this.channel = null;
    console.log("RabbitMQ connection closed successfully");
  }
}

async function startWorker() {
  console.log("===========================================");
  console.log("Call Timeout Worker Starting...");
  console.log("===========================================");
  console.log(`Environment: ${env.ENV}`);
  console.log(`RabbitMQ URL: ${env.RABBITMQ_URL}`);
  console.log(`Prefetch Count: ${PREFETCH_COUNT}`);
  console.log("===========================================\n");

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

  console.log("Pusher client initialized");

  try {
    await worker.connect();
    await worker.consume();

    const shutdown = async () => {
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
  console.error("[Call Timeout Worker] Failed to start:", error);
  process.exit(1);
});
