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
ALTER TABLE "pushSubscription" ADD CONSTRAINT "pushSubscription_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_endpoint" ON "pushSubscription" USING btree ("userId","endpoint");--> statement-breakpoint
CREATE INDEX "idx_push_subscription_user" ON "pushSubscription" USING btree ("userId");