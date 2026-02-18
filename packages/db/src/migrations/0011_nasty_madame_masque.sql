CREATE TYPE "public"."scope" AS ENUM('org', 'team');--> statement-breakpoint
CREATE TABLE "permissionAuditLog" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"organizationId" text NOT NULL,
	"actorId" text NOT NULL,
	"action" text NOT NULL,
	"targetUserId" text,
	"targetRoleId" text,
	"targetPermissionId" text,
	"details" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permissionNode" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"resource" text NOT NULL,
	"subResource" text NOT NULL,
	"action" text NOT NULL,
	"description" text,
	"bitIndex" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "permissionNode_key_unique" UNIQUE("key"),
	CONSTRAINT "permissionNode_bitIndex_unique" UNIQUE("bitIndex")
);
--> statement-breakpoint
CREATE TABLE "permissionSnapshot" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"organizationId" text NOT NULL,
	"policyVersionId" text NOT NULL,
	"bitset" text NOT NULL,
	"permissionMap" text NOT NULL,
	"computedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "policyOverride" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"permissionNodeId" text NOT NULL,
	"organizationId" text NOT NULL,
	"teamId" text,
	"resourceId" text,
	"effect" text NOT NULL,
	"reason" text,
	"expiresAt" timestamp with time zone,
	"createdBy" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "policyVersion" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"organizationId" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"compiledAt" timestamp with time zone,
	"compiledBy" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"errorMessage" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roleAssignment" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"roleTemplateId" text NOT NULL,
	"organizationId" text NOT NULL,
	"teamId" text,
	"assignedBy" text,
	"assignedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rolePermission" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"roleTemplateId" text NOT NULL,
	"permissionNodeId" text NOT NULL,
	"effect" text DEFAULT 'allow' NOT NULL,
	"conditions" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roleTemplate" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"displayName" text NOT NULL,
	"description" text,
	"scope" "scope" NOT NULL,
	"isSystem" boolean DEFAULT false NOT NULL,
	"organizationId" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "teamModuleConfig" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"teamId" text NOT NULL,
	"module" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now(),
	"updatedBy" text
);
--> statement-breakpoint
CREATE TABLE "casbin_rule" (
	"id" serial PRIMARY KEY NOT NULL,
	"ptype" varchar(255),
	"v0" varchar(255),
	"v1" varchar(255),
	"v2" varchar(255),
	"v3" varchar(255),
	"v4" varchar(255),
	"v5" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "permissionAuditLog" ADD CONSTRAINT "permissionAuditLog_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permissionSnapshot" ADD CONSTRAINT "permissionSnapshot_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permissionSnapshot" ADD CONSTRAINT "permissionSnapshot_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permissionSnapshot" ADD CONSTRAINT "permissionSnapshot_policyVersionId_policyVersion_id_fk" FOREIGN KEY ("policyVersionId") REFERENCES "public"."policyVersion"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "policyOverride" ADD CONSTRAINT "policyOverride_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "policyOverride" ADD CONSTRAINT "policyOverride_permissionNodeId_permissionNode_id_fk" FOREIGN KEY ("permissionNodeId") REFERENCES "public"."permissionNode"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "policyOverride" ADD CONSTRAINT "policyOverride_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "policyOverride" ADD CONSTRAINT "policyOverride_teamId_team_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "policyOverride" ADD CONSTRAINT "policyOverride_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "policyVersion" ADD CONSTRAINT "policyVersion_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roleAssignment" ADD CONSTRAINT "roleAssignment_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roleAssignment" ADD CONSTRAINT "roleAssignment_roleTemplateId_roleTemplate_id_fk" FOREIGN KEY ("roleTemplateId") REFERENCES "public"."roleTemplate"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roleAssignment" ADD CONSTRAINT "roleAssignment_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roleAssignment" ADD CONSTRAINT "roleAssignment_teamId_team_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roleAssignment" ADD CONSTRAINT "roleAssignment_assignedBy_user_id_fk" FOREIGN KEY ("assignedBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rolePermission" ADD CONSTRAINT "rolePermission_roleTemplateId_roleTemplate_id_fk" FOREIGN KEY ("roleTemplateId") REFERENCES "public"."roleTemplate"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rolePermission" ADD CONSTRAINT "rolePermission_permissionNodeId_permissionNode_id_fk" FOREIGN KEY ("permissionNodeId") REFERENCES "public"."permissionNode"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roleTemplate" ADD CONSTRAINT "roleTemplate_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teamModuleConfig" ADD CONSTRAINT "teamModuleConfig_teamId_team_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teamModuleConfig" ADD CONSTRAINT "teamModuleConfig_updatedBy_user_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "permissionAuditLogOrgCreatedIdx" ON "permissionAuditLog" USING btree ("organizationId","createdAt");--> statement-breakpoint
CREATE INDEX "permissionAuditLogActorIdIdx" ON "permissionAuditLog" USING btree ("actorId");--> statement-breakpoint
CREATE INDEX "permissionAuditLogTargetUserIdIdx" ON "permissionAuditLog" USING btree ("targetUserId");--> statement-breakpoint
CREATE INDEX "permissionNodeResourceIdx" ON "permissionNode" USING btree ("resource");--> statement-breakpoint
CREATE UNIQUE INDEX "permissionNodeKeyIdx" ON "permissionNode" USING btree ("key");--> statement-breakpoint
CREATE UNIQUE INDEX "permissionNodeBitIndexIdx" ON "permissionNode" USING btree ("bitIndex");--> statement-breakpoint
CREATE UNIQUE INDEX "permissionSnapshotUserOrgIdx" ON "permissionSnapshot" USING btree ("userId","organizationId");--> statement-breakpoint
CREATE INDEX "permissionSnapshotPolicyVersionIdIdx" ON "permissionSnapshot" USING btree ("policyVersionId");--> statement-breakpoint
CREATE INDEX "policyOverrideUserOrgIdx" ON "policyOverride" USING btree ("userId","organizationId");--> statement-breakpoint
CREATE INDEX "policyOverrideUserPermissionIdx" ON "policyOverride" USING btree ("userId","permissionNodeId");--> statement-breakpoint
CREATE UNIQUE INDEX "policyVersionOrganizationIdVersionIdx" ON "policyVersion" USING btree ("organizationId","version");--> statement-breakpoint
CREATE INDEX "policyVersionOrganizationIdIdx" ON "policyVersion" USING btree ("organizationId");--> statement-breakpoint
CREATE UNIQUE INDEX "roleAssignmentUniqueIdx" ON "roleAssignment" USING btree ("userId","roleTemplateId","organizationId","teamId");--> statement-breakpoint
CREATE INDEX "roleAssignmentScopeIdx" ON "roleAssignment" USING btree ("organizationId","teamId");--> statement-breakpoint
CREATE INDEX "roleAssignmentUserIdIdx" ON "roleAssignment" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "rolePermissionRolePermissionIdx" ON "rolePermission" USING btree ("roleTemplateId","permissionNodeId");--> statement-breakpoint
CREATE INDEX "rolePermissionPermissionNodeIdIdx" ON "rolePermission" USING btree ("permissionNodeId");--> statement-breakpoint
CREATE UNIQUE INDEX "roleTemplateNameOrganizationIdIdx" ON "roleTemplate" USING btree ("name","organizationId");--> statement-breakpoint
CREATE INDEX "roleTemplateOrganizationIdIdx" ON "roleTemplate" USING btree ("organizationId");--> statement-breakpoint
CREATE UNIQUE INDEX "teamModuleConfigTeamIdModuleIdx" ON "teamModuleConfig" USING btree ("teamId","module");--> statement-breakpoint
CREATE INDEX "teamModuleConfigTeamIdIdx" ON "teamModuleConfig" USING btree ("teamId");