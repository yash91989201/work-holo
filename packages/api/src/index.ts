import { ORPCError, os } from "@orpc/server";
import { member } from "@work-holo/db/schema/auth";
import { and, eq } from "drizzle-orm";
import type { Context } from "./context";
import { PermissionContext } from "./lib/casbin/permission.service";

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

  return next({
    context: {
      orgId: activeOrganizationId,
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

    const permission = await PermissionContext.create(
      membership.role,
      context.session.user.id,
      context.db
    );

    return next({
      context: {
        orgMembership: {
          memberId: membership.id,
          role: membership.role,
        },
        permission,
      },
    });
  }
);

export const orgAdminProcedure = orgMemberProcedure.use(({ context, next }) => {
  const { role } = context.orgMembership;

  if (role !== "admin" && role !== "owner") {
    throw new ORPCError("FORBIDDEN", {
      message: "Organization admin or owner role required",
    });
  }

  return next();
});

// Platform admin procedure (does not bypass org/channel checks)
export const platformAdminProcedure = protectedProcedure.use(
  ({ context, next }) => {
    if (context.session.user.role !== "admin") {
      throw new ORPCError("FORBIDDEN", {
        message: "Platform admin role required",
      });
    }

    return next();
  }
);
