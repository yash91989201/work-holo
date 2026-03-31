import { ORPCError } from "@orpc/client";
import {
  attachmentTable,
  channelMemberTable,
  channelTable,
  messageTable,
  user as userTable,
} from "@work-holo/db/schema/index";
import { and, asc, count, desc, eq, sql } from "drizzle-orm";
import { orgMemberProcedure } from "../../index";
import {
  ChannelFilesListOutput,
  GetUpdateAttachmentUploadUrlInput,
  GetUpdateAttachmentUploadUrlOutput,
  ListChannelFilesInput,
  UpdateAttachmentInput,
  UpdateAttachmentOutput,
} from "../../lib/schemas/attachment";
import {
  BUCKETS,
  getPublicUrl,
  getStorageClient,
  URL_EXPIRY,
} from "../../lib/storage";
import type { BucketName } from "../../lib/storage/types";

function getAttachmentBucket(
  type: "image" | "document" | "video" | "audio" | "archive" | "other"
): BucketName {
  return type === "audio" ? BUCKETS.MESSAGE_AUDIO : BUCKETS.MESSAGE_ATTACHMENT;
}

function getAttachmentOrderBy(
  sortBy: "name" | "size" | "createdAt" | "type",
  sortOrder: "asc" | "desc"
) {
  const direction = sortOrder === "asc" ? asc : desc;

  if (sortBy === "name") {
    return direction(attachmentTable.originalName);
  }

  if (sortBy === "size") {
    return direction(attachmentTable.fileSize);
  }

  if (sortBy === "type") {
    return direction(attachmentTable.type);
  }

  return direction(attachmentTable.createdAt);
}

