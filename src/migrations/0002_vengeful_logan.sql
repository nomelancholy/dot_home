CREATE TYPE "public"."order_status" AS ENUM('pending', 'shipped', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TABLE "addresses" (
	"address_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "addresses_address_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"profile_id" uuid,
	"address_name" text NOT NULL,
	"address" text NOT NULL,
	"zipcode" text NOT NULL,
	"is_default" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"category_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "categories_category_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"order_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "orders_order_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"profile_id" uuid,
	"product_id" bigint,
	"order_date" timestamp DEFAULT now() NOT NULL,
	"order_status" "order_status" DEFAULT 'pending' NOT NULL,
	"total_price" integer NOT NULL,
	"address_id" bigint
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "phone" text NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "nickname" text NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "email_receive_agree" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "sms_receive_agree" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "category_id" bigint;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "soldout" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "thumbnail_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "image1" text NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "image2" text NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "image3" text NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "image4" text NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "image5" text NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_address_id_addresses_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("address_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("category_id") ON DELETE set null ON UPDATE no action;