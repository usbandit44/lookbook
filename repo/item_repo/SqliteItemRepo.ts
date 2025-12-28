import { items } from "@/db/schemas/items";
import ItemRepo from "@/repo/item_repo/ItemRepo";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";

class SqliteItemRepo extends ItemRepo {
  private db = useSQLiteContext();
  private drizzleDb = drizzle(this.db);

  async addItem(item: { type: string; imgUrl: string }): Promise<number> {
    try {
      const result = await this.drizzleDb
        .insert(items)
        .values(item)
        .returning();
      if (result[0].id == null) {
        throw new Error("Insert did not return an id");
      }
      return result[0].id;
    } catch (err) {
      console.error("Failed to add item:", err);
      throw err;
    }
  }
}

export default SqliteItemRepo;
