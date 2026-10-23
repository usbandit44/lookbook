import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

export const DATABASE_NAME = "lookbook";

export const expoDb = openDatabaseSync(DATABASE_NAME, {
  enableChangeListener: true, // ✅ lets useLiveQuery see changes
});
export const drizzleDb = drizzle(expoDb);
