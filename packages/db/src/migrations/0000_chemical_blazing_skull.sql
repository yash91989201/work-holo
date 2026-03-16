CREATE TYPE "public"."attendanceStatus" AS ENUM('present', 'absent', 'late', 'excused', 'partial', 'holiday', 'sick_leave', 'work_from_home');--> statement-breakpoint
CREATE TYPE "public"."clockInMethod" AS ENUM('manual', 'qr_code', 'geofence', 'ip_restriction', 'biometric', 'rfid');--> statement-breakpoint
CREATE TYPE "public"."clockOutMethod" AS ENUM('manual', 'qr_code', 'geofence', 'ip_restriction', 'biometric', 'rfid', 'auto');--> statement-breakpoint
CREATE TYPE "public"."endReason" AS ENUM('manual', 'break', 'punch_out', 'idle_timeout');--> statement-breakpoint
CREATE TYPE "public"."module_access_mode" AS ENUM('disabled', 'org_wide', 'team_based', 'user_based');--> statement-breakpoint
CREATE TYPE "public"."scope" AS ENUM('org', 'team');--> statement-breakpoint
CREATE TYPE "public"."attachmentType" AS ENUM('image', 'document', 'video', 'audio', 'archive');--> statement-breakpoint
CREATE TYPE "public"."channelType" AS ENUM('team', 'group');--> statement-breakpoint
CREATE TYPE "public"."messageType" AS ENUM('text', 'attachment', 'audio');--> statement-breakpoint
CREATE TYPE "public"."notificationStatus" AS ENUM('unread', 'read', 'dismissed');--> statement-breakpoint
CREATE TYPE "public"."notificationType" AS ENUM('channel_message', 'channel_reply', 'channel_direct_reply', 'channel_reaction', 'channel_mention', 'dm_message', 'dm_reply', 'dm_direct_reply', 'dm_reaction');--> statement-breakpoint
CREATE TABLE "attendance" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"organizationId" text NOT NULL,
	"teamId" text,
	"date" date NOT NULL,
	"status" "attendanceStatus" DEFAULT 'present' NOT NULL,
	"checkInTime" timestamp with time zone,
	"checkOutTime" timestamp with time zone,
	"totalHours" numeric(4, 2),
	"breakDuration" integer DEFAULT 0,
	"location" text,
	"coordinates" text,
	"ipAddress" text,
	"deviceInfo" text,
	"notes" text,
	"adminNotes" text,
	"verifiedBy" text,
	"isManualEntry" boolean DEFAULT false NOT NULL,
	"isApproved" boolean DEFAULT true NOT NULL,
	"approvedBy" text,
	"approvedAt" timestamp with time zone,
	"clockInMethod" "clockInMethod" DEFAULT 'manual',
	"clockOutMethod" "clockOutMethod",
	"shiftId" text,
	"overtimeHours" numeric(4, 2),
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workBlock" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"attendanceId" varchar(24) NOT NULL,
	"userId" text NOT NULL,
	"startedAt" timestamp with time zone NOT NULL,
	"endedAt" timestamp with time zone,
	"durationMinutes" integer,
	"endReason" "endReason",
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"password" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"organizationId" text NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"teamId" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"inviterId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" text PRIMARY KEY NOT NULL,
	"organizationId" text NOT NULL,
	"userId" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo" text,
	"createdAt" timestamp NOT NULL,
	"metadata" text,
	CONSTRAINT "organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "passkey" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"publicKey" text NOT NULL,
	"userId" text NOT NULL,
	"credentialID" text NOT NULL,
	"counter" integer NOT NULL,
	"deviceType" text NOT NULL,
	"backedUp" boolean NOT NULL,
	"transports" text,
	"createdAt" timestamp,
	"aaguid" text
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	"impersonatedBy" text,
	"activeOrganizationId" text,
	"activeTeamId" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "team" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"organizationId" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "teamMember" (
	"id" text PRIMARY KEY NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"teamId" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "twoFactor" (
	"id" text PRIMARY KEY NOT NULL,
	"secret" text NOT NULL,
	"backupCodes" text NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"image" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"role" text,
	"banned" boolean DEFAULT false,
	"banReason" text,
	"banExpires" timestamp,
	"twoFactorEnabled" boolean DEFAULT false,
	"username" text,
	"displayUsername" text,
	"phoneNumber" text,
	"phoneNumberVerified" boolean,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_phoneNumber_unique" UNIQUE("phoneNumber")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE "attachment" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"messageId" varchar(24) NOT NULL,
	"fileName" text NOT NULL,
	"originalName" text NOT NULL,
	"fileSize" integer NOT NULL,
	"mimeType" text NOT NULL,
	"type" "attachmentType" NOT NULL,
	"url" text,
	"thumbnailUrl" text,
	"uploadedBy" text NOT NULL,
	"isPublic" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "channelMember" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"channelId" varchar(24) NOT NULL,
	"userId" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"joinedAt" timestamp with time zone NOT NULL,
	"lastReadAt" timestamp with time zone,
	"isMuted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "channelReadProcessedWatermark" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"channelId" varchar(24) NOT NULL,
	"lastProcessedAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	CONSTRAINT "channelReadProcessedWatermark_channelId_unique" UNIQUE("channelId")
);
--> statement-breakpoint
CREATE TABLE "channelRead" (
	"channelId" varchar(24) NOT NULL,
	"userId" text NOT NULL,
	"lastReadMessageId" varchar(24),
	"lastReadAt" timestamp with time zone,
	CONSTRAINT "channelRead_userId_channelId_pk" PRIMARY KEY("userId","channelId")
);
--> statement-breakpoint
CREATE TABLE "channel" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" "channelType" DEFAULT 'team' NOT NULL,
	"organizationId" text NOT NULL,
	"teamId" text,
	"createdBy" text NOT NULL,
	"isPrivate" boolean DEFAULT false NOT NULL,
	"isArchived" boolean DEFAULT false NOT NULL,
	"lastMessageAt" timestamp with time zone,
	"messageCount" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messageMention" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"messageId" varchar(24) NOT NULL,
	"mentionedById" text NOT NULL,
	"mentionedUserId" text NOT NULL,
	"isSeen" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messageReaction" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"messageId" varchar(24) NOT NULL,
	"userId" text NOT NULL,
	"reaction" text NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messageReadSummary" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"messageId" varchar(24) NOT NULL,
	"readCount" integer DEFAULT 0 NOT NULL,
	"lastReadAt" timestamp with time zone,
	"recentReaders" json DEFAULT '[]'::json NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	CONSTRAINT "messageReadSummary_messageId_unique" UNIQUE("messageId")
);
--> statement-breakpoint
CREATE TABLE "messageRead" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"messageId" text NOT NULL,
	"userId" text NOT NULL,
	"readAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"channelId" varchar(24) NOT NULL,
	"senderId" text NOT NULL,
	"receiverId" text,
	"content" text,
	"type" "messageType" DEFAULT 'text' NOT NULL,
	"parentMessageId" varchar(24),
	"replyToMessageId" varchar(24),
	"threadCount" integer DEFAULT 0 NOT NULL,
	"isEdited" boolean DEFAULT false NOT NULL,
	"editedAt" timestamp with time zone,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"isPinned" boolean DEFAULT false NOT NULL,
	"pinnedAt" timestamp with time zone,
	"pinnedBy" text,
	"deletedAt" timestamp with time zone,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	CONSTRAINT "unique_message_id_channel" UNIQUE("id","channelId")
);
--> statement-breakpoint
CREATE TABLE "dmAttachment" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"messageId" varchar(24) NOT NULL,
	"fileName" text NOT NULL,
	"originalName" text NOT NULL,
	"fileSize" integer NOT NULL,
	"mimeType" text NOT NULL,
	"type" "attachmentType" NOT NULL,
	"url" text,
	"thumbnailUrl" text,
	"uploadedBy" text NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dmConversationMute" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"conversationId" varchar(24) NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dmConversationRead" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"conversationId" varchar(24) NOT NULL,
	"userId" text NOT NULL,
	"lastReadMessageId" varchar(24),
	"lastReadAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dmConversation" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"organizationId" text NOT NULL,
	"participantOneId" text NOT NULL,
	"participantTwoId" text NOT NULL,
	"lastMessageAt" timestamp with time zone,
	"messageCount" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dmMessageReaction" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"messageId" varchar(24) NOT NULL,
	"userId" text NOT NULL,
	"emoji" text NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dmMessageRead" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"messageId" varchar(24) NOT NULL,
	"userId" text NOT NULL,
	"readAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dmMessage" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"conversationId" varchar(24) NOT NULL,
	"senderId" text NOT NULL,
	"content" text,
	"type" "messageType" DEFAULT 'text' NOT NULL,
	"parentMessageId" varchar(24),
	"replyToMessageId" varchar(24),
	"threadCount" integer DEFAULT 0 NOT NULL,
	"isEdited" boolean DEFAULT false NOT NULL,
	"editedAt" timestamp with time zone,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"deletedAt" timestamp with time zone,
	"isPinned" boolean DEFAULT false NOT NULL,
	"pinnedAt" timestamp with time zone,
	"pinnedBy" text,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	CONSTRAINT "unique_dm_message_id_conversation" UNIQUE("id","conversationId")
);
--> statement-breakpoint
CREATE TABLE "notificationPreference" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"orgId" text NOT NULL,
	"eventType" "notificationType" NOT NULL,
	"deliveryChannel" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"entityType" text,
	"entityId" text,
	"emailDigestInterval" text,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notificationSoundPreference" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"orgId" text NOT NULL,
	"scope" text NOT NULL,
	"entityId" text,
	"soundType" text NOT NULL,
	"presetId" text,
	"customSoundUrl" text,
	"customSoundName" text,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notificationSoundPreset" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"filename" text NOT NULL,
	"category" text NOT NULL,
	"sortOrder" integer NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"actorId" text,
	"orgId" text,
	"type" "notificationType" NOT NULL,
	"status" "notificationStatus" DEFAULT 'unread' NOT NULL,
	"title" text NOT NULL,
	"message" text,
	"entityId" text,
	"entityType" text,
	"actionUrl" text,
	"metadata" json,
	"readAt" timestamp with time zone,
	"dismissedAt" timestamp with time zone,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pendingEmailDigest" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"orgId" text NOT NULL,
	"notificationId" text NOT NULL,
	"scheduledAt" timestamp with time zone NOT NULL,
	"sent" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pushSubscription" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"userAgent" text,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_teamId_team_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_verifiedBy_user_id_fk" FOREIGN KEY ("verifiedBy") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_approvedBy_user_id_fk" FOREIGN KEY ("approvedBy") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workBlock" ADD CONSTRAINT "workBlock_attendanceId_attendance_id_fk" FOREIGN KEY ("attendanceId") REFERENCES "public"."attendance"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workBlock" ADD CONSTRAINT "workBlock_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviterId_user_id_fk" FOREIGN KEY ("inviterId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passkey" ADD CONSTRAINT "passkey_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teamMember" ADD CONSTRAINT "teamMember_teamId_team_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teamMember" ADD CONSTRAINT "teamMember_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "twoFactor" ADD CONSTRAINT "twoFactor_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moduleTeamAccess" ADD CONSTRAINT "moduleTeamAccess_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moduleTeamAccess" ADD CONSTRAINT "moduleTeamAccess_teamId_team_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moduleUserAccess" ADD CONSTRAINT "moduleUserAccess_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moduleUserAccess" ADD CONSTRAINT "moduleUserAccess_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orgModuleConfig" ADD CONSTRAINT "orgModuleConfig_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orgModuleConfig" ADD CONSTRAINT "orgModuleConfig_updatedBy_user_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
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
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_messageId_message_id_fk" FOREIGN KEY ("messageId") REFERENCES "public"."message"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_uploadedBy_user_id_fk" FOREIGN KEY ("uploadedBy") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channelMember" ADD CONSTRAINT "channelMember_channelId_channel_id_fk" FOREIGN KEY ("channelId") REFERENCES "public"."channel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channelMember" ADD CONSTRAINT "channelMember_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channelReadProcessedWatermark" ADD CONSTRAINT "channelReadProcessedWatermark_channelId_channel_id_fk" FOREIGN KEY ("channelId") REFERENCES "public"."channel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channelRead" ADD CONSTRAINT "channelRead_channelId_channel_id_fk" FOREIGN KEY ("channelId") REFERENCES "public"."channel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channelRead" ADD CONSTRAINT "channelRead_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channelRead" ADD CONSTRAINT "channelRead_lastReadMessageId_message_id_fk" FOREIGN KEY ("lastReadMessageId") REFERENCES "public"."message"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channel" ADD CONSTRAINT "channel_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channel" ADD CONSTRAINT "channel_teamId_team_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channel" ADD CONSTRAINT "channel_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messageMention" ADD CONSTRAINT "messageMention_messageId_message_id_fk" FOREIGN KEY ("messageId") REFERENCES "public"."message"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messageMention" ADD CONSTRAINT "messageMention_mentionedById_user_id_fk" FOREIGN KEY ("mentionedById") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messageMention" ADD CONSTRAINT "messageMention_mentionedUserId_user_id_fk" FOREIGN KEY ("mentionedUserId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messageReaction" ADD CONSTRAINT "messageReaction_messageId_message_id_fk" FOREIGN KEY ("messageId") REFERENCES "public"."message"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messageReaction" ADD CONSTRAINT "messageReaction_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messageReadSummary" ADD CONSTRAINT "messageReadSummary_messageId_message_id_fk" FOREIGN KEY ("messageId") REFERENCES "public"."message"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messageRead" ADD CONSTRAINT "messageRead_messageId_message_id_fk" FOREIGN KEY ("messageId") REFERENCES "public"."message"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messageRead" ADD CONSTRAINT "messageRead_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_channelId_channel_id_fk" FOREIGN KEY ("channelId") REFERENCES "public"."channel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_senderId_user_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_receiverId_user_id_fk" FOREIGN KEY ("receiverId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_pinnedBy_user_id_fk" FOREIGN KEY ("pinnedBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "fk_message_parent" FOREIGN KEY ("parentMessageId") REFERENCES "public"."message"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "fk_message_reply_to" FOREIGN KEY ("replyToMessageId","channelId") REFERENCES "public"."message"("id","channelId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmAttachment" ADD CONSTRAINT "dmAttachment_messageId_dmMessage_id_fk" FOREIGN KEY ("messageId") REFERENCES "public"."dmMessage"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmAttachment" ADD CONSTRAINT "dmAttachment_uploadedBy_user_id_fk" FOREIGN KEY ("uploadedBy") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmConversationMute" ADD CONSTRAINT "dmConversationMute_conversationId_dmConversation_id_fk" FOREIGN KEY ("conversationId") REFERENCES "public"."dmConversation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmConversationMute" ADD CONSTRAINT "dmConversationMute_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmConversationRead" ADD CONSTRAINT "dmConversationRead_conversationId_dmConversation_id_fk" FOREIGN KEY ("conversationId") REFERENCES "public"."dmConversation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmConversationRead" ADD CONSTRAINT "dmConversationRead_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmConversationRead" ADD CONSTRAINT "dmConversationRead_lastReadMessageId_dmMessage_id_fk" FOREIGN KEY ("lastReadMessageId") REFERENCES "public"."dmMessage"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmConversation" ADD CONSTRAINT "dmConversation_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmConversation" ADD CONSTRAINT "dmConversation_participantOneId_user_id_fk" FOREIGN KEY ("participantOneId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmConversation" ADD CONSTRAINT "dmConversation_participantTwoId_user_id_fk" FOREIGN KEY ("participantTwoId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmMessageReaction" ADD CONSTRAINT "dmMessageReaction_messageId_dmMessage_id_fk" FOREIGN KEY ("messageId") REFERENCES "public"."dmMessage"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmMessageReaction" ADD CONSTRAINT "dmMessageReaction_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmMessageRead" ADD CONSTRAINT "dmMessageRead_messageId_dmMessage_id_fk" FOREIGN KEY ("messageId") REFERENCES "public"."dmMessage"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmMessageRead" ADD CONSTRAINT "dmMessageRead_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmMessage" ADD CONSTRAINT "dmMessage_conversationId_dmConversation_id_fk" FOREIGN KEY ("conversationId") REFERENCES "public"."dmConversation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmMessage" ADD CONSTRAINT "dmMessage_senderId_user_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmMessage" ADD CONSTRAINT "dmMessage_pinnedBy_user_id_fk" FOREIGN KEY ("pinnedBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmMessage" ADD CONSTRAINT "fk_dm_message_parent" FOREIGN KEY ("parentMessageId") REFERENCES "public"."dmMessage"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dmMessage" ADD CONSTRAINT "fk_dm_message_reply_to" FOREIGN KEY ("replyToMessageId","conversationId") REFERENCES "public"."dmMessage"("id","conversationId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notificationPreference" ADD CONSTRAINT "notificationPreference_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notificationPreference" ADD CONSTRAINT "notificationPreference_orgId_organization_id_fk" FOREIGN KEY ("orgId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notificationSoundPreference" ADD CONSTRAINT "notificationSoundPreference_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notificationSoundPreference" ADD CONSTRAINT "notificationSoundPreference_orgId_organization_id_fk" FOREIGN KEY ("orgId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notificationSoundPreference" ADD CONSTRAINT "notificationSoundPreference_presetId_notificationSoundPreset_id_fk" FOREIGN KEY ("presetId") REFERENCES "public"."notificationSoundPreset"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_actorId_user_id_fk" FOREIGN KEY ("actorId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_orgId_organization_id_fk" FOREIGN KEY ("orgId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pendingEmailDigest" ADD CONSTRAINT "pendingEmailDigest_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pendingEmailDigest" ADD CONSTRAINT "pendingEmailDigest_orgId_organization_id_fk" FOREIGN KEY ("orgId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pendingEmailDigest" ADD CONSTRAINT "pendingEmailDigest_notificationId_notification_id_fk" FOREIGN KEY ("notificationId") REFERENCES "public"."notification"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pushSubscription" ADD CONSTRAINT "pushSubscription_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "invitation_organizationId_idx" ON "invitation" USING btree ("organizationId");--> statement-breakpoint
CREATE INDEX "invitation_email_idx" ON "invitation" USING btree ("email");--> statement-breakpoint
CREATE INDEX "member_organizationId_idx" ON "member" USING btree ("organizationId");--> statement-breakpoint
CREATE INDEX "member_userId_idx" ON "member" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "passkey_userId_idx" ON "passkey" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "passkey_credentialID_idx" ON "passkey" USING btree ("credentialID");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "team_organizationId_idx" ON "team" USING btree ("organizationId");--> statement-breakpoint
CREATE INDEX "teamMember_teamId_idx" ON "teamMember" USING btree ("teamId");--> statement-breakpoint
CREATE INDEX "teamMember_userId_idx" ON "teamMember" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "twoFactor_secret_idx" ON "twoFactor" USING btree ("secret");--> statement-breakpoint
CREATE INDEX "twoFactor_userId_idx" ON "twoFactor" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE UNIQUE INDEX "moduleTeamAccessOrgModuleTeamIdx" ON "moduleTeamAccess" USING btree ("organizationId","module","teamId");--> statement-breakpoint
CREATE UNIQUE INDEX "moduleUserAccessOrgModuleUserIdx" ON "moduleUserAccess" USING btree ("organizationId","module","userId");--> statement-breakpoint
CREATE UNIQUE INDEX "orgModuleConfigOrgModuleIdx" ON "orgModuleConfig" USING btree ("organizationId","module");--> statement-breakpoint
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
CREATE INDEX "teamModuleConfigTeamIdIdx" ON "teamModuleConfig" USING btree ("teamId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_channel_user" ON "channelMember" USING btree ("channelId","userId");--> statement-breakpoint
CREATE INDEX "idx_channel_read_watermark_channel" ON "channelReadProcessedWatermark" USING btree ("channelId");--> statement-breakpoint
CREATE INDEX "idx_channel_read_user" ON "channelRead" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_channel_read_channel" ON "channelRead" USING btree ("channelId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_message_mention_user" ON "messageMention" USING btree ("messageId","mentionedUserId");--> statement-breakpoint
CREATE INDEX "idx_message_mention_user" ON "messageMention" USING btree ("mentionedUserId");--> statement-breakpoint
CREATE INDEX "idx_message_mention_message" ON "messageMention" USING btree ("messageId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_message_reaction_user" ON "messageReaction" USING btree ("messageId","userId","reaction");--> statement-breakpoint
CREATE INDEX "idx_message_reaction_message" ON "messageReaction" USING btree ("messageId");--> statement-breakpoint
CREATE INDEX "idx_message_reaction_user" ON "messageReaction" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_message_read_summary_message" ON "messageReadSummary" USING btree ("messageId");--> statement-breakpoint
CREATE INDEX "idx_message_read_summary_last_read" ON "messageReadSummary" USING btree ("lastReadAt");--> statement-breakpoint
CREATE INDEX "idx_message_read_message_user" ON "messageRead" USING btree ("messageId","userId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_message_read_message_user" ON "messageRead" USING btree ("messageId","userId");--> statement-breakpoint
CREATE INDEX "idx_message_parent_message_id" ON "message" USING btree ("parentMessageId");--> statement-breakpoint
CREATE INDEX "idx_message_reply_to" ON "message" USING btree ("replyToMessageId");--> statement-breakpoint
CREATE INDEX "idx_message_is_deleted" ON "message" USING btree ("isDeleted");--> statement-breakpoint
CREATE INDEX "idx_message_channel_id" ON "message" USING btree ("channelId");--> statement-breakpoint
CREATE INDEX "idx_message_channel_deleted" ON "message" USING btree ("channelId","isDeleted");--> statement-breakpoint
CREATE INDEX "idx_message_parent_deleted" ON "message" USING btree ("parentMessageId","isDeleted");--> statement-breakpoint
CREATE INDEX "idx_dm_attachment_message" ON "dmAttachment" USING btree ("messageId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_dm_conversation_mute" ON "dmConversationMute" USING btree ("conversationId","userId");--> statement-breakpoint
CREATE INDEX "idx_dm_conversation_mute_conversation" ON "dmConversationMute" USING btree ("conversationId");--> statement-breakpoint
CREATE INDEX "idx_dm_conversation_mute_user" ON "dmConversationMute" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_dm_conversation_read" ON "dmConversationRead" USING btree ("conversationId","userId");--> statement-breakpoint
CREATE INDEX "idx_dm_conversation_read_conversation" ON "dmConversationRead" USING btree ("conversationId");--> statement-breakpoint
CREATE INDEX "idx_dm_conversation_read_user" ON "dmConversationRead" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_dm_conversation_participants" ON "dmConversation" USING btree ("organizationId","participantOneId","participantTwoId");--> statement-breakpoint
CREATE INDEX "idx_dm_conversation_org" ON "dmConversation" USING btree ("organizationId");--> statement-breakpoint
CREATE INDEX "idx_dm_conversation_org_last_message_id" ON "dmConversation" USING btree ("organizationId","lastMessageAt","id");--> statement-breakpoint
CREATE INDEX "idx_dm_conversation_p1" ON "dmConversation" USING btree ("participantOneId");--> statement-breakpoint
CREATE INDEX "idx_dm_conversation_p2" ON "dmConversation" USING btree ("participantTwoId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_dm_message_reaction" ON "dmMessageReaction" USING btree ("messageId","userId","emoji");--> statement-breakpoint
CREATE INDEX "idx_dm_message_reaction_message" ON "dmMessageReaction" USING btree ("messageId");--> statement-breakpoint
CREATE INDEX "idx_dm_message_reaction_user" ON "dmMessageReaction" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_dm_message_read" ON "dmMessageRead" USING btree ("messageId","userId");--> statement-breakpoint
CREATE INDEX "idx_dm_message_read_message" ON "dmMessageRead" USING btree ("messageId");--> statement-breakpoint
CREATE INDEX "idx_dm_message_read_user" ON "dmMessageRead" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_dm_message_conversation" ON "dmMessage" USING btree ("conversationId");--> statement-breakpoint
CREATE INDEX "idx_dm_message_conversation_created_id" ON "dmMessage" USING btree ("conversationId","createdAt","id");--> statement-breakpoint
CREATE INDEX "idx_dm_message_sender" ON "dmMessage" USING btree ("senderId");--> statement-breakpoint
CREATE INDEX "idx_dm_message_parent" ON "dmMessage" USING btree ("parentMessageId");--> statement-breakpoint
CREATE INDEX "idx_dm_message_reply_to" ON "dmMessage" USING btree ("replyToMessageId");--> statement-breakpoint
CREATE INDEX "idx_dm_message_is_deleted" ON "dmMessage" USING btree ("isDeleted");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_notification_preference" ON "notificationPreference" USING btree ("userId","orgId","eventType","deliveryChannel","entityType","entityId");--> statement-breakpoint
CREATE INDEX "idx_notification_preference_user_org" ON "notificationPreference" USING btree ("userId","orgId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_notification_sound_preference" ON "notificationSoundPreference" USING btree ("userId","orgId","scope","entityId");--> statement-breakpoint
CREATE INDEX "idx_notification_sound_preference_user_org" ON "notificationSoundPreference" USING btree ("userId","orgId");--> statement-breakpoint
CREATE INDEX "idx_pending_email_digest_scheduled" ON "pendingEmailDigest" USING btree ("scheduledAt","sent");--> statement-breakpoint
CREATE INDEX "idx_pending_email_digest_user_org" ON "pendingEmailDigest" USING btree ("userId","orgId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_endpoint" ON "pushSubscription" USING btree ("userId","endpoint");--> statement-breakpoint
CREATE INDEX "idx_push_subscription_user" ON "pushSubscription" USING btree ("userId");