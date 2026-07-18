ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2026-07-08T07:03:37.201Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2026-07-08T07:03:37.202Z';--> statement-breakpoint
ALTER TABLE "triggers" ADD COLUMN "webhook_token" varchar(64);--> statement-breakpoint
ALTER TABLE "triggers" ADD CONSTRAINT "triggers_webhook_token_unique" UNIQUE("webhook_token");