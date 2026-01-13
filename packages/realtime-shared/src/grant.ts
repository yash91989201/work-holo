import { z } from "zod";

export const JoinGrantClaims = z.object({
  iss: z.literal("work-holo-server"),
  aud: z.literal("work-holo-realtime"),
  sub: z.string(),
  room: z.string(),
  caps: z.array(z.enum(["presence", "typing", "broadcast"])),
  exp: z.number(),
  iat: z.number().optional(),
});

export type JoinGrantClaims = z.infer<typeof JoinGrantClaims>;
