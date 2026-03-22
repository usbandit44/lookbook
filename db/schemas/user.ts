import { integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  completedTutorial: integer({ mode: "boolean" }).default(false).notNull(),
});

export type UserType = typeof user.$inferSelect;
