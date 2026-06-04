CREATE TYPE "public"."transaction_kind" AS ENUM('income', 'expense');--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" "transaction_kind" NOT NULL,
	"amount" integer NOT NULL,
	"description" text NOT NULL,
	"category" text,
	"member" text,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "transactions_occurred_at_idx" ON "transactions" USING btree ("occurred_at");