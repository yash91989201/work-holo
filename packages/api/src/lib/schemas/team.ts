import {
  TeamMemberSchema,
  TeamSchema,
  UserSchema,
} from "@work-holo/db/lib/schemas/db-tables";
import { z } from "zod";

export const ListTeamsInput = z
  .object({
    page: z.number().default(1),
    limit: z.number().default(10),
    search: z.string().optional(),
    filters: z
      .object({
        dateRange: z
          .object({
            from: z
              .string()
              .transform((val) => new Date(val))
              .optional(),
            to: z
              .string()
              .transform((val) => new Date(val))
              .optional(),
          })
          .optional(),
      })
      .optional(),
    sorting: z
      .array(
        z.object({
          id: z.string(),
          desc: z.boolean(),
        })
      )
      .optional(),
  })
  .default({ page: 1, limit: 10 });

const TeamWithMembers = TeamSchema.extend({
  teamMembers: z.array(
    TeamMemberSchema.extend({
      user: UserSchema,
    })
  ),
});

export const ListTeamsOutput = z.object({
  teams: z.array(TeamWithMembers),
  total: z.number(),
  pageCount: z.number(),
});

export const AddMemberInput = z.object({
  teamId: z.string(),
  userIds: z.array(z.string()).min(1, "At least one user ID is required"),
});

export const AddMemberOutput = z.object({
  success: z.boolean(),
  message: z.string(),
  addedCount: z.number(),
});

export const RemoveMemberInput = z.object({
  teamId: z.string(),
  userIds: z.array(z.string()).min(1, "At least one user ID is required"),
});

export const RemoveMemberOutput = z.object({
  success: z.boolean(),
  message: z.string(),
  removedCount: z.number(),
});

export const CreateTeamInput = z.object({
  name: z.string().min(1, "Team name is required"),
});

export const CreateTeamOutput = z.object({
  id: z.string(),
  name: z.string(),
  organizationId: z.string(),
  createdBy: z.string().nullable(),
  createdAt: z.date(),
});

export const DeleteTeamInput = z.object({
  teamId: z.string(),
});

export const DeleteTeamOutput = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const UpdateTeamMemberRoleInput = z.object({
  teamId: z.string(),
  userId: z.string(),
  role: z.enum(["member", "team_lead"]),
});

export const UpdateTeamMemberRoleOutput = z.object({
  success: z.boolean(),
  message: z.string(),
});
