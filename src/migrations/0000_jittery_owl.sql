CREATE TYPE "public"."product_type" AS ENUM('cup', 'plate');--> statement-breakpoint
CREATE TABLE "product" (
	"product_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_product_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"description" text NOT NULL
);
