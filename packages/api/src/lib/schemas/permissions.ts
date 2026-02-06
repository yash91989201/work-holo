import z from "zod";

export const permissionsSchema = z.object({
  role: z.string(),
  permissions: z.object({
    // Organization permissions
    canCreateOrg: z.boolean(),
    canDeleteOrg: z.boolean(),

    // User management permissions
    canInviteUsers: z.boolean(),
    canRemoveUsers: z.boolean(),

    // Role assignment permissions
    canAssignOwner: z.boolean(),
    canAssignAdmin: z.boolean(),
    canAssignTeamAdmin: z.boolean(),
    canAssignTeamLead: z.boolean(),

    // Team permissions
    canCreateTeam: z.boolean(),
    canDeleteTeam: z.boolean(),
    canUpdateTeam: z.boolean(),
    canViewAllTeams: z.boolean(),
    canAddTeamMembers: z.boolean(),

    // Channel permissions
    canCreateChannel: z.boolean(),
    canDeleteChannel: z.boolean(),

    // Message permissions
    canModerateMessages: z.boolean(),

    // Attendance permissions
    canViewAllAttendance: z.boolean(),
    canViewTeamAttendance: z.boolean(),
    canViewOwnAttendance: z.boolean(),

    // Dashboard permissions
    canViewOrgDashboard: z.boolean(),
    canViewTeamDashboard: z.boolean(),
    canViewPersonalDashboard: z.boolean(),
  }),
});
