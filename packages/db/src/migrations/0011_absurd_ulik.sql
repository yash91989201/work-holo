ALTER TABLE "team" ADD COLUMN "createdBy" text;--> statement-breakpoint
ALTER TABLE "teamMember" ADD COLUMN "role" text DEFAULT 'member' NOT NULL;--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;