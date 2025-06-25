import { bigint, integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";

export const products = pgTable("product", {
  product_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  name: text().notNull(),
  price: integer().notNull(),
  description: text().notNull(),
});
