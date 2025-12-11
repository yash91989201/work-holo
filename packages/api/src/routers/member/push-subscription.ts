import { pushSubscriptionTable } from "@work-holo/db/schema/communication";
import { and, eq } from "drizzle-orm";
import webpush from "web-push";
import { protectedProcedure, publicProcedure } from "../../index";
import { generateTxId } from "../../lib/electric-proxy";
import {
  GetVapidPublicKeyOutput,
  getVapidPublicKey,
  RemovePushSubscriptionOutput,
  SavePushSubscriptionOutput,
  TestPushNotificationOutput,
} from "../../lib/push-notifications";
import {
  RemovePushSubscriptionInput,
  SavePushSubscriptionInput,
} from "../../lib/schemas/push-subscription";

export const memberPushSubscriptionRouter = {
  getVapidPublicKey: publicProcedure
    .output(GetVapidPublicKeyOutput)
    .handler(() => ({ publicKey: getVapidPublicKey() })),

  savePushSubscription: protectedProcedure
    .input(SavePushSubscriptionInput)
    .output(SavePushSubscriptionOutput)
    .handler(async ({ context: { db, session }, input }) => {
      try {
        const { user } = session;

        const { txid } = await db.transaction(async (tx) => {
          const txid = await generateTxId(tx);

          await tx
            .insert(pushSubscriptionTable)
            .values({
              userId: user.id,
              endpoint: input.subscription.endpoint,
              p256dh: input.subscription.keys.p256dh,
              auth: input.subscription.keys.auth,
              userAgent: input.userAgent,
            })
            .onConflictDoUpdate({
              target: [
                pushSubscriptionTable.userId,
                pushSubscriptionTable.endpoint,
              ],
              set: {
                p256dh: input.subscription.keys.p256dh,
                auth: input.subscription.keys.auth,
                userAgent: input.userAgent,
              },
            })
            .returning();

          return { txid };
        });

        return { success: true, txid };
      } catch (error) {
        console.error("Error saving push subscription:", error);
        return { success: false, txid: 0 };
      }
    }),

  removePushSubscription: protectedProcedure
    .input(RemovePushSubscriptionInput)
    .output(RemovePushSubscriptionOutput)
    .handler(async ({ context: { db, session }, input }) => {
      const { user } = session;

      const { txid } = await db.transaction(async (tx) => {
        const txid = await generateTxId(tx);

        await tx
          .delete(pushSubscriptionTable)
          .where(
            and(
              eq(pushSubscriptionTable.userId, user.id),
              eq(pushSubscriptionTable.endpoint, input.endpoint)
            )
          );

        return { txid };
      });

      return { success: true, txid };
    }),

  testPushNotification: protectedProcedure
    .output(TestPushNotificationOutput)
    .handler(async ({ context: { db, session } }) => {
      try {
        const { user } = session;

        try {
          // Fetch all push subscriptions for the user
          const subscriptions = await db
            .select()
            .from(pushSubscriptionTable)
            .where(eq(pushSubscriptionTable.userId, user.id));

          if (subscriptions.length === 0) {
            return { success: true, sent: 0 };
          }

          let sent = 0;

          // Send notification to all subscriptions
          const sendPromises = subscriptions.map(async (subscription) => {
            try {
              const pushSubscription = {
                endpoint: subscription.endpoint,
                keys: {
                  p256dh: subscription.p256dh,
                  auth: subscription.auth,
                },
              };

              await webpush.sendNotification(
                pushSubscription,
                JSON.stringify({
                  title: "Test Notification",
                  body: "This is a test push notification from Work Holo",
                  icon: "/favicon.ico",
                  badge: "/favicon.ico",
                  tag: "test-notification",
                })
              );

              sent++;
            } catch (error) {
              console.error(
                `Failed to send push notification to subscription ${subscription.id}:`,
                error
              );

              // Remove invalid subscriptions (410 Gone or 404 Not Found)
              if (
                error &&
                typeof error === "object" &&
                "statusCode" in error &&
                (error.statusCode === 410 || error.statusCode === 404)
              ) {
                try {
                  await db
                    .delete(pushSubscriptionTable)
                    .where(eq(pushSubscriptionTable.id, subscription.id));

                  console.log(
                    `Removed invalid subscription ${subscription.id}`
                  );
                } catch (deleteError) {
                  console.error(
                    `Failed to remove invalid subscription ${subscription.id}:`,
                    deleteError
                  );
                }
              }
            }
          });

          await Promise.allSettled(sendPromises);

          return { success: true, sent };
        } catch (error) {
          console.error("Error sending push notifications:", error);
          return { success: false, sent: 0 };
        }
      } catch (error) {
        console.error("Error in testPushNotification:", error);
        return { success: false, sent: 0 };
      }
    }),
};
