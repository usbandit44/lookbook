import { PresetTypesType } from "@/constants/constants";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const presets = sqliteTable("presets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  types: text("types", { mode: "json" })
    .$type<PresetTypesType>()
    .notNull()
    .default({}),
  favorited: integer("favorited", { mode: "boolean" }).default(false),
});

export type PresetType = typeof presets.$inferSelect;
