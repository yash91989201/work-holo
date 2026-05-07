import { ORPCError } from "@orpc/server";
import { member, user } from "@work-holo/db/schema/auth";
import {
  agentDialerAccess,
  didInventory,
  orgDialerSettings,
} from "@work-holo/db/schema/dialer";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { orgMemberProcedure } from "../../index";

export const orgDialerRouter = {
  getDialerStatus: orgMemberProcedure.handler(async ({ context }) => {
    const { db, orgId } = context;
    const settings = await db.query.orgDialerSettings.findFirst({
      where: eq(orgDialerSettings.organizationId, orgId),
    });
    return settings ?? null;
  }),

  listOrgDids: orgMemberProcedure.handler(async ({ context }) => {
    const { db, orgId } = context;
    return db
      .select({
        id: didInventory.id,
        number: didInventory.number,
        friendlyName: didInventory.friendlyName,
        assignedToUserId: didInventory.assignedToUserId,
      })
      .from(didInventory)
      .where(
        and(
          eq(didInventory.organizationId, orgId),
          eq(didInventory.status, "assigned")
        )
      )
      .orderBy(didInventory.number);
  }),

  listAgentAccess: orgMemberProcedure.handler(async ({ context }) => {
    const { db, orgId } = context;

    const members = await db
      .select({
        memberId: member.id,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userImage: user.image,
        memberRole: member.role,
      })
      .from(member)
      .innerJoin(user, eq(member.userId, user.id))
      .where(eq(member.organizationId, orgId))
      .orderBy(user.name);

    const userIds = members.map((m) => m.userId);
    if (userIds.length === 0) return [];

    const accessRows = await db
      .select({
        userId: agentDialerAccess.userId,
        accessId: agentDialerAccess.id,
        canMakeCalls: agentDialerAccess.canMakeCalls,
        canReceiveCalls: agentDialerAccess.canReceiveCalls,
        assignedDidId: agentDialerAccess.assignedDidId,
        assignedDidNumber: didInventory.number,
        isActive: agentDialerAccess.isActive,
      })
      .from(agentDialerAccess)
      .leftJoin(
        didInventory,
        eq(agentDialerAccess.assignedDidId, didInventory.id)
      )
      .where(eq(agentDialerAccess.organizationId, orgId));

    const accessMap = new Map(accessRows.map((a) => [a.userId, a]));

    return members.map((m) => ({
      ...m,
      access: accessMap.get(m.userId) ?? null,
    }));
  }),

  upsertAgentAccess: orgMemberProcedure
    .input(
      z.object({
        userId: z.string(),
        canMakeCalls: z.boolean(),
        canReceiveCalls: z.boolean(),
        assignedDidId: z.string().nullable().optional(),
        isActive: z.boolean().default(true),
      })
    )
    .handler(async ({ input, context }) => {
      await context.permission.check(context.permission.org.update());
      const { db, orgId, session } = context;

      const isMember = await db.query.member.findFirst({
        where: and(
          eq(member.organizationId, orgId),
          eq(member.userId, input.userId)
        ),
        columns: { id: true },
      });
      if (!isMember) {
        throw new ORPCError("NOT_FOUND", {
          message: "User is not a member of this organization",
        });
      }

      if (input.assignedDidId) {
        const did = await db.query.didInventory.findFirst({
          where: and(
            eq(didInventory.id, input.assignedDidId),
            eq(didInventory.organizationId, orgId)
          ),
          columns: { id: true },
        });
        if (!did) {
          throw new ORPCError("NOT_FOUND", {
            message: "DID does not belong to this organization",
          });
        }
      }

      const { userId, ...access } = input;

      await db
        .insert(agentDialerAccess)
        .values({
          organizationId: orgId,
          userId,
          ...access,
          grantedBy: session.user.id,
        })
        .onConflictDoUpdate({
          target: [agentDialerAccess.organizationId, agentDialerAccess.userId],
          set: { ...access, updatedAt: new Date() },
        });

      return { success: true };
    }),

  revokeAgentAccess: orgMemberProcedure
    .input(z.object({ accessId: z.string() }))
    .handler(async ({ input, context }) => {
      await context.permission.check(context.permission.org.update());
      const { db, orgId } = context;

      const access = await db.query.agentDialerAccess.findFirst({
        where: and(
          eq(agentDialerAccess.id, input.accessId),
          eq(agentDialerAccess.organizationId, orgId)
        ),
        columns: { id: true },
      });
      if (!access) {
        throw new ORPCError("NOT_FOUND", {
          message: "Access record not found",
        });
      }

      await db
        .delete(agentDialerAccess)
        .where(eq(agentDialerAccess.id, input.accessId));

      return { success: true };
    }),
};
