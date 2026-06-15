import { log } from "evlog";
import { env } from "@work-holo/env/search-worker";
import {
  ensureSearchIndex,
  OpenSearchClient,
  QUEUES,
  Queue,
  type SearchIndexQueueMessage,
} from "@work-holo/infrastructure";
import type { Channel, ConsumeMessage } from "amqplib";
import { handleSearchIndexMessage } from "./lib/processor";

const TAG = "message-search";

const PREFETCH_COUNT = env.PREFETCH_COUNT;
const MAX_RETRIES = env.MAX_RETRIES;

async function handleMessage(message: SearchIndexQueueMessage): Promise<void> {
  log.info(
    TAG,
    `Processing ${message.action} for message: ${message.messageId}`
  );

  const client = OpenSearchClient.getClient();
  await handleSearchIndexMessage(client, message);
}

class QueueWorker {
  private channel: Channel | null = null;

  async connect(): Promise<void> {
    await Queue.connect({ url: env.RABBITMQ_URL });
    this.channel = Queue.getClient();
    log.info(TAG, "Connected to RabbitMQ successfully");
  }

  async consume(): Promise<void> {
    if (!this.channel) {
      throw new Error("Channel not initialized");
    }

    await this.channel.prefetch(PREFETCH_COUNT);

    log.info(
      TAG,
      `Starting to consume messages from queue: ${QUEUES.SEARCH_INDEXING}`
    );
    log.info(TAG, `Prefetch count: ${PREFETCH_COUNT}`);

    await this.channel.consume(
      QUEUES.SEARCH_INDEXING,
      async (msg: ConsumeMessage | null) => {
        if (!msg) return;

        try {
          const content = msg.content.toString();
          const message: SearchIndexQueueMessage = JSON.parse(content);

          await handleMessage(message);

          if (this.channel) {
            this.channel.ack(msg);
          }
        } catch (error) {
          log.error({
            tag: TAG,
            message: "Error processing message",
            error: error instanceof Error ? error.message : String(error),
          });

          if (!this.channel) return;

          const headers = msg.properties.headers || {};
          const retryCount = (headers["x-retries"] as number) || 0;

          if (retryCount >= MAX_RETRIES) {
            log.error({
              tag: TAG,
              message: `Message ${msg.properties.messageId} exceeded max retries (${MAX_RETRIES}). Discarding.`,
            });
            this.channel.ack(msg);
            return;
          }

          // Republish with incremented retry count
          const updatedHeaders = {
            ...headers,
            "x-retries": retryCount + 1,
          };

          this.channel.publish("", QUEUES.SEARCH_INDEXING, msg.content, {
            ...msg.properties,
            headers: updatedHeaders,
          });

          // Ack the original message
          this.channel.ack(msg);
        }
      },
      {
        noAck: false,
      }
    );

    log.info(TAG, "Worker is now consuming messages. Press CTRL+C to exit.");
  }

  async close(): Promise<void> {
    log.info({ tag: TAG, message: "Shutting down worker gracefully" });

    await Queue.close();
    this.channel = null;
    log.info(TAG, "RabbitMQ connection closed successfully");

    await OpenSearchClient.close();
    log.info(TAG, "OpenSearch connection closed successfully");
  }
}

async function startWorker() {
  log.info({
    tag: TAG,
    message: "Message Search Worker Starting",
    environment: env.ENV,
    rabbitmqUrl: env.RABBITMQ_URL,
    opensearchUrl: env.OPENSEARCH_URL,
    prefetchCount: PREFETCH_COUNT,
  });

  const worker = new QueueWorker();

  try {
    await OpenSearchClient.connect(
      { url: env.OPENSEARCH_URL },
      { throwOnError: true }
    );
    log.info(TAG, "Connected to OpenSearch successfully");

    const searchClient = OpenSearchClient.getClient();
    await ensureSearchIndex(searchClient);
    log.info(TAG, "Search index ensured");

    await worker.connect();
    await worker.consume();

    const shutdown = async () => {
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
