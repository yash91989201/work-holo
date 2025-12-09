CREATE TABLE "messageReaction" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"messageId" text NOT NULL,
	"userId" text NOT NULL,
	"reaction" text NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messageReaction" ADD CONSTRAINT "messageReaction_messageId_message_id_fk" FOREIGN KEY ("messageId") REFERENCES "public"."message"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messageReaction" ADD CONSTRAINT "messageReaction_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_message_reaction_user" ON "messageReaction" USING btree ("messageId","userId","reaction");--> statement-breakpoint
CREATE INDEX "idx_message_reaction_message" ON "messageReaction" USING btree ("messageId");--> statement-breakpoint
CREATE INDEX "idx_message_reaction_user" ON "messageReaction" USING btree ("userId");--> statement-breakpoint
ALTER TABLE "message" DROP COLUMN "mentions";--> statement-breakpoint
ALTER TABLE "message" DROP COLUMN "reactions";