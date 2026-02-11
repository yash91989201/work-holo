import { ORPCError, os } from "@orpc/server";
import { member } from "@work-holo/db/schema/auth";
import { PermissionService } from "@work-holo/permission/server/services/permission.service";
import { and, eq } from "drizzle-orm";
import type { Context } from "./context";

export const o = os.$context<Context>();

export const publicProcedure = o;

export const protectedProcedure = publicProcedure.use(({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  return next({
    context: {
      session: context.session,
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

  const permission = new PermissionService({
    userId: context.session.user.id,
    db: context.db,
    orgId: activeOrganizationId,
  });

  return next({
    context: {
      orgId: activeOrganizationId,
      permission,
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
