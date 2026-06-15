import { Client } from "@opensearch-project/opensearch";
import { log } from "evlog";

export interface OpenSearchConfig {
  url: string;
}

export interface OpenSearchConnectOptions {
  /** Throw instead of degrading to lazy retry when the initial probe fails. */
  throwOnError?: boolean;
}

const TAG = "opensearch";

let client: Client | null = null;
let config: OpenSearchConfig | null = null;
let connecting: Promise<void> | null = null;

function build(url: string): Client {
  return new Client({
    node: url,
    ssl: { rejectUnauthorized: false },
  });
}

async function probe(candidate: Client): Promise<void> {
  await candidate.cluster.health();
}

/**
 * OpenSearch connection manager.
 *
 * OpenSearch is stateless HTTP, so "connecting" is really a one-time health
 * probe. The server boots tolerantly (probe failure degrades to lazy retry via
 * {@link OpenSearchClient.ensureConnected}); workers that hard-depend on search
 * pass `throwOnError` to fail fast at startup.
 */
export const OpenSearchClient = {
  async connect(
    cfg: OpenSearchConfig,
    options?: OpenSearchConnectOptions
  ): Promise<void> {
    config = cfg;

    if (client) {
      return;
    }
    if (connecting) {
      await connecting;
      return;
    }

    connecting = (async () => {
      const candidate = build(cfg.url);
      try {
        await probe(candidate);
        client = candidate;
        log.info(TAG, "connected");
      } catch (err) {
        log.warn(TAG, "initial connect failed — will retry lazily");
        client = null;
        if (options?.throwOnError) {
          throw err;
        }
      } finally {
        connecting = null;
      }
    })();

    await connecting;
  },

  getClient(): Client {
    if (!client) {
      throw new Error(
        "OpenSearch client not initialized. Call OpenSearchClient.connect() first."
      );
    }
    return client;
  },

  /**
   * Returns a live client, transparently retrying the connection if a prior
   * probe failed. Use this on request paths so a brief startup outage doesn't
   * permanently disable search.
   */
  async ensureConnected(): Promise<Client> {
    if (client) {
      return client;
    }
    if (!config) {
      throw new Error(
        "OpenSearch config not set. Call OpenSearchClient.connect() first."
      );
    }

    await OpenSearchClient.connect(config, { throwOnError: true });

    if (!client) {
      throw new Error("failed to connect to OpenSearch after retry");
    }
    return client;
  },

  isConnected(): boolean {
    return client !== null;
  },

  async close(): Promise<void> {
    if (client) {
      await client.close();
      client = null;
      connecting = null;
      log.info(TAG, "closed");
    }
  },
};
