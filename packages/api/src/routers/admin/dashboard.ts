import { member, team } from "@work-holo/db/schema/index";
import { count, eq } from "drizzle-orm";
import { orgAdminProcedure } from "../../index";

export const adminDashboardRouter = {
  getMemberCount: orgAdminProcedure.handler(
    async ({ context: { db, orgId } }) => {
      const [memberRows] = await db
        .select({
          count: count(),
        })
        .from(member)
        .where(eq(member.organizationId, orgId!));

      return memberRows?.count ?? 0;
    }
  ),

  getTeamCount: orgAdminProcedure.handler(
    async ({ context: { db, orgId } }) => {
      const [teamRows] = await db
        .select({
          count: count(),
        })
        .from(team)
        .where(eq(team.organizationId, orgId!));

      return teamRows?.count ?? 0;
    }
  ),
};
