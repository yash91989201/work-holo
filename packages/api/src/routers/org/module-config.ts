import { ORPCError } from "@orpc/server";
import { member, team, teamMember, user } from "@work-holo/db/schema/auth";
import {
  moduleTeamAccessTable,
  moduleUserAccessTable,
  orgModuleConfigTable,
} from "@work-holo/db/schema/authorization";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { orgMemberProcedure } from "../../index";
import { MODULE_IDS } from "../../lib/module-ids";

const moduleSchema = z.enum(Object.values(MODULE_IDS) as [string, ...string[]]);

export const moduleConfigRouter = {
  getModuleConfig: orgMemberProcedure
    .input(z.object({ module: moduleSchema }))
    .handler(async ({ context, input }) => {
      const { db, orgId } = context;

      const config = await db.query.orgModuleConfigTable.findFirst({
        where: and(
          eq(orgModuleConfigTable.organizationId, orgId),
          eq(orgModuleConfigTable.module, input.module)
        ),
      });

      if (!config) {
        return {
          module: input.module,
          mode: "disabled" as const,
          teams: [] as { id: string; name: string }[],
          users: [] as { id: string; name: string; email: string }[],
        };
      }

      const teams = await db
        .select({
          id: team.id,
          name: team.name,
        })
        .from(moduleTeamAccessTable)
        .innerJoin(team, eq(moduleTeamAccessTable.teamId, team.id))
        .where(
          and(
            eq(moduleTeamAccessTable.organizationId, orgId),
            eq(moduleTeamAccessTable.module, input.module)
          )
        );

      const users = await db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
        })
        .from(moduleUserAccessTable)
        .innerJoin(user, eq(moduleUserAccessTable.userId, user.id))
        .where(
          and(
            eq(moduleUserAccessTable.organizationId, orgId),
            eq(moduleUserAccessTable.module, input.module)
          )
        );

      return {
        module: config.module,
        mode: config.mode,
        teams,
        users,
      };
    }),

  updateModuleConfig: orgMemberProcedure
    .input(
      z.object({
        module: moduleSchema,
        mode: z.enum(["disabled", "org_wide", "team_based", "user_based"]),
        teamIds: z.array(z.string()).optional(),
        userIds: z.array(z.string()).optional(),
      })
    )
    .handler(async ({ context, input }) => {
      if (!["owner", "admin"].includes(context.orgMembership.role)) {
        throw new ORPCError("FORBIDDEN", {
          message: "Only admins can update module config",
        });
      }

      const { db, orgId, session } = context;
      const userId = session.user.id;

      if (input.mode === "team_based" && input.teamIds?.length) {
        const orgTeams = await db
          .select({ id: team.id })
          .from(team)
          .where(
            and(eq(team.organizationId, orgId), inArray(team.id, input.teamIds))
          );

        if (orgTeams.length !== input.teamIds.length) {
          throw new ORPCError("BAD_REQUEST", {
            message: "Some team IDs do not belong to this organization",
          });
        }
      }

      if (input.mode === "user_based" && input.userIds?.length) {
        const orgMembers = await db
          .select({ userId: member.userId })
          .from(member)
          .where(
            and(
              eq(member.organizationId, orgId),
              inArray(member.userId, input.userIds)
            )
          );

        if (orgMembers.length !== input.userIds.length) {
          throw new ORPCError("BAD_REQUEST", {
            message: "Some user IDs are not members of this organization",
          });
        }
      }

      await db.transaction(async (tx) => {
        await tx
          .insert(orgModuleConfigTable)
          .values({
            organizationId: orgId,
            module: input.module,
            mode: input.mode,
            updatedBy: userId,
          })
          .onConflictDoUpdate({
            target: [
              orgModuleConfigTable.organizationId,
              orgModuleConfigTable.module,
            ],
            set: {
              mode: input.mode,
              updatedAt: new Date(),
              updatedBy: userId,
            },
          });

        await tx
          .delete(moduleTeamAccessTable)
          .where(
            and(
              eq(moduleTeamAccessTable.organizationId, orgId),
              eq(moduleTeamAccessTable.module, input.module)
            )
          );

        await tx
          .delete(moduleUserAccessTable)
          .where(
            and(
              eq(moduleUserAccessTable.organizationId, orgId),
              eq(moduleUserAccessTable.module, input.module)
            )
          );

        if (input.mode === "team_based" && input.teamIds?.length) {
          await tx.insert(moduleTeamAccessTable).values(
            input.teamIds.map((teamId) => ({
              organizationId: orgId,
              module: input.module,
              teamId,
            }))
          );
        }

        if (input.mode === "user_based" && input.userIds?.length) {
          await tx.insert(moduleUserAccessTable).values(
            input.userIds.map((uid) => ({
              organizationId: orgId,
              module: input.module,
              userId: uid,
            }))
          );
        }
      });

      return { success: true };
    }),

  checkModuleAccess: orgMemberProcedure
    .input(z.object({ module: moduleSchema }))
    .handler(async ({ context, input }) => {
      const { db, orgId, session } = context;
      const userId = session.user.id;

      const config = await db.query.orgModuleConfigTable.findFirst({
        where: and(
          eq(orgModuleConfigTable.organizationId, orgId),
          eq(orgModuleConfigTable.module, input.module)
        ),
      });

      if (!config || config.mode === "disabled") {
        return { allowed: false as const, reason: "org_disabled" as const };
      }

      if (config.mode === "org_wide") {
        return { allowed: true as const };
      }

      if (config.mode === "team_based") {
        const grantedTeams = await db
          .select({ teamId: moduleTeamAccessTable.teamId })
          .from(moduleTeamAccessTable)
          .where(
            and(
              eq(moduleTeamAccessTable.organizationId, orgId),
              eq(moduleTeamAccessTable.module, input.module)
            )
          );

        const grantedTeamIds = grantedTeams.map((t) => t.teamId);
        if (grantedTeamIds.length === 0) {
          return {
            allowed: false as const,
            reason: "team_restricted" as const,
          };
        }

        const membership = await db.query.teamMember.findFirst({
          where: and(
            eq(teamMember.userId, userId),
            inArray(teamMember.teamId, grantedTeamIds)
          ),
        });

        if (!membership) {
          return {
            allowed: false as const,
            reason: "team_restricted" as const,
          };
        }

        return { allowed: true as const };
      }

      // user_based
      const userAccess = await db.query.moduleUserAccessTable.findFirst({
        where: and(
          eq(moduleUserAccessTable.organizationId, orgId),
          eq(moduleUserAccessTable.module, input.module),
          eq(moduleUserAccessTable.userId, userId)
        ),
      });

      if (!userAccess) {
        return {
          allowed: false as const,
          reason: "user_restricted" as const,
        };
      }

      return { allowed: true as const };
    }),

  listAllowedUsers: orgMemberProcedure
    .input(z.object({ module: moduleSchema }))
    .handler(async ({ context, input }) => {
      const { db, orgId } = context;

      const config = await db.query.orgModuleConfigTable.findFirst({
        where: and(
          eq(orgModuleConfigTable.organizationId, orgId),
          eq(orgModuleConfigTable.module, input.module)
        ),
      });

      if (!config || config.mode === "disabled") {
        return { userIds: [] as string[] };
      }

      if (config.mode === "org_wide") {
        return { userIds: null };
      }

      if (config.mode === "team_based") {
        const grantedTeams = await db
          .select({ teamId: moduleTeamAccessTable.teamId })
          .from(moduleTeamAccessTable)
          .where(
            and(
              eq(moduleTeamAccessTable.organizationId, orgId),
              eq(moduleTeamAccessTable.module, input.module)
            )
          );

        const grantedTeamIds = grantedTeams.map((t) => t.teamId);
        if (grantedTeamIds.length === 0) {
          return { userIds: [] as string[] };
        }

        const members = await db
          .select({ userId: teamMember.userId })
          .from(teamMember)
          .where(inArray(teamMember.teamId, grantedTeamIds));

        const userIds = [...new Set(members.map((m) => m.userId))];
        return { userIds };
      }

      // user_based
      const userAccess = await db
        .select({ userId: moduleUserAccessTable.userId })
        .from(moduleUserAccessTable)
        .where(
          and(
            eq(moduleUserAccessTable.organizationId, orgId),
            eq(moduleUserAccessTable.module, input.module)
          )
        );

      const userIds = userAccess.map((u) => u.userId);
      return { userIds };
    }),
};
