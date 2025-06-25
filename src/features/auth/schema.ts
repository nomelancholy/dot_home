import {
  pgTable,
  serial,
  text,
  timestamp,
  pgSchema,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";

const users = pgSchema("auth").table("users", {
  id: uuid("id").primaryKey(),
});

export const roles = pgEnum("role", ["admin", "user"]);

export const profiles = pgTable("profiles", {
  profile_id: uuid()
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: roles().default("user").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
