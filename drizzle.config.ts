import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schemas",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "expo", // <--- very important
});
