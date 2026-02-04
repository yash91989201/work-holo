import { ORPCError } from "@orpc/server";
import { member, user } from "@work-holo/db/schema/index";
import type { SQL } from "drizzle-orm";
import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  or,
} from "drizzle-orm";
import { orgAdminProcedure } from "../../index";
import {
  ListMembersInput,
  ListMembersOutput,
  UpdateRoleInput,
  UpdateRoleOutput,
} from "../../lib/schemas/admin-member";

export const adminMemberRouter = {
  listMembers: orgAdminProcedure
    .input(ListMembersInput)
    .output(ListMembersOutput)
    .handler(async ({ input, context: { db, orgId } }) => {
      const { page, perPage, search, filters, sorting } = input;
      const offset = (page - 1) * perPage;

      const conditions = [eq(member.organizationId, orgId)];

      if (filters?.role) {
        conditions.push(eq(member.role, filters.role));
      }

      let searchCondition: SQL | undefined;
      if (search) {
        searchCondition = or(
          ilike(user.name, `%${search}%`),
          ilike(user.email, `%${search}%`)
        );
      }

      const whereClause = searchCondition
        ? and(...conditions, searchCondition)
        : and(...conditions);

      let orderBy = [desc(member.createdAt)];

      if (sorting && sorting.length > 0) {
        orderBy = sorting.map((sort) => {
          const direction = sort.desc ? desc : asc;
          switch (sort.id) {
            case "user.name":
              return direction(user.name);
            case "role":
              return direction(member.role);
            case "createdAt":
              return direction(user.createdAt);
            default:
              return desc(member.createdAt);
          }
        });
      }

      const members = await db
        .select({
          ...getTableColumns(member),
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            createdAt: user.createdAt,
          },
        })
        .from(member)
        .innerJoin(user, eq(member.userId, user.id))
        .where(whereClause)
        .orderBy(...orderBy)
        .limit(perPage)
        .offset(offset);

      const [totalRow] = await db
        .select({ count: count() })
        .from(member)
        .innerJoin(user, eq(member.userId, user.id))
        .where(whereClause);

      const total = totalRow?.count ?? 0;
      const pageCount = Math.ceil(total / perPage);

      return { members, total, pageCount };
    }),

  updateRole: orgAdminProcedure
    .input(UpdateRoleInput)
    .output(UpdateRoleOutput)
    .handler(async ({ input, context: { db, orgMembership, permission } }) => {
      if (!permission) {
        throw new ORPCError("FORBIDDEN", {
          message: "Permission context not available",
        });
      }

      if (input.memberId === orgMembership.memberId) {
        throw new ORPCError("FORBIDDEN", {
          message: "You cannot change your own role",
        });
      }

      permission.validateRoleAssignment(input.role);

      const [updated] = await db
        .update(member)
        .set({ role: input.role })
        .where(eq(member.id, input.memberId))
        .returning();

      if (!updated) {
        throw new ORPCError("NOT_FOUND", {
          message: "Member not found",
        });
      }

      return {
        success: true,
        message: `Member role updated to '${input.role}'`,
      };
    }),
};
