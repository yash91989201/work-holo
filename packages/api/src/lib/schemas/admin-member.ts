import { member, user } from "@work-holo/db/schema/index";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const MemberSelectSchema = createSelectSchema(member);
export const UserSelectSchema = createSelectSchema(user);

export const ListMembersInput = z
  .object({
    page: z.number().min(1).default(1),
    perPage: z.number().min(1).max(100).default(10),
    search: z.string().optional(),
    filters: z
      .object({
        role: z.string().optional(),
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

export const MemberWithUserSchema = MemberSelectSchema.extend({
  user: UserSelectSchema.pick({
    id: true,
    name: true,
    email: true,
    image: true,
    createdAt: true,
  }),
});

export const ListMembersOutput = z.object({
  members: z.array(MemberWithUserSchema),
  total: z.number(),
  pageCount: z.number(),
});
