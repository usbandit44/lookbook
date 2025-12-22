import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const items = sqliteTable("items", {
  id: integer().primaryKey({ autoIncrement: true }),
  type: text(),
  imgUrl: text(),
});

export type ItemsType = typeof items.$inferSelect;
