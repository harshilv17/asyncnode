ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2026-06-30T05:32:07.564Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2026-06-30T05:32:07.564Z';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;