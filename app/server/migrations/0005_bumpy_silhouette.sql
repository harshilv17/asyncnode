ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2026-07-04T08:11:00.935Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2026-07-04T08:11:00.936Z';--> statement-breakpoint
ALTER TABLE "integrations" ADD COLUMN "node_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "triggers" ADD COLUMN "node_id" varchar(255) NOT NULL;