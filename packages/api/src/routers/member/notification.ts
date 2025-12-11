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

export const memberNotificationRouter = {
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
