import { ORPCError, os } from "@orpc/server";
import { member } from "@work-holo/db/schema/auth";
import { PermissionManagers, PermissionService } from "@work-holo/permission";
import { and, eq } from "drizzle-orm";
import type { Context } from "./context";
import {
  NotificationManagers,
  NotificationService,
} from "./services/notification";
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
  const notificationManagers = NotificationManagers.getAll();

  const permission = new PermissionService({
    userId: context.session.user.id,
    db: context.db,
    orgId: activeOrganizationId,
    ...managers,
  });

  const notification = new NotificationService({
    userId: context.session.user.id,
    db: context.db,
    orgId: activeOrganizationId,
    ...notificationManagers,
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
