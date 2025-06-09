import { bigint, integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { PRODUCT_TYPES } from "./constants";

export const productTypes = pgEnum(
  "product_type",
  PRODUCT_TYPES.map((type) => type.value) as [string, ...string[]]
);

export const products = pgTable("product", {
  product_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  name: text().notNull(),
  price: integer().notNull(),
  description: text().notNull(),
  product_type: productTypes(),
});
