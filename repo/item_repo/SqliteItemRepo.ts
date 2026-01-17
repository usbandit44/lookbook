import { items, ItemsType } from "@/db/schemas/items";
import ItemRepo from "@/repo/item_repo/ItemRepo";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";

class SqliteItemRepo extends ItemRepo {
  private db = useSQLiteContext();
  private drizzleDb = drizzle(this.db);

  async addItem(item: {
    name: string;
    type: string;
    size: string;
    imgUrl: string;
  }): Promise<number> {
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

  async getItem(id: number): Promise<ItemsType> {
    try {
      const result = await this.drizzleDb
        .select()
        .from(items)
        .where(eq(items.id, id));
      if (result == null) {
        throw new Error("Item doesn't exist");
      }
      return result[0];
    } catch (error) {
      console.error("Failed to get item:", error);
      throw error;
    }
  }

  async countNumberOfItem(): Promise<number> {
    try {
      const result = await this.drizzleDb.$count(items);
      if (result == null) {
        throw new Error("Count failed");
      }
      return result;
    } catch (error) {
      console.error("Failed to add item:", error);
      throw error;
    }
  }

  async getAllTops(): Promise<ItemsType[]> {
    try {
      const result = await this.drizzleDb
        .select()
        .from(items)
        .where(eq(items.type, "Tops"));
      if (result == null) {
        throw new Error("No Tops have been saved");
      }
      return result;
    } catch (error) {
      console.error("Failed to get item:", error);
      throw error;
    }
  }
  getAllBottoms(): Promise<ItemsType[]> {
    throw new Error("Method not implemented.");
  }
  getAllOuterwear(): Promise<ItemsType[]> {
    throw new Error("Method not implemented.");
  }
  getAllShoes(): Promise<ItemsType[]> {
    throw new Error("Method not implemented.");
  }
  getAllEyewear(): Promise<ItemsType[]> {
    throw new Error("Method not implemented.");
  }
  getAllHeadwear(): Promise<ItemsType[]> {
    throw new Error("Method not implemented.");
  }
  getAllNecklaces(): Promise<ItemsType[]> {
    throw new Error("Method not implemented.");
  }
  getAllWristwear(): Promise<ItemsType[]> {
    throw new Error("Method not implemented.");
  }
}

export default SqliteItemRepo;
