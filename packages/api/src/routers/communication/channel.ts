import { ORPCError } from "@orpc/server";
import { ChannelSchema } from "@work-holo/db/lib/schemas/db-tables";
import {
  channelJoinRequestTable,
  channelMemberTable,
  channelTable,
  member,
  notificationTable,
  teamMember,
  user as userTable,
} from "@work-holo/db/schema/index";
import { and, asc, count, desc, eq, inArray, like, not } from "drizzle-orm";
import type { Context } from "../../context";
import { orgAdminProcedure, orgMemberProcedure } from "../../index";
import { generateTxId } from "../../lib/electric-proxy";
import {
  ChannelJoinRequestInput,
  ChannelJoinRequestOutput,
  CreateChannelInput,
  CreateChannelOutput,
  DeleteChannelInput,
  DeletechannelOutput,
  GetChannelInput,
  GetChannelOutput,
  IsChannelMemberInput,
  IsChannelMemberOutput,
  ListChannelMembersInput,
  ListChannelMembersOutput,
  ListChannelsInput,
  ListChannelsOutput,
  ListJoinRequestInput,
  ListJoinRequestOutput,
  ModifyChannelMembersInput,
  SuccessOutput,
  UpdateChannelInput,
} from "../../lib/schemas/channel";

/**
 * Verifies user is a member of the specified channel
 * @throws ORPCError if not a member or channel doesn't belong to org
 */
