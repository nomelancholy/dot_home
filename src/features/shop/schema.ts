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
} from "drizzle-orm/pg-core";

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

export const categories = pgTable("categories", {
  category_id: bigint("category_id", { mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  name: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const products = pgTable("product", {
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
});

export const product_images = pgTable("product_images", {
  product_image_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  product_id: bigint({ mode: "number" }).references(() => products.product_id, {
    onDelete: "cascade",
  }),
  image_url: text().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Cart
export const cart = pgTable("cart", {
  cart_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  user_id: uuid("user_id")
    .references(() => profiles.profile_id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cart Items
export const cartItems = pgTable("cart_items", {
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
});

export const orders = pgTable("orders", {
  order_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
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
});

// Order Items
export const orderItems = pgTable("order_items", {
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
});

export const orderCancellations = pgTable("order_cancellations", {
  cancelId: serial("cancel_id").primaryKey(),
  order_id: bigint({ mode: "number" }).references(() => orders.order_id, {
    onDelete: "cascade",
  }),
  reason: text("reason"),
  requestedAt: timestamp("requested_at").defaultNow(),
  approved: boolean("approved").default(false),
});

// Refunds
export const orderRefunds = pgTable("order_refunds", {
  refund_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  payment_id: bigint({ mode: "number" }).references(() => payments.payment_id, {
    onDelete: "cascade",
  }),
  reason: text("reason"),
  refundedAt: timestamp("refunded_at"),
  amount: numeric("amount", { precision: 10, scale: 2 }),
});

// Shipping
export const shipping = pgTable("shipping", {
  shipping_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  order_id: bigint({ mode: "number" }).references(() => orders.order_id, {
    onDelete: "cascade",
  }),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
});

export const reviews = pgTable("reviews", {
  review_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  profile_id: uuid().references(() => profiles.profile_id, {
    onDelete: "cascade",
  }),
  product_id: bigint({ mode: "number" }).references(() => products.product_id, {
    onDelete: "cascade",
  }),
  rating: integer().notNull(),
  comment: text().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const payments = pgTable("payments", {
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
});
