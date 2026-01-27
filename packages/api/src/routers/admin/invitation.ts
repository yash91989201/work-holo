import { ORPCError } from "@orpc/client";
import { invitation } from "@work-holo/db/schema/index";
import type { SQL } from "drizzle-orm";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { orgAdminProcedure } from "../../index";
import {
  ListInvitationsInput,
  ListInvitationsOutput,
} from "../../lib/schemas/admin-invitation";

export const adminInvitationRouter = {
  listInvitations: orgAdminProcedure
    .input(ListInvitationsInput)
    .output(ListInvitationsOutput)
    .handler(async ({ input, context: { db, session } }) => {
      const organizationId = session.session.activeOrganizationId;
      if (!organizationId) {
        throw new ORPCError("BAD_REQUEST", {
          message: "No active organization",
        });
      }

      const { page, perPage, search, filters, sorting } = input;
      const offset = (page - 1) * perPage;

      const conditions = [eq(invitation.organizationId, organizationId)];

      if (filters?.role) {
        conditions.push(eq(invitation.role, filters.role));
      }

      if (filters?.status) {
        conditions.push(eq(invitation.status, filters.status));
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
