import { ORPCError } from "@orpc/server";
import {
  dmConversationMuteTable,
  dmConversationTable,
} from "@work-holo/db/schema/direct-message";
import {
  channelMemberTable,
  notificationPreferenceTable,
  notificationTable,
} from "@work-holo/db/schema/index";
import { and, count, desc, eq, isNull, or, sql } from "drizzle-orm";
import { orgMemberProcedure, protectedProcedure } from "../../index";
import { generateTxId } from "../../lib/electric-proxy";
import {
  DismissNotificationInput,
  DismissNotificationOutput,
  GetChannelMuteStatusInput,
  GetChannelMuteStatusOutput,
  GetNotificationsInput,
  GetNotificationUnreadCountInput,
  GetPreferencesInput,
  GetPreferencesOutput,
  GetUnreadCountOutput,
  MarkAllNotificationsAsReadInput,
  MarkAllNotificationsAsReadOutput,
  MarkNotificationAsReadInput,
  MarkNotificationAsReadOutput,
  NotificationsListOutput,
  ToggleChannelMuteInput,
  ToggleChannelMuteOutput,
  UpdateBulkPreferencesInput,
  UpdateBulkPreferencesOutput,
  UpdatePreferenceInput,
  UpdatePreferenceOutput,
} from "../../lib/schemas/notification";
import { DEFAULT_NOTIFICATION_PREFERENCES } from "../../services/notification/defaults";
import type { NotificationEventType } from "../../services/notification/types";
import { soundPreferencesRouter } from "./sound-preferences";

