import { ORPCError, os } from "@orpc/server";
import { member, teamMember } from "@work-holo/db/schema/auth";
import {
  moduleTeamAccessTable,
  moduleUserAccessTable,
  orgModuleConfigTable,
} from "@work-holo/db/schema/authorization";
import { PermissionManagers, PermissionService } from "@work-holo/permission";
import { and, eq, inArray } from "drizzle-orm";
import type { Context } from "./context";
import { MODULE_IDS } from "./lib/module-ids";
import { NotificationService } from "./services/notification";
import { StorageService } from "./services/storage";

export const o = os.$context<Context>();

export const publicProcedure = o;

export const protectedProcedure = publicProcedure.use(({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  const storage = new StorageService({ userId: context.session.user.id });

  return next({
    context: {
      session: context.session,
      storage,
    },
  });
});

export const orgProcedure = protectedProcedure.use(({ context, next }) => {
  const activeOrganizationId = context.session.session.activeOrganizationId;

  if (!activeOrganizationId) {
    throw new ORPCError("UNAUTHORIZED", {
      message: "No active organization selected",
    });
  }

  const managers = PermissionManagers.getAll();

  const permission = new PermissionService({
    userId: context.session.user.id,
    db: context.db,
    orgId: activeOrganizationId,
    ...managers,
  });

  const notification = new NotificationService({
    userId: context.session.user.id,
    db: context.db,
  });

  return next({
    context: {
      orgId: activeOrganizationId,
      permission,
      notification,
    },
  });
});

export const orgMemberProcedure = orgProcedure.use(
  async ({ context, next }) => {
    const membership = await context.db.query.member.findFirst({
      where: and(
        eq(member.organizationId, context.orgId),
        eq(member.userId, context.session.user.id)
      ),
      columns: {
        id: true,
        role: true,
      },
    });

    if (!membership) {
      throw new ORPCError("FORBIDDEN", {
        message: "You are not a member of this organization",
      });
    }

    return next({
      context: {
        orgMembership: {
          memberId: membership.id,
          role: membership.role,
        },
      },
    });
  }
);

export const adminProcedure = protectedProcedure.use(({ context, next }) => {
  const role = context.session.user.role;
  if (role !== "admin" && role !== "super_admin") {
    throw new ORPCError("FORBIDDEN", {
      message: "Only admins can access this endpoint",
    });
  }
  return next({});
});

export const superAdminProcedure = protectedProcedure.use(
  ({ context, next }) => {
    if (context.session.user.role !== "super_admin") {
      throw new ORPCError("FORBIDDEN", {
        message: "Only super admins can access this endpoint",
      });
    }
    return next({});
  }
);

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
