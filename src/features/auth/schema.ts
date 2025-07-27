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
    username: text().notNull().unique(),
    email: text("").notNull().unique(),
    role: roles().notNull().default("user"),
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

    // 회원가입 시 중복 검사를 위해 public이 username과 email 조회 가능
    pgPolicy("public can select username and email for signup check", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),

    // 트리거가 새 사용자 프로필을 생성할 수 있도록 service_role에 INSERT 권한 부여
    pgPolicy("service can insert profiles", {
      for: "insert",
      to: serviceRole,
      withCheck: sql`true`,
    }),

    // 본인만 수정 (role은 항상 'user'여야 함)
    pgPolicy("authenticated can update own profile except role", {
      for: "update",
      to: authenticatedRole,
      using: sql`${table.profile_id} = auth.uid() AND ${table.role} = 'user'`,
      withCheck: sql`${table.profile_id} = auth.uid() AND ${table.role} = 'user'`,
    }),

    // service_role만 role 변경 가능
    pgPolicy("service can update role", {
      for: "update",
      to: serviceRole,
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
    address_name: text().notNull(), // 배송지 이름 (예: "집", "회사")
    recipient_name: text().notNull(), // 수령자 이름
    recipient_phone: text().notNull(), // 수령자 전화번호
    address: text().notNull(), // 주소
    zipcode: varchar("zipcode", { length: 10 }).notNull(),
    isDefault: boolean("is_default").default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("authenticated can select addresses", {
      for: "select",
      to: authenticatedRole,
      using: sql`${table.profile_id} = auth.uid()`,
    }),
    pgPolicy("admin can select addresses", {
      for: "select",
      to: authenticatedRole,
      using: sql`EXISTS (SELECT 1 FROM profiles WHERE profile_id = auth.uid() AND role = 'admin')`,
    }),
    pgPolicy("authenticated can insert addresses", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${table.profile_id} = auth.uid()`,
    }),
    pgPolicy("authenticated can update addresses", {
      for: "update",
      to: authenticatedRole,
      using: sql`${table.profile_id} = auth.uid()`,
    }),
    pgPolicy("authenticated can delete addresses", {
      for: "delete",
      to: authenticatedRole,
      using: sql`${table.profile_id} = auth.uid()`,
    }),
  ]
);
