import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/features/**/schema.ts",
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
