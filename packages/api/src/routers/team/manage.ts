import { ORPCError } from "@orpc/client";
import {
  AddMemberInput,
  AddMemberOutput,
  ListTeamsInput,
  ListTeamsOutput,
  RemoveMemberInput,
  RemoveMemberOutput,
} from "@work-holo/api/lib/schemas/team";
import { auth } from "@work-holo/auth";
import { team } from "@work-holo/db/schema/index";
import { and, asc, count, desc, eq, gte, like, lte } from "drizzle-orm";
import { orgMemberProcedure } from "../../index";

export const manageRouter = {
  /**
   * Lists teams in the organization with pagination, name search,
   * date range filtering, and configurable sort order. Includes team members with user details.
   *
   * @param input.page - Page number (1-based)
   * @param input.limit - Number of results per page
   * @param input.search - Optional name search string
   * @param input.filters.dateRange - Optional created date range filter
   * @param input.sorting - Optional sort configuration (supports name, createdAt)
   * @returns Paginated list of teams with members, total count, and page count
   */
  list: orgMemberProcedure
    .input(ListTeamsInput)
    .output(ListTeamsOutput)
    .handler(async ({ input, context: { db, orgId, permission } }) => {
      await permission.check(permission.org.read());
      const { page, limit, search, filters, sorting } = input;
      const offset = (page - 1) * limit;

      const conditions = [eq(team.organizationId, orgId)];

      if (search) {
        conditions.push(like(team.name, `%${search}%`));
      }

      if (filters?.dateRange) {
        if (filters.dateRange.from) {
          conditions.push(gte(team.createdAt, filters.dateRange.from));
        }
        if (filters.dateRange.to) {
          conditions.push(lte(team.createdAt, filters.dateRange.to));
        }
      }

      const whereClause =
        conditions.length > 1 ? and(...conditions) : conditions[0];

      let orderBy = [desc(team.createdAt)];

      if (sorting && sorting.length > 0) {
        orderBy = sorting.map((sort) => {
          if (sort.id === "name")
            return sort.desc ? desc(team.name) : asc(team.name);
          if (sort.id === "createdAt")
            return sort.desc ? desc(team.createdAt) : asc(team.createdAt);

          return desc(team.createdAt);
        });
      }

      const teams = await db.query.team.findMany({
        where: whereClause,
        limit,
        offset,
        orderBy,
        with: {
          teamMembers: {
            with: {
              user: true,
            },
          },
        },
      });

      const totalResult = await db
        .select({ count: count() })
        .from(team)
        .where(whereClause);

      const total = Number(totalResult[0]?.count ?? 0);
      const pageCount = Math.ceil(total / limit);

      return { teams, total, pageCount };
    }),

  /**
   * Adds one or more members to a team via the auth service API.
   * Processes each user sequentially and reports partial success if some fail.
   *
   * @param input.teamId - The team to add members to
   * @param input.userIds - Array of user IDs to add
   * @returns Success status, message, and count of members added
   * @throws INTERNAL_SERVER_ERROR if all additions fail
   */
  addMember: orgMemberProcedure
    .input(AddMemberInput)
    .output(AddMemberOutput)
    .handler(
      async ({
        input: { teamId, userIds },
        context: { headers, permission },
      }) => {
        await permission.check(permission.team(teamId).member.add());
        try {
          let addedCount = 0;
          const errors: string[] = [];

          for (const userId of userIds) {
            try {
              await auth.api.addTeamMember({
                body: {
                  userId,
                  teamId,
                },
                headers,
              });

              addedCount++;
            } catch (error) {
              errors.push(
                `Failed to add user ${userId}: ${
                  error instanceof Error ? error.message : "Unknown error"
                }`
              );
            }
          }

          if (addedCount === 0) {
            throw new ORPCError("INTERNAL_SERVER_ERROR", {
              message: `Failed to add any members. Errors: ${errors.join(", ")}`,
            });
          }

          return {
            success: true,
            message:
              addedCount === userIds.length
                ? `Successfully added ${addedCount} member(s)`
                : `Added ${addedCount} of ${
                    userIds.length
                  } member(s). Some failed: ${errors.join(", ")}`,
            addedCount,
          };
        } catch (error) {
          if (error instanceof ORPCError) {
            throw error;
          }
          throw new ORPCError("INTERNAL_SERVER_ERROR", {
            message:
              error instanceof Error
                ? error.message
                : "Failed to add members to team",
          });
        }
      }
    ),

  /**
   * Removes one or more members from a team via the auth service API.
   * Processes each removal sequentially and reports partial success if some fail.
   *
   * @param input.teamId - The team to remove members from
   * @param input.userIds - Array of user IDs to remove
   * @returns Success status, message, and count of members removed
   * @throws INTERNAL_SERVER_ERROR if all removals fail
   */
  removeMember: orgMemberProcedure
    .input(RemoveMemberInput)
    .output(RemoveMemberOutput)
    .handler(
      async ({
        input: { teamId, userIds },
        context: { headers, permission },
      }) => {
        await permission.check(permission.team(teamId).member.remove());
        try {
          let removedCount = 0;
          const errors: string[] = [];

          for (const userId of userIds) {
            try {
              await auth.api.removeTeamMember({
                body: {
                  teamId,
                  userId,
                },
                headers,
              });
              removedCount++;
            } catch (error) {
              errors.push(
                `Failed to remove user ${userId}: ${
                  error instanceof Error ? error.message : "Unknown error"
                }`
              );
            }
          }

          if (removedCount === 0) {
            throw new ORPCError("INTERNAL_SERVER_ERROR", {
              message: `Failed to remove any members. Errors: ${errors.join(", ")}`,
            });
          }

          return {
            success: true,
            message:
              removedCount === userIds.length
                ? `Successfully removed ${removedCount} member(s)`
                : `Removed ${removedCount} of ${
                    userIds.length
                  } member(s). Some failed: ${errors.join(", ")}`,
            removedCount,
          };
        } catch (error) {
          if (error instanceof ORPCError) {
            throw error;
          }
          throw new ORPCError("INTERNAL_SERVER_ERROR", {
            message:
              error instanceof Error
                ? error.message
                : "Failed to remove members from team",
          });
        }
      }
    ),
};
