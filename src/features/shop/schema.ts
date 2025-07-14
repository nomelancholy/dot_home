import {
  serial,
  bigint,
  boolean,
  integer,
  numeric,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  pgPolicy,
} from "drizzle-orm/pg-core";

import { authenticatedRole, serviceRole } from "drizzle-orm/supabase";

import { sql } from "drizzle-orm";

import { addresses, profiles } from "../auth/schema";

// Enums
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
]);
export const paymentMethodEnum = pgEnum("payment_method", [
  "card",
  "bank",
  "kakao",
  "naver",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "paid",
  "failed",
  "refunded",
]);

export const categories = pgTable(
  "categories",
  {
    category_id: bigint("category_id", { mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    name: text().notNull(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("public can select categories", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),
    pgPolicy("admin can insert categories", {
      for: "insert",
      to: "admin",
      withCheck: sql`auth.role() = 'admin'`,
    }),
    pgPolicy("admin can update categories", {
      for: "update",
      to: "admin",
      using: sql`auth.role() = 'admin'`,
      withCheck: sql`auth.role() = 'admin'`,
    }),
    pgPolicy("admin can delete categories", {
      for: "delete",
      to: "admin",
      using: sql`auth.role() = 'admin'`,
    }),
  ]
);

export const products = pgTable(
  "product",
  {
    product_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    name: text().notNull(),
    category_id: bigint({ mode: "number" }).references(
      () => categories.category_id,
      { onDelete: "set null" }
    ),
    stock: integer("stock").notNull().default(0),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    thumbnail_url: text().notNull(),
    description: text().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    // 모두 조회 가능
    pgPolicy("public can select products", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),
    // admin만 등록/수정/삭제 가능
    pgPolicy("admin can insert products", {
      for: "insert",
      to: "admin",
      withCheck: sql`auth.role() = 'admin'`,
    }),
    pgPolicy("admin can update products", {
      for: "update",
      to: "admin",
      using: sql`auth.role() = 'admin'`,
      withCheck: sql`auth.role() = 'admin'`,
    }),
    pgPolicy("admin can delete products", {
      for: "delete",
      to: "admin",
      using: sql`auth.role() = 'admin'`,
    }),
  ]
);

export const product_images = pgTable(
  "product_images",
  {
    product_image_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    product_id: bigint({ mode: "number" }).references(
      () => products.product_id,
      {
        onDelete: "cascade",
      }
    ),
    image_url: text().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("public can select product_images", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),
    pgPolicy("admin can insert product_images", {
      for: "insert",
      to: "admin",
      withCheck: sql`auth.role() = 'admin'`,
    }),
    pgPolicy("admin can update product_images", {
      for: "update",
      to: "admin",
      using: sql`auth.role() = 'admin'`,
      withCheck: sql`auth.role() = 'admin'`,
    }),
    pgPolicy("admin can delete product_images", {
      for: "delete",
      to: "admin",
      using: sql`auth.role() = 'admin'`,
    }),
  ]
);

// Cart
export const cart = pgTable(
  "cart",
  {
    cart_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    user_id: uuid("user_id")
      .references(() => profiles.profile_id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    pgPolicy("authenticated can select own cart", {
      for: "select",
      to: authenticatedRole,
      using: sql`${table.user_id} = auth.uid()`,
    }),
    pgPolicy("authenticated can insert own cart", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${table.user_id} = auth.uid()`,
    }),
    pgPolicy("authenticated can update own cart", {
      for: "update",
      to: authenticatedRole,
      using: sql`${table.user_id} = auth.uid()`,
      withCheck: sql`${table.user_id} = auth.uid()`,
    }),
    pgPolicy("authenticated can delete own cart", {
      for: "delete",
      to: authenticatedRole,
      using: sql`${table.user_id} = auth.uid()`,
    }),
  ]
);

// Cart Items
export const cartItems = pgTable(
  "cart_items",
  {
    cart_item_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    cart_id: bigint({ mode: "number" }).references(() => cart.cart_id, {
      onDelete: "cascade",
    }),
    product_id: bigint({ mode: "number" })
      .references(() => products.product_id)
      .notNull(),
    quantity: integer("quantity").notNull(),
  },
  (table) => [
    pgPolicy("authenticated can select own cart items", {
      for: "select",
      to: authenticatedRole,
      using: sql`${table.cart_id} IN (SELECT cart_id FROM cart WHERE user_id = auth.uid())`,
    }),
    pgPolicy("authenticated can insert own cart items", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${table.cart_id} IN (SELECT cart_id FROM cart WHERE user_id = auth.uid())`,
    }),
    pgPolicy("authenticated can update own cart items", {
      for: "update",
      to: authenticatedRole,
      using: sql`${table.cart_id} IN (SELECT cart_id FROM cart WHERE user_id = auth.uid())`,
      withCheck: sql`${table.cart_id} IN (SELECT cart_id FROM cart WHERE user_id = auth.uid())`,
    }),
    pgPolicy("authenticated can delete own cart items", {
      for: "delete",
      to: authenticatedRole,
      using: sql`${table.cart_id} IN (SELECT cart_id FROM cart WHERE user_id = auth.uid())`,
    }),
  ]
);

export const orders = pgTable(
  "orders",
  {
    order_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    profile_id: uuid().references(() => profiles.profile_id, {
      onDelete: "cascade",
    }),
    order_date: timestamp().notNull().defaultNow(),
    order_status: orderStatusEnum().notNull().default("pending"),
    total_price: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
    address_id: bigint({ mode: "number" }).references(
      () => addresses.address_id,
      { onDelete: "cascade" }
    ),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("authenticated can select own orders", {
      for: "select",
      to: authenticatedRole,
      using: sql`${table.profile_id} = auth.uid()`,
    }),
    pgPolicy("authenticated can insert own orders", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${table.profile_id} = auth.uid()`,
    }),
    pgPolicy("authenticated can update own orders", {
      for: "update",
      to: authenticatedRole,
      using: sql`${table.profile_id} = auth.uid()`,
      withCheck: sql`${table.profile_id} = auth.uid()`,
    }),
    pgPolicy("authenticated can delete own orders", {
      for: "delete",
      to: authenticatedRole,
      using: sql`${table.profile_id} = auth.uid()`,
    }),
  ]
);

// Order Items
export const orderItems = pgTable(
  "order_items",
  {
    order_item_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    order_id: bigint({ mode: "number" }).references(() => orders.order_id, {
      onDelete: "cascade",
    }),
    product_id: bigint({ mode: "number" })
      .references(() => products.product_id)
      .notNull(),
    quantity: integer("quantity").notNull(),
    price: numeric("price", { precision: 10, scale: 2 }),
  },
  (table) => [
    pgPolicy("authenticated can select own order items", {
      for: "select",
      to: authenticatedRole,
      using: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
    }),
    pgPolicy("authenticated can insert own order items", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
    }),
    pgPolicy("authenticated can update own order items", {
      for: "update",
      to: authenticatedRole,
      using: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
      withCheck: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
    }),
    pgPolicy("authenticated can delete own order items", {
      for: "delete",
      to: authenticatedRole,
      using: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
    }),
  ]
);

export const orderCancellations = pgTable(
  "order_cancellations",
  {
    cancelId: serial("cancel_id").primaryKey(),
    order_id: bigint({ mode: "number" }).references(() => orders.order_id, {
      onDelete: "cascade",
    }),
    reason: text("reason"),
    requestedAt: timestamp("requested_at").defaultNow(),
    approved: boolean("approved").default(false),
  },
  (table) => [
    pgPolicy("authenticated can select own order cancellations", {
      for: "select",
      to: authenticatedRole,
      using: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
    }),
    pgPolicy("authenticated can insert own order cancellations", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
    }),
    pgPolicy("authenticated can update own order cancellations", {
      for: "update",
      to: authenticatedRole,
      using: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
      withCheck: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
    }),
    pgPolicy("authenticated can delete own order cancellations", {
      for: "delete",
      to: authenticatedRole,
      using: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
    }),
  ]
);

// Refunds
export const orderRefunds = pgTable(
  "order_refunds",
  {
    refund_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    payment_id: bigint({ mode: "number" }).references(
      () => payments.payment_id,
      {
        onDelete: "cascade",
      }
    ),
    reason: text("reason"),
    refundedAt: timestamp("refunded_at"),
    amount: numeric("amount", { precision: 10, scale: 2 }),
  },
  (table) => [
    pgPolicy("authenticated can select own order refunds", {
      for: "select",
      to: authenticatedRole,
      using: sql`${table.payment_id} IN (SELECT payment_id FROM payments WHERE order_id IN (SELECT order_id FROM orders WHERE profile_id = auth.uid()))`,
    }),
    pgPolicy("authenticated can insert own order refunds", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${table.payment_id} IN (SELECT payment_id FROM payments WHERE order_id IN (SELECT order_id FROM orders WHERE profile_id = auth.uid()))`,
    }),
    pgPolicy("authenticated can update own order refunds", {
      for: "update",
      to: authenticatedRole,
      using: sql`${table.payment_id} IN (SELECT payment_id FROM payments WHERE order_id IN (SELECT order_id FROM orders WHERE profile_id = auth.uid()))`,
      withCheck: sql`${table.payment_id} IN (SELECT payment_id FROM payments WHERE order_id IN (SELECT order_id FROM orders WHERE profile_id = auth.uid()))`,
    }),
    pgPolicy("authenticated can delete own order refunds", {
      for: "delete",
      to: authenticatedRole,
      using: sql`${table.payment_id} IN (SELECT payment_id FROM payments WHERE order_id IN (SELECT order_id FROM orders WHERE profile_id = auth.uid()))`,
    }),
  ]
);

// Shipping
export const shipping = pgTable(
  "shipping",
  {
    shipping_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    order_id: bigint({ mode: "number" }).references(() => orders.order_id, {
      onDelete: "cascade",
    }),
    shippedAt: timestamp("shipped_at"),
    deliveredAt: timestamp("delivered_at"),
  },
  (table) => [
    pgPolicy("authenticated can select own shipping", {
      for: "select",
      to: authenticatedRole,
      using: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
    }),
    pgPolicy("authenticated can insert own shipping", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
    }),
    pgPolicy("authenticated can update own shipping", {
      for: "update",
      to: authenticatedRole,
      using: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
      withCheck: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
    }),
    pgPolicy("authenticated can delete own shipping", {
      for: "delete",
      to: authenticatedRole,
      using: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
    }),
  ]
);

export const reviews = pgTable(
  "reviews",
  {
    review_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    profile_id: uuid().references(() => profiles.profile_id, {
      onDelete: "cascade",
    }),
    product_id: bigint({ mode: "number" }).references(
      () => products.product_id,
      {
        onDelete: "cascade",
      }
    ),
    rating: integer().notNull(),
    comment: text().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("authenticated can select own reviews", {
      for: "select",
      to: authenticatedRole,
      using: sql`${table.profile_id} = auth.uid()`,
    }),
    pgPolicy("authenticated can insert own reviews", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${table.profile_id} = auth.uid()`,
    }),
    pgPolicy("authenticated can update own reviews", {
      for: "update",
      to: authenticatedRole,
      using: sql`${table.profile_id} = auth.uid()`,
      withCheck: sql`${table.profile_id} = auth.uid()`,
    }),
    pgPolicy("authenticated can delete own reviews", {
      for: "delete",
      to: authenticatedRole,
      using: sql`${table.profile_id} = auth.uid()`,
    }),
  ]
);

export const payments = pgTable(
  "payments",
  {
    payment_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    order_id: bigint({ mode: "number" }).references(() => orders.order_id, {
      onDelete: "cascade",
    }),

    // 토스페이먼츠 고유 ID들
    paymentKey: text("payment_key").notNull().unique(), // 결제 고유 키
    orderName: text("order_name").notNull(), // 결제 항목 이름
    customerName: text("customer_name"), // 고객명
    customerEmail: text("customer_email"), // 고객 이메일

    // 실제 결제 상태
    status: paymentStatusEnum("status").default("paid"), // paid, failed, refunded
    method: paymentMethodEnum("method"), // card, kakao, 등

    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(), // 총 결제 금액
    paidAt: timestamp("paid_at"),

    // 카드 정보 등
    cardCompany: text("card_company"), // 예: 삼성카드
    cardNumber: text("card_number"), // 마스킹 번호
    receiptUrl: text("receipt_url"), // 영수증 URL

    requestedAt: timestamp("requested_at").defaultNow(),
  },
  (table) => [
    pgPolicy("authenticated can select own payments", {
      for: "select",
      to: authenticatedRole,
      using: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
    }),
    pgPolicy("authenticated can insert own payments", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
    }),
    pgPolicy("authenticated can update own payments", {
      for: "update",
      to: authenticatedRole,
      using: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
      withCheck: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
    }),
    pgPolicy("authenticated can delete own payments", {
      for: "delete",
      to: authenticatedRole,
      using: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
    }),
  ]
);
