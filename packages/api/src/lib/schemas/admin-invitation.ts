import { invitation } from "@work-holo/db/schema/index";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const InvitationSelectSchema = createSelectSchema(invitation).extend({
  role: z.enum(["admin", "member"]),
});

export const ListInvitationsInput = z
  .object({
    page: z.number().min(1).default(1),
    perPage: z.number().min(1).max(100).default(10),
    search: z.string().optional(),
    role: z.string().optional(),
    status: z.enum(["pending", "accepted", "rejected", "expired"]).optional(),
    filters: z
      .object({
        role: z.string().optional(),
        status: z
          .enum(["pending", "accepted", "rejected", "expired"])
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
  .optional()
  .default({ page: 1, perPage: 10 });

export const ListInvitationsOutput = z.object({
  invitations: z.array(InvitationSelectSchema),
  total: z.number(),
  pageCount: z.number(),
});
