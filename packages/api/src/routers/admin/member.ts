import { ORPCError } from "@orpc/client";
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
import { protectedProcedure } from "../../index";
import {
  ListMembersInput,
  ListMembersOutput,
} from "../../lib/schemas/admin-member";

export const adminMemberRouter = {
  listMembers: protectedProcedure
    .input(ListMembersInput)
    .output(ListMembersOutput)
    .handler(async ({ input, context: { db, session } }) => {
      const organizationId = session.session.activeOrganizationId;
      if (!organizationId) {
        throw new ORPCError("BAD_REQUEST", {
          message: "No active organization",
        });
      }

      const { page, perPage, search, filters, sorting } = input;
      const offset = (page - 1) * perPage;

      const conditions = [eq(member.organizationId, organizationId)];

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
            case "createdAt": // User joined date (user creation or member creation? previously used user.createdAt in UI sort of?)
              // UI shows "Joined" which usually means member joined org. Member has createdAt.
              // The UI code was showing `member.user.createdAt`.
              // Member table usually has createdAt. Let's use member.createdAt for "Joined" context if possible,
              // or match UI which used user.createdAt.
              // Actually, user.createdAt is when the user signed up to the platform.
              // member.createdAt is when they joined the org.
              // Let's stick to user.createdAt if that's what was displayed, or better yet, fix it to member.createdAt?
              // The previous code used `member.user.createdAt`. I will stick to that to avoid breaking UI perception, or support both.
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
