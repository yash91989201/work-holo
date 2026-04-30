import { ORPCError } from "@orpc/server";
import { ChannelSchema } from "@work-holo/db/lib/schemas/db-tables";
import {
  channelMemberTable,
  channelReadTable,
  channelTable,
  member,
  messageTable,
  notificationTable,
  teamMember,
  user as userTable,
} from "@work-holo/db/schema/index";
import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  gt,
  inArray,
  like,
  not,
} from "drizzle-orm";
import { orgMemberProcedure, protectedProcedure } from "../../index";
import { generateTxId } from "../../lib/electric-proxy";
import {
  CreateChannelInput,
  CreateChannelOutput,
  DeleteChannelInput,
  DeletechannelOutput,
  GetChannelInput,
  GetChannelOutput,
  GetChannelUnreadCountsInput,
  GetChannelUnreadCountsOutput,
  ListChannelMembersInput,
  ListChannelMembersOutput,
  ListChannelsInput,
  ListChannelsOutput,
  ModifyChannelMembersInput,
  SuccessOutput,
  UpdateChannelInput,
} from "../../lib/schemas/channel";

function getChannelOrderBy(sorting?: Array<{ id: string; desc: boolean }>) {
  if (!sorting || sorting.length === 0) {
    return [desc(channelTable.createdAt)];
  }

  return sorting.map((sort) => {
    if (sort.id === "name") {
      return sort.desc ? desc(channelTable.name) : asc(channelTable.name);
    }
    if (sort.id === "createdAt") {
      return sort.desc
        ? desc(channelTable.createdAt)
        : asc(channelTable.createdAt);
    }
    if (sort.id === "type") {
      return sort.desc ? desc(channelTable.type) : asc(channelTable.type);
    }
    return desc(channelTable.createdAt);
  });
}

