import path from "node:path";
import { fileURLToPath } from "node:url";
import { ORPCError } from "@orpc/server";
import type { db } from "@work-holo/db";
import { member, team, teamMember } from "@work-holo/db/schema/auth";
import { type Enforcer, newEnforcer } from "casbin";
import { and, eq } from "drizzle-orm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let enforcerInstance: Enforcer | null = null;

async function getEnforcer(): Promise<Enforcer> {
  if (!enforcerInstance) {
    enforcerInstance = await newEnforcer(
      path.resolve(__dirname, "model.conf"),
      path.resolve(__dirname, "policy.csv")
    );
  }
  return enforcerInstance;
}

export async function initializePermissionService(): Promise<void> {
  await getEnforcer();
}

// What each role is allowed to assign
const ASSIGNABLE_ROLES: Record<string, string[]> = {
  owner: ["owner", "admin", "team_admin", "team_lead", "member"],
  admin: ["team_admin", "team_lead", "member"],
  team_admin: ["team_lead", "member"],
  team_lead: [],
  member: [],
};

export class PermissionContext {
  private readonly enforcer: Enforcer;
  readonly role: string;
  readonly userId: string;
  private readonly db: typeof db;

  private constructor(
    enforcer: Enforcer,
    role: string,
    userId: string,
    dbInstance: typeof db
  ) {
    this.enforcer = enforcer;
    this.role = role;
    this.userId = userId;
    this.db = dbInstance;
  }

  static async create(
    role: string,
    userId: string,
    dbInstance: typeof db
  ): Promise<PermissionContext> {
    const enforcer = await getEnforcer();
    return new PermissionContext(enforcer, role, userId, dbInstance);
  }

  /** Does the role have this permission? (no throw) */
  can(resource: string, action: string): boolean {
    return this.enforcer.enforceSync(this.role, resource, action);
  }

  /** Does the role have this permission? Throws FORBIDDEN if not. */
  check(resource: string, action: string): void {
    if (!this.can(resource, action)) {
      throw new ORPCError("FORBIDDEN", {
        message: `Role '${this.role}' is not permitted to '${action}' on '${resource}'`,
      });
    }
  }

  /**
   * Team-scoped check: Casbin check + ownership/membership scope.
   *   owner / admin  → full access (no scope restriction)
   *   team_admin     → must have created the team (team.createdBy)
   *   team_lead      → must be assigned as lead (teamMember.role = "team_lead")
   */
  async checkTeamScope(teamId: string, action: string): Promise<void> {
    this.check("team", action);

    if (this.role === "owner" || this.role === "admin") return;

    if (this.role === "team_admin") {
      const t = await this.db.query.team.findFirst({
        where: eq(team.id, teamId),
        columns: { createdBy: true },
      });
      if (!t?.createdBy || t.createdBy !== this.userId) {
        throw new ORPCError("FORBIDDEN", {
          message: "You can only manage teams you created",
        });
      }
      return;
    }

    if (this.role === "team_lead") {
      const tm = await this.db.query.teamMember.findFirst({
        where: and(
          eq(teamMember.teamId, teamId),
          eq(teamMember.userId, this.userId)
        ),
        columns: { role: true },
      });
      if (tm?.role !== "team_lead") {
        throw new ORPCError("FORBIDDEN", {
          message: "You are not the lead of this team",
        });
      }
      return;
    }

    throw new ORPCError("FORBIDDEN", {
      message: "Insufficient permissions for this team",
    });
  }

  /**
   * Ownership-only check (no Casbin call). Used when Casbin already passed
   * and we just need to verify the team_admin created this specific team.
   */
  async verifyTeamOwnership(teamId: string): Promise<void> {
    if (this.role === "owner" || this.role === "admin") return;

    const t = await this.db.query.team.findFirst({
      where: eq(team.id, teamId),
      columns: { createdBy: true },
    });

    if (!t?.createdBy || t.createdBy !== this.userId) {
      throw new ORPCError("FORBIDDEN", {
        message: "You can only manage resources in teams you created",
      });
    }
  }

  /**
   * Returns the team IDs this user can access.
   * null  → all teams (owner / admin)
   * []    → no teams
   */
  async getAccessibleTeamIds(): Promise<string[] | null> {
    if (this.role === "owner" || this.role === "admin") return null;

    if (this.role === "team_admin") {
      const teams = await this.db.query.team.findMany({
        where: eq(team.createdBy, this.userId),
        columns: { id: true },
      });
      return teams.map((t: { id: string }) => t.id);
    }

    // team_lead + member: teams they belong to
    const memberships = await this.db.query.teamMember.findMany({
      where: eq(teamMember.userId, this.userId),
      columns: { teamId: true },
    });
    return memberships.map((m: { teamId: string }) => m.teamId);
  }

  /**
   * Validates that the current role is allowed to assign targetRole.
   * Throws FORBIDDEN if not.
   */
  validateRoleAssignment(targetRole: string): void {
    const allowed = ASSIGNABLE_ROLES[this.role] ?? [];
    if (!allowed.includes(targetRole)) {
      throw new ORPCError("FORBIDDEN", {
        message: `Role '${this.role}' cannot assign role '${targetRole}'`,
      });
    }
  }

  /**
   * Syncs org-level member.role when a team-level role changes.
   * - Promoting to team_lead  → sets member.role = "team_lead"
   * - Demoting from team_lead → reverts member.role = "member"
   *   only if the user has no other team_lead assignments.
   */
  async syncOrgRoleForTeamLead(
    userId: string,
    orgId: string,
    newTeamRole: string
  ): Promise<void> {
    if (newTeamRole === "team_lead") {
      await this.db
        .update(member)
        .set({ role: "team_lead" })
        .where(
          and(eq(member.userId, userId), eq(member.organizationId, orgId))
        );
      return;
    }

    // Removing team_lead — check if user still leads any other team
    const remaining = await this.db.query.teamMember.findMany({
      where: and(
        eq(teamMember.userId, userId),
        eq(teamMember.role, "team_lead")
      ),
      columns: { teamId: true },
    });

    if (remaining.length === 0) {
      await this.db
        .update(member)
        .set({ role: "member" })
        .where(
          and(eq(member.userId, userId), eq(member.organizationId, orgId))
        );
    }
  }
}
