import {
  attachmentTable,
  channelMemberTable,
  channelTable,
  messageTable,
  user as userTable,
} from "@work-holo/db/schema/index";
import { and, asc, count, desc, eq, ilike, sql } from "drizzle-orm";
import { orgMemberProcedure } from "../../index";
import {
  ChannelFilesListOutput,
  ListChannelFilesInput,
} from "../../lib/schemas/attachment";

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
      const { channelId, page, perPage, search, sortBy, sortOrder, type } =
        input;
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
        filters.push(ilike(attachmentTable.originalName, `%${search.trim()}%`));
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
        .leftJoin(userTable, eq(userTable.id, messageTable.senderId))
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
};
