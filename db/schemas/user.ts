import { sql } from "drizzle-orm";
import { customType, integer, sqliteTable } from "drizzle-orm/sqlite-core";

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

export const user = sqliteTable("user", {
  completedTutorial: integer({ mode: "boolean" }).default(false).notNull(),
  customTags: stringArrayJson("customTags")
    .notNull()
    .default(sql`(json_array())`),
});

export type UserType = typeof user.$inferSelect;
