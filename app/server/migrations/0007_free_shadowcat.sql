ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2026-07-08T04:58:45.221Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2026-07-08T04:58:45.221Z';--> statement-breakpoint
ALTER TABLE "node_execution" DROP COLUMN "error_message";