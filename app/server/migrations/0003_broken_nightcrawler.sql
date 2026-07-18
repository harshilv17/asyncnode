ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2026-06-20T15:32:11.461Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2026-06-20T15:32:11.462Z';--> statement-breakpoint
ALTER TABLE "workflows" ALTER COLUMN "graph_json" DROP NOT NULL;