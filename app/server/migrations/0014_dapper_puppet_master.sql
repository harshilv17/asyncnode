ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
CREATE INDEX "execution_workflow_id_idx" ON "execution" USING btree ("workflow_id");--> statement-breakpoint
CREATE INDEX "execution_trigger_id_idx" ON "execution" USING btree ("trigger_id");--> statement-breakpoint
CREATE INDEX "execution_workflow_id_status_idx" ON "execution" USING btree ("workflow_id","status");--> statement-breakpoint
CREATE INDEX "execution_logs_execution_id_idx" ON "execution_logs" USING btree ("execution_id");--> statement-breakpoint
CREATE INDEX "execution_logs_node_execution_id_idx" ON "execution_logs" USING btree ("node_execution_id");--> statement-breakpoint
CREATE INDEX "node_execution_execution_id_idx" ON "node_execution" USING btree ("execution_id");--> statement-breakpoint
CREATE INDEX "node_execution_execution_id_status_idx" ON "node_execution" USING btree ("execution_id","status");--> statement-breakpoint
CREATE INDEX "workflows_user_id_idx" ON "workflows" USING btree ("user_id");