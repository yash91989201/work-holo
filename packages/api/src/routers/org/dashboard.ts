import { member, team } from "@work-holo/db/schema/index";
import { count, eq } from "drizzle-orm";
import { orgMemberProcedure } from "../../index";

export const dashboardRouter = {
  /**
   * Returns the total number of members in the current organization.
   *
   * @returns Member count as a number
   */
  getMemberCount: orgMemberProcedure.handler(
    async ({ context: { db, orgId, permission } }) => {
      await permission.check(permission.org.read());
      const [memberRows] = await db
        .select({
          count: count(),
        })
        .from(member)
        .where(eq(member.organizationId, orgId));

      return memberRows?.count ?? 0;
    }
  ),

  /**
   * Returns the total number of teams in the current organization.
   *
   * @returns Team count as a number
   */
  getTeamCount: orgMemberProcedure.handler(
    async ({ context: { db, orgId, permission } }) => {
      await permission.check(permission.org.read());
      const [teamRows] = await db
        .select({
          count: count(),
        })
        .from(team)
        .where(eq(team.organizationId, orgId));

      return teamRows?.count ?? 0;
    }
  ),
};
