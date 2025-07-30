import {
  serial,
  bigint,
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  pgPolicy,
} from "drizzle-orm/pg-core";

import { authenticatedRole } from "drizzle-orm/supabase";

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
    // 모두 조회 가능
    pgPolicy("public can select categories", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),

    // admin만 등록 가능
    pgPolicy("admin can insert categories", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`EXISTS (SELECT 1 FROM profiles WHERE profile_id = auth.uid() AND role = 'admin')`,
    }),

    // admin만 수정 가능
    pgPolicy("admin can update categories", {
      for: "update",
      to: authenticatedRole,
      using: sql`EXISTS (SELECT 1 FROM profiles WHERE profile_id = auth.uid() AND role = 'admin')`,
      withCheck: sql`EXISTS (SELECT 1 FROM profiles WHERE profile_id = auth.uid() AND role = 'admin')`,
    }),

    // admin만 삭제 가능
    pgPolicy("admin can delete categories", {
      for: "delete",
      to: authenticatedRole,
      using: sql`EXISTS (SELECT 1 FROM profiles WHERE profile_id = auth.uid() AND role = 'admin')`,
    }),
  ]
);

export const products = pgTable(
  "products",
  {
    product_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    name: text().notNull(),
    unique_name: text().notNull().unique(),
    category_id: bigint({ mode: "number" }).references(
      () => categories.category_id,
      { onDelete: "set null" }
    ),
    stock: integer("stock").notNull().default(0),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    product_image_1: text().notNull(),
    product_image_2: text(),
    product_image_3: text(),
    product_image_4: text(),
    product_image_5: text(),
    detail_page_image_1: text().notNull(),
    detail_page_image_2: text(),
    detail_page_image_3: text(),
    detail_page_image_4: text(),
    detail_page_image_5: text(),
    purchase_link: text(),
    description: text(),
    detail: text(),
    exchange_refund_policy: text(),
    shipping_policy: text(),
    caution: text(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("public can select products", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),
    pgPolicy("admin can insert products", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`EXISTS (SELECT 1 FROM profiles WHERE profile_id = auth.uid() AND role = 'admin')`,
    }),
    pgPolicy("admin can update products", {
      for: "update",
      to: authenticatedRole,
      using: sql`EXISTS (SELECT 1 FROM profiles WHERE profile_id = auth.uid() AND role = 'admin')`,
      withCheck: sql`EXISTS (SELECT 1 FROM profiles WHERE profile_id = auth.uid() AND role = 'admin')`,
    }),
    pgPolicy("admin can delete products", {
      for: "delete",
      to: authenticatedRole,
      using: sql`EXISTS (SELECT 1 FROM profiles WHERE profile_id = auth.uid() AND role = 'admin')`,
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
    profile_id: uuid("profile_id").references(() => profiles.profile_id, {
      onDelete: "cascade",
    }),
    product_id: bigint({ mode: "number" })
      .references(() => products.product_id)
      .notNull(),
    quantity: integer("quantity").notNull(),
  },
  (table) => [
    pgPolicy("authenticated can select cart items", {
      for: "select",
      to: authenticatedRole,
      using: sql`${table.profile_id} = auth.uid()`,
    }),
    pgPolicy("authenticated can insert cart items", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${table.profile_id} = auth.uid()`,
    }),
    pgPolicy("authenticated can update cart items", {
      for: "update",
      to: authenticatedRole,
      using: sql`${table.profile_id} = auth.uid()`,
      withCheck: sql`${table.profile_id} = auth.uid()`,
    }),
    pgPolicy("authenticated can delete cart items", {
      for: "delete",
      to: authenticatedRole,
      using: sql`${table.profile_id} = auth.uid()`,
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
    pgPolicy("authenticated can select orders", {
      for: "select",
      to: authenticatedRole,
      using: sql`${table.profile_id} = auth.uid()`,
    }),
    pgPolicy("authenticated can insert orders", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${table.profile_id} = auth.uid()`,
    }),
    pgPolicy("authenticated can update orders", {
      for: "update",
      to: authenticatedRole,
      using: sql`${table.profile_id} = auth.uid()`,
      withCheck: sql`${table.profile_id} = auth.uid()`,
    }),
    pgPolicy("authenticated can delete orders", {
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
    pgPolicy("authenticated can select order items", {
      for: "select",
      to: authenticatedRole,
      using: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
    }),
    pgPolicy("admin can select order items", {
      for: "select",
      to: authenticatedRole,
      using: sql`EXISTS (SELECT 1 FROM profiles WHERE profile_id = auth.uid() AND role = 'admin')`,
    }),
    pgPolicy("authenticated can insert order items", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
    }),
    pgPolicy("authenticated can update order items", {
      for: "update",
      to: authenticatedRole,
      using: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
      withCheck: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
    }),
    pgPolicy("authenticated can delete order items", {
      for: "delete",
      to: authenticatedRole,
      using: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
    }),
    pgPolicy("admin can delete order items", {
      for: "delete",
      to: authenticatedRole,
      using: sql`EXISTS (SELECT 1 FROM profiles WHERE profile_id = auth.uid() AND role = 'admin')`,
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
    pgPolicy("authenticated can select order cancellations", {
      for: "select",
      to: authenticatedRole,
      using: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
    }),
    pgPolicy("admin can select order cancellations", {
      for: "select",
      to: authenticatedRole,
      using: sql`EXISTS (SELECT 1 FROM profiles WHERE profile_id = auth.uid() AND role = 'admin')`,
    }),
    pgPolicy("authenticated can insert order cancellations", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
    }),
    pgPolicy("admin can insert order cancellations", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`EXISTS (SELECT 1 FROM profiles WHERE profile_id = auth.uid() AND role = 'admin')`,
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
    pgPolicy("authenticated can select payments", {
      for: "select",
      to: authenticatedRole,
      using: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
    }),
    pgPolicy("admin can select payments", {
      for: "select",
      to: authenticatedRole,
      using: sql`EXISTS (SELECT 1 FROM profiles WHERE profile_id = auth.uid() AND role = 'admin')`,
    }),
    pgPolicy("authenticated can insert payments", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
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
    order_id: bigint({ mode: "number" }).references(() => orders.order_id, {
      onDelete: "cascade",
    }),
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
    pgPolicy("authenticated can select order refunds", {
      for: "select",
      to: authenticatedRole,
      using: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
    }),
    pgPolicy("admin can select order refunds", {
      for: "select",
      to: authenticatedRole,
      using: sql`EXISTS (SELECT 1 FROM profiles WHERE profile_id = auth.uid() AND role = 'admin')`,
    }),
    pgPolicy("admin can insert order refunds", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`EXISTS (SELECT 1 FROM profiles WHERE profile_id = auth.uid() AND role = 'admin')`,
    }),
    pgPolicy("admin can update order refunds", {
      for: "update",
      to: authenticatedRole,
      using: sql`EXISTS (SELECT 1 FROM profiles WHERE profile_id = auth.uid() AND role = 'admin')`,
      withCheck: sql`EXISTS (SELECT 1 FROM profiles WHERE profile_id = auth.uid() AND role = 'admin')`,
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
    pgPolicy("authenticated can select shipping", {
      for: "select",
      to: authenticatedRole,
      using: sql`${table.order_id} IN (SELECT order_id FROM orders WHERE profile_id = auth.uid())`,
    }),
    pgPolicy("admin can select shipping", {
      for: "select",
      to: authenticatedRole,
      using: sql`EXISTS (SELECT 1 FROM profiles WHERE profile_id = auth.uid() AND role = 'admin')`,
    }),
    pgPolicy("admin can insert shipping", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`EXISTS (SELECT 1 FROM profiles WHERE profile_id = auth.uid() AND role = 'admin')`,
    }),
    pgPolicy("admin can update shipping", {
      for: "update",
      to: authenticatedRole,
      using: sql`EXISTS (SELECT 1 FROM profiles WHERE profile_id = auth.uid() AND role = 'admin')`,
      withCheck: sql`EXISTS (SELECT 1 FROM profiles WHERE profile_id = auth.uid() AND role = 'admin')`,
    }),
    pgPolicy("admin can delete shipping", {
      for: "delete",
      to: authenticatedRole,
      using: sql`EXISTS (SELECT 1 FROM profiles WHERE profile_id = auth.uid() AND role = 'admin')`,
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
    pgPolicy("public can select reviews", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),
    pgPolicy("authenticated can insert reviews", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${table.profile_id} = auth.uid()`,
    }),
    pgPolicy("authenticated can update reviews", {
      for: "update",
      to: authenticatedRole,
      using: sql`${table.profile_id} = auth.uid()`,
      withCheck: sql`${table.profile_id} = auth.uid()`,
    }),
    pgPolicy("authenticated can delete reviews", {
      for: "delete",
      to: authenticatedRole,
      using: sql`${table.profile_id} = auth.uid()`,
    }),
    pgPolicy("admin can delete reviews", {
      for: "delete",
      to: authenticatedRole,
      using: sql`EXISTS (SELECT 1 FROM profiles WHERE profile_id = auth.uid() AND role = 'admin')`,
    }),
  ]
);
