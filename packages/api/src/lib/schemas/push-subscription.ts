import { z } from "zod";

export const SavePushSubscriptionInput = z.object({
  subscription: z.object({
    endpoint: z.string().url(),
    keys: z.object({
      p256dh: z.string(),
      auth: z.string(),
    }),
  }),
  userAgent: z.string().optional(),
});

export const RemovePushSubscriptionInput = z.object({
  endpoint: z.string().url(),
});
