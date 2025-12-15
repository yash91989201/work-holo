import { z } from "zod";
import { protectedProcedure } from "../../index";
import { processReadReceipts } from "../../lib/read-receipt-worker";

const TriggerReadReceiptWorkerInput = z.object({
  channelIds: z.array(z.string()).optional(),
  maxChannels: z.number().min(1).max(100).default(50),
});

const TriggerReadReceiptWorkerOutput = z.object({
  success: z.boolean(),
  channelsProcessed: z.number(),
  totalMessagesProcessed: z.number(),
  totalSummariesUpdated: z.number(),
  results: z.array(
    z.object({
      channelId: z.string(),
      messagesProcessed: z.number(),
      summariesUpdated: z.number(),
    })
  ),
  errors: z.array(
    z.object({
      channelId: z.string(),
      error: z.string(),
    })
  ),
});

export const adminWorkerRouter = {
  triggerReadReceiptWorker: protectedProcedure
    .input(TriggerReadReceiptWorkerInput)
    .output(TriggerReadReceiptWorkerOutput)
    .handler(async ({ context, input }) => {
      const { db, session } = context;

      // TODO: Add admin role check here
      // For now, we'll allow any authenticated user to trigger this
      // In production, you should check if user has admin privileges

      const result = await processReadReceipts(db, {
        channelIds: input.channelIds,
        maxChannels: input.maxChannels,
      });

      return result;
    }),
};
