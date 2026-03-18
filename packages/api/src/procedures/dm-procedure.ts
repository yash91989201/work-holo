import { ORPCError } from "@orpc/server";
import { teamMember } from "@work-holo/db/schema/auth";
import {
  moduleTeamAccessTable,
  moduleUserAccessTable,
  orgModuleConfigTable,
} from "@work-holo/db/schema/authorization";
import { and, eq, inArray } from "drizzle-orm";
import { orgMemberProcedure } from "../index";
import { MODULE_IDS } from "../lib/module-ids";

export const dmProcedure = orgMemberProcedure.use(async ({ context, next }) => {
  const { db, orgId, session } = context;
  const userId = session.user.id;
  const module = MODULE_IDS.DIRECT_MESSAGE;

  const config = await db.query.orgModuleConfigTable.findFirst({
    where: and(
      eq(orgModuleConfigTable.organizationId, orgId),
      eq(orgModuleConfigTable.module, module)
    ),
  });

  if (!config || config.mode === "disabled") {
    throw new ORPCError("FORBIDDEN", {
      message: "Module disabled",
      data: {
        code: "MODULE_DISABLED",
        module,
        reason: "org_disabled",
      },
    });
  }

  if (config.mode === "org_wide") {
    return next();
  }

  if (config.mode === "team_based") {
    const grantedTeams = await db
      .select({ teamId: moduleTeamAccessTable.teamId })
      .from(moduleTeamAccessTable)
      .where(
        and(
          eq(moduleTeamAccessTable.organizationId, orgId),
          eq(moduleTeamAccessTable.module, module)
        )
      );

    const grantedTeamIds = grantedTeams.map((team) => team.teamId);
    if (grantedTeamIds.length === 0) {
      throw new ORPCError("FORBIDDEN", {
        message: "Direct message access restricted to granted teams",
        data: {
          code: "MODULE_DISABLED",
          module,
          reason: "team_restricted",
        },
      });
    }

    const membership = await db.query.teamMember.findFirst({
      where: and(
        eq(teamMember.userId, userId),
        inArray(teamMember.teamId, grantedTeamIds)
      ),
    });

    if (!membership) {
      throw new ORPCError("FORBIDDEN", {
        message: "Direct message access restricted to granted teams",
        data: {
          code: "MODULE_DISABLED",
          module,
          reason: "team_restricted",
        },
      });
    }

    return next();
  }

  const userAccess = await db.query.moduleUserAccessTable.findFirst({
    where: and(
      eq(moduleUserAccessTable.organizationId, orgId),
      eq(moduleUserAccessTable.module, module),
      eq(moduleUserAccessTable.userId, userId)
    ),
  });

  if (!userAccess) {
    throw new ORPCError("FORBIDDEN", {
      message: "Direct message access restricted to specific users",
      data: {
        code: "MODULE_DISABLED",
        module,
        reason: "user_restricted",
      },
    });
  }

  return next();
});
