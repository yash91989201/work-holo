ALTER TABLE "message" ADD COLUMN "replyToMessageId" varchar(24);--> statement-breakpoint
ALTER TABLE "dmMessage" ADD COLUMN "replyToMessageId" varchar(24);--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "fk_message_reply_to" FOREIGN KEY ("replyToMessageId") REFERENCES "public"."message"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmMessage" ADD CONSTRAINT "fk_dm_message_reply_to" FOREIGN KEY ("replyToMessageId") REFERENCES "public"."dmMessage"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_message_reply_to" ON "message" USING btree ("replyToMessageId");--> statement-breakpoint
CREATE INDEX "idx_dm_message_reply_to" ON "dmMessage" USING btree ("replyToMessageId");