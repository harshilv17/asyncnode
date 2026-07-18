ALTER TABLE "execution" ALTER COLUMN "workflow_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "execution" ALTER COLUMN "trigger_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "execution_logs" ALTER COLUMN "execution_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "execution_logs" ALTER COLUMN "node_execution_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "node_execution" ALTER COLUMN "execution_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "integrations" ALTER COLUMN "workflow_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "triggers" ALTER COLUMN "workflow_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2026-06-20T08:11:43.937Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2026-06-20T08:11:43.938Z';--> statement-breakpoint
ALTER TABLE "workflows" ALTER COLUMN "user_id" SET DATA TYPE integer;