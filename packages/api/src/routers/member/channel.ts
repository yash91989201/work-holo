import { ORPCError } from "@orpc/client";
import {
  channelMemberTable,
  channelTable,
  messageTable,
} from "@work-holo/db/schema/index";
import { and, desc, eq, getTableColumns, inArray } from "drizzle-orm";
import { protectedProcedure } from "../../index";

export const memberChannelRouter = {
  listChannels: protectedProcedure.handler(
    async ({ context: { db, session } }) => {
      const organizationId = session.session.activeOrganizationId;

      if (!organizationId) {
        throw new ORPCError("BAD_REQUEST", {
          message: "No active organization",
        });
      }

      const userId = session.user.id;

      const channels = await db
        .select({ ...getTableColumns(channelTable) })
        .from(channelTable)
        .innerJoin(
          channelMemberTable,
          eq(channelMemberTable.channelId, channelTable.id)
        )
        .where(
          and(
            eq(channelMemberTable.userId, userId),
            eq(channelTable.organizationId, organizationId)
          )
        );

      return { channels };
    }
  ),
  recentChannels: protectedProcedure.handler(
    async ({ context: { db, session } }) => {
      const recentMessages = await db.query.messageTable.findMany({
        where: eq(messageTable.senderId, session.user.id),
        orderBy: [desc(messageTable.createdAt)],
        limit: 5,
        columns: {
          channelId: true,
        },
      });

      if (recentMessages.length === 0) {
        return [];
      }

      const recentChannelIds = recentMessages.map(
        (message) => message.channelId
      );

      const recentChannels = await db.query.channelTable.findMany({
        where: inArray(channelTable.id, recentChannelIds),
        with: {
          creator: true,
          members: true,
        },
      });

      return recentChannels;
    }
  ),
};
