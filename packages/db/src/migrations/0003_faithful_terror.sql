CREATE TYPE "public"."callParticipantRole" AS ENUM('host', 'participant');--> statement-breakpoint
CREATE TYPE "public"."callSourceType" AS ENUM('dm', 'channel');--> statement-breakpoint
CREATE TYPE "public"."callStatus" AS ENUM('ringing', 'active', 'missed', 'rejected', 'cancelled', 'ended');--> statement-breakpoint
CREATE TYPE "public"."callType" AS ENUM('voice', 'video');--> statement-breakpoint
CREATE TABLE "callParticipant" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"callId" varchar(24) NOT NULL,
	"userId" text NOT NULL,
	"role" "callParticipantRole" DEFAULT 'participant' NOT NULL,
	"joinedAt" timestamp with time zone,
	"leftAt" timestamp with time zone,
	"isRemoved" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "call" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"orgId" text NOT NULL,
	"type" "callType" NOT NULL,
	"status" "callStatus" DEFAULT 'ringing' NOT NULL,
	"initiatorId" text NOT NULL,
	"sourceConversationId" text,
	"sourceType" "callSourceType",
	"livekitRoomName" text NOT NULL,
	"startedAt" timestamp with time zone,
	"endedAt" timestamp with time zone,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	CONSTRAINT "call_livekitRoomName_unique" UNIQUE("livekitRoomName")
);
--> statement-breakpoint
ALTER TABLE "callParticipant" ADD CONSTRAINT "callParticipant_callId_call_id_fk" FOREIGN KEY ("callId") REFERENCES "public"."call"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "callParticipant" ADD CONSTRAINT "callParticipant_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "call" ADD CONSTRAINT "call_orgId_organization_id_fk" FOREIGN KEY ("orgId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "call" ADD CONSTRAINT "call_initiatorId_user_id_fk" FOREIGN KEY ("initiatorId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_call_participant_call" ON "callParticipant" USING btree ("callId");--> statement-breakpoint
CREATE INDEX "idx_call_participant_user" ON "callParticipant" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_call_participant_call_user" ON "callParticipant" USING btree ("callId","userId");--> statement-breakpoint
CREATE INDEX "idx_call_org" ON "call" USING btree ("orgId");--> statement-breakpoint
CREATE INDEX "idx_call_initiator" ON "call" USING btree ("initiatorId");--> statement-breakpoint
CREATE INDEX "idx_call_status" ON "call" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_call_org_created" ON "call" USING btree ("orgId","createdAt");