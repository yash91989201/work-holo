import { z } from "zod";

export const InviteMemberFormSchema = z.object({
  email: z.email(),
  teamId: z.string(),
});

export const UpdateMemberRoleSchema = z.object({
  role: z.enum(["admin", "member"]),
});