export const attachmentRouter = {
  list: orgMemberProcedure
    .input(ListChannelFilesInput)
    .output(ChannelFilesListOutput)
    .handler(async ({ input, context: { db, orgId, session } }) => {
      const {
        channelId,
        page,
        perPage,
        search,
        sortBy,
        sortOrder,
        type,
        onlyMine,
      } = input;
      const offset = (page - 1) * perPage;
      const orderBy = getAttachmentOrderBy(sortBy, sortOrder);

      const filters = [
        eq(channelMemberTable.userId, session.user.id),
        eq(channelTable.organizationId, orgId),
        eq(messageTable.isDeleted, false),
      ];

      if (channelId) {
        filters.push(eq(messageTable.channelId, channelId));
      }

      if (onlyMine) {
        filters.push(eq(attachmentTable.uploadedBy, session.user.id));
      }

      switch (type) {
        case "image":
        case "document":
        case "video":
        case "audio":
        case "archive": {
          filters.push(eq(attachmentTable.type, type));
          break;
        }
        case "other": {
          filters.push(sql`false`);
          break;
        }
        default: {
          break;
        }
      }

      if (search?.trim()) {
        const escaped = search
          .trim()
          .replace(/\\/g, "\\\\")
          .replace(/%/g, "\\%")
          .replace(/_/g, "\\_");
        const normalizedSearch = `%${escaped}%`;
        filters.push(
          sql`(
            ${attachmentTable.originalName} ILIKE ${normalizedSearch}
            OR COALESCE(${userTable.name}, '') ILIKE ${normalizedSearch}
            OR ${channelTable.name} ILIKE ${normalizedSearch}
          )`
        );
      }

      const whereClause = and(...filters);

      const files = await db
        .select({
          id: attachmentTable.id,
          messageId: attachmentTable.messageId,
          fileName: attachmentTable.fileName,
          originalName: attachmentTable.originalName,
          fileSize: attachmentTable.fileSize,
          mimeType: attachmentTable.mimeType,
          type: attachmentTable.type,
          url: attachmentTable.url,
          thumbnailUrl: attachmentTable.thumbnailUrl,
          uploadedBy: attachmentTable.uploadedBy,
          isPublic: attachmentTable.isPublic,
          createdAt: attachmentTable.createdAt,
          channelId: channelTable.id,
          channelName: channelTable.name,
          senderName: userTable.name,
          senderImage: userTable.image,
        })
        .from(attachmentTable)
        .innerJoin(messageTable, eq(attachmentTable.messageId, messageTable.id))
        .innerJoin(
          channelMemberTable,
          eq(channelMemberTable.channelId, messageTable.channelId)
        )
        .innerJoin(channelTable, eq(channelTable.id, messageTable.channelId))
        .leftJoin(userTable, eq(userTable.id, attachmentTable.uploadedBy))
        .where(whereClause)
        .orderBy(orderBy)
        .offset(offset)
        .limit(perPage);

      const totalResult = await db
        .select({ count: count() })
        .from(attachmentTable)
        .innerJoin(messageTable, eq(attachmentTable.messageId, messageTable.id))
        .innerJoin(
          channelMemberTable,
          eq(channelMemberTable.channelId, messageTable.channelId)
        )
        .innerJoin(channelTable, eq(channelTable.id, messageTable.channelId))
        .leftJoin(userTable, eq(userTable.id, attachmentTable.uploadedBy))
        .where(whereClause);

      const total = Number(totalResult[0]?.count ?? 0);

      return {
        files: files.map((file) => ({
          ...file,
          storagePath: file.fileName,
          bucket:
            file.type === "audio" ? "message-audio" : "message-attachment",
          thumbnailPath: file.thumbnailUrl,
          uploaderName: file.senderName,
          uploaderImage: file.senderImage,
        })),
        total,
        pageCount: Math.ceil(total / perPage),
      };
    }),

  getUpdateUploadUrl: orgMemberProcedure
    .input(GetUpdateAttachmentUploadUrlInput)
    .output(GetUpdateAttachmentUploadUrlOutput)
    .handler(async ({ input, context: { db, orgId, session } }) => {
      const attachmentResult = await db
        .select({
          id: attachmentTable.id,
          fileName: attachmentTable.fileName,
          url: attachmentTable.url,
          type: attachmentTable.type,
          uploadedBy: attachmentTable.uploadedBy,
        })
        .from(attachmentTable)
        .innerJoin(messageTable, eq(attachmentTable.messageId, messageTable.id))
        .innerJoin(channelTable, eq(channelTable.id, messageTable.channelId))
        .innerJoin(
          channelMemberTable,
          and(
            eq(channelMemberTable.channelId, messageTable.channelId),
            eq(channelMemberTable.userId, session.user.id)
          )
        )
        .where(
          and(
            eq(attachmentTable.id, input.attachmentId),
            eq(channelTable.organizationId, orgId),
            eq(messageTable.isDeleted, false),
            eq(attachmentTable.uploadedBy, session.user.id)
          )
        )
        .limit(1);

      const attachment = attachmentResult[0] ?? null;

      if (!attachment) {
        throw new ORPCError("FORBIDDEN", {
          message: "You can only update files you uploaded.",
        });
      }

      const bucket = getAttachmentBucket(attachment.type);

      if (
        bucket === BUCKETS.MESSAGE_AUDIO &&
        !input.contentType.startsWith("audio/")
      ) {
        throw new ORPCError("BAD_REQUEST", {
          message: "Audio files must be updated with an audio format.",
        });
      }

      const storageClient = await getStorageClient();
      const uploadUrl = await storageClient.presignedPutObject(
        bucket,
        attachment.fileName,
        URL_EXPIRY.UPLOAD
      );

      return {
        uploadUrl,
        publicUrl: attachment.url ?? getPublicUrl(bucket, attachment.fileName),
        filePath: attachment.fileName,
        bucket,
        expiresAt: new Date(Date.now() + URL_EXPIRY.UPLOAD * 1000),
      };
    }),

  update: orgMemberProcedure
    .input(UpdateAttachmentInput)
    .output(UpdateAttachmentOutput)
    .handler(async ({ input, context: { db, orgId, session } }) => {
      const attachmentResult = await db
        .select({
          id: attachmentTable.id,
          fileName: attachmentTable.fileName,
          url: attachmentTable.url,
          type: attachmentTable.type,
          uploadedBy: attachmentTable.uploadedBy,
        })
        .from(attachmentTable)
        .innerJoin(messageTable, eq(attachmentTable.messageId, messageTable.id))
        .innerJoin(channelTable, eq(channelTable.id, messageTable.channelId))
        .innerJoin(
          channelMemberTable,
          and(
            eq(channelMemberTable.channelId, messageTable.channelId),
            eq(channelMemberTable.userId, session.user.id)
          )
        )
        .where(
          and(
            eq(attachmentTable.id, input.attachmentId),
            eq(channelTable.organizationId, orgId),
            eq(messageTable.isDeleted, false),
            eq(attachmentTable.uploadedBy, session.user.id)
          )
        )
        .limit(1);

      const attachment = attachmentResult[0] ?? null;

      if (!attachment) {
        throw new ORPCError("FORBIDDEN", {
          message: "You can only update files you uploaded.",
        });
      }

      const updatedType = input.type;

      if (updatedType === "other") {
        throw new ORPCError("BAD_REQUEST", {
          message: "Unsupported file type for updating attachment metadata.",
        });
      }

      const currentBucket = getAttachmentBucket(attachment.type);
      const nextBucket = getAttachmentBucket(updatedType);

      if (currentBucket !== nextBucket) {
        throw new ORPCError("BAD_REQUEST", {
          message: "Updating this file type would change its URL bucket.",
        });
      }

      await db
        .update(attachmentTable)
        .set({
          originalName: input.originalName,
          fileSize: input.fileSize,
          mimeType: input.mimeType,
          type: updatedType,
        })
        .where(eq(attachmentTable.id, input.attachmentId));

      return { success: true };
    }),
};
