import { invitation } from "@work-holo/db/schema/index";
import type { SQL } from "drizzle-orm";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { orgMemberProcedure } from "../../index";
import {
  ListInvitationsInput,
  ListInvitationsOutput,
} from "../../lib/schemas/admin-invitation";

export const invitationRouter = {
  /**
   * Lists organization invitations with pagination, email search,
   * role/status filtering, and configurable sort order.
   *
   * @param input.page - Page number (1-based)
   * @param input.perPage - Number of results per page
   * @param input.search - Optional search string matched against invitation email
   * @param input.filters.role - Optional role filter
   * @param input.filters.status - Optional invitation status filter
   * @param input.sorting - Optional sort configuration (supports email, role, status, expiresAt)
   * @returns Paginated list of invitations, total count, and page count
   */
  list: orgMemberProcedure
    .input(ListInvitationsInput)
    .output(ListInvitationsOutput)
    .handler(async ({ input, context: { db, orgId, permission } }) => {
      await permission.check(permission.org.invite.list());
      const { page, perPage, search, filters, sorting, role, status } = input;
      const offset = (page - 1) * perPage;
      const roleFilter = filters?.role ?? role;
      const statusFilter = filters?.status ?? status;

      const conditions = [eq(invitation.organizationId, orgId)];

      if (roleFilter) {
        conditions.push(eq(invitation.role, roleFilter));
      }

      if (statusFilter) {
        conditions.push(eq(invitation.status, statusFilter));
      }

      let searchCondition: SQL | undefined;
      if (search) {
        searchCondition = ilike(invitation.email, `%${search}%`);
      }

      const whereClause = searchCondition
        ? and(...conditions, searchCondition)
        : and(...conditions);

      let orderBy = [desc(invitation.createdAt)];

      if (sorting && sorting.length > 0) {
        orderBy = sorting.map((sort) => {
          const direction = sort.desc ? desc : asc;
          switch (sort.id) {
            case "email":
              return direction(invitation.email);
            case "role":
              return direction(invitation.role);
            case "status":
              return direction(invitation.status);
            case "expiresAt":
              return direction(invitation.expiresAt);
            default:
              return desc(invitation.createdAt);
          }
        });
      }

      const invitations = await db.query.invitation.findMany({
        where: whereClause,
        limit: perPage,
        offset,
        orderBy,
      });

      const [totalRow] = await db
        .select({ count: count() })
        .from(invitation)
        .where(whereClause);

      const total = totalRow?.count ?? 0;
      const pageCount = Math.ceil(total / perPage);

      const mappedInvitations = invitations.map((inv) => ({
        ...inv,
        role: (inv.role as "admin" | "member") ?? "member",
      }));

      return { invitations: mappedInvitations, total, pageCount };
    }),
};