export const channelRouter = {
  /**
   * Creates a new communication channel within the organization.
   * Automatically adds org owners/admins as channel members. For team channels,
   * also adds all team members.
   *
   * @param input.name - Channel name
   * @param input.type - Channel type (e.g. "team", "general")
   * @param input.teamId - Required when type is "team"
   * @param input.memberIds - User IDs to add as members (non-team channels)
   * @returns The created channel record and transaction ID
   * @throws INTERNAL_SERVER_ERROR if channel creation fails
   */
  create: orgMemberProcedure
    .input(CreateChannelInput)
    .output(CreateChannelOutput)
    .handler(async ({ input, context: { db, orgId, permission } }) => {
      await permission.check(permission.channel().create());

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

  /**
   * Updates channel properties such as name, description, or archive status.
   * Requires channel access with update permission.
   *
   * @param input.channelId - The channel to update
   * @returns The updated channel record
   * @throws NOT_FOUND if the channel does not exist
   */
  update: orgMemberProcedure
    .input(UpdateChannelInput)
    .output(ChannelSchema)
    .handler(async ({ input, context: { db, permission } }) => {
      await permission.requireChannelAccess(
        input.channelId,
        permission.channel().update
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

  /**
   * Retrieves a single channel by ID, including creator details.
   * Requires channel access with view permission.
   *
   * @param input.channelId - The channel to retrieve
   * @returns Channel record with creator user data
   * @throws Error if the channel does not exist or user lacks access
   */
  get: orgMemberProcedure
    .input(GetChannelInput)
    .output(GetChannelOutput)
    .handler(async ({ context: { db, permission }, input }) => {
      await permission.requireChannelAccess(
        input.channelId,
        permission.channel().read
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

  /**
   * Lists channels the current user is a member of, with pagination, search,
   * type/team filtering, archive toggle, and configurable sort order.
   *
   * @param input.page - Page number (1-based)
   * @param input.limit - Results per page
   * @param input.search - Optional channel name search
   * @param input.filters.type - Optional channel type filter
   * @param input.filters.teamId - Optional team ID filter
   * @param input.filters.includeArchived - Whether to include archived channels
   * @param input.sorting - Sort configuration (supports name, createdAt, type)
   * @returns Paginated list of channels with creator details, total count, and page count
   */
  list: orgMemberProcedure
    .input(ListChannelsInput)
    .output(ListChannelsOutput)
    .handler(
      async ({ context: { db, orgId, session, orgMembership }, input }) => {
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

        const isAdmin =
          orgMembership.role === "owner" || orgMembership.role === "admin";

        if (!isAdmin) {
          const userMemberChannels = await db
            .select({ channelId: channelMemberTable.channelId })
            .from(channelMemberTable)
            .innerJoin(
              channelTable,
              eq(channelMemberTable.channelId, channelTable.id)
            )
            .where(
              and(
                eq(channelMemberTable.userId, session.user.id),
                eq(channelTable.organizationId, orgId)
              )
            );

          const accessibleChannelIds = userMemberChannels.map(
            (r) => r.channelId
          );

          if (accessibleChannelIds.length === 0) {
            return { channels: [], total: 0, pageCount: 0 };
          }

          conditions.push(inArray(channelTable.id, accessibleChannelIds));
        }

        const whereClause =
          conditions.length > 1 ? and(...conditions) : conditions[0];

        const orderBy = getChannelOrderBy(sorting);

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
      }
    ),

  /**
   * Lists members of a channel with their user details and role.
   * Supports optional filtering by member role.
   *
   * @param input.channelId - The channel to list members for
   * @param input.filter.role - Optional role filter
   * @returns Array of channel members with id, name, email, image, role, and joinedAt
   */
  listMembers: orgMemberProcedure
    .input(ListChannelMembersInput)
    .output(ListChannelMembersOutput)
    .handler(async ({ input, context: { db, permission } }) => {
      await permission.requireChannelAccess(
        input.channelId,
        "channel.member.list"
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

  /**
   * Adds one or more members to a channel.
   * Requires channel access with member.add permission.
   *
   * @param input.channelId - The channel to add members to
   * @param input.memberIds - Array of user IDs to add
   * @returns Success status and confirmation message
   */
  addMembers: orgMemberProcedure
    .input(ModifyChannelMembersInput)
    .output(SuccessOutput)
    .handler(async ({ context: { db, permission }, input }) => {
      await permission.requireChannelAccess(
        input.channelId,
        "channel.member.add"
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

  /**
   * Removes one or more members from a channel.
   * Requires channel access with member.remove permission.
   *
   * @param input.channelId - The channel to remove members from
   * @param input.memberIds - Array of user IDs to remove
   * @returns Success status and confirmation message
   */
  removeMembers: orgMemberProcedure
    .input(ModifyChannelMembersInput)
    .output(SuccessOutput)
    .handler(async ({ context: { db, permission }, input }) => {
      await permission.requireChannelAccess(
        input.channelId,
        "channel.member.remove"
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

  /**
   * Deletes a channel and its related notifications in a single transaction.
   * Requires channel access with delete permission.
   *
   * @param input.channelId - The channel to delete
   * @returns Transaction ID for the deletion
   * @throws NOT_FOUND if the channel does not exist in the current org
   */
  delete: orgMemberProcedure
    .input(DeleteChannelInput)
    .output(DeletechannelOutput)
    .handler(async ({ input, context: { db, orgId, permission } }) => {
      await permission.requireChannelAccess(
        input.channelId,
        permission.channel().delete
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

  /**
   * Lists all channels the current user belongs to in the active organization.
   * Uses protectedProcedure since it only returns the user's own channels.
   *
   * @returns Object containing array of channel records
   * @throws BAD_REQUEST if no active organization is set on the session
   */
  listOwn: protectedProcedure.handler(async ({ context: { db, session } }) => {
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
  }),

  /**
   * Returns recently used channels based on the user's latest sent messages.
   * Retrieves the 5 most recent distinct channels the user has messaged in,
   * with creator and member details.
   *
   * @returns Array of recent channel records, or empty array if no messages sent
   */
  getRecent: protectedProcedure.handler(
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

  /**
   * Computes unread message counts per channel for the current user.
   * Considers only non-archived channels the user belongs to. Uses the
   * channel read tracking record to determine which messages are unread.
   *
   * @returns Array of objects with channelId and unreadCount
   * @throws BAD_REQUEST if no active organization is set on the session
   */
  getUnreadCounts: protectedProcedure
    .input(GetChannelUnreadCountsInput)
    .output(GetChannelUnreadCountsOutput)
    .handler(async ({ context: { db, session } }) => {
      const userId = session.user.id;
      const organizationId = session.session.activeOrganizationId;

      if (!organizationId) {
        throw new ORPCError("BAD_REQUEST", {
          message: "No active organization",
        });
      }

      const userChannels = await db
        .select({ channelId: channelMemberTable.channelId })
        .from(channelMemberTable)
        .innerJoin(
          channelTable,
          eq(channelMemberTable.channelId, channelTable.id)
        )
        .where(
          and(
            eq(channelMemberTable.userId, userId),
            eq(channelTable.organizationId, organizationId),
            eq(channelTable.isArchived, false)
          )
        );

      const channelIds = userChannels.map((c) => c.channelId);

      if (channelIds.length === 0) {
        return [];
      }

      const channelReads = await db
        .select({
          channelId: channelReadTable.channelId,
          lastReadMessageId: channelReadTable.lastReadMessageId,
        })
        .from(channelReadTable)
        .where(
          and(
            eq(channelReadTable.userId, userId),
            inArray(channelReadTable.channelId, channelIds)
          )
        );

      const lastReadMap = new Map(
        channelReads.map((cr) => [cr.channelId, cr.lastReadMessageId])
      );

      const unreadCounts = await Promise.all(
        channelIds.map(async (channelId) => {
          const lastReadMessageId = lastReadMap.get(channelId);

          if (!lastReadMessageId) {
            const result = await db
              .select({ count: count() })
              .from(messageTable)
              .where(eq(messageTable.channelId, channelId));

            return {
              channelId,
              unreadCount: Number(result[0]?.count || 0),
            };
          }

          const lastReadMessage = await db
            .select({ createdAt: messageTable.createdAt })
            .from(messageTable)
            .where(eq(messageTable.id, lastReadMessageId))
            .limit(1);

          if (!lastReadMessage[0]) {
            const result = await db
              .select({ count: count() })
              .from(messageTable)
              .where(eq(messageTable.channelId, channelId));

            return {
              channelId,
              unreadCount: Number(result[0]?.count || 0),
            };
          }

          const result = await db
            .select({ count: count() })
            .from(messageTable)
            .where(
              and(
                eq(messageTable.channelId, channelId),
                gt(messageTable.createdAt, lastReadMessage[0].createdAt)
              )
            );

          return {
            channelId,
            unreadCount: Number(result[0]?.count || 0),
          };
        })
      );

      return unreadCounts;
    }),
};
