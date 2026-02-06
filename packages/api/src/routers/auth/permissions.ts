import { orgMemberProcedure } from "@work-holo/api/index";
import { permissionsSchema } from "../../lib/schemas/permissions";

export const permissionsRouter = {
  check: orgMemberProcedure
    .output(permissionsSchema)
    .handler(async ({ context }) => {
      const { permission, orgMembership } = context;

      if (!permission) {
        throw new Error("Permission context not available");
      }

      return {
        role: orgMembership.role,
        permissions: {
          // Organization permissions
          canCreateOrg: permission.can("org", "create"),
          canDeleteOrg: permission.can("org", "delete"),

          // User management permissions
          canInviteUsers: permission.can("user", "create"),
          canRemoveUsers: permission.can("user", "delete"),

          // Role assignment permissions
          canAssignOwner: permission.can("role", "assign_owner"),
          canAssignAdmin: permission.can("role", "assign_admin"),
          canAssignTeamAdmin: permission.can("role", "assign_team_admin"),
          canAssignTeamLead: permission.can("role", "assign_team_lead"),

          // Team permissions
          canCreateTeam: permission.can("team", "create"),
          canDeleteTeam: permission.can("team", "delete"),
          canUpdateTeam: permission.can("team", "update"),
          canViewAllTeams: (await permission.getAccessibleTeamIds()) === null,
          canAddTeamMembers: permission.can("team", "add_members"),

          // Channel permissions
          canCreateChannel: permission.can("channel", "create"),
          canDeleteChannel: permission.can("channel", "delete"),

          // Message permissions
          canModerateMessages: permission.can("message", "moderate"),

          // Attendance permissions
          canViewAllAttendance: permission.can("attendance", "view_all"),
          canViewTeamAttendance: permission.can("attendance", "view_team"),
          canViewOwnAttendance: permission.can("attendance", "view_self"),

          // Dashboard permissions
          canViewOrgDashboard: permission.can("dashboard", "org"),
          canViewTeamDashboard: permission.can("dashboard", "team"),
          canViewPersonalDashboard: permission.can("dashboard", "personal"),
        },
      };
    }),
};
