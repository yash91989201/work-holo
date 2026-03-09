import { env } from "@work-holo/env/search-worker";
import {
  ensureSearchIndex,
  OpenSearchClient,
  QUEUES,
  Queue,
  type SearchIndexQueueMessage,
} from "@work-holo/infrastructure";
import type { Channel } from "amqplib";
import { handleSearchIndexMessage } from "./lib/processor";

const PREFETCH_COUNT = env.PREFETCH_COUNT;

async function handleMessage(message: SearchIndexQueueMessage): Promise<void> {
  console.log(
    `[Message Search Worker] Processing ${message.action} for message: ${message.messageId}`
  );

  const client = OpenSearchClient.getClient();
  await handleSearchIndexMessage(client, message);
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
      `Starting to consume messages from queue: ${QUEUES.SEARCH_INDEXING}`
    );
    console.log(`Prefetch count: ${PREFETCH_COUNT}`);

    await this.channel.consume(
      QUEUES.SEARCH_INDEXING,
      async (msg) => {
        if (!msg) return;

        try {
          const content = msg.content.toString();
          const message: SearchIndexQueueMessage = JSON.parse(content);

          await handleMessage(message);

          if (this.channel) {
            this.channel.ack(msg);
          }
        } catch (error) {
          console.error(
            "[Message Search Worker] Error processing message:",
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

    await OpenSearchClient.close();
    console.log("OpenSearch connection closed successfully");
  }
}

async function startWorker() {
  console.log("===========================================");
  console.log("Message Search Worker Starting...");
  console.log("===========================================");
  console.log(`Environment: ${env.ENV}`);
  console.log(`RabbitMQ URL: ${env.RABBITMQ_URL}`);
  console.log(`OpenSearch URL: ${env.OPENSEARCH_URL}`);
  console.log(`Prefetch Count: ${PREFETCH_COUNT}`);
  console.log("===========================================\n");

  const worker = new QueueWorker();

  try {
    await OpenSearchClient.connect({ url: env.OPENSEARCH_URL });
    console.log("Connected to OpenSearch successfully");

    const searchClient = OpenSearchClient.getClient();
    await ensureSearchIndex(searchClient);
    console.log("Search index ensured");

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
  console.error("[Message Search Worker] Failed to start:", error);
  process.exit(1);
});
