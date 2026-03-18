import { pushSubscriptionTable } from "@work-holo/db/schema/notification";
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

export const pushSubscriptionRouter = {
  /**
   * Returns the VAPID public key needed by clients to subscribe to push notifications.
   *
   * @returns The VAPID public key string
   */
  getVapidPublicKey: publicProcedure
    .output(GetVapidPublicKeyOutput)
    .handler(() => ({ publicKey: getVapidPublicKey() })),

  /**
   * Saves or updates a push notification subscription for the current user.
   * Uses upsert on (userId, endpoint) to avoid duplicates.
   *
   * @param input.subscription - The PushSubscription object with endpoint and keys
   * @param input.userAgent - The client's user agent string
   * @returns Success flag and transaction ID
   */
  save: protectedProcedure
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

  /**
   * Removes a push notification subscription by endpoint for the current user.
   *
   * @param input.endpoint - The push subscription endpoint URL to remove
   * @returns Success flag and transaction ID
   */
  remove: protectedProcedure
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

  /**
   * Sends a test push notification to all of the current user's subscribed devices.
   * Automatically cleans up stale subscriptions that return 404 or 410 status codes.
   *
   * @returns Success flag and count of notifications successfully sent
   */
  test: protectedProcedure
    .output(TestPushNotificationOutput)
    .handler(async ({ context: { db, session } }) => {
      try {
        const { user } = session;

        try {
          const subscriptions = await db
            .select()
            .from(pushSubscriptionTable)
            .where(eq(pushSubscriptionTable.userId, user.id));

          if (subscriptions.length === 0) {
            return { success: true, sent: 0 };
          }

          let sent = 0;

          const sendPromises = subscriptions.map(async (subscription) => {
            try {
              const testNotificationId = `test-${Date.now()}-${subscription.id}`;

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
                  notificationId: testNotificationId,
                  eventType: "test",
                  entityType: "event_type",
                  entityId: "test",
                  playSound: true,
                  data: {
                    url: "/",
                    notificationId: testNotificationId,
                    type: "test",
                    entityType: "event_type",
                    entityId: "test",
                    playSound: true,
                  },
                })
              );

              sent++;
            } catch (error) {
              console.error(
                `Failed to send push notification to subscription ${subscription.id}:`,
                error
              );

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
