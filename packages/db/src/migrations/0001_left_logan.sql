CREATE TYPE "public"."module_access_mode" AS ENUM('disabled', 'org_wide', 'team_based', 'user_based');--> statement-breakpoint
CREATE TABLE "moduleTeamAccess" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"organizationId" text NOT NULL,
	"module" text NOT NULL,
	"teamId" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "moduleUserAccess" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"organizationId" text NOT NULL,
	"module" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "orgModuleConfig" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"organizationId" text NOT NULL,
	"module" text NOT NULL,
	"mode" "module_access_mode" DEFAULT 'disabled' NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now(),
	"updatedBy" text
);
--> statement-breakpoint
ALTER TABLE "moduleTeamAccess" ADD CONSTRAINT "moduleTeamAccess_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moduleTeamAccess" ADD CONSTRAINT "moduleTeamAccess_teamId_team_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moduleUserAccess" ADD CONSTRAINT "moduleUserAccess_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moduleUserAccess" ADD CONSTRAINT "moduleUserAccess_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orgModuleConfig" ADD CONSTRAINT "orgModuleConfig_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orgModuleConfig" ADD CONSTRAINT "orgModuleConfig_updatedBy_user_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "moduleTeamAccessOrgModuleTeamIdx" ON "moduleTeamAccess" USING btree ("organizationId","module","teamId");--> statement-breakpoint
CREATE UNIQUE INDEX "moduleUserAccessOrgModuleUserIdx" ON "moduleUserAccess" USING btree ("organizationId","module","userId");--> statement-breakpoint
CREATE UNIQUE INDEX "orgModuleConfigOrgModuleIdx" ON "orgModuleConfig" USING btree ("organizationId","module");