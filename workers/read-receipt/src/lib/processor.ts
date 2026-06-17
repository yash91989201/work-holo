import type { db } from "@work-holo/db";
import {
  channelMemberTable,
  channelReadProcessedWatermarkTable,
  channelReadTable,
  messageReadSummaryTable,
  messageReadTable,
  messageTable,
} from "@work-holo/db/schema/index";
import { env } from "@work-holo/env/read-receipt";
import { and, count, eq, gt, isNotNull, isNull, sql } from "drizzle-orm";

const MAX_RECENT_READERS = 10;

const MESSAGE_BATCH_SIZE = env.READ_RECEIPT_BATCH_SIZE;
const MAX_MEMBERS_FOR_DETAILED_TRACKING = env.MAX_MEMBERS_FOR_DETAILED_TRACKING;

const MEMBER_COUNT_CACHE_TTL = 30 * 1000; // 30 seconds in milliseconds
const memberCountCache = new Map<
  string,
  { count: number; timestamp: number }
>();

export function cleanupMemberCountCache(): void {
  const now = Date.now();
  const expiredKeys: string[] = [];

  for (const [channelId, cached] of memberCountCache.entries()) {
    if (now - cached.timestamp >= MEMBER_COUNT_CACHE_TTL) {
      expiredKeys.push(channelId);
    }
  }

  for (const key of expiredKeys) {
    memberCountCache.delete(key);
  }
}

export function invalidateMemberCountCache(channelId: string): void {
  memberCountCache.delete(channelId);
}

export interface ProcessChannelResult {
  channelId: string;
  messagesProcessed: number;
  summariesUpdated: number;
}

async function processLargeChannelReadReceipts(
  dbInstance: typeof db,
  channelId: string,
  lastProcessedAt: Date
): Promise<ProcessChannelResult> {
  let messagesProcessed = 0;
  let summariesUpdated = 0;
  let hasMore = true;
  let cursor: Date = lastProcessedAt;

  while (hasMore) {
    await dbInstance.transaction(async (tx) => {
      const messagesWithNewReads = await tx
        .select({
          messageId: messageTable.id,
          messageCreatedAt: messageTable.createdAt,
        })
        .from(messageTable)
        .innerJoin(
          channelReadTable,
          and(
            eq(channelReadTable.channelId, channelId),
            gt(channelReadTable.lastReadAt, cursor)
          )
        )
        .where(eq(messageTable.channelId, channelId))
        .groupBy(messageTable.id, messageTable.createdAt)
        .orderBy(messageTable.createdAt)
        .limit(MESSAGE_BATCH_SIZE);

      if (messagesWithNewReads.length === 0) {
        hasMore = false;
        return;
      }

      for (const { messageId, messageCreatedAt } of messagesWithNewReads) {
        const message = await tx.query.messageTable.findFirst({
          where: and(
            eq(messageTable.id, messageId),
            isNull(messageTable.deletedAt)
          ),
        });

        if (!message) continue;

        const readCountResult = await tx
          .select({
            count: count(),
            recentReaders: sql<string[]>`
            (
              SELECT ARRAY_AGG(user_id ORDER BY last_read_at DESC)
              FROM (
                SELECT ${channelReadTable.userId} as user_id, ${channelReadTable.lastReadAt} as last_read_at
                FROM ${channelReadTable}
                INNER JOIN ${messageTable} ON ${channelReadTable.lastReadMessageId} = ${messageTable.id}
                WHERE ${channelReadTable.channelId} = ${channelId}
                  AND ${channelReadTable.lastReadMessageId} IS NOT NULL
                  AND ${messageTable.createdAt} >= ${messageCreatedAt}
                ORDER BY ${channelReadTable.lastReadAt} DESC
                LIMIT 10
              ) recent_users
            )
          `,
          })
          .from(channelReadTable)
          .innerJoin(
            messageTable,
            eq(channelReadTable.lastReadMessageId, messageTable.id)
          )
          .where(
            and(
              eq(channelReadTable.channelId, channelId),
              isNotNull(channelReadTable.lastReadMessageId),
              sql`${messageTable.createdAt} >= ${messageCreatedAt}`
            )
          );

        const readData = readCountResult[0];
        if (!readData) continue;

        const readCount = Number(readData.count);
        const recentReaders = (readData.recentReaders || []) as string[];

        await tx
          .insert(messageReadSummaryTable)
          .values({
            messageId,
            readCount,
            lastReadAt: new Date(),
            recentReaders,
          })
          .onConflictDoUpdate({
            target: messageReadSummaryTable.messageId,
            set: {
              readCount,
              lastReadAt: new Date(),
              recentReaders,
              updatedAt: new Date(),
            },
          });

        summariesUpdated++;
      }

      messagesProcessed += messagesWithNewReads.length;

      if (messagesWithNewReads.length === MESSAGE_BATCH_SIZE) {
        const lastMessage = messagesWithNewReads.at(-1);
        if (lastMessage?.messageCreatedAt) {
          cursor = new Date(lastMessage.messageCreatedAt);
        }
      } else {
        hasMore = false;
      }
    });
  }

  const now = new Date();
  await dbInstance
    .insert(channelReadProcessedWatermarkTable)
    .values({
      channelId,
      lastProcessedAt: now,
    })
    .onConflictDoUpdate({
      target: channelReadProcessedWatermarkTable.channelId,
      set: {
        lastProcessedAt: now,
        updatedAt: now,
      },
    });

  return {
    channelId,
    messagesProcessed,
    summariesUpdated,
  };
}

