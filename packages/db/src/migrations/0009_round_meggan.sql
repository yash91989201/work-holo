ALTER TABLE "workBlock" ALTER COLUMN "attendanceId" SET DATA TYPE varchar(24);--> statement-breakpoint
ALTER TABLE "attachment" ALTER COLUMN "messageId" SET DATA TYPE varchar(24);--> statement-breakpoint
ALTER TABLE "channelJoinRequest" ALTER COLUMN "channelId" SET DATA TYPE varchar(24);--> statement-breakpoint
ALTER TABLE "channelMember" ALTER COLUMN "channelId" SET DATA TYPE varchar(24);--> statement-breakpoint
ALTER TABLE "channelReadProcessedWatermark" ALTER COLUMN "channelId" SET DATA TYPE varchar(24);--> statement-breakpoint
ALTER TABLE "channelRead" ALTER COLUMN "channelId" SET DATA TYPE varchar(24);--> statement-breakpoint
ALTER TABLE "channelRead" ALTER COLUMN "lastReadMessageId" SET DATA TYPE varchar(24);--> statement-breakpoint
ALTER TABLE "messageMention" ALTER COLUMN "messageId" SET DATA TYPE varchar(24);--> statement-breakpoint
ALTER TABLE "messageReadSummary" ALTER COLUMN "messageId" SET DATA TYPE varchar(24);--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "channelId" SET DATA TYPE varchar(24);--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "parentMessageId" SET DATA TYPE varchar(24);