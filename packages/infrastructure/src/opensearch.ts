import { Client } from "@opensearch-project/opensearch";

export interface OpenSearchConfig {
  url: string;
}

let client: Client | null = null;
let connectPromise: Promise<void> | null = null;
let savedConfig: OpenSearchConfig | null = null;

function createClient(url: string): Client {
  const c = new Client({
    node: url,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  return c;
}

// biome-ignore lint/complexity/noStaticOnlyClass: Singleton pattern with encapsulated state
export class OpenSearchClient {
  static async connect(
    config: OpenSearchConfig,
    options?: { throwOnError?: boolean }
  ): Promise<void> {
    if (client) return;
    savedConfig = config;

    if (connectPromise) {
      await connectPromise;
      return;
    }

    connectPromise = (async () => {
      const c = createClient(config.url);
      try {
        await c.cluster.health();
        client = c;
        console.log("[opensearch] connected");
      } catch (err) {
        console.warn("[opensearch] initial connect failed — will retry lazily");
        client = null;
        connectPromise = null;
        if (options?.throwOnError) {
          throw err;
        }
      }
    })();

    await connectPromise;
  }

  static getClient(): Client {
    if (!client) {
      throw new Error(
        "OpenSearch client not initialized. Call OpenSearchClient.connect() first."
      );
    }
    return client;
  }

  static async ensureConnected(): Promise<Client> {
    if (client) return client;

    if (!savedConfig) {
      throw new Error(
        "OpenSearch config not set. Call OpenSearchClient.connect() first."
      );
    }

    await OpenSearchClient.connect(savedConfig, { throwOnError: true });

    if (!client) {
      throw new Error("[opensearch] failed to connect after retry");
    }

    return client;
  }

  static isConnected(): boolean {
    return client !== null;
  }

  static async close(): Promise<void> {
    if (client) {
      await client.close();
      client = null;
      connectPromise = null;
      console.log("[opensearch] closed");
    }
  }
}
