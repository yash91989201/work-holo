import { ORPCError, os } from "@orpc/server";
import { member } from "@work-holo/db/schema/auth";
import { and, eq } from "drizzle-orm";
import type { Context } from "./context";

export const o = os.$context<Context>();

export const publicProcedure = o;

const requireAuth = o.middleware(({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  return next({
    context: {
      session: context.session,
    },
  });
});

// Middleware: Require active organization
const requireOrg = o.middleware(({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }

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

// Middleware: Require organization membership
const requireOrgMember = o.middleware(async ({ context, next }) => {
  if (!context.orgId) {
    throw new ORPCError("UNAUTHORIZED", {
      message: "No active organization",
    });
  }

  const membership = await context.db.query.member.findFirst({
    where: and(
      eq(member.organizationId, context.orgId),
      eq(member.userId, context.session!.user.id)
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
});

// Middleware: Require organization admin/owner
const requireOrgAdmin = o.middleware(({ context, next }) => {
  if (!context.orgMembership) {
    throw new ORPCError("FORBIDDEN", {
      message: "Organization membership required",
    });
  }

  const { role } = context.orgMembership;

  if (role !== "admin" && role !== "owner") {
    throw new ORPCError("FORBIDDEN", {
      message: "Organization admin or owner role required",
    });
  }

  return next();
});

// Middleware: Require platform admin
const requirePlatformAdmin = o.middleware(({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  if (context.session.user.role !== "admin") {
    throw new ORPCError("FORBIDDEN", {
      message: "Platform admin role required",
    });
  }

  return next();
});

export const protectedProcedure = publicProcedure.use(requireAuth);

// Org-scoped procedures
export const orgProcedure = protectedProcedure.use(requireOrg);

export const orgMemberProcedure = orgProcedure.use(requireOrgMember);

export const orgAdminProcedure = orgMemberProcedure.use(requireOrgAdmin);

// Platform admin procedure (does not bypass org/channel checks)
export const platformAdminProcedure = protectedProcedure.use(
  requirePlatformAdmin
);
