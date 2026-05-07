CREATE TABLE "agentExtensions" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"extension" text NOT NULL,
	"password" text NOT NULL,
	"callerIdName" text NOT NULL,
	"callerIdNumber" text NOT NULL,
	"organizationId" text,
	"userId" text,
	"context" text DEFAULT 'default' NOT NULL,
	"tollAllow" text DEFAULT 'domestic,international,local' NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"deploymentStatus" text DEFAULT 'pending' NOT NULL,
	"deployedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdBy" text NOT NULL,
	CONSTRAINT "agentExtensions_extension_unique" UNIQUE("extension")
);
--> statement-breakpoint
CREATE TABLE "dialerAuditLog" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"entityType" text NOT NULL,
	"entityId" text NOT NULL,
	"action" text NOT NULL,
	"changes" text,
	"performedBy" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "didInventory" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"number" text NOT NULL,
	"friendlyName" text,
	"sipTrunkId" text NOT NULL,
	"organizationId" text,
	"status" text DEFAULT 'available' NOT NULL,
	"destinationType" text,
	"destinationTarget" text,
	"recordingEnabled" boolean DEFAULT true NOT NULL,
	"stickyAgentEnabled" boolean DEFAULT false NOT NULL,
	"isActive" boolean DEFAULT false NOT NULL,
	"deploymentStatus" text DEFAULT 'undeployed' NOT NULL,
	"deployedAt" timestamp,
	"assignedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdBy" text NOT NULL,
	CONSTRAINT "didInventory_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "sipTrunks" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"provider" text NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"proxy" text NOT NULL,
	"fromDomain" text,
	"fromUser" text,
	"register" boolean DEFAULT true NOT NULL,
	"expireSeconds" integer DEFAULT 60 NOT NULL,
	"pingInterval" integer DEFAULT 25 NOT NULL,
	"transport" text DEFAULT 'udp' NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"deploymentStatus" text DEFAULT 'pending' NOT NULL,
	"deployedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdBy" text NOT NULL,
	CONSTRAINT "sipTrunks_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "agentExtensions" ADD CONSTRAINT "agentExtensions_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agentExtensions" ADD CONSTRAINT "agentExtensions_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agentExtensions" ADD CONSTRAINT "agentExtensions_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dialerAuditLog" ADD CONSTRAINT "dialerAuditLog_performedBy_user_id_fk" FOREIGN KEY ("performedBy") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "didInventory" ADD CONSTRAINT "didInventory_sipTrunkId_sipTrunks_id_fk" FOREIGN KEY ("sipTrunkId") REFERENCES "public"."sipTrunks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "didInventory" ADD CONSTRAINT "didInventory_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "didInventory" ADD CONSTRAINT "didInventory_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sipTrunks" ADD CONSTRAINT "sipTrunks_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "agentExtensions_organizationId_idx" ON "agentExtensions" USING btree ("organizationId");--> statement-breakpoint
CREATE INDEX "agentExtensions_userId_idx" ON "agentExtensions" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "dialerAuditLog_entityType_entityId_idx" ON "dialerAuditLog" USING btree ("entityType","entityId");--> statement-breakpoint
CREATE INDEX "dialerAuditLog_performedBy_idx" ON "dialerAuditLog" USING btree ("performedBy");--> statement-breakpoint
CREATE INDEX "didInventory_sipTrunkId_idx" ON "didInventory" USING btree ("sipTrunkId");--> statement-breakpoint
CREATE INDEX "didInventory_organizationId_idx" ON "didInventory" USING btree ("organizationId");--> statement-breakpoint
CREATE INDEX "didInventory_status_idx" ON "didInventory" USING btree ("status");--> statement-breakpoint
CREATE INDEX "sipTrunks_provider_idx" ON "sipTrunks" USING btree ("provider");--> statement-breakpoint
CREATE INDEX "sipTrunks_isActive_idx" ON "sipTrunks" USING btree ("isActive");