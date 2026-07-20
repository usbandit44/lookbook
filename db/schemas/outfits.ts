import { OutfitPositions } from "@/constants/constants";
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const outfits = sqliteTable("outfits", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  items: text("items", { mode: "json" })
    .notNull()
    .$type<string[]>()
    .default(sql`(json_array())`),
  imgUrl: text().notNull(),
  updateImgUrl: integer("updateImgUrl", { mode: "boolean" })
    .notNull()
    .default(false),
  positions: text("positions", { mode: "json" }).$type<OutfitPositions>(),
});

export type OutfitType = typeof outfits.$inferSelect;
