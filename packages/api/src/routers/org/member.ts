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
import { orgMemberProcedure } from "../../index";
import {
  ListMembersInput,
  ListMembersOutput,
} from "../../lib/schemas/admin-member";

export const memberRouter = {
  /**
   * Lists organization members with pagination, search by name/email,
   * role filtering, and configurable sort order.
   *
   * @param input.page - Page number (1-based)
   * @param input.perPage - Number of results per page
   * @param input.search - Optional search string matched against name and email
   * @param input.filters.role - Optional role filter
   * @param input.sorting - Optional sort configuration (supports user.name, role, createdAt)
   * @returns Paginated list of members with user details, total count, and page count
   */
  list: orgMemberProcedure
    .input(ListMembersInput)
    .output(ListMembersOutput)
    .handler(async ({ input, context: { db, orgId, permission } }) => {
      await permission.check(permission.org.read());
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
};
