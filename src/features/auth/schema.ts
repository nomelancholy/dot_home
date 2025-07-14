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
  pgRole,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";
import { authenticatedRole, serviceRole } from "drizzle-orm/supabase";
import { pgPolicy } from "drizzle-orm/pg-core";

export const adminRole = pgRole("admin");

const users = pgSchema("auth").table("users", {
  id: uuid("id").primaryKey(),
});

export const roles = pgEnum("role", ["admin", "user"]);

export const profiles = pgTable(
  "profiles",
  {
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
  },
  (table) => [
    // 본인만 조회
    pgPolicy("authenticated can select own profile", {
      for: "select",
      to: authenticatedRole,
      using: sql`${table.profile_id} = auth.uid()`,
    }),
    // 본인만 수정 (role은 항상 'user'여야 함)
    pgPolicy("authenticated can update own profile except role", {
      for: "update",
      to: authenticatedRole,
      using: sql`${table.profile_id} = auth.uid() AND ${table.role} = 'user'`,
      withCheck: sql`${table.profile_id} = auth.uid() AND ${table.role} = 'user'`,
    }),
    // admin만 role 변경 가능
    pgPolicy("only admin can update role", {
      for: "update",
      to: adminRole,
      using: sql`true`,
      withCheck: sql`true`,
    }),
    // 본인만 삭제
    pgPolicy("authenticated can delete own profile", {
      for: "delete",
      to: authenticatedRole,
      using: sql`${table.profile_id} = auth.uid()`,
    }),
  ]
);

export const addresses = pgTable(
  "addresses",
  {
    address_id: serial("address_id").primaryKey(),
    profile_id: uuid().references(() => profiles.profile_id, {
      onDelete: "cascade",
    }),
    address_name: text().notNull(),
    address: text().notNull(),
    zipcode: varchar("zipcode", { length: 10 }).notNull(),
    isDefault: boolean("is_default").default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    // 본인만 조회/수정/삭제
    pgPolicy("authenticated can select own address", {
      for: "select",
      to: authenticatedRole,
      using: sql`${table.profile_id} = auth.uid()`,
    }),
    pgPolicy("authenticated can update own address", {
      for: "update",
      to: authenticatedRole,
      using: sql`${table.profile_id} = auth.uid()`,
      withCheck: sql`${table.profile_id} = auth.uid()`,
    }),
    pgPolicy("authenticated can delete own address", {
      for: "delete",
      to: authenticatedRole,
      using: sql`${table.profile_id} = auth.uid()`,
    }),
    pgPolicy("authenticated can insert own address", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${table.profile_id} = auth.uid()`,
    }),
  ]
);
