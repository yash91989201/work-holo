import { ORPCError } from "@orpc/server";
import {
  invitation,
  member,
  organization,
  user,
} from "@work-holo/db/schema/auth";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, superAdminProcedure } from "../../index";

export const adminRouter = {
  listUsers: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        search: z.string().optional(),
        role: z.string().optional(),
      })
    )
    .handler(async ({ input, context }) => {
      const offset = (input.page - 1) * input.limit;
      const conditions = [];

      if (input.search) {
        conditions.push(
          or(
            ilike(user.email, `%${input.search}%`),
            ilike(user.name, `%${input.search}%`)
          )
        );
      }
      if (input.role) {
        conditions.push(eq(user.role, input.role));
      }

      const users = await context.db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          banned: user.banned,
          banReason: user.banReason,
          banExpires: user.banExpires,
          createdAt: user.createdAt,
          emailVerified: user.emailVerified,
          image: user.image,
        })
        .from(user)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(user.createdAt))
        .limit(input.limit)
        .offset(offset);

      const userIds = users.map((u) => u.id);
      if (userIds.length === 0) return [];

      const memberships = await context.db
        .select({
          userId: member.userId,
          orgRole: member.role,
          orgName: organization.name,
          orgSlug: organization.slug,
        })
        .from(member)
        .innerJoin(organization, eq(member.organizationId, organization.id))
        .where(or(...userIds.map((id) => eq(member.userId, id))));

      const membershipsByUser = new Map<
        string,
        { orgRole: string; orgName: string; orgSlug: string }[]
      >();
      for (const m of memberships) {
        const list = membershipsByUser.get(m.userId) ?? [];
        list.push({
          orgRole: m.orgRole,
          orgName: m.orgName,
          orgSlug: m.orgSlug,
        });
        membershipsByUser.set(m.userId, list);
      }

      return users.map((u) => ({
        ...u,
        organizations: membershipsByUser.get(u.id) ?? [],
      }));
    }),

  getUser: adminProcedure
    .input(z.object({ userId: z.string() }))
    .handler(async ({ input, context }) => {
      const result = await context.db
        .select()
        .from(user)
        .where(eq(user.id, input.userId))
        .limit(1);

      if (!result[0]) {
        throw new ORPCError("NOT_FOUND", { message: "User not found" });
      }
      return result[0];
    }),

  banUser: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        reason: z.string().optional(),
        expiresAt: z.date().optional(),
      })
    )
    .handler(async ({ input, context }) => {
      const target = await context.db
        .select({ role: user.role })
        .from(user)
        .where(eq(user.id, input.userId))
        .limit(1);

      if (target[0]?.role === "super_admin") {
        throw new ORPCError("FORBIDDEN", {
          message: "Cannot ban super_admin",
        });
      }

      await context.db
        .update(user)
        .set({
          banned: true,
          banReason: input.reason ?? null,
          banExpires: input.expiresAt ?? null,
        })
        .where(eq(user.id, input.userId));

      return { success: true };
    }),

  unbanUser: adminProcedure
    .input(z.object({ userId: z.string() }))
    .handler(async ({ input, context }) => {
      await context.db
        .update(user)
        .set({ banned: false, banReason: null, banExpires: null })
        .where(eq(user.id, input.userId));

      return { success: true };
    }),

  setUserRole: superAdminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["user", "support", "admin"]),
      })
    )
    .handler(async ({ input, context }) => {
      await context.db
        .update(user)
        .set({ role: input.role })
        .where(eq(user.id, input.userId));

      return { success: true };
    }),

  getStats: superAdminProcedure.handler(async ({ context }) => {
    const [total] = await context.db.select({ value: count() }).from(user);
    const [banned] = await context.db
      .select({ value: count() })
      .from(user)
      .where(eq(user.banned, true));
    const [admins] = await context.db
      .select({ value: count() })
      .from(user)
      .where(eq(user.role, "admin"));
    const [support] = await context.db
      .select({ value: count() })
      .from(user)
      .where(eq(user.role, "support"));
    const [orgs] = await context.db
      .select({ value: count() })
      .from(organization);

    return {
      totalUsers: total?.value ?? 0,
      bannedUsers: banned?.value ?? 0,
      adminUsers: admins?.value ?? 0,
      supportUsers: support?.value ?? 0,
      totalOrgs: orgs?.value ?? 0,
    };
  }),

  listOrganizations: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        search: z.string().optional(),
      })
    )
    .handler(async ({ input, context }) => {
      const offset = (input.page - 1) * input.limit;
      const conditions = [];

      if (input.search) {
        conditions.push(
          or(
            ilike(organization.name, `%${input.search}%`),
            ilike(organization.slug, `%${input.search}%`)
          )
        );
      }

      const orgs = await context.db
        .select({
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          logo: organization.logo,
          createdAt: organization.createdAt,
        })
        .from(organization)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(organization.createdAt))
        .limit(input.limit)
        .offset(offset);

      if (orgs.length === 0) return [];

      const orgIds = orgs.map((o) => o.id);

      // Get member counts per org
      const memberCounts = await context.db
        .select({
          organizationId: member.organizationId,
          memberCount: count(),
        })
        .from(member)
        .where(or(...orgIds.map((id) => eq(member.organizationId, id))))
        .groupBy(member.organizationId);

      // Get owners per org
      const owners = await context.db
        .select({
          organizationId: member.organizationId,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
        })
        .from(member)
        .innerJoin(user, eq(member.userId, user.id))
        .where(
          and(
            or(...orgIds.map((id) => eq(member.organizationId, id))),
            eq(member.role, "owner")
          )
        );

      const countMap = new Map<string, number>();
      for (const mc of memberCounts) {
        countMap.set(mc.organizationId, mc.memberCount);
      }

      const ownerMap = new Map<
        string,
        { userId: string; userName: string; userEmail: string }[]
      >();
      for (const o of owners) {
        const list = ownerMap.get(o.organizationId) ?? [];
        list.push({
          userId: o.userId,
          userName: o.userName,
          userEmail: o.userEmail,
        });
        ownerMap.set(o.organizationId, list);
      }

      return orgs.map((o) => ({
        ...o,
        memberCount: countMap.get(o.id) ?? 0,
        owners: ownerMap.get(o.id) ?? [],
      }));
    }),

  getOrganizationMembers: adminProcedure
    .input(
      z.object({
        orgId: z.string(),
        page: z.number().default(1),
        limit: z.number().default(50),
        search: z.string().optional(),
      })
    )
    .handler(async ({ input, context }) => {
      const offset = (input.page - 1) * input.limit;

      // Verify org exists
      const org = await context.db
        .select({
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          logo: organization.logo,
          createdAt: organization.createdAt,
        })
        .from(organization)
        .where(eq(organization.id, input.orgId))
        .limit(1);

      if (!org[0]) {
        throw new ORPCError("NOT_FOUND", {
          message: "Organization not found",
        });
      }

      const conditions = [eq(member.organizationId, input.orgId)];

      if (input.search) {
        conditions.push(
          or(
            ilike(user.name, `%${input.search}%`),
            ilike(user.email, `%${input.search}%`)
          )!
        );
      }

      const members = await context.db
        .select({
          memberId: member.id,
          orgRole: member.role,
          joinedAt: member.createdAt,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          userImage: user.image,
          platformRole: user.role,
          banned: user.banned,
        })
        .from(member)
        .innerJoin(user, eq(member.userId, user.id))
        .where(and(...conditions))
        .orderBy(desc(member.createdAt))
        .limit(input.limit)
        .offset(offset);

      const [totalCount] = await context.db
        .select({ value: count() })
        .from(member)
        .where(eq(member.organizationId, input.orgId));

      // Fetch pending/accepted invitations for this org
      // const { invitation } = await import("@work-holo/db/schema/auth");
      const invitations = await context.db
        .select({
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          status: invitation.status,
          expiresAt: invitation.expiresAt,
          createdAt: invitation.createdAt,
          inviterId: invitation.inviterId,
        })
        .from(invitation)
        .where(eq(invitation.organizationId, input.orgId))
        .orderBy(desc(invitation.createdAt));

      // Get inviter names
      const inviterIds = [...new Set(invitations.map((inv) => inv.inviterId))];
      const inviters =
        inviterIds.length > 0
          ? await context.db
              .select({ id: user.id, name: user.name })
              .from(user)
              .where(or(...inviterIds.map((id) => eq(user.id, id))))
          : [];

      const inviterMap = new Map<string, string>();
      for (const inv of inviters) {
        inviterMap.set(inv.id, inv.name);
      }

      return {
        organization: org[0],
        members,
        totalMembers: totalCount?.value ?? 0,
        invitations: invitations.map((inv) => ({
          ...inv,
          inviterName: inviterMap.get(inv.inviterId) ?? "Unknown",
        })),
      };
    }),

  listOwners: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        search: z.string().optional(),
      })
    )
    .handler(async ({ input, context }) => {
      const offset = (input.page - 1) * input.limit;
      const conditions = [eq(member.role, "owner")];

      if (input.search) {
        conditions.push(
          or(
            ilike(user.name, `%${input.search}%`),
            ilike(user.email, `%${input.search}%`)
          )!
        );
      }

      const owners = await context.db
        .select({
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          userImage: user.image,
          platformRole: user.role,
          banned: user.banned,
          orgId: organization.id,
          orgName: organization.name,
          orgSlug: organization.slug,
          orgCreatedAt: organization.createdAt,
        })
        .from(member)
        .innerJoin(user, eq(member.userId, user.id))
        .innerJoin(organization, eq(member.organizationId, organization.id))
        .where(and(...conditions))
        .orderBy(desc(organization.createdAt))
        .limit(input.limit)
        .offset(offset);

      // Group by owner - one owner can own multiple orgs
      const ownerMap = new Map<
        string,
        {
          userId: string;
          userName: string;
          userEmail: string;
          userImage: string | null;
          platformRole: string | null;
          banned: boolean | null;
          organizations: {
            orgId: string;
            orgName: string;
            orgSlug: string;
            orgCreatedAt: Date;
          }[];
        }
      >();

      for (const o of owners) {
        const existing = ownerMap.get(o.userId);
        const orgEntry = {
          orgId: o.orgId,
          orgName: o.orgName,
          orgSlug: o.orgSlug,
          orgCreatedAt: o.orgCreatedAt,
        };

        if (existing) {
          existing.organizations.push(orgEntry);
        } else {
          ownerMap.set(o.userId, {
            userId: o.userId,
            userName: o.userName,
            userEmail: o.userEmail,
            userImage: o.userImage,
            platformRole: o.platformRole,
            banned: o.banned,
            organizations: [orgEntry],
          });
        }
      }

      return [...ownerMap.values()].slice(offset, offset + input.limit);
    }),

  getOwnerOrganizations: adminProcedure
    .input(z.object({ userId: z.string() }))
    .handler(async ({ input, context }) => {
      const ownerUser = await context.db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          banned: user.banned,
          createdAt: user.createdAt,
        })
        .from(user)
        .where(eq(user.id, input.userId))
        .limit(1);

      if (!ownerUser[0]) {
        throw new ORPCError("NOT_FOUND", { message: "User not found" });
      }

      const ownedOrgs = await context.db
        .select({
          orgId: organization.id,
          orgName: organization.name,
          orgSlug: organization.slug,
          orgLogo: organization.logo,
          orgCreatedAt: organization.createdAt,
        })
        .from(member)
        .innerJoin(organization, eq(member.organizationId, organization.id))
        .where(and(eq(member.userId, input.userId), eq(member.role, "owner")));

      // Get member counts for each org
      const orgIds = ownedOrgs.map((o) => o.orgId);
      const memberCounts =
        orgIds.length > 0
          ? await context.db
              .select({
                organizationId: member.organizationId,
                memberCount: count(),
              })
              .from(member)
              .where(or(...orgIds.map((id) => eq(member.organizationId, id))))
              .groupBy(member.organizationId)
          : [];

      const countMap = new Map<string, number>();
      for (const mc of memberCounts) {
        countMap.set(mc.organizationId, mc.memberCount);
      }

      return {
        owner: ownerUser[0],
        organizations: ownedOrgs.map((o) => ({
          ...o,
          memberCount: countMap.get(o.orgId) ?? 0,
        })),
      };
    }),
};
