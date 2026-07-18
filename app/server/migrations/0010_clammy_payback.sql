ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2026-07-08T06:05:03.972Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2026-07-08T06:05:03.972Z';--> statement-breakpoint
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_workflow_id_node_id_unique" UNIQUE("workflow_id","node_id");--> statement-breakpoint
ALTER TABLE "triggers" ADD CONSTRAINT "triggers_workflow_id_node_id_unique" UNIQUE("workflow_id","node_id");