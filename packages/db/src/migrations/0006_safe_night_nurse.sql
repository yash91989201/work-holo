CREATE TABLE "callLogs" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"freeswitchCallId" text NOT NULL,
	"organizationId" text,
	"agentUserId" text,
	"extensionId" text,
	"didId" text,
	"direction" text NOT NULL,
	"fromNumber" text NOT NULL,
	"toNumber" text NOT NULL,
	"status" text NOT NULL,
	"hangupCause" text,
	"startedAt" timestamp NOT NULL,
	"answeredAt" timestamp,
	"endedAt" timestamp,
	"durationSeconds" integer DEFAULT 0 NOT NULL,
	"billableSeconds" integer DEFAULT 0 NOT NULL,
	"recordingUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "callLogs_freeswitchCallId_unique" UNIQUE("freeswitchCallId")
);
--> statement-breakpoint
ALTER TABLE "callLogs" ADD CONSTRAINT "callLogs_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "callLogs" ADD CONSTRAINT "callLogs_agentUserId_user_id_fk" FOREIGN KEY ("agentUserId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "callLogs" ADD CONSTRAINT "callLogs_extensionId_agentExtensions_id_fk" FOREIGN KEY ("extensionId") REFERENCES "public"."agentExtensions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "callLogs" ADD CONSTRAINT "callLogs_didId_didInventory_id_fk" FOREIGN KEY ("didId") REFERENCES "public"."didInventory"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "callLogs_organizationId_idx" ON "callLogs" USING btree ("organizationId");--> statement-breakpoint
CREATE INDEX "callLogs_agentUserId_idx" ON "callLogs" USING btree ("agentUserId");--> statement-breakpoint
CREATE INDEX "callLogs_startedAt_idx" ON "callLogs" USING btree ("startedAt");--> statement-breakpoint
CREATE INDEX "callLogs_direction_idx" ON "callLogs" USING btree ("direction");--> statement-breakpoint
CREATE INDEX "callLogs_status_idx" ON "callLogs" USING btree ("status");