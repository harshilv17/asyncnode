CREATE TYPE "public"."status_enum" AS ENUM('pending', 'running', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."is_active" AS ENUM('true', 'false');--> statement-breakpoint
CREATE TYPE "public"."workflow_status" AS ENUM('draft', 'active', 'completed');--> statement-breakpoint
CREATE TABLE "execution" (
	"id" serial PRIMARY KEY NOT NULL,
	"workflow_id" serial NOT NULL,
	"trigger_id" serial NOT NULL,
	"status" "status_enum" DEFAULT 'pending' NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"input_json" jsonb,
	"output_json" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "execution_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"execution_id" serial NOT NULL,
	"node_id" varchar(255) NOT NULL,
	"log_level" varchar(50) NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "node_execution" (
	"id" serial PRIMARY KEY NOT NULL,
	"execution_id" serial NOT NULL,
	"node_id" varchar(255) NOT NULL,
	"node_type" varchar(255) NOT NULL,
	"status" "status_enum" DEFAULT 'pending' NOT NULL,
	"input_json" jsonb,
	"output_json" jsonb,
	"error_message" text,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "integrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"workflow_id" serial NOT NULL,
	"provider" varchar(255) NOT NULL,
	"credentials_json" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "triggers" (
	"id" serial PRIMARY KEY NOT NULL,
	"workflow_id" serial NOT NULL,
	"type" varchar(255) NOT NULL,
	"config_json" jsonb NOT NULL,
	"is_active" "is_active" DEFAULT 'true' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"created_at" text DEFAULT '2026-06-19T16:38:04.076Z' NOT NULL,
	"updated_at" text DEFAULT '2026-06-19T16:38:04.076Z' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "workflows" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"graph_json" jsonb NOT NULL,
	"status" "workflow_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "execution" ADD CONSTRAINT "execution_workflow_id_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution" ADD CONSTRAINT "execution_trigger_id_triggers_id_fk" FOREIGN KEY ("trigger_id") REFERENCES "public"."triggers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_logs" ADD CONSTRAINT "execution_logs_execution_id_execution_id_fk" FOREIGN KEY ("execution_id") REFERENCES "public"."execution"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_logs" ADD CONSTRAINT "execution_logs_node_id_node_execution_node_id_fk" FOREIGN KEY ("node_id") REFERENCES "public"."node_execution"("node_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "node_execution" ADD CONSTRAINT "node_execution_execution_id_execution_id_fk" FOREIGN KEY ("execution_id") REFERENCES "public"."execution"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_workflow_id_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "triggers" ADD CONSTRAINT "triggers_workflow_id_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;