async function processSmallChannelReadReceipts(
  dbInstance: typeof db,
  channelId: string,
  lastProcessedAt: Date
): Promise<ProcessChannelResult> {
  let messagesProcessed = 0;
  let summariesUpdated = 0;
  let hasMore = true;
  let cursor: Date = lastProcessedAt;

  while (hasMore) {
    await dbInstance.transaction(async (tx) => {
      const messagesWithNewReads = await tx
        .select({
          messageId: messageReadTable.messageId,
          lastReadAt: sql`MAX(${messageReadTable.readAt})`
            .mapWith(messageReadTable.readAt)
            .as("lastReadAt"),
        })
        .from(messageReadTable)
        .innerJoin(
          messageTable,
          eq(messageReadTable.messageId, messageTable.id)
        )
        .where(
          and(
            eq(messageTable.channelId, channelId),
            gt(messageReadTable.readAt, cursor)
          )
        )
        .groupBy(messageReadTable.messageId)
        .orderBy(sql`MAX(${messageReadTable.readAt})`)
        .limit(MESSAGE_BATCH_SIZE);

      if (messagesWithNewReads.length === 0) {
        hasMore = false;
        return;
      }

      for (const { messageId } of messagesWithNewReads) {
        const message = await tx.query.messageTable.findFirst({
          where: and(
            eq(messageTable.id, messageId),
            isNull(messageTable.deletedAt)
          ),
        });

        if (!message) continue;

        const readStatsResult = await tx
          .select({
            count: sql<number>`COUNT(DISTINCT ${messageReadTable.userId})`,
            lastReadAt: sql`MAX(${messageReadTable.readAt})`.mapWith(
              messageReadTable.readAt
            ),
          })
          .from(messageReadTable)
          .where(eq(messageReadTable.messageId, messageId));

        const readStats = readStatsResult[0];
        if (!readStats) continue;

        const recentReaders = await tx
          .select({
            userId: messageReadTable.userId,
            readAt: messageReadTable.readAt,
          })
          .from(messageReadTable)
          .where(eq(messageReadTable.messageId, messageId))
          .orderBy(sql`${messageReadTable.readAt} DESC`)
          .limit(MAX_RECENT_READERS);

        const recentReaderIds = recentReaders.map((r) => r.userId);

        await tx
          .insert(messageReadSummaryTable)
          .values({
            messageId,
            readCount: Number(readStats.count) || 0,
            lastReadAt: readStats.lastReadAt ?? new Date(),
            recentReaders: recentReaderIds,
          })
          .onConflictDoUpdate({
            target: messageReadSummaryTable.messageId,
            set: {
              readCount: Number(readStats.count) || 0,
              lastReadAt: readStats.lastReadAt ?? new Date(),
              recentReaders: recentReaderIds,
              updatedAt: new Date(),
            },
          });

        summariesUpdated++;
      }

      messagesProcessed += messagesWithNewReads.length;

      if (messagesWithNewReads.length === MESSAGE_BATCH_SIZE) {
        const lastMessage = messagesWithNewReads.at(-1);
        if (lastMessage?.lastReadAt) {
          cursor = lastMessage.lastReadAt;
        }
      } else {
        hasMore = false;
      }
    });
  }

  const now = new Date();
  await dbInstance
    .insert(channelReadProcessedWatermarkTable)
    .values({
      channelId,
      lastProcessedAt: now,
    })
    .onConflictDoUpdate({
      target: channelReadProcessedWatermarkTable.channelId,
      set: {
        lastProcessedAt: now,
        updatedAt: now,
      },
    });

  return {
    channelId,
    messagesProcessed,
    summariesUpdated,
  };
}

export async function processChannelReadReceiptsNow(
  dbInstance: typeof db,
  channelId: string,
  memberCount?: number
): Promise<ProcessChannelResult> {
  const watermark =
    await dbInstance.query.channelReadProcessedWatermarkTable.findFirst({
      where: eq(channelReadProcessedWatermarkTable.channelId, channelId),
    });

  const lastProcessedAt = watermark?.lastProcessedAt || new Date("1970-01-01");

  let finalMemberCount = memberCount;
  if (finalMemberCount === undefined) {
    const now = Date.now();
    const cached = memberCountCache.get(channelId);

    if (cached && now - cached.timestamp < MEMBER_COUNT_CACHE_TTL) {
      finalMemberCount = cached.count;
    } else {
      const countResult = await dbInstance
        .select({ count: count() })
        .from(channelMemberTable)
        .where(eq(channelMemberTable.channelId, channelId));

      finalMemberCount = Number(countResult[0]?.count || 0);

      memberCountCache.set(channelId, {
        count: finalMemberCount,
        timestamp: now,
      });
    }
  } else {
    memberCountCache.set(channelId, {
      count: finalMemberCount,
      timestamp: Date.now(),
    });
  }

  if (finalMemberCount <= MAX_MEMBERS_FOR_DETAILED_TRACKING) {
    return processSmallChannelReadReceipts(
      dbInstance,
      channelId,
      lastProcessedAt
    );
  }

  return processLargeChannelReadReceipts(
    dbInstance,
    channelId,
    lastProcessedAt
  );
}
