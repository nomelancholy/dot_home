CREATE TYPE "public"."role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('card', 'bank', 'kakao', 'naver');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('paid', 'failed', 'refunded');--> statement-breakpoint
CREATE ROLE "admin";--> statement-breakpoint
CREATE TABLE "addresses" (
	"address_id" serial PRIMARY KEY NOT NULL,
	"profile_id" uuid,
	"address_name" text NOT NULL,
	"address" text NOT NULL,
	"zipcode" varchar(10) NOT NULL,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "addresses" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profiles" (
	"profile_id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"role" "role" DEFAULT 'user' NOT NULL,
	"email_consent" boolean NOT NULL,
	"phone_consent" boolean NOT NULL,
	"agree_terms" boolean NOT NULL,
	"agree_privacy" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "cart" (
	"cart_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cart_cart_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "cart" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "cart_items" (
	"cart_item_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cart_items_cart_item_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"cart_id" bigint,
	"product_id" bigint NOT NULL,
	"quantity" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cart_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "categories" (
	"category_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "categories_category_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "order_cancellations" (
	"cancel_id" serial PRIMARY KEY NOT NULL,
	"order_id" bigint,
	"reason" text,
	"requested_at" timestamp DEFAULT now(),
	"approved" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "order_cancellations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "order_items" (
	"order_item_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "order_items_order_item_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"order_id" bigint,
	"product_id" bigint NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric(10, 2)
);
--> statement-breakpoint
ALTER TABLE "order_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "order_refunds" (
	"refund_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "order_refunds_refund_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"payment_id" bigint,
	"reason" text,
	"refunded_at" timestamp,
	"amount" numeric(10, 2)
);
--> statement-breakpoint
ALTER TABLE "order_refunds" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "orders" (
	"order_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "orders_order_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"profile_id" uuid,
	"order_date" timestamp DEFAULT now() NOT NULL,
	"order_status" "order_status" DEFAULT 'pending' NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"address_id" bigint,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "payments" (
	"payment_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "payments_payment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"order_id" bigint,
	"payment_key" text NOT NULL,
	"order_name" text NOT NULL,
	"customer_name" text,
	"customer_email" text,
	"status" "payment_status" DEFAULT 'paid',
	"method" "payment_method",
	"amount" numeric(10, 2) NOT NULL,
	"paid_at" timestamp,
	"card_company" text,
	"card_number" text,
	"receipt_url" text,
	"requested_at" timestamp DEFAULT now(),
	CONSTRAINT "payments_payment_key_unique" UNIQUE("payment_key")
);
--> statement-breakpoint
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "product_images" (
	"product_image_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_images_product_image_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"product_id" bigint,
	"image_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product_images" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "product" (
	"product_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_product_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"category_id" bigint,
	"stock" integer DEFAULT 0 NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"thumbnail_url" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "reviews" (
	"review_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "reviews_review_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"profile_id" uuid,
	"product_id" bigint,
	"rating" integer NOT NULL,
	"comment" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reviews" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "shipping" (
	"shipping_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "shipping_shipping_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"order_id" bigint,
	"shipped_at" timestamp,
	"delivered_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "shipping" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_profile_id_users_id_fk" FOREIGN KEY ("profile_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_profiles_profile_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_cart_cart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."cart"("cart_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_cancellations" ADD CONSTRAINT "order_cancellations_order_id_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_refunds" ADD CONSTRAINT "order_refunds_payment_id_payments_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("payment_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_address_id_addresses_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("address_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("category_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipping" ADD CONSTRAINT "shipping_order_id_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "authenticated can select own address" ON "addresses" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("addresses"."profile_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can update own address" ON "addresses" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("addresses"."profile_id" = auth.uid()) WITH CHECK ("addresses"."profile_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can delete own address" ON "addresses" AS PERMISSIVE FOR DELETE TO "authenticated" USING ("addresses"."profile_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can insert own address" ON "addresses" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ("addresses"."profile_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can select own profile" ON "profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("profiles"."profile_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can update own profile except role" ON "profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("profiles"."profile_id" = auth.uid() AND "profiles"."role" = 'user') WITH CHECK ("profiles"."profile_id" = auth.uid() AND "profiles"."role" = 'user');--> statement-breakpoint
CREATE POLICY "only admin can update role" ON "profiles" AS PERMISSIVE FOR UPDATE TO "admin" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "authenticated can delete own profile" ON "profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ("profiles"."profile_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "service can insert any profile" ON "profiles" AS PERMISSIVE FOR INSERT TO "service_role" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "authenticated can select own cart" ON "cart" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("cart"."user_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can insert own cart" ON "cart" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ("cart"."user_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can update own cart" ON "cart" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("cart"."user_id" = auth.uid()) WITH CHECK ("cart"."user_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can delete own cart" ON "cart" AS PERMISSIVE FOR DELETE TO "authenticated" USING ("cart"."user_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can select own cart items" ON "cart_items" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("cart_items"."cart_id" IN (SELECT cart_id FROM cart WHERE user_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "authenticated can insert own cart items" ON "cart_items" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ("cart_items"."cart_id" IN (SELECT cart_id FROM cart WHERE user_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "authenticated can update own cart items" ON "cart_items" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("cart_items"."cart_id" IN (SELECT cart_id FROM cart WHERE user_id = auth.uid())) WITH CHECK ("cart_items"."cart_id" IN (SELECT cart_id FROM cart WHERE user_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "authenticated can delete own cart items" ON "cart_items" AS PERMISSIVE FOR DELETE TO "authenticated" USING ("cart_items"."cart_id" IN (SELECT cart_id FROM cart WHERE user_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "public can select categories" ON "categories" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "admin can insert categories" ON "categories" AS PERMISSIVE FOR INSERT TO "admin" WITH CHECK (auth.role() = 'admin');--> statement-breakpoint
CREATE POLICY "admin can update categories" ON "categories" AS PERMISSIVE FOR UPDATE TO "admin" USING (auth.role() = 'admin') WITH CHECK (auth.role() = 'admin');--> statement-breakpoint
CREATE POLICY "admin can delete categories" ON "categories" AS PERMISSIVE FOR DELETE TO "admin" USING (auth.role() = 'admin');--> statement-breakpoint
CREATE POLICY "authenticated can select own order cancellations" ON "order_cancellations" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("order_cancellations"."order_id" IN (SELECT order_id FROM orders WHERE profile_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "authenticated can insert own order cancellations" ON "order_cancellations" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ("order_cancellations"."order_id" IN (SELECT order_id FROM orders WHERE profile_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "authenticated can update own order cancellations" ON "order_cancellations" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("order_cancellations"."order_id" IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())) WITH CHECK ("order_cancellations"."order_id" IN (SELECT order_id FROM orders WHERE profile_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "authenticated can delete own order cancellations" ON "order_cancellations" AS PERMISSIVE FOR DELETE TO "authenticated" USING ("order_cancellations"."order_id" IN (SELECT order_id FROM orders WHERE profile_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "authenticated can select own order items" ON "order_items" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("order_items"."order_id" IN (SELECT order_id FROM orders WHERE profile_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "authenticated can insert own order items" ON "order_items" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ("order_items"."order_id" IN (SELECT order_id FROM orders WHERE profile_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "authenticated can update own order items" ON "order_items" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("order_items"."order_id" IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())) WITH CHECK ("order_items"."order_id" IN (SELECT order_id FROM orders WHERE profile_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "authenticated can delete own order items" ON "order_items" AS PERMISSIVE FOR DELETE TO "authenticated" USING ("order_items"."order_id" IN (SELECT order_id FROM orders WHERE profile_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "authenticated can select own order refunds" ON "order_refunds" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("order_refunds"."payment_id" IN (SELECT payment_id FROM payments WHERE order_id IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())));--> statement-breakpoint
CREATE POLICY "authenticated can insert own order refunds" ON "order_refunds" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ("order_refunds"."payment_id" IN (SELECT payment_id FROM payments WHERE order_id IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())));--> statement-breakpoint
CREATE POLICY "authenticated can update own order refunds" ON "order_refunds" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("order_refunds"."payment_id" IN (SELECT payment_id FROM payments WHERE order_id IN (SELECT order_id FROM orders WHERE profile_id = auth.uid()))) WITH CHECK ("order_refunds"."payment_id" IN (SELECT payment_id FROM payments WHERE order_id IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())));--> statement-breakpoint
CREATE POLICY "authenticated can delete own order refunds" ON "order_refunds" AS PERMISSIVE FOR DELETE TO "authenticated" USING ("order_refunds"."payment_id" IN (SELECT payment_id FROM payments WHERE order_id IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())));--> statement-breakpoint
CREATE POLICY "authenticated can select own orders" ON "orders" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("orders"."profile_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can insert own orders" ON "orders" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ("orders"."profile_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can update own orders" ON "orders" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("orders"."profile_id" = auth.uid()) WITH CHECK ("orders"."profile_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can delete own orders" ON "orders" AS PERMISSIVE FOR DELETE TO "authenticated" USING ("orders"."profile_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can select own payments" ON "payments" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("payments"."order_id" IN (SELECT order_id FROM orders WHERE profile_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "authenticated can insert own payments" ON "payments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ("payments"."order_id" IN (SELECT order_id FROM orders WHERE profile_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "authenticated can update own payments" ON "payments" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("payments"."order_id" IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())) WITH CHECK ("payments"."order_id" IN (SELECT order_id FROM orders WHERE profile_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "authenticated can delete own payments" ON "payments" AS PERMISSIVE FOR DELETE TO "authenticated" USING ("payments"."order_id" IN (SELECT order_id FROM orders WHERE profile_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "public can select product_images" ON "product_images" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "admin can insert product_images" ON "product_images" AS PERMISSIVE FOR INSERT TO "admin" WITH CHECK (auth.role() = 'admin');--> statement-breakpoint
CREATE POLICY "admin can update product_images" ON "product_images" AS PERMISSIVE FOR UPDATE TO "admin" USING (auth.role() = 'admin') WITH CHECK (auth.role() = 'admin');--> statement-breakpoint
CREATE POLICY "admin can delete product_images" ON "product_images" AS PERMISSIVE FOR DELETE TO "admin" USING (auth.role() = 'admin');--> statement-breakpoint
CREATE POLICY "public can select products" ON "product" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "admin can insert products" ON "product" AS PERMISSIVE FOR INSERT TO "admin" WITH CHECK (auth.role() = 'admin');--> statement-breakpoint
CREATE POLICY "admin can update products" ON "product" AS PERMISSIVE FOR UPDATE TO "admin" USING (auth.role() = 'admin') WITH CHECK (auth.role() = 'admin');--> statement-breakpoint
CREATE POLICY "admin can delete products" ON "product" AS PERMISSIVE FOR DELETE TO "admin" USING (auth.role() = 'admin');--> statement-breakpoint
CREATE POLICY "authenticated can select own reviews" ON "reviews" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("reviews"."profile_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can insert own reviews" ON "reviews" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ("reviews"."profile_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can update own reviews" ON "reviews" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("reviews"."profile_id" = auth.uid()) WITH CHECK ("reviews"."profile_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can delete own reviews" ON "reviews" AS PERMISSIVE FOR DELETE TO "authenticated" USING ("reviews"."profile_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can select own shipping" ON "shipping" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("shipping"."order_id" IN (SELECT order_id FROM orders WHERE profile_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "authenticated can insert own shipping" ON "shipping" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ("shipping"."order_id" IN (SELECT order_id FROM orders WHERE profile_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "authenticated can update own shipping" ON "shipping" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("shipping"."order_id" IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())) WITH CHECK ("shipping"."order_id" IN (SELECT order_id FROM orders WHERE profile_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "authenticated can delete own shipping" ON "shipping" AS PERMISSIVE FOR DELETE TO "authenticated" USING ("shipping"."order_id" IN (SELECT order_id FROM orders WHERE profile_id = auth.uid()));