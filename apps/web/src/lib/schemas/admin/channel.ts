import z from "zod";

export const UpdateChannelFormSchema = z.object({
  channelId: z.string(),
  name: z
    .string()
    .min(1, "Channel name is required")
    .max(100, "Channel name must be less than 100 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  isPrivate: z.boolean().optional(),
  isArchived: z.boolean().optional(),
});
