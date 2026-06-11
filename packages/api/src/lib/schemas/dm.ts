import { z } from "zod";

export const CreateDmConversationInput = z.object({
  participantId: z.string().min(1),
});

export const GetDmConversationsInput = z.object({
  limit: z.number().min(1).max(100).default(50),
  cursor: z.cuid2().optional(),
});

export const GetDmConversationInput = z.object({
  conversationId: z.cuid2(),
});

export const GetDmMessagesInput = z.object({
  conversationId: z.cuid2(),
  limit: z.number().min(1).max(100).default(50),
  cursor: z.cuid2().optional(),
  parentMessageId: z.cuid2().optional(),
});

export const SendDmMessageInput = z
  .object({
    id: z.string().optional(),
    conversationId: z.cuid2(),
    content: z.string().max(10_000).optional(),
    type: z.enum(["text", "attachment", "audio"]),
    parentMessageId: z.cuid2().optional(),
    replyToMessageId: z.cuid2().optional(),
    attachments: z
      .array(
        z.object({
          fileName: z.string().min(1),
          originalName: z.string().min(1),
          fileSize: z.number().positive(),
          mimeType: z.string().min(1),
          type: z.enum(["image", "document", "video", "audio", "archive"]),
          url: z.url(),
        })
      )
      .optional(),
  })
  .refine(
    (value) => {
      const hasText = (value.content ?? "").trim().length > 0;
      const hasAttachments = (value.attachments?.length ?? 0) > 0;
      return hasText || hasAttachments;
    },
    {
      message: "Message must contain text or attachments.",
    }
  );

export const EditDmMessageInput = z.object({
  messageId: z.cuid2(),
  content: z.string().min(1).max(10_000),
});

export const DeleteDmMessageInput = z.object({
  messageId: z.cuid2(),
});

export const ToggleDmReactionInput = z.object({
  messageId: z.cuid2(),
  emoji: z.string().min(1).max(32),
});

export const ToggleDmPinInput = z.object({
  messageId: z.cuid2(),
});

export const MarkDmReadInput = z.object({
  conversationId: z.cuid2(),
  messageId: z.cuid2(),
});

export const SearchDmMessagesInput = z.object({
  conversationId: z.cuid2(),
  query: z.string().min(1).max(200),
  cursor: z.string().optional(),
  limit: z.number().min(1).max(50).default(20),
});

export const SearchDmMessagesOutput = z.object({
  messages: z.array(
    z.object({
      id: z.string(),
      conversationId: z.string(),
      senderId: z.string(),
      content: z.string().nullable(),
      type: z.string(),
      parentMessageId: z.string().nullable(),
      createdAt: z.date(),
      sender: z.object({
        name: z.string(),
        email: z.string(),
        image: z.string().nullable(),
      }),
      highlights: z.array(z.string()),
    })
  ),
  nextCursor: z.string().nullable(),
  total: z.number(),
});

export const MuteDmConversationInput = z.object({
  conversationId: z.cuid2(),
});

export const UnmuteDmConversationInput = z.object({
  conversationId: z.cuid2(),
});

export const DmAttachmentInput = z.object({
  messageId: z.cuid2(),
  fileName: z.string().min(1),
  originalName: z.string().min(1).optional(),
  url: z.url(),
  mimeType: z.string().min(1),
  type: z.enum(["image", "document", "video", "audio", "archive"]),
  size: z.number().positive(),
});