export const notificationRouter = {
  getNotifications: protectedProcedure
    .input(GetNotificationsInput)
    .output(NotificationsListOutput)
    .handler(async ({ context: { db, session }, input }) => {
      const { user } = session;
      const { limit, cursor, status, orgId } = input;

      const conditions: ReturnType<typeof eq>[] = [
        eq(notificationTable.userId, user.id),
      ];

      if (status) {
        conditions.push(eq(notificationTable.status, status));
      }

      if (orgId) {
        conditions.push(eq(notificationTable.orgId, orgId));
      }

      if (cursor) {
        const cursorNotification = await db.query.notificationTable.findFirst({
          where: and(
            eq(notificationTable.id, cursor),
            eq(notificationTable.userId, user.id)
          ),
          columns: { id: true, createdAt: true },
        });

        if (cursorNotification?.createdAt) {
          conditions.push(
            sql`(
              ${notificationTable.createdAt} < ${cursorNotification.createdAt}
              OR (
                ${notificationTable.createdAt} = ${cursorNotification.createdAt}
                AND ${notificationTable.id} < ${cursorNotification.id}
              )
            )`
          );
        }
      }

      const rows = await db.query.notificationTable.findMany({
        where: and(...conditions),
        orderBy: [
          desc(notificationTable.createdAt),
          desc(notificationTable.id),
        ],
        limit: limit + 1,
        with: {
          actor: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      const hasMore = rows.length > limit;
      const items = rows.slice(0, limit);
      const nextCursor = hasMore ? items.at(-1)?.id : undefined;

      const notifications = items.map((row) => ({
        id: row.id,
        type: row.type,
        status: row.status,
        title: row.title,
        message: row.message,
        entityId: row.entityId,
        entityType: row.entityType,
        actionUrl: row.actionUrl,
        orgId: row.orgId,
        actor: row.actor
          ? {
              id: row.actor.id,
              name: row.actor.name,
              image: row.actor.image,
            }
          : null,
        readAt: row.readAt,
        dismissedAt: row.dismissedAt,
        createdAt: row.createdAt,
      }));

      return { notifications, nextCursor, hasMore };
    }),

  getUnreadCount: protectedProcedure
    .input(GetNotificationUnreadCountInput)
    .output(GetUnreadCountOutput)
    .handler(async ({ context: { db, session }, input }) => {
      const { user } = session;

      const conditions: ReturnType<typeof eq>[] = [
        eq(notificationTable.userId, user.id),
        eq(notificationTable.status, "unread"),
      ];

      if (input.orgId) {
        conditions.push(eq(notificationTable.orgId, input.orgId));
      }

      const [result] = await db
        .select({ count: count() })
        .from(notificationTable)
        .where(and(...conditions));

      return { count: result?.count ?? 0 };
    }),

  dismissNotification: protectedProcedure
    .input(DismissNotificationInput)
    .output(DismissNotificationOutput)
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

        if (notification.status !== "dismissed") {
          await tx
            .update(notificationTable)
            .set({
              status: "dismissed",
              dismissedAt: new Date(),
            })
            .where(eq(notificationTable.id, input.notificationId));
        }

        return { txid };
      });

      return { txid, success: true };
    }),

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
    .handler(async ({ context: { db, session }, input }) => {
      const { user } = session;

      const conditions: ReturnType<typeof eq>[] = [
        eq(notificationTable.userId, user.id),
        eq(notificationTable.status, "unread"),
      ];

      if (input.orgId) {
        conditions.push(eq(notificationTable.orgId, input.orgId));
      }

      const { txid } = await db.transaction(async (tx) => {
        const txid = await generateTxId(tx);

        await tx
          .update(notificationTable)
          .set({
            status: "read",
            readAt: new Date(),
          })
          .where(and(...conditions));

        return { txid };
      });

      return { txid };
    }),

  getPreferences: orgMemberProcedure
    .input(GetPreferencesInput)
    .output(GetPreferencesOutput)
    .handler(async ({ context: { db, session, orgId } }) => {
      const userId = session.user.id;

      const userPreferences =
        await db.query.notificationPreferenceTable.findMany({
          where: and(
            eq(notificationPreferenceTable.userId, userId),
            eq(notificationPreferenceTable.orgId, orgId)
          ),
          orderBy: [
            desc(notificationPreferenceTable.updatedAt),
            desc(notificationPreferenceTable.createdAt),
            desc(notificationPreferenceTable.id),
          ],
        });

      const globalPrefs = userPreferences.filter(
        (p) => !(p.entityType || p.entityId)
      );
      const latestOverrideMap = new Map<
        string,
        {
          eventType: (typeof userPreferences)[number]["eventType"];
          deliveryChannel: (typeof userPreferences)[number]["deliveryChannel"];
          enabled: boolean;
          entityType: string | null;
          entityId: string | null;
          emailDigestInterval: string | null;
        }
      >();

      for (const pref of userPreferences) {
        if (!(pref.entityType || pref.entityId)) {
          continue;
        }

        const key = `${pref.eventType}:${pref.deliveryChannel}:${pref.entityType ?? ""}:${pref.entityId ?? ""}`;

        if (latestOverrideMap.has(key)) {
          continue;
        }

        latestOverrideMap.set(key, {
          eventType: pref.eventType,
          deliveryChannel: pref.deliveryChannel,
          enabled: pref.enabled,
          entityType: pref.entityType,
          entityId: pref.entityId,
          emailDigestInterval: pref.emailDigestInterval,
        });
      }

      const eventTypes = Object.keys(
        DEFAULT_NOTIFICATION_PREFERENCES
      ) as NotificationEventType[];

      const global = {} as Record<
        NotificationEventType,
        { sound: boolean; push: boolean; email: boolean }
      >;

      for (const eventType of eventTypes) {
        const defaults = DEFAULT_NOTIFICATION_PREFERENCES[eventType];

        const soundPref = globalPrefs.find(
          (p) => p.eventType === eventType && p.deliveryChannel === "sound"
        );
        const pushPref = globalPrefs.find(
          (p) => p.eventType === eventType && p.deliveryChannel === "push"
        );
        const emailPref = globalPrefs.find(
          (p) => p.eventType === eventType && p.deliveryChannel === "email"
        );

        global[eventType] = {
          sound: soundPref ? soundPref.enabled : defaults.sound,
          push: pushPref ? pushPref.enabled : defaults.push,
          email: emailPref ? emailPref.enabled : defaults.email,
        };
      }

      const overrides = Array.from(latestOverrideMap.values()).map((p) => ({
        eventType: p.eventType,
        deliveryChannel: p.deliveryChannel as "sound" | "push" | "email",
        enabled: p.enabled,
        entityType: p.entityType,
        entityId: p.entityId,
        emailDigestInterval: p.emailDigestInterval,
      }));

      return { global, overrides };
    }),

  updatePreference: orgMemberProcedure
    .input(UpdatePreferenceInput)
    .output(UpdatePreferenceOutput)
    .handler(async ({ context: { db, session, orgId }, input }) => {
      const userId = session.user.id;
      const entityType = input.entityType ?? null;
      const entityId = input.entityId ?? null;
      const hasScopedTarget = entityType !== null && entityId !== null;

      if (hasScopedTarget) {
        await db
          .insert(notificationPreferenceTable)
          .values({
            userId,
            orgId,
            eventType: input.eventType,
            deliveryChannel: input.deliveryChannel,
            enabled: input.enabled,
            entityType,
            entityId,
            emailDigestInterval: input.emailDigestInterval ?? null,
          })
          .onConflictDoUpdate({
            target: [
              notificationPreferenceTable.userId,
              notificationPreferenceTable.orgId,
              notificationPreferenceTable.eventType,
              notificationPreferenceTable.deliveryChannel,
              notificationPreferenceTable.entityType,
              notificationPreferenceTable.entityId,
            ],
            set: {
              enabled: input.enabled,
              emailDigestInterval: input.emailDigestInterval ?? null,
            },
          });

        return { success: true };
      }

      const whereConditions = [
        eq(notificationPreferenceTable.userId, userId),
        eq(notificationPreferenceTable.orgId, orgId),
        eq(notificationPreferenceTable.eventType, input.eventType),
        eq(notificationPreferenceTable.deliveryChannel, input.deliveryChannel),
        entityType === null
          ? isNull(notificationPreferenceTable.entityType)
          : eq(notificationPreferenceTable.entityType, entityType),
        entityId === null
          ? isNull(notificationPreferenceTable.entityId)
          : eq(notificationPreferenceTable.entityId, entityId),
      ];

      const updatedRows = await db
        .update(notificationPreferenceTable)
        .set({
          enabled: input.enabled,
          emailDigestInterval: input.emailDigestInterval ?? null,
        })
        .where(and(...whereConditions))
        .returning({ id: notificationPreferenceTable.id });

      if (updatedRows.length === 0) {
        await db.insert(notificationPreferenceTable).values({
          userId,
          orgId,
          eventType: input.eventType,
          deliveryChannel: input.deliveryChannel,
          enabled: input.enabled,
          entityType,
          entityId,
          emailDigestInterval: input.emailDigestInterval ?? null,
        });
      }

      return { success: true };
    }),

  updateBulkPreferences: orgMemberProcedure
    .input(UpdateBulkPreferencesInput)
    .output(UpdateBulkPreferencesOutput)
    .handler(async ({ context: { db, session, orgId }, input }) => {
      const userId = session.user.id;

      await db.transaction(async (tx) => {
        for (const pref of input.preferences) {
          const entityType = pref.entityType ?? null;
          const entityId = pref.entityId ?? null;

          const whereConditions = [
            eq(notificationPreferenceTable.userId, userId),
            eq(notificationPreferenceTable.orgId, orgId),
            eq(notificationPreferenceTable.eventType, pref.eventType),
            eq(
              notificationPreferenceTable.deliveryChannel,
              pref.deliveryChannel
            ),
            entityType === null
              ? isNull(notificationPreferenceTable.entityType)
              : eq(notificationPreferenceTable.entityType, entityType),
            entityId === null
              ? isNull(notificationPreferenceTable.entityId)
              : eq(notificationPreferenceTable.entityId, entityId),
          ];

          const updatedRows = await tx
            .update(notificationPreferenceTable)
            .set({
              enabled: pref.enabled,
              emailDigestInterval: pref.emailDigestInterval ?? null,
            })
            .where(and(...whereConditions))
            .returning({ id: notificationPreferenceTable.id });

          if (updatedRows.length > 0) {
            continue;
          }

          await tx.insert(notificationPreferenceTable).values({
            userId,
            orgId,
            eventType: pref.eventType,
            deliveryChannel: pref.deliveryChannel,
            enabled: pref.enabled,
            entityType,
            entityId,
            emailDigestInterval: pref.emailDigestInterval ?? null,
          });
        }
      });

      return { success: true, updated: input.preferences.length };
    }),

  getChannelMuteStatus: orgMemberProcedure
    .input(GetChannelMuteStatusInput)
    .output(GetChannelMuteStatusOutput)
    .handler(async ({ context: { db, session }, input }) => {
      const userId = session.user.id;

      if (input.entityType === "channel") {
        const member = await db.query.channelMemberTable.findFirst({
          where: and(
            eq(channelMemberTable.channelId, input.entityId),
            eq(channelMemberTable.userId, userId)
          ),
          columns: { isMuted: true },
        });

        return { muted: member?.isMuted ?? false };
      }

      const mute = await db.query.dmConversationMuteTable.findFirst({
        where: and(
          eq(dmConversationMuteTable.conversationId, input.entityId),
          eq(dmConversationMuteTable.userId, userId)
        ),
        columns: { id: true },
      });

      return { muted: !!mute };
    }),

  toggleChannelMute: orgMemberProcedure
    .input(ToggleChannelMuteInput)
    .output(ToggleChannelMuteOutput)
    .handler(async ({ context: { db, session }, input }) => {
      const userId = session.user.id;

      if (input.entityType === "channel") {
        const member = await db.query.channelMemberTable.findFirst({
          where: and(
            eq(channelMemberTable.channelId, input.entityId),
            eq(channelMemberTable.userId, userId)
          ),
          columns: { id: true },
        });

        if (!member) {
          throw new ORPCError("NOT_FOUND", {
            message: "Channel membership not found.",
          });
        }

        await db
          .update(channelMemberTable)
          .set({ isMuted: input.muted })
          .where(
            and(
              eq(channelMemberTable.channelId, input.entityId),
              eq(channelMemberTable.userId, userId)
            )
          );

        return { success: true, muted: input.muted };
      }

      const conversation = await db.query.dmConversationTable.findFirst({
        where: and(
          eq(dmConversationTable.id, input.entityId),
          or(
            eq(dmConversationTable.participantOneId, userId),
            eq(dmConversationTable.participantTwoId, userId)
          )
        ),
        columns: { id: true },
      });

      if (!conversation) {
        throw new ORPCError("NOT_FOUND", {
          message: "DM conversation not found.",
        });
      }

      if (input.muted) {
        await db
          .insert(dmConversationMuteTable)
          .values({
            conversationId: input.entityId,
            userId,
          })
          .onConflictDoNothing();
      } else {
        await db
          .delete(dmConversationMuteTable)
          .where(
            and(
              eq(dmConversationMuteTable.conversationId, input.entityId),
              eq(dmConversationMuteTable.userId, userId)
            )
          );
      }

      return { success: true, muted: input.muted };
    }),

  soundPreferences: soundPreferencesRouter,
};
