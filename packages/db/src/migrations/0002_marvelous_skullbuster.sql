CREATE TABLE "messageMention" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"messageId" text NOT NULL,
	"mentionedById" text NOT NULL,
	"mentionedUserId" text NOT NULL,
	"isSeen" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messageMention" ADD CONSTRAINT "messageMention_messageId_message_id_fk" FOREIGN KEY ("messageId") REFERENCES "public"."message"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messageMention" ADD CONSTRAINT "messageMention_mentionedById_user_id_fk" FOREIGN KEY ("mentionedById") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messageMention" ADD CONSTRAINT "messageMention_mentionedUserId_user_id_fk" FOREIGN KEY ("mentionedUserId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_message_mention_user" ON "messageMention" USING btree ("messageId","mentionedUserId");--> statement-breakpoint
CREATE INDEX "idx_message_mention_user" ON "messageMention" USING btree ("mentionedUserId");--> statement-breakpoint
CREATE INDEX "idx_message_mention_message" ON "messageMention" USING btree ("messageId");--> statement-breakpoint
ALTER TABLE "channelMember" DROP COLUMN "notificationSettings";