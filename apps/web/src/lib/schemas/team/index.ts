import z from "zod";

export const CreateTeamFormSchema = z.object({
  name: z.string(),
  modules: z.array(z.string()),
  memberIds: z.array(z.string()),
});
