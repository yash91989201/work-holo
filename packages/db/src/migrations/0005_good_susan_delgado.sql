CREATE TABLE "agentDialerAccess" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"organizationId" text NOT NULL,
	"userId" text NOT NULL,
	"canMakeCalls" boolean DEFAULT false NOT NULL,
	"canReceiveCalls" boolean DEFAULT false NOT NULL,
	"assignedDidId" text,
	"assignedExtensionId" text,
	"isActive" boolean DEFAULT true NOT NULL,
	"grantedBy" text NOT NULL,
	"grantedAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "agentDialerAccess_org_user_unique" UNIQUE("organizationId","userId")
);
--> statement-breakpoint
CREATE TABLE "orgDialerSettings" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"organizationId" text NOT NULL,
	"isEnabled" boolean DEFAULT false NOT NULL,
	"canMakeOutboundCalls" boolean DEFAULT false NOT NULL,
	"canReceiveInboundCalls" boolean DEFAULT false NOT NULL,
	"defaultOutboundTrunkId" text,
	"recordAllCalls" boolean DEFAULT false NOT NULL,
	"maxConcurrentCalls" integer DEFAULT 5 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdBy" text NOT NULL,
	CONSTRAINT "orgDialerSettings_organizationId_unique" UNIQUE("organizationId")
);
--> statement-breakpoint
CREATE TABLE "sipProviders" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"host" text NOT NULL,
	"port" integer DEFAULT 5060 NOT NULL,
	"transport" text DEFAULT 'tcp' NOT NULL,
	"requiresRegistration" boolean DEFAULT false NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdBy" text NOT NULL,
	CONSTRAINT "sipProviders_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
DROP INDEX IF EXISTS "roleAssignmentUniqueIdx";--> statement-breakpoint
DROP INDEX IF EXISTS "roleTemplateNameOrganizationIdIdx";--> statement-breakpoint
ALTER TABLE "didInventory" ADD COLUMN "assignedToOrgAt" timestamp;--> statement-breakpoint
ALTER TABLE "didInventory" ADD COLUMN "assignedToOrgBy" text;--> statement-breakpoint
ALTER TABLE "didInventory" ADD COLUMN "assignedToUserId" text;--> statement-breakpoint
ALTER TABLE "didInventory" ADD COLUMN "assignedToUserAt" timestamp;--> statement-breakpoint
ALTER TABLE "didInventory" ADD COLUMN "assignedToUserBy" text;--> statement-breakpoint
ALTER TABLE "sipTrunks" ADD COLUMN "sipProviderId" text;--> statement-breakpoint
ALTER TABLE "agentDialerAccess" ADD CONSTRAINT "agentDialerAccess_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agentDialerAccess" ADD CONSTRAINT "agentDialerAccess_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agentDialerAccess" ADD CONSTRAINT "agentDialerAccess_assignedDidId_didInventory_id_fk" FOREIGN KEY ("assignedDidId") REFERENCES "public"."didInventory"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agentDialerAccess" ADD CONSTRAINT "agentDialerAccess_assignedExtensionId_agentExtensions_id_fk" FOREIGN KEY ("assignedExtensionId") REFERENCES "public"."agentExtensions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agentDialerAccess" ADD CONSTRAINT "agentDialerAccess_grantedBy_user_id_fk" FOREIGN KEY ("grantedBy") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orgDialerSettings" ADD CONSTRAINT "orgDialerSettings_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orgDialerSettings" ADD CONSTRAINT "orgDialerSettings_defaultOutboundTrunkId_sipTrunks_id_fk" FOREIGN KEY ("defaultOutboundTrunkId") REFERENCES "public"."sipTrunks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orgDialerSettings" ADD CONSTRAINT "orgDialerSettings_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sipProviders" ADD CONSTRAINT "sipProviders_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "agentDialerAccess_organizationId_idx" ON "agentDialerAccess" USING btree ("organizationId");--> statement-breakpoint
CREATE INDEX "agentDialerAccess_userId_idx" ON "agentDialerAccess" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "sipProviders_isActive_idx" ON "sipProviders" USING btree ("isActive");--> statement-breakpoint
ALTER TABLE "didInventory" ADD CONSTRAINT "didInventory_assignedToOrgBy_user_id_fk" FOREIGN KEY ("assignedToOrgBy") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "didInventory" ADD CONSTRAINT "didInventory_assignedToUserId_user_id_fk" FOREIGN KEY ("assignedToUserId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "didInventory" ADD CONSTRAINT "didInventory_assignedToUserBy_user_id_fk" FOREIGN KEY ("assignedToUserBy") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sipTrunks" ADD CONSTRAINT "sipTrunks_sipProviderId_sipProviders_id_fk" FOREIGN KEY ("sipProviderId") REFERENCES "public"."sipProviders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "roleAssignmentOrgUniqueIdx" ON "roleAssignment" USING btree ("userId","roleTemplateId","organizationId") WHERE "roleAssignment"."teamId" is null;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "roleAssignmentTeamUniqueIdx" ON "roleAssignment" USING btree ("userId","roleTemplateId","organizationId","teamId") WHERE "roleAssignment"."teamId" is not null;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "roleTemplateSystemNameIdx" ON "roleTemplate" USING btree ("name") WHERE "roleTemplate"."organizationId" is null;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "roleTemplateOrgNameIdx" ON "roleTemplate" USING btree ("name","organizationId") WHERE "roleTemplate"."organizationId" is not null;--> statement-breakpoint
CREATE INDEX "didInventory_assignedToUserId_idx" ON "didInventory" USING btree ("assignedToUserId");--> statement-breakpoint
CREATE INDEX "sipTrunks_sipProviderId_idx" ON "sipTrunks" USING btree ("sipProviderId");