import {
  attachmentTable,
  channelTable,
  dmAttachmentTable,
  dmConversationTable,
  dmMessageTable,
  messageTable,
  user as userTable,
} from "@work-holo/db/schema/index";
import { and, count, eq, ilike, or, type SQL, sql, sum } from "drizzle-orm";
import { orgMemberProcedure } from "../../index";
import {
  AttachmentsListOutput,
  GetStorageStatsInput,
  GetUserAttachmentsInput,
  SearchAttachmentsInput,
  StorageStatsOutput,
} from "../../lib/schemas/attachment";

export const attachmentRouter = {
  search: orgMemberProcedure
    .input(SearchAttachmentsInput)
    .output(AttachmentsListOutput)
    .handler(
      async ({ input, context: { db, orgId, orgMembership, session } }) => {
        const isAdmin = orgMembership.role === "admin";
        const searchPattern = `%${input.query}%`;

        const channelConditions: SQL<unknown>[] = [
          eq(channelTable.organizationId, orgId),
          ilike(attachmentTable.originalName, searchPattern),
        ];

        if (input.type) {
          channelConditions.push(eq(attachmentTable.type, input.type));
        }

        if (!isAdmin) {
          channelConditions.push(
            eq(attachmentTable.uploadedBy, session.user.id)
          );
        }

        const dmConditions: SQL<unknown>[] = [
          eq(dmConversationTable.organizationId, orgId),
          ilike(dmAttachmentTable.originalName, searchPattern),
        ];

        if (input.type) {
          dmConditions.push(eq(dmAttachmentTable.type, input.type));
        }

        if (!isAdmin) {
          const dmParticipantCondition = or(
            eq(dmConversationTable.participantOneId, session.user.id),
            eq(dmConversationTable.participantTwoId, session.user.id)
          );

          if (dmParticipantCondition) {
            dmConditions.push(dmParticipantCondition);
          }
        }

        const channelAttachments =
          input.source === "dm"
            ? []
            : await db
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
                  uploaderName: userTable.name,
                  uploaderImage: userTable.image,
                  isPublic: attachmentTable.isPublic,
                  source: sql<"channel">`'channel'`,
                  sourceContextId: channelTable.id,
                  sourceContextName: channelTable.name,
                  createdAt: attachmentTable.createdAt,
                })
                .from(attachmentTable)
                .innerJoin(
                  messageTable,
                  eq(attachmentTable.messageId, messageTable.id)
                )
                .innerJoin(
                  channelTable,
                  eq(messageTable.channelId, channelTable.id)
                )
                .innerJoin(
                  userTable,
                  eq(attachmentTable.uploadedBy, userTable.id)
                )
                .where(and(...channelConditions));

        const dmAttachments =
          input.source === "channel"
            ? []
            : await db
                .select({
                  id: dmAttachmentTable.id,
                  messageId: dmAttachmentTable.messageId,
                  fileName: dmAttachmentTable.fileName,
                  originalName: dmAttachmentTable.originalName,
                  fileSize: dmAttachmentTable.fileSize,
                  mimeType: dmAttachmentTable.mimeType,
                  type: dmAttachmentTable.type,
                  url: dmAttachmentTable.url,
                  thumbnailUrl: dmAttachmentTable.thumbnailUrl,
                  uploadedBy: dmAttachmentTable.uploadedBy,
                  uploaderName: userTable.name,
                  uploaderImage: userTable.image,
                  isPublic: sql<boolean>`false`,
                  source: sql<"dm">`'dm'`,
                  sourceContextId: dmConversationTable.id,
                  sourceContextName: sql<string>`'Direct Message'`,
                  createdAt: dmAttachmentTable.createdAt,
                })
                .from(dmAttachmentTable)
                .innerJoin(
                  dmMessageTable,
                  eq(dmAttachmentTable.messageId, dmMessageTable.id)
                )
                .innerJoin(
                  dmConversationTable,
                  eq(dmMessageTable.conversationId, dmConversationTable.id)
                )
                .innerJoin(
                  userTable,
                  eq(dmAttachmentTable.uploadedBy, userTable.id)
                )
                .where(and(...dmConditions));

        const merged = [...channelAttachments, ...dmAttachments].sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
        const paginated = merged.slice(
          input.offset,
          input.offset + input.limit
        );

        return {
          attachments: paginated.map((attachment) => ({
            id: attachment.id,
            messageId: attachment.messageId,
            fileName: attachment.fileName,
            originalName: attachment.originalName,
            fileSize: attachment.fileSize,
            mimeType: attachment.mimeType,
            type: attachment.type,
            url: attachment.url,
            thumbnailUrl: attachment.thumbnailUrl,
            uploadedBy: attachment.uploadedBy,
            uploaderName: attachment.uploaderName,
            uploaderImage: attachment.uploaderImage,
            isPublic: attachment.isPublic,
            source: attachment.source,
            sourceContext: {
              id: attachment.sourceContextId,
              name: attachment.sourceContextName,
            },
            createdAt: attachment.createdAt,
          })),
          total: merged.length,
          hasMore: input.offset + paginated.length < merged.length,
        };
      }
    ),

  list: orgMemberProcedure
    .input(GetUserAttachmentsInput)
    .output(AttachmentsListOutput)
    .handler(
      async ({ input, context: { db, orgId, orgMembership, session } }) => {
        const isAdmin = orgMembership.role === "admin";

        const channelConditions: SQL<unknown>[] = [
          eq(channelTable.organizationId, orgId),
        ];

        if (input.type) {
          channelConditions.push(eq(attachmentTable.type, input.type));
        }

        if (!isAdmin) {
          channelConditions.push(
            eq(attachmentTable.uploadedBy, session.user.id)
          );
        }

        const dmConditions: SQL<unknown>[] = [
          eq(dmConversationTable.organizationId, orgId),
        ];

        if (input.type) {
          dmConditions.push(eq(dmAttachmentTable.type, input.type));
        }

        if (!isAdmin) {
          const dmParticipantCondition = or(
            eq(dmConversationTable.participantOneId, session.user.id),
            eq(dmConversationTable.participantTwoId, session.user.id)
          );

          if (dmParticipantCondition) {
            dmConditions.push(dmParticipantCondition);
          }
        }

        const channelAttachments =
          input.source === "dm"
            ? []
            : await db
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
                  uploaderName: userTable.name,
                  uploaderImage: userTable.image,
                  isPublic: attachmentTable.isPublic,
                  source: sql<"channel">`'channel'`,
                  sourceContextId: channelTable.id,
                  sourceContextName: channelTable.name,
                  createdAt: attachmentTable.createdAt,
                })
                .from(attachmentTable)
                .innerJoin(
                  messageTable,
                  eq(attachmentTable.messageId, messageTable.id)
                )
                .innerJoin(
                  channelTable,
                  eq(messageTable.channelId, channelTable.id)
                )
                .innerJoin(
                  userTable,
                  eq(attachmentTable.uploadedBy, userTable.id)
                )
                .where(and(...channelConditions));

        const dmAttachments =
          input.source === "channel"
            ? []
            : await db
                .select({
                  id: dmAttachmentTable.id,
                  messageId: dmAttachmentTable.messageId,
                  fileName: dmAttachmentTable.fileName,
                  originalName: dmAttachmentTable.originalName,
                  fileSize: dmAttachmentTable.fileSize,
                  mimeType: dmAttachmentTable.mimeType,
                  type: dmAttachmentTable.type,
                  url: dmAttachmentTable.url,
                  thumbnailUrl: dmAttachmentTable.thumbnailUrl,
                  uploadedBy: dmAttachmentTable.uploadedBy,
                  uploaderName: userTable.name,
                  uploaderImage: userTable.image,
                  isPublic: sql<boolean>`false`,
                  source: sql<"dm">`'dm'`,
                  sourceContextId: dmConversationTable.id,
                  sourceContextName: sql<string>`'Direct Message'`,
                  createdAt: dmAttachmentTable.createdAt,
                })
                .from(dmAttachmentTable)
                .innerJoin(
                  dmMessageTable,
                  eq(dmAttachmentTable.messageId, dmMessageTable.id)
                )
                .innerJoin(
                  dmConversationTable,
                  eq(dmMessageTable.conversationId, dmConversationTable.id)
                )
                .innerJoin(
                  userTable,
                  eq(dmAttachmentTable.uploadedBy, userTable.id)
                )
                .where(and(...dmConditions));

        const merged = [...channelAttachments, ...dmAttachments].sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
        const paginated = merged.slice(
          input.offset,
          input.offset + input.limit
        );

        return {
          attachments: paginated.map((attachment) => ({
            id: attachment.id,
            messageId: attachment.messageId,
            fileName: attachment.fileName,
            originalName: attachment.originalName,
            fileSize: attachment.fileSize,
            mimeType: attachment.mimeType,
            type: attachment.type,
            url: attachment.url,
            thumbnailUrl: attachment.thumbnailUrl,
            uploadedBy: attachment.uploadedBy,
            uploaderName: attachment.uploaderName,
            uploaderImage: attachment.uploaderImage,
            isPublic: attachment.isPublic,
            source: attachment.source,
            sourceContext: {
              id: attachment.sourceContextId,
              name: attachment.sourceContextName,
            },
            createdAt: attachment.createdAt,
          })),
          total: merged.length,
          hasMore: input.offset + paginated.length < merged.length,
        };
      }
    ),

  storageStats: orgMemberProcedure
    .input(GetStorageStatsInput)
    .output(StorageStatsOutput)
    .handler(async ({ context: { db, orgId, orgMembership, session } }) => {
      const isAdmin = orgMembership.role === "admin";

      const channelConditions: SQL<unknown>[] = [
        eq(channelTable.organizationId, orgId),
      ];

      if (!isAdmin) {
        channelConditions.push(eq(attachmentTable.uploadedBy, session.user.id));
      }

      const dmConditions: SQL<unknown>[] = [
        eq(dmConversationTable.organizationId, orgId),
      ];

      if (!isAdmin) {
        dmConditions.push(
          or(
            eq(dmConversationTable.participantOneId, session.user.id),
            eq(dmConversationTable.participantTwoId, session.user.id)
          ) as SQL<unknown>
        );
      }

      // Channel stats
      const channelStats = await db
        .select({
          type: attachmentTable.type,
          count: count(),
          size: sum(attachmentTable.fileSize),
        })
        .from(attachmentTable)
        .innerJoin(messageTable, eq(attachmentTable.messageId, messageTable.id))
        .innerJoin(channelTable, eq(messageTable.channelId, channelTable.id))
        .where(and(...channelConditions))
        .groupBy(attachmentTable.type);

      // DM stats
      const dmStats = await db
        .select({
          type: dmAttachmentTable.type,
          count: count(),
          size: sum(dmAttachmentTable.fileSize),
        })
        .from(dmAttachmentTable)
        .innerJoin(
          dmMessageTable,
          eq(dmAttachmentTable.messageId, dmMessageTable.id)
        )
        .innerJoin(
          dmConversationTable,
          eq(dmMessageTable.conversationId, dmConversationTable.id)
        )
        .where(and(...dmConditions))
        .groupBy(dmAttachmentTable.type);

      // Aggregate stats by type
      const typeStats = new Map<string, { count: number; size: number }>();

      for (const stat of channelStats) {
        const type = stat.type || "other";
        const existing = typeStats.get(type) || { count: 0, size: 0 };
        typeStats.set(type, {
          count: existing.count + (Number(stat.count) || 0),
          size: existing.size + (Number(stat.size) || 0),
        });
      }

      for (const stat of dmStats) {
        const type = stat.type || "other";
        const existing = typeStats.get(type) || { count: 0, size: 0 };
        typeStats.set(type, {
          count: existing.count + (Number(stat.count) || 0),
          size: existing.size + (Number(stat.size) || 0),
        });
      }

      // Calculate totals
      const totalFiles = Array.from(typeStats.values()).reduce(
        (sum, stat) => sum + stat.count,
        0
      );
      const totalSize = Array.from(typeStats.values()).reduce(
        (sum, stat) => sum + stat.size,
        0
      );

      // Get source breakdown
      const channelCount = channelStats.reduce(
        (sum, stat) => sum + Number(stat.count || 0),
        0
      );
      const channelSize = channelStats.reduce(
        (sum, stat) => sum + Number(stat.size || 0),
        0
      );
      const dmCount = dmStats.reduce(
        (sum, stat) => sum + Number(stat.count || 0),
        0
      );
      const dmSize = dmStats.reduce(
        (sum, stat) => sum + Number(stat.size || 0),
        0
      );

      return {
        totalFiles,
        totalSize,
        imageCount: typeStats.get("image")?.count || 0,
        documentCount: typeStats.get("document")?.count || 0,
        videoCount: typeStats.get("video")?.count || 0,
        audioCount: typeStats.get("audio")?.count || 0,
        archiveCount: typeStats.get("archive")?.count || 0,
        otherCount: typeStats.get("other")?.count || 0,
        channelCount,
        channelSize,
        dmCount,
        dmSize,
      };
    }),
};
