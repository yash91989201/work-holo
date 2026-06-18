import { db } from "@work-holo/db";
import {
  channelReadTable,
  messageReadTable,
  messageTable,
  user as userTable,
} from "@work-holo/db/schema/index";
import { desc, eq, sql } from "drizzle-orm";

/**
 * Prepared statement for fetching message readers in small channels (<=25 members)
 * Uses messageRead table for detailed tracking
 * Excludes the current user from results
 * Uses DISTINCT ON to ensure each user appears only once
 */
export const smallChannelReadersSql = db
  .selectDistinctOn([userTable.id], {
    id: userTable.id,
    name: userTable.name,
    email: userTable.email,
    image: userTable.image,
    readAt: messageReadTable.readAt,
  })
  .from(messageReadTable)
  .innerJoin(userTable, eq(messageReadTable.userId, userTable.id))
  .where(
    sql`${messageReadTable.messageId} = ${sql.placeholder("messageId")} AND ${messageReadTable.userId} != ${sql.placeholder("currentUserId")}`
  )
  .orderBy(userTable.id, desc(messageReadTable.readAt))
  .prepare("get_small_channel_readers");

/**
 * Prepared statement for fetching message readers in large channels (>25 members)
 * Uses channelRead table for aggregated tracking
 * Filters by message creation time to only include users who have read past the message
 * Excludes the current user from results
 */
export const largeChannelReadersSql = db
  .select({
    id: userTable.id,
    name: userTable.name,
    email: userTable.email,
    image: userTable.image,
    readAt: sql`${channelReadTable.lastReadAt}`
      .mapWith(channelReadTable.lastReadAt)
      .as("readAt"),
  })
  .from(channelReadTable)
  .innerJoin(userTable, eq(channelReadTable.userId, userTable.id))
  .innerJoin(
    messageTable,
    eq(channelReadTable.lastReadMessageId, messageTable.id)
  )
  .where(
    sql`${channelReadTable.channelId} = ${sql.placeholder("channelId")} 
        AND ${channelReadTable.userId} != ${sql.placeholder("currentUserId")}
        AND ${channelReadTable.lastReadMessageId} IS NOT NULL
        AND ${channelReadTable.lastReadAt} IS NOT NULL
        AND ${messageTable.createdAt} >= ${sql.placeholder("messageCreatedAt")}`
  )
  .orderBy(desc(channelReadTable.lastReadAt))
  .prepare("get_large_channel_readers");
