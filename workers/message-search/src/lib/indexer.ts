import type {
  MessageSearchDocument,
  OpenSearchClient,
} from "@work-holo/infrastructure";
import { MESSAGE_SEARCH_INDEX } from "@work-holo/infrastructure";

const MENTION_SPAN_REGEX =
  /<span\b([^>]*\bdata-type\s*=\s*["']mention["'][^>]*)>([\s\S]*?)<\/span>/gi;
const BR_TAG_REGEX = /<br\s*\/?>/gi;
const BLOCK_CLOSE_TAG_REGEX = /<\/(p|div|li|ul|ol|blockquote|h[1-6])>/gi;
const BLOCK_OPEN_TAG_REGEX = /<(p|div|li|ul|ol|blockquote|h[1-6])\b[^>]*>/gi;
const HTML_TAG_REGEX = /<[^>]+>/g;
const NAMED_ENTITY_REGEX = /&(?:amp|lt|gt|quot|apos|nbsp);/gi;
const DECIMAL_ENTITY_REGEX = /&#(\d+);/g;
const HEX_ENTITY_REGEX = /&#x([0-9a-f]+);/gi;
const MAX_UNICODE_CODE_POINT = 0x10_ff_ff;

const NAMED_ENTITY_MAP: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
};

export type SearchDocument = MessageSearchDocument;
export type Client = ReturnType<(typeof OpenSearchClient)["getClient"]>;

function decodeHtmlEntities(input: string): string {
  return input
    .replace(NAMED_ENTITY_REGEX, (entity) => {
      const key = entity.slice(1, -1).toLowerCase();
      return NAMED_ENTITY_MAP[key] ?? entity;
    })
    .replace(HEX_ENTITY_REGEX, (_match, hex) => {
      const codePoint = Number.parseInt(hex, 16);
      if (
        !Number.isInteger(codePoint) ||
        codePoint < 0 ||
        codePoint > MAX_UNICODE_CODE_POINT
      ) {
        return "";
      }

      return String.fromCodePoint(codePoint);
    })
    .replace(DECIMAL_ENTITY_REGEX, (_match, decimal) => {
      const codePoint = Number.parseInt(decimal, 10);
      if (
        !Number.isInteger(codePoint) ||
        codePoint < 0 ||
        codePoint > MAX_UNICODE_CODE_POINT
      ) {
        return "";
      }

      return String.fromCodePoint(codePoint);
    });
}

function getAttributeValue(
  attributes: string,
  name: string
): string | undefined {
  const pattern = new RegExp(
    `${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'>]+))`,
    "i"
  );
  const match = attributes.match(pattern);
  const value = match?.[1] ?? match?.[2] ?? match?.[3];

  return value?.trim() || undefined;
}

function extractMentionDisplayName(
  attributes: string,
  innerHtml: string
): string {
  const fallbackText = decodeHtmlEntities(
    innerHtml.replace(HTML_TAG_REGEX, " ")
  )
    .replace(/\s+/g, " ")
    .trim();

  if (fallbackText.length > 0) {
    return fallbackText;
  }

  const attrName =
    getAttributeValue(attributes, "data-label") ??
    getAttributeValue(attributes, "data-name") ??
    getAttributeValue(attributes, "data-id") ??
    "";

  if (attrName.length === 0) {
    return "";
  }

  return attrName.startsWith("@") ? attrName : `@${attrName}`;
}

export function stripHtmlToPlainText(html: string): string {
  if (typeof html !== "string" || html.trim().length === 0) {
    return "";
  }

  const withMentions = html.replace(
    MENTION_SPAN_REGEX,
    (_match, attributes: string, innerHtml: string) =>
      extractMentionDisplayName(attributes, innerHtml)
  );

  const withoutTags = withMentions
    .replace(BR_TAG_REGEX, "\n")
    .replace(BLOCK_CLOSE_TAG_REGEX, "\n")
    .replace(BLOCK_OPEN_TAG_REGEX, " ")
    .replace(HTML_TAG_REGEX, " ");

  const decoded = decodeHtmlEntities(withoutTags);

  return decoded
    .replace(/\u00A0/g, " ")
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .replace(/\n+/g, " ")
    .trim();
}

export async function indexMessage(
  client: Client,
  doc: SearchDocument
): Promise<void> {
  await client.index({
    index: MESSAGE_SEARCH_INDEX,
    id: doc.messageId,
    body: doc,
    refresh: "wait_for",
  });
}

export async function deleteMessage(
  client: Client,
  messageId: string
): Promise<void> {
  try {
    await client.delete({
      index: MESSAGE_SEARCH_INDEX,
      id: messageId,
      refresh: "wait_for",
    });
  } catch (error: unknown) {
    const statusCode =
      typeof error === "object" && error !== null && "statusCode" in error
        ? Number((error as any).statusCode)
        : typeof error === "object" &&
            error !== null &&
            "meta" in error &&
            typeof (error as any).meta === "object" &&
            (error as any).meta !== null &&
            "statusCode" in (error as any).meta
          ? Number((error as any).meta.statusCode)
          : undefined;

    if (statusCode === 404) {
      return;
    }

    throw error;
  }
}
