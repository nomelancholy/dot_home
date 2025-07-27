import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/features/**/schema.ts",
  out: "./src/sql/migrations",
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
