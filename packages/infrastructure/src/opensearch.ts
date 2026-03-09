import { Client } from "@opensearch-project/opensearch";

export interface OpenSearchConfig {
  url: string;
}

let client: Client | null = null;
let connectPromise: Promise<void> | null = null;

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
  static async connect(config: OpenSearchConfig): Promise<void> {
    if (client) return;
    if (connectPromise) return;

    connectPromise = (async () => {
      const c = createClient(config.url);
      try {
        await c.cluster.health();
        client = c;
        console.log("[opensearch] connected");
      } catch (err) {
        console.error("[opensearch] initial connect failed:", err);
        client = null;
        connectPromise = null;
        throw err;
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
