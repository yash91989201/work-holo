import type { Client } from "@opensearch-project/opensearch";

export const MESSAGE_SEARCH_INDEX = "message_search";

export interface MessageSearchDocument {
  contentPlain: string;
  createdAt: string;
  hasAttachments: boolean;
  isPinned: boolean;
  mentionedUserIds: string[];
  messageId: string;
  messageType: string;
  organizationId: string;
  parentMessageId?: string;
  scopeId: string;
  scopeType: "channel" | "dm";
  senderId: string;
  senderName: string;
  updatedAt: string;
}

export const messageSearchIndexSettings = {
  settings: {
    index: {
      number_of_shards: 1,
      number_of_replicas: 0,
    },
    analysis: {
      analyzer: {
        message_analyzer: {
          type: "custom",
          tokenizer: "standard",
          filter: ["lowercase", "english_stop", "english_stemmer"],
        },
        message_search_analyzer: {
          type: "custom",
          tokenizer: "standard",
          filter: ["lowercase", "english_stop", "english_stemmer"],
        },
      },
      filter: {
        english_stop: {
          type: "stop",
          stopwords: "_english_",
        },
        english_stemmer: {
          type: "stemmer",
          language: "english",
        },
      },
    },
  },
  mappings: {
    properties: {
      messageId: {
        type: "keyword",
      },
      organizationId: {
        type: "keyword",
      },
      scopeType: {
        type: "keyword",
      },
      scopeId: {
        type: "keyword",
      },
      senderId: {
        type: "keyword",
      },
      senderName: {
        type: "text",
      },
      contentPlain: {
        type: "text",
        analyzer: "message_analyzer",
        search_analyzer: "message_search_analyzer",
      },
      messageType: {
        type: "keyword",
      },
      parentMessageId: {
        type: "keyword",
      },
      isPinned: {
        type: "boolean",
      },
      hasAttachments: {
        type: "boolean",
      },
      mentionedUserIds: {
        type: "keyword",
      },
      createdAt: {
        type: "date",
      },
      updatedAt: {
        type: "date",
      },
    },
  },
};

export async function ensureSearchIndex(client: Client): Promise<void> {
  try {
    // Check if index exists
    const indexExists = await client.indices.exists({
      index: MESSAGE_SEARCH_INDEX,
    });

    if (indexExists.body) {
      // Index already exists, skip creation
      return;
    }
  } catch (err) {
    // If error checking existence, attempt creation anyway
    // but don't fail if it already exists
  }

  try {
    // Create index with settings and mappings
    await client.indices.create({
      index: MESSAGE_SEARCH_INDEX,
      body: messageSearchIndexSettings,
    });

    console.log(`[opensearch] Created index: ${MESSAGE_SEARCH_INDEX}`);
  } catch (err: unknown) {
    // Handle the case where index was created between our check and creation attempt
    if (
      err &&
      typeof err === "object" &&
      "body" in err &&
      typeof err.body === "object" &&
      err.body !== null &&
      "error" in err.body &&
      typeof err.body.error === "object" &&
      err.body.error !== null &&
      "type" in err.body.error &&
      err.body.error.type === "resource_already_exists_exception"
    ) {
      // Index already exists, this is fine (idempotent)
      console.log(`[opensearch] Index already exists: ${MESSAGE_SEARCH_INDEX}`);
      return;
    }

    throw err;
  }
}
