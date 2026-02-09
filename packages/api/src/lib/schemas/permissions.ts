import z from "zod";

export const permissionsSchema = z.object({
  role: z.string(),
  permissions: z.object({
    org: z.object({
      create: z.boolean(),
      delete: z.boolean(),
      inviteUsers: z.boolean(),
      removeUsers: z.boolean(),
    }),
    role: z.object({
      assignOwner: z.boolean(),
      assignAdmin: z.boolean(),
      assignTeamAdmin: z.boolean(),
      assignTeamLead: z.boolean(),
    }),
    team: z.object({
      create: z.boolean(),
      delete: z.boolean(),
      update: z.boolean(),
      viewAll: z.boolean(),
      addMembers: z.boolean(),
    }),
    channel: z.object({
      create: z.boolean(),
      delete: z.boolean(),
    }),
    message: z.object({
      moderate: z.boolean(),
    }),
    attendance: z.object({
      viewAll: z.boolean(),
      viewTeam: z.boolean(),
      viewOwn: z.boolean(),
    }),
    dashboard: z.object({
      viewOrg: z.boolean(),
      viewTeam: z.boolean(),
      viewPersonal: z.boolean(),
    }),
  }),
});
