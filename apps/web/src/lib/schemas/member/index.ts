import { z } from "zod";

export const InvitationFormSchema = z
  .object({
    email: z.email(),
    role: z.enum(["admin", "member"]),
    teamId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === "member") {
        return data.teamId != null && data.teamId.length > 0;
      }
      return true;
    },
    {
      message: "Team is required for member invitations",
      path: ["teamId"],
    }
  );

export const UpdateMemberRoleSchema = z.object({
  role: z.enum(["admin", "member"]),
});
