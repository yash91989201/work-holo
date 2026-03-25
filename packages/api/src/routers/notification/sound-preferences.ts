import { ORPCError } from "@orpc/server";
import {
  notificationSoundPreferenceTable,
  notificationSoundPresetTable,
} from "@work-holo/db/schema/notification";
import { and, asc, desc, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { orgMemberProcedure } from "../../index";
import {
  ALLOWED_MIME_TYPES,
  BUCKETS,
  type BucketName,
  getUploadUrl,
} from "../../lib/storage";

const SoundPresetOutput = z.object({
  id: z.string(),
  name: z.string(),
  filename: z.string(),
  category: z.string(),
  sortOrder: z.number(),
  createdAt: z.date(),
});

const SoundScopeSchema = z.enum([
  "global",
  "channel",
  "dm_conversation",
  "event_type",
]);

const SoundTypeSchema = z.enum(["preset", "custom"]);

const SoundPreferenceOutput = z.object({
  id: z.string(),
  userId: z.string(),
  orgId: z.string(),
  scope: z.string(),
  entityId: z.string().nullable(),
  soundType: z.string(),
  presetId: z.string().nullable(),
  customSoundUrl: z.string().nullable(),
  customSoundName: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const AUDIO_MIME_TYPES = ALLOWED_MIME_TYPES[BUCKETS.NOTIFICATION_SOUND] ?? [];

function buildSoundFields(input: {
  soundType: string;
  presetId?: string | null;
  customSoundUrl?: string | null;
  customSoundName?: string | null;
}) {
  const isPreset = input.soundType === "preset";
  return {
    soundType: input.soundType,
    presetId: isPreset ? (input.presetId ?? null) : null,
    customSoundUrl: isPreset ? null : (input.customSoundUrl ?? null),
    customSoundName: isPreset ? null : (input.customSoundName ?? null),
  };
}

export const soundPreferencesRouter = {
  listPresets: orgMemberProcedure
    .input(z.object({}))
    .output(z.object({ presets: z.array(SoundPresetOutput) }))
    .handler(async ({ context: { db } }) => {
      const presets = await db.query.notificationSoundPresetTable.findMany({
        orderBy: [asc(notificationSoundPresetTable.sortOrder)],
      });

      return { presets };
    }),

  getPreference: orgMemberProcedure
    .input(
      z.object({
        scope: SoundScopeSchema,
        entityId: z.string().nullish(),
      })
    )
    .output(z.object({ preference: SoundPreferenceOutput.nullable() }))
    .handler(async ({ context: { db, session, orgId }, input }) => {
      const userId = session.user.id;

      const conditions = [
        eq(notificationSoundPreferenceTable.userId, userId),
        eq(notificationSoundPreferenceTable.orgId, orgId),
        eq(notificationSoundPreferenceTable.scope, input.scope),
      ];

      if (input.entityId == null) {
        conditions.push(isNull(notificationSoundPreferenceTable.entityId));
      } else {
        conditions.push(
          eq(notificationSoundPreferenceTable.entityId, input.entityId)
        );
      }

      const preference =
        await db.query.notificationSoundPreferenceTable.findFirst({
          where: and(...conditions),
          orderBy: [
            desc(notificationSoundPreferenceTable.updatedAt),
            desc(notificationSoundPreferenceTable.createdAt),
            desc(notificationSoundPreferenceTable.id),
          ],
        });

      return { preference: preference ?? null };
    }),

  updatePreference: orgMemberProcedure
    .input(
      z.object({
        scope: SoundScopeSchema,
        entityId: z.string().nullish(),
        soundType: SoundTypeSchema,
        presetId: z.string().nullish(),
        customSoundUrl: z.string().nullish(),
        customSoundName: z.string().max(255).nullish(),
      })
    )
    .output(z.object({ success: z.literal(true) }))
    .handler(async ({ context: { db, session, orgId }, input }) => {
      const userId = session.user.id;

      if (input.soundType === "preset" && !input.presetId) {
        throw new ORPCError("BAD_REQUEST", {
          message: "presetId is required when soundType is 'preset'.",
        });
      }

      if (input.soundType === "custom" && !input.customSoundUrl) {
        throw new ORPCError("BAD_REQUEST", {
          message: "customSoundUrl is required when soundType is 'custom'.",
        });
      }

      if (input.soundType === "preset" && input.presetId) {
        const preset = await db.query.notificationSoundPresetTable.findFirst({
          where: eq(notificationSoundPresetTable.id, input.presetId),
          columns: { id: true },
        });

        if (!preset) {
          throw new ORPCError("NOT_FOUND", {
            message: "Sound preset not found.",
          });
        }
      }

      const soundFields = buildSoundFields(input);
      const entityId = input.entityId ?? null;

      if (entityId !== null) {
        await db
          .insert(notificationSoundPreferenceTable)
          .values({
            userId,
            orgId,
            scope: input.scope,
            entityId,
            ...soundFields,
          })
          .onConflictDoUpdate({
            target: [
              notificationSoundPreferenceTable.userId,
              notificationSoundPreferenceTable.orgId,
              notificationSoundPreferenceTable.scope,
              notificationSoundPreferenceTable.entityId,
            ],
            set: soundFields,
          });

        return { success: true as const };
      }

      const whereConditions = [
        eq(notificationSoundPreferenceTable.userId, userId),
        eq(notificationSoundPreferenceTable.orgId, orgId),
        eq(notificationSoundPreferenceTable.scope, input.scope),
        entityId === null
          ? isNull(notificationSoundPreferenceTable.entityId)
          : eq(notificationSoundPreferenceTable.entityId, entityId),
      ];

      const updatedRows = await db
        .update(notificationSoundPreferenceTable)
        .set(soundFields)
        .where(and(...whereConditions))
        .returning({ id: notificationSoundPreferenceTable.id });

      if (updatedRows.length === 0) {
        await db.insert(notificationSoundPreferenceTable).values({
          userId,
          orgId,
          scope: input.scope,
          entityId,
          ...soundFields,
        });
      }

      return { success: true as const };
    }),

  deletePreference: orgMemberProcedure
    .input(
      z.object({
        scope: SoundScopeSchema,
        entityId: z.string().nullish(),
      })
    )
    .output(z.object({ success: z.literal(true) }))
    .handler(async ({ context: { db, session, orgId }, input }) => {
      const userId = session.user.id;

      const conditions = [
        eq(notificationSoundPreferenceTable.userId, userId),
        eq(notificationSoundPreferenceTable.orgId, orgId),
        eq(notificationSoundPreferenceTable.scope, input.scope),
      ];

      if (input.entityId == null) {
        conditions.push(isNull(notificationSoundPreferenceTable.entityId));
      } else {
        conditions.push(
          eq(notificationSoundPreferenceTable.entityId, input.entityId)
        );
      }

      await db
        .delete(notificationSoundPreferenceTable)
        .where(and(...conditions));

      return { success: true as const };
    }),

  getUploadUrl: orgMemberProcedure
    .input(
      z.object({
        fileName: z.string().min(1).max(255),
        contentType: z.string().min(1).max(255),
        fileSize: z.number().min(1),
      })
    )
    .output(
      z.object({
        uploadUrl: z.string(),
        publicUrl: z.string(),
        filePath: z.string(),
        bucket: z.string(),
        expiresAt: z.date(),
      })
    )
    .handler(async ({ context: { session }, input }) => {
      if (!AUDIO_MIME_TYPES.includes(input.contentType)) {
        throw new ORPCError("BAD_REQUEST", {
          message: `File type '${input.contentType}' is not allowed. Allowed types: ${AUDIO_MIME_TYPES.join(", ")}`,
        });
      }

      const result = await getUploadUrl({
        bucket: BUCKETS.NOTIFICATION_SOUND as BucketName,
        fileName: input.fileName,
        contentType: input.contentType,
        fileSize: input.fileSize,
        userId: session.user.id,
      });

      return result;
    }),
};
