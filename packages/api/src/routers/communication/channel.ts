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
import { protectedProcedure } from "../../index";
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

export const channelRouter = {
  create: protectedProcedure
    .input(CreateChannelInput)
    .output(CreateChannelOutput)
    .handler(async ({ input, context }) => {
      try {
        const { db, session } = context;
        const orgId = session.session.activeOrganizationId;

        if (!orgId) {
          throw new ORPCError("NOT_FOUND", {
            message: "Organization not found.",
          });
        }

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

  update: protectedProcedure
    .input(UpdateChannelInput)
    .output(ChannelSchema)
    .handler(async ({ input, context }) => {
      const [updatedChannel] = await context.db
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

  get: protectedProcedure
    .input(GetChannelInput)
    .output(GetChannelOutput)
    .handler(async ({ context, input }) => {
      const channel = await context.db.query.channelTable.findFirst({
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

  list: protectedProcedure
    .input(ListChannelsInput)
    .output(ListChannelsOutput)
    .handler(async ({ context, input }) => {
      const orgId = context.session.session.activeOrganizationId ?? "";

      const { page, limit, search, filters, sorting } = input;
      const offset = (page - 1) * limit;

      const conditions = [eq(channelTable.organizationId, orgId)];

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

      const channels = await context.db.query.channelTable.findMany({
        where: whereClause,
        limit,
        offset,
        orderBy,
        with: {
          creator: true,
        },
      });

      const totalResult = await context.db
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

  listMembers: protectedProcedure
    .input(ListChannelMembersInput)
    .output(ListChannelMembersOutput)
    .handler(async ({ input, context }) => {
      const filter = input?.filter;
      const members = await context.db
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
  isMember: protectedProcedure
    .input(IsChannelMemberInput)
    .output(IsChannelMemberOutput)
    .handler(async ({ input, context }) => {
      const isMember = await context.db.query.channelMemberTable.findFirst({
        where: and(
          eq(channelMemberTable.channelId, input.channelId),
          eq(channelMemberTable.userId, context.session.user.id)
        ),
      });

      return typeof isMember !== "undefined";
    }),

  addMembers: protectedProcedure
    .input(ModifyChannelMembersInput)
    .output(SuccessOutput)
    .handler(async ({ context, input }) => {
      const channelMembers = input.memberIds.map((memberId) => ({
        channelId: input.channelId,
        userId: memberId,
      }));

      await context.db.insert(channelMemberTable).values(channelMembers);

      return {
        success: true,
        message: "Members added to channel",
      };
    }),

  removeMembers: protectedProcedure
    .input(ModifyChannelMembersInput)
    .output(SuccessOutput)
    .handler(async ({ context, input }) => {
      await context.db
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

  joinRequest: protectedProcedure
    .input(ChannelJoinRequestInput)
    .output(ChannelJoinRequestOutput)
    .handler(async ({ input, context }) => {
      const [newRequest] = await context.db
        .insert(channelJoinRequestTable)
        .values({
          channelId: input.channelId,
          userId: context.session.user.id,
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
  listJoinRequests: protectedProcedure
    .input(ListJoinRequestInput)
    .output(ListJoinRequestOutput)
    .handler(async ({ context: { db }, input }) => {
      const joinRequests = await db.query.channelJoinRequestTable.findMany({
        where: eq(channelJoinRequestTable.channelId, input.channelId),
        with: {
          user: true,
        },
      });

      return joinRequests;
    }),

  delete: protectedProcedure
    .input(DeleteChannelInput)
    .output(DeletechannelOutput)
    .handler(async ({ input, context }) => {
      const { db, session } = context;
      const orgId = session.session.activeOrganizationId;

      if (!orgId) {
        throw new ORPCError("NOT_FOUND", {
          message: "Organization not found.",
        });
      }

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
