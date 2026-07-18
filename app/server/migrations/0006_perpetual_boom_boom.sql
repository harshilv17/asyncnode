ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2026-07-08T04:57:37.069Z';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2026-07-08T04:57:37.070Z';--> statement-breakpoint
ALTER TABLE "execution" DROP COLUMN "input_json";--> statement-breakpoint
ALTER TABLE "execution" DROP COLUMN "output_json";