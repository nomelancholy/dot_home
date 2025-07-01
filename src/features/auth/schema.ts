import {
  pgTable,
  serial,
  text,
  timestamp,
  pgSchema,
  uuid,
  pgEnum,
  boolean,
  bigint,
} from "drizzle-orm/pg-core";

const users = pgSchema("auth").table("users", {
  id: uuid("id").primaryKey(),
});

export const roles = pgEnum("role", ["admin", "user"]);

export const profiles = pgTable("profiles", {
  profile_id: uuid()
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text().notNull(),
  phone: text().notNull(),
  nickname: text("").notNull(),
  email: text("").notNull().unique(),
  role: roles().default("user").notNull(),
  email_receive_agree: boolean().notNull(),
  sms_receive_agree: boolean().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const addresses = pgTable("addresses", {
  address_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  profile_id: uuid().references(() => profiles.profile_id, {
    onDelete: "cascade",
  }),
  address_name: text().notNull(),
  address: text().notNull(),
  zipcode: text().notNull(),
  is_default: boolean().notNull(),
});
