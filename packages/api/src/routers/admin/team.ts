import { ORPCError } from "@orpc/server";
import {
  AddMemberInput,
  AddMemberOutput,
  CreateTeamInput,
  CreateTeamOutput,
  DeleteTeamInput,
  DeleteTeamOutput,
  ListTeamsInput,
  ListTeamsOutput,
  RemoveMemberInput,
  RemoveMemberOutput,
  UpdateTeamMemberRoleInput,
  UpdateTeamMemberRoleOutput,
} from "@work-holo/api/lib/schemas/team";
import { auth } from "@work-holo/auth";
import { team, teamMember } from "@work-holo/db/schema/index";
import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  inArray,
  like,
  lte,
} from "drizzle-orm";
import { orgMemberProcedure } from "../../index";

export const adminTeamRouter = {
  // ─── Create team ──────────────────────────────────────────────
  createTeam: orgMemberProcedure
    .input(CreateTeamInput)
    .output(CreateTeamOutput)
    .handler(
      async ({
        input,
        context: { db, session, orgId, headers, permission },
      }) => {
        if (!permission) {
          throw new ORPCError("FORBIDDEN", {
            message: "Permission context not available",
          });
        }

        permission.check("team", "create");

        const createdTeam = (await auth.api.createTeam({
          body: { name: input.name, organizationId: orgId },
          headers,
        })) as { id: string };

        // Patch createdBy after Better-Auth creates the row
        await db
          .update(team)
          .set({ createdBy: session.user.id })
          .where(eq(team.id, createdTeam.id));

        const updated = await db.query.team.findFirst({
          where: eq(team.id, createdTeam.id),
        });

        if (!updated) {
          throw new ORPCError("INTERNAL_SERVER_ERROR", {
            message: "Failed to retrieve created team",
          });
        }

        return updated;
      }
    ),

  // ─── Delete team ──────────────────────────────────────────────
  deleteTeam: orgMemberProcedure
    .input(DeleteTeamInput)
    .output(DeleteTeamOutput)
    .handler(async ({ input, context: { headers, permission } }) => {
      if (!permission) {
        throw new ORPCError("FORBIDDEN", {
          message: "Permission context not available",
        });
      }

      permission.check("team", "delete");
      await permission.checkTeamScope(input.teamId, "delete");

      await auth.api.removeTeam({
        body: { teamId: input.teamId },
        headers,
      });

      return { success: true, message: "Team deleted successfully" };
    }),

  // ─── List teams (scope-filtered) ──────────────────────────────
  listTeams: orgMemberProcedure
    .input(ListTeamsInput)
    .output(ListTeamsOutput)
    .handler(async ({ input, context: { db, orgId, permission } }) => {
      if (!permission) {
        throw new ORPCError("FORBIDDEN", {
          message: "Permission context not available",
        });
      }

      permission.check("team", "access");

      const { page, limit, search, filters, sorting } = input;
      const offset = (page - 1) * limit;

      const conditions = [eq(team.organizationId, orgId)];

      // Scope filter: team_admin sees own teams, team_lead/member sees assigned teams
      const accessibleTeamIds = await permission.getAccessibleTeamIds();
      if (accessibleTeamIds !== null) {
        if (accessibleTeamIds.length === 0) {
          return { teams: [], total: 0, pageCount: 0 };
        }
        conditions.push(inArray(team.id, accessibleTeamIds));
      }

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

  // ─── Add members to team ──────────────────────────────────────
  addMember: orgMemberProcedure
    .input(AddMemberInput)
    .output(AddMemberOutput)
    .handler(
      async ({
        input: { teamId, userIds },
        context: { headers, permission },
      }) => {
        if (!permission) {
          throw new ORPCError("FORBIDDEN", {
            message: "Permission context not available",
          });
        }

        await permission.checkTeamScope(teamId, "add_members");

        let addedCount = 0;
        const errors: string[] = [];

        for (const userId of userIds) {
          try {
            await auth.api.addTeamMember({
              body: { userId, teamId },
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
              : `Added ${addedCount} of ${userIds.length} member(s). Some failed: ${errors.join(", ")}`,
          addedCount,
        };
      }
    ),

  // ─── Remove members from team ─────────────────────────────────
  removeMember: orgMemberProcedure
    .input(RemoveMemberInput)
    .output(RemoveMemberOutput)
    .handler(
      async ({
        input: { teamId, userIds },
        context: { headers, permission },
      }) => {
        if (!permission) {
          throw new ORPCError("FORBIDDEN", {
            message: "Permission context not available",
          });
        }

        await permission.checkTeamScope(teamId, "add_members");

        let removedCount = 0;
        const errors: string[] = [];

        for (const userId of userIds) {
          try {
            await auth.api.removeTeamMember({
              body: { teamId, userId },
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
              : `Removed ${removedCount} of ${userIds.length} member(s). Some failed: ${errors.join(", ")}`,
          removedCount,
        };
      }
    ),

  // ─── Assign / remove team_lead role within a team ─────────────
  updateTeamMemberRole: orgMemberProcedure
    .input(UpdateTeamMemberRoleInput)
    .output(UpdateTeamMemberRoleOutput)
    .handler(async ({ input, context: { db, orgId, permission } }) => {
      if (!permission) {
        throw new ORPCError("FORBIDDEN", {
          message: "Permission context not available",
        });
      }

      // Only roles that can assign_team_lead may promote
      if (input.role === "team_lead") {
        permission.check("role", "assign_team_lead");
        // team_admin: must own this team
        if (permission.role === "team_admin") {
          await permission.verifyTeamOwnership(input.teamId);
        }
      } else {
        // Demoting: same gate as promoting (must be able to assign_team_lead to touch it)
        permission.check("role", "assign_team_lead");
        if (permission.role === "team_admin") {
          await permission.verifyTeamOwnership(input.teamId);
        }
      }

      const tm = await db.query.teamMember.findFirst({
        where: and(
          eq(teamMember.teamId, input.teamId),
          eq(teamMember.userId, input.userId)
        ),
      });

      if (!tm) {
        throw new ORPCError("NOT_FOUND", {
          message: "User is not a member of this team",
        });
      }

      // Update team-level role
      await db
        .update(teamMember)
        .set({ role: input.role })
        .where(eq(teamMember.id, tm.id));

      // Sync org-level member.role accordingly
      await permission.syncOrgRoleForTeamLead(input.userId, orgId, input.role);

      return {
        success: true,
        message: `Team member role updated to '${input.role}'`,
      };
    }),
};
