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
          org: {
            create: permission.can("org", "create"),
            delete: permission.can("org", "delete"),
            inviteUsers: permission.can("user", "create"),
            removeUsers: permission.can("user", "delete"),
          },
          role: {
            assignOwner: permission.can("role", "assign_owner"),
            assignAdmin: permission.can("role", "assign_admin"),
            assignTeamAdmin: permission.can("role", "assign_team_admin"),
            assignTeamLead: permission.can("role", "assign_team_lead"),
          },
          team: {
            create: permission.can("team", "create"),
            delete: permission.can("team", "delete"),
            update: permission.can("team", "update"),
            viewAll: (await permission.getAccessibleTeamIds()) === null,
            addMembers: permission.can("team", "add_members"),
          },
          channel: {
            create: permission.can("channel", "create"),
            delete: permission.can("channel", "delete"),
          },
          message: {
            moderate: permission.can("message", "moderate"),
          },
          attendance: {
            viewAll: permission.can("attendance", "view_all"),
            viewTeam: permission.can("attendance", "view_team"),
            viewOwn: permission.can("attendance", "view_self"),
          },
          dashboard: {
            viewOrg: permission.can("dashboard", "org"),
            viewTeam: permission.can("dashboard", "team"),
            viewPersonal: permission.can("dashboard", "personal"),
          },
        },
      };
    }),
};
