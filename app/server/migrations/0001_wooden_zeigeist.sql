ALTER TABLE "execution_logs" RENAME COLUMN "node_id" TO "node_execution_id";--> statement-breakpoint
ALTER TABLE "execution_logs" DROP CONSTRAINT "execution_logs_node_id_node_execution_node_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2026-06-20T08:06:39.564Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2026-06-20T08:06:39.564Z';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "refresh_token" text;--> statement-breakpoint
ALTER TABLE "execution_logs" ADD CONSTRAINT "execution_logs_node_execution_id_node_execution_id_fk" FOREIGN KEY ("node_execution_id") REFERENCES "public"."node_execution"("id") ON DELETE no action ON UPDATE no action;