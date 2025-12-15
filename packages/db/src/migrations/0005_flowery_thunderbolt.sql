CREATE TABLE "channelReadProcessedWatermark" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"channelId" text NOT NULL,
	"lastProcessedAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	CONSTRAINT "channelReadProcessedWatermark_channelId_unique" UNIQUE("channelId")
);
--> statement-breakpoint
CREATE TABLE "channelRead" (
	"channelId" text NOT NULL,
	"userId" text NOT NULL,
	"lastReadMessageId" text NOT NULL,
	"lastReadAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messageReadSummary" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"messageId" text NOT NULL,
	"readCount" integer DEFAULT 0 NOT NULL,
	"lastReadAt" timestamp with time zone,
	"recentReaders" json DEFAULT '[]'::json NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	CONSTRAINT "messageReadSummary_messageId_unique" UNIQUE("messageId")
);
--> statement-breakpoint
ALTER TABLE "channelReadProcessedWatermark" ADD CONSTRAINT "channelReadProcessedWatermark_channelId_channel_id_fk" FOREIGN KEY ("channelId") REFERENCES "public"."channel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channelRead" ADD CONSTRAINT "channelRead_channelId_channel_id_fk" FOREIGN KEY ("channelId") REFERENCES "public"."channel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channelRead" ADD CONSTRAINT "channelRead_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channelRead" ADD CONSTRAINT "channelRead_lastReadMessageId_message_id_fk" FOREIGN KEY ("lastReadMessageId") REFERENCES "public"."message"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messageReadSummary" ADD CONSTRAINT "messageReadSummary_messageId_message_id_fk" FOREIGN KEY ("messageId") REFERENCES "public"."message"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_channel_read_watermark_channel" ON "channelReadProcessedWatermark" USING btree ("channelId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_channel_user_read" ON "channelRead" USING btree ("channelId","userId");--> statement-breakpoint
CREATE INDEX "idx_channel_read_user" ON "channelRead" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_channel_read_channel" ON "channelRead" USING btree ("channelId");--> statement-breakpoint
CREATE INDEX "idx_message_read_summary_message" ON "messageReadSummary" USING btree ("messageId");--> statement-breakpoint
CREATE INDEX "idx_message_read_summary_last_read" ON "messageReadSummary" USING btree ("lastReadAt");