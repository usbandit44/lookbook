import { itemTypes } from "@/constants/constants";
import { sql } from "drizzle-orm";
import { customType, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/** Stored as JSON text; avoids Drizzle `mode: "json"` throwing on legacy/corrupt cells. */
const stringArrayJson = customType<{ data: string[]; driverData: string }>({
  dataType() {
    return "text";
  },
  fromDriver(value) {
    if (value == null || value === "") return [];
    try {
      const parsed: unknown = JSON.parse(value);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((x): x is string => typeof x === "string");
    } catch {
      return [];
    }
  },
  toDriver(value) {
    return JSON.stringify(Array.isArray(value) ? value : []);
  },
});

export const items = sqliteTable("items", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  type: text("type", {
    enum: Object.values(itemTypes) as [string, ...string[]],
  }).notNull(),
  color: text(),
  size: text().$default(() => ""),
  tags: stringArrayJson("tags")
    .notNull()
    .default(sql`(json_array())`),
  imgUrl: text().notNull(),
  backgroundRemoved: integer("updateImgUrl", { mode: "boolean" })
    .notNull()
    .default(true),
});

export type ItemsType = Omit<typeof items.$inferSelect, "size"> & {
  size?: string | null;
};