async function verifyChannelMembership(
  db: Context["db"],
  channelId: string,
  userId: string,
  orgId: string
) {
  // First verify channel belongs to org
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

  // Verify user is channel member
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

export const channelRouter = {
  create: orgMemberProcedure
    .input(CreateChannelInput)
    .output(CreateChannelOutput)
    .handler(async ({ input, context: { db, orgId } }) => {
      try {
        const { txid, channel } = await db.transaction(async (tx) => {
          const txid = await generateTxId(tx);

          const [channel] = await tx
            .insert(channelTable)
            .values({
              ...input,
              organizationId: orgId,
            })
            .returning();

          if (!channel) {
            throw new ORPCError("INTERNAL_SERVER_ERROR", {
              message: "Failed to create channel.",
            });
          }

          const ownerAdminUsers = await tx.query.member.findMany({
            where: and(
              not(eq(member.role, "member")),
              eq(member.organizationId, orgId)
            ),
            columns: {
              userId: true,
              role: true,
            },
          });

          const ownerAdminChannelMembers = ownerAdminUsers.map((user) => ({
            channelId: channel.id,
            ...user,
          }));

          if (input.type === "team" && input.teamId) {
            const ownerAdminUsersIds = ownerAdminUsers.map((u) => u.userId);
            const teamMemberIds = await tx.query.teamMember.findMany({
              where: and(
                eq(teamMember.teamId, input.teamId),
                not(inArray(teamMember.userId, ownerAdminUsersIds))
              ),
              columns: {
                userId: true,
              },
            });

            const teamChannelMembers = teamMemberIds.map((member) => ({
              channelId: channel.id,
              userId: member.userId,
              role: "member",
            }));

            await tx
              .insert(channelMemberTable)
              .values([...teamChannelMembers, ...ownerAdminChannelMembers])
              .returning();

            return { txid, channel };
          }

          const channelMembers = input.memberIds.map((memberId) => ({
            channelId: channel.id,
            userId: memberId,
            role: "member",
          }));

          await tx
            .insert(channelMemberTable)
            .values([...channelMembers, ...ownerAdminChannelMembers])
            .returning();

          return { txid, channel };
        });

        return {
          txid,
          channel,
        };
      } catch (error) {
        console.error(error);
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "An error occurred while creating the channel.",
        });
      }
    }),

  update: orgMemberProcedure
    .input(UpdateChannelInput)
    .output(ChannelSchema)
    .handler(async ({ input, context: { db, session, orgId } }) => {
      await verifyChannelMembership(
        db,
        input.channelId,
        session.user.id,
        orgId
      );
      const [updatedChannel] = await db
        .update(channelTable)
        .set(input)
        .where(eq(channelTable.id, input.channelId))
        .returning();

      if (!updatedChannel) {
        throw new ORPCError("NOT_FOUND", {
          message: "Channel not found or could not be updated.",
        });
      }

      return updatedChannel;
    }),

  get: orgMemberProcedure
    .input(GetChannelInput)
    .output(GetChannelOutput)
    .handler(async ({ context: { db, session, orgId }, input }) => {
      await verifyChannelMembership(
        db,
        input.channelId,
        session.user.id,
        orgId
      );
      const channel = await db.query.channelTable.findFirst({
        where: eq(channelTable.id, input.channelId),
        with: {
          creator: true,
        },
      });

      if (!channel) {
        throw new Error(
          "This channel does not exist or you do not have access to it."
        );
      }

      return channel;
    }),

  list: orgMemberProcedure
    .input(ListChannelsInput)
    .output(ListChannelsOutput)
    .handler(async ({ context: { db, session, orgId }, input }) => {
      const userId = session.user.id;
      const { page, limit, search, filters, sorting } = input;
      const offset = (page - 1) * limit;

      // Base conditions: org match + user is channel member
      const conditions = [
        eq(channelTable.organizationId, orgId),
        // CRITICAL: Only show channels user is member of
        inArray(
          channelTable.id,
          db
            .select({ channelId: channelMemberTable.channelId })
            .from(channelMemberTable)
            .where(eq(channelMemberTable.userId, userId))
        ),
      ];

      if (search) {
        conditions.push(like(channelTable.name, `%${search}%`));
      }

      if (filters?.type) {
        conditions.push(eq(channelTable.type, filters.type));
      }

      if (filters?.teamId) {
        conditions.push(eq(channelTable.teamId, filters.teamId));
      }

      if (!filters?.includeArchived) {
        conditions.push(eq(channelTable.isArchived, false));
      }

      const whereClause =
        conditions.length > 1 ? and(...conditions) : conditions[0];

      let orderBy = [desc(channelTable.createdAt)];

      if (sorting && sorting.length > 0) {
        orderBy = sorting.map((sort) => {
          if (sort.id === "name")
            return sort.desc ? desc(channelTable.name) : asc(channelTable.name);
          if (sort.id === "createdAt")
            return sort.desc
              ? desc(channelTable.createdAt)
              : asc(channelTable.createdAt);
          if (sort.id === "type")
            return sort.desc ? desc(channelTable.type) : asc(channelTable.type);
          return desc(channelTable.createdAt);
        });
      }

      const channels = await db.query.channelTable.findMany({
        where: whereClause,
        limit,
        offset,
        orderBy,
        with: {
          creator: true,
        },
      });

      const totalResult = await db
        .select({ count: count() })
        .from(channelTable)
        .where(whereClause);
      const total = Number(totalResult[0]?.count ?? 0);
      const pageCount = Math.ceil(total / limit);

      return {
        channels,
        total,
        pageCount,
      };
    }),

  listMembers: orgMemberProcedure
    .input(ListChannelMembersInput)
    .output(ListChannelMembersOutput)
    .handler(async ({ input, context: { db, session, orgId } }) => {
      await verifyChannelMembership(
        db,
        input.channelId,
        session.user.id,
        orgId
      );
      const filter = input?.filter;
      const members = await db
        .select({
          id: userTable.id,
          name: userTable.name,
          email: userTable.email,
          image: userTable.image,
          role: channelMemberTable.role,
          joinedAt: channelMemberTable.joinedAt,
        })
        .from(channelMemberTable)
        .innerJoin(userTable, eq(channelMemberTable.userId, userTable.id))
        .where(
          and(
            eq(channelMemberTable.channelId, input.channelId),
            filter?.role ? eq(channelMemberTable.role, filter.role) : undefined
          )
        );

      return members;
    }),
  isMember: orgMemberProcedure
    .input(IsChannelMemberInput)
    .output(IsChannelMemberOutput)
    .handler(async ({ input, context: { db, session, orgId } }) => {
      // Verify channel belongs to org
      const channel = await db.query.channelTable.findFirst({
        where: eq(channelTable.id, input.channelId),
        columns: { organizationId: true },
      });
      if (!channel || channel.organizationId !== orgId) {
        throw new ORPCError("NOT_FOUND", { message: "Channel not found" });
      }
      const isMember = await db.query.channelMemberTable.findFirst({
        where: and(
          eq(channelMemberTable.channelId, input.channelId),
          eq(channelMemberTable.userId, session.user.id)
        ),
      });

      return typeof isMember !== "undefined";
    }),

  addMembers: orgAdminProcedure
    .input(ModifyChannelMembersInput)
    .output(SuccessOutput)
    .handler(async ({ context: { db, session, orgId }, input }) => {
      await verifyChannelMembership(
        db,
        input.channelId,
        session.user.id,
        orgId
      );
      const channelMembers = input.memberIds.map((memberId) => ({
        channelId: input.channelId,
        userId: memberId,
      }));

      await db.insert(channelMemberTable).values(channelMembers);

      return {
        success: true,
        message: "Members added to channel",
      };
    }),

  removeMembers: orgAdminProcedure
    .input(ModifyChannelMembersInput)
    .output(SuccessOutput)
    .handler(async ({ context: { db, session, orgId }, input }) => {
      await verifyChannelMembership(
        db,
        input.channelId,
        session.user.id,
        orgId
      );
      await db
        .delete(channelMemberTable)
        .where(
          and(
            eq(channelMemberTable.channelId, input.channelId),
            inArray(channelMemberTable.userId, input.memberIds)
          )
        );

      return {
        success: true,
        message: "Members added to channel",
      };
    }),

  joinRequest: orgMemberProcedure
    .input(ChannelJoinRequestInput)
    .output(ChannelJoinRequestOutput)
    .handler(async ({ input, context: { db, session, orgId } }) => {
      // Verify channel belongs to org
      const channel = await db.query.channelTable.findFirst({
        where: eq(channelTable.id, input.channelId),
        columns: { organizationId: true },
      });
      if (!channel || channel.organizationId !== orgId) {
        throw new ORPCError("NOT_FOUND", { message: "Channel not found" });
      }
      const [newRequest] = await db
        .insert(channelJoinRequestTable)
        .values({
          channelId: input.channelId,
          userId: session.user.id,
          note: input.note,
        })
        .returning();

      if (!newRequest) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to create join request.",
        });
      }

      return newRequest;
    }),
  listJoinRequests: orgAdminProcedure
    .input(ListJoinRequestInput)
    .output(ListJoinRequestOutput)
    .handler(async ({ context: { db, session, orgId }, input }) => {
      await verifyChannelMembership(
        db,
        input.channelId,
        session.user.id,
        orgId
      );
      const joinRequests = await db.query.channelJoinRequestTable.findMany({
        where: eq(channelJoinRequestTable.channelId, input.channelId),
        with: {
          user: true,
        },
      });

      return joinRequests;
    }),

  delete: orgAdminProcedure
    .input(DeleteChannelInput)
    .output(DeletechannelOutput)
    .handler(async ({ input, context: { db, session, orgId } }) => {
      await verifyChannelMembership(
        db,
        input.channelId,
        session.user.id,
        orgId
      );

      const { txid } = await db.transaction(async (tx) => {
        const txid = await generateTxId(tx);

        const channel = await tx.query.channelTable.findFirst({
          where: and(
            eq(channelTable.id, input.channelId),
            eq(channelTable.organizationId, orgId)
          ),
        });

        if (!channel) {
          throw new ORPCError("NOT_FOUND", {
            message: "Channel not found or you do not have access to it.",
          });
        }

        await tx
          .delete(notificationTable)
          .where(eq(notificationTable.entityId, input.channelId));

        await tx
          .delete(channelTable)
          .where(eq(channelTable.id, input.channelId));

        return { txid };
      });

      return { txid };
    }),
};
