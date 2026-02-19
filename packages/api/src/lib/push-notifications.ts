import webpush from "web-push";
import { z } from "zod";
import { env } from "../env";

webpush.setVapidDetails(
  env.VAPID_SUBJECT,
  env.VAPID_PUBLIC_KEY,
  env.VAPID_PRIVATE_KEY
);

export const GetVapidPublicKeyOutput = z.object({
  publicKey: z.string(),
});

export const SavePushSubscriptionOutput = z.object({
  success: z.boolean(),
  txid: z.number(),
});

export const RemovePushSubscriptionOutput = z.object({
  success: z.boolean(),
  txid: z.number(),
});

export const TestPushNotificationOutput = z.object({
  success: z.boolean(),
  sent: z.number(),
});

export interface PushNotificationPayload {
  badge?: string;
  body: string;
  data?: Record<string, unknown>;
  icon?: string;
  requireInteraction?: boolean;
  tag?: string;
  title: string;
}

export function getVapidPublicKey(): string {
  return env.VAPID_PUBLIC_KEY;
}
