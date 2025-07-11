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
  varchar,
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
  email: text("").notNull().unique(),
  role: roles().default("user").notNull(),
  email_consent: boolean().notNull(),
  phone_consent: boolean().notNull(),
  agree_terms: boolean().notNull(),
  agree_privacy: boolean().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const addresses = pgTable("addresses", {
  address_id: serial("address_id").primaryKey(),
  profile_id: uuid().references(() => profiles.profile_id, {
    onDelete: "cascade",
  }),
  address_name: text().notNull(),
  address: text().notNull(),
  zipcode: varchar("zipcode", { length: 10 }).notNull(),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
