import { itemTypes } from "@/constants/constants";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const items = sqliteTable("items", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  type: text("type", {
    enum: Object.values(itemTypes) as [string, ...string[]],
  }).notNull(),
  size: text(),
  imgUrl: text().notNull(),
  backgroundRemoved: integer("updateImgUrl", { mode: "boolean" })
    .notNull()
    .default(false),
});

export type ItemsType = typeof items.$inferSelect;
