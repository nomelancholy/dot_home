import {
  bigint,
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { addresses, profiles } from "../auth/schema";

export const categories = pgTable("categories", {
  category_id: bigint({ mode: "number" })
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
  price: integer().notNull(),
  soldout: boolean().notNull().default(false),
  thumbnail_url: text().notNull(),
  image1: text().notNull(),
  image2: text().notNull(),
  image3: text().notNull(),
  image4: text().notNull(),
  image5: text().notNull(),
  description: text().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "shipped",
  "delivered",
  "cancelled",
]);

export const orders = pgTable("orders", {
  order_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  profile_id: uuid().references(() => profiles.profile_id, {
    onDelete: "cascade",
  }),
  product_id: bigint({ mode: "number" }).references(() => products.product_id, {
    onDelete: "cascade",
  }),
  order_date: timestamp().notNull().defaultNow(),
  order_status: orderStatusEnum().notNull().default("pending"),
  total_price: integer().notNull(),
  address_id: bigint({ mode: "number" }).references(
    () => addresses.address_id,
    { onDelete: "cascade" }
  ),
});
