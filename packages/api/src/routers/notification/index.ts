import { ORPCError } from "@orpc/server";
import { notificationTable } from "@work-holo/db/schema/index";
import { and, eq } from "drizzle-orm";
import { protectedProcedure } from "../../index";
import { generateTxId } from "../../lib/electric-proxy";
import {
  MarkAllNotificationsAsReadInput,
  MarkAllNotificationsAsReadOutput,
  MarkNotificationAsReadInput,
  MarkNotificationAsReadOutput,
} from "../../lib/schemas/notification";

export const notificationRouter = {
  /**
   * Marks a single notification as read for the current user.
   * No-op if the notification is already read.
   *
   * @param input.notificationId - The notification to mark as read
   * @returns Transaction ID and success flag
   * @throws NOT_FOUND if the notification does not exist or belongs to another user
   */
  markAsRead: protectedProcedure
    .input(MarkNotificationAsReadInput)
    .output(MarkNotificationAsReadOutput)
    .handler(async ({ context: { db, session }, input }) => {
      const { user } = session;

      const { txid } = await db.transaction(async (tx) => {
        const txid = await generateTxId(tx);

        const notification = await tx.query.notificationTable.findFirst({
          where: and(
            eq(notificationTable.id, input.notificationId),
            eq(notificationTable.userId, user.id)
          ),
          columns: {
            id: true,
            status: true,
          },
        });

        if (!notification) {
          throw new ORPCError("NOT_FOUND", {
            message: "Notification not found.",
          });
        }

        if (notification.status === "unread") {
          await tx
            .update(notificationTable)
            .set({
              status: "read",
              readAt: new Date(),
            })
            .where(eq(notificationTable.id, input.notificationId));
        }

        return { txid };
      });

      return { txid, success: true };
    }),

  /**
   * Marks all unread notifications as read for the current user in a single transaction.
   *
   * @returns Transaction ID
   */
  markAllAsRead: protectedProcedure
    .input(MarkAllNotificationsAsReadInput)
    .output(MarkAllNotificationsAsReadOutput)
    .handler(async ({ context: { db, session } }) => {
      const { user } = session;

      const { txid } = await db.transaction(async (tx) => {
        const txid = await generateTxId(tx);

        await tx
          .update(notificationTable)
          .set({
            status: "read",
            readAt: new Date(),
          })
          .where(
            and(
              eq(notificationTable.userId, user.id),
              eq(notificationTable.status, "unread")
            )
          );

        return { txid };
      });

      return { txid };
    }),
};
