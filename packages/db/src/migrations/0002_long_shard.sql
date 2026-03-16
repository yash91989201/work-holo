ALTER TYPE "public"."notificationType" ADD VALUE 'channel_direct_reply' BEFORE 'channel_reaction';--> statement-breakpoint
ALTER TYPE "public"."notificationType" ADD VALUE 'dm_direct_reply' BEFORE 'dm_reaction';--> statement-breakpoint
ALTER TABLE "message" DROP CONSTRAINT "fk_message_reply_to";
--> statement-breakpoint
ALTER TABLE "dmMessage" DROP CONSTRAINT "fk_dm_message_reply_to";
--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "fk_message_reply_to" FOREIGN KEY ("replyToMessageId","channelId") REFERENCES "public"."message"("id","channelId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmMessage" ADD CONSTRAINT "fk_dm_message_reply_to" FOREIGN KEY ("replyToMessageId","conversationId") REFERENCES "public"."dmMessage"("id","conversationId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_message_id_channel" ON "message" USING btree ("id","channelId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_dm_message_id_conversation" ON "dmMessage" USING btree ("id","conversationId");