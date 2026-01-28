// Helper function to verify channel membership for message operations
// This can be imported and reused across message router endpoints
import { ORPCError } from "@orpc/server";
import {
  channelMemberTable,
  channelTable,
  messageTable,
} from "@work-holo/db/schema/index";
import { and, eq } from "drizzle-orm";
import type { Context } from "../../context";

/**
 * Verifies user is a member of the specified channel
 * @throws ORPCError if not a member or channel doesn't belong to org
 */
export async function verifyChannelMembership(
  db: Context["db"],
  channelId: string,
  userId: string,
  orgId: string
) {
  const channel = await db.query.channelTable.findFirst({
    where: eq(channelTable.id, channelId),
    columns: { organizationId: true },
  });

  if (!channel) {
    throw new ORPCError("NOT_FOUND", {
      message: "Channel not found",
    });
  }

  if (channel.organizationId !== orgId) {
    throw new ORPCError("FORBIDDEN", {
      message: "Channel does not belong to your organization",
    });
  }

  const membership = await db.query.channelMemberTable.findFirst({
    where: and(
      eq(channelMemberTable.channelId, channelId),
      eq(channelMemberTable.userId, userId)
    ),
  });

  if (!membership) {
    throw new ORPCError("FORBIDDEN", {
      message: "You are not a member of this channel",
    });
  }
}

/**
 * Resolves a message to its channel and verifies membership
 * @throws ORPCError if message not found or user not a channel member
 */
export async function verifyMessageChannelMembership(
  db: Context["db"],
  messageId: string,
  userId: string,
  orgId: string
) {
  const message = await db.query.messageTable.findFirst({
    where: eq(messageTable.id, messageId),
    columns: { channelId: true },
  });

  if (!message) {
    throw new ORPCError("NOT_FOUND", {
      message: "Message not found",
    });
  }

  await verifyChannelMembership(db, message.channelId, userId, orgId);
}
