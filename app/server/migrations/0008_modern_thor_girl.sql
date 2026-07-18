ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2026-07-08T05:29:48.114Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2026-07-08T05:29:48.114Z';--> statement-breakpoint
ALTER TABLE "workflows" ADD COLUMN "schedule_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "workflows" ADD COLUMN "schedule_interval_seconds" integer;