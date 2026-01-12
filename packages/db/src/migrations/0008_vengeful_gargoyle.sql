ALTER TABLE "channelRead" DROP CONSTRAINT "channelRead_lastReadMessageId_message_id_fk";
--> statement-breakpoint
DROP INDEX "unique_channel_user_read";--> statement-breakpoint
ALTER TABLE "channelRead" ALTER COLUMN "lastReadMessageId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "channelRead" ALTER COLUMN "lastReadAt" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "channelRead" ADD CONSTRAINT "channelRead_lastReadMessageId_message_id_fk" FOREIGN KEY ("lastReadMessageId") REFERENCES "public"."message"("id") ON DELETE set null ON UPDATE no action;