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

  async getAllTopIds(): Promise<number[]> {
    try {
      const result = await this.drizzleDb
        .select()
        .from(items)
        .where(eq(items.type, "Tops"));
      if (result == null) {
        throw new Error("No Tops have been saved");
      }
      const ids = result.map((item) => item.id);
      return ids;
    } catch (error) {
      console.error("Failed to get item:", error);
      throw error;
    }
  }
  async getAllBottomIds(): Promise<number[]> {
    try {
      const result = await this.drizzleDb
        .select()
        .from(items)
        .where(eq(items.type, "Bottoms"));
      if (result == null) {
        throw new Error("No Bottoms have been saved");
      }
      const ids = result.map((item) => item.id);
      return ids;
    } catch (error) {
      console.error("Failed to get item:", error);
      throw error;
    }
  }
  async getAllOuterwearIds(): Promise<number[]> {
    try {
      const result = await this.drizzleDb
        .select()
        .from(items)
        .where(eq(items.type, "Outerwear"));
      if (result == null) {
        throw new Error("No Outerwear have been saved");
      }
      const ids = result.map((item) => item.id);
      return ids;
    } catch (error) {
      console.error("Failed to get item:", error);
      throw error;
    }
  }
  async getAllShoeIds(): Promise<number[]> {
    try {
      const result = await this.drizzleDb
        .select()
        .from(items)
        .where(eq(items.type, "Shoes"));
      if (result == null) {
        throw new Error("No Shoes have been saved");
      }
      const ids = result.map((item) => item.id);
      return ids;
    } catch (error) {
      console.error("Failed to get item:", error);
      throw error;
    }
  }
  async getAllEyewearIds(): Promise<number[]> {
    try {
      const result = await this.drizzleDb
        .select()
        .from(items)
        .where(eq(items.type, "Eyewear"));
      if (result == null) {
        throw new Error("No Eyewear have been saved");
      }
      const ids = result.map((item) => item.id);
      return ids;
    } catch (error) {
      console.error("Failed to get item:", error);
      throw error;
    }
  }
  async getAllHeadwearIds(): Promise<number[]> {
    try {
      const result = await this.drizzleDb
        .select()
        .from(items)
        .where(eq(items.type, "Headwear"));
      if (result == null) {
        throw new Error("No Headwear have been saved");
      }
      const ids = result.map((item) => item.id);
      return ids;
    } catch (error) {
      console.error("Failed to get item:", error);
      throw error;
    }
  }
  async getAllNecklaceIds(): Promise<number[]> {
    try {
      const result = await this.drizzleDb
        .select()
        .from(items)
        .where(eq(items.type, "Necklaces"));
      if (result == null) {
        throw new Error("No Necklaces have been saved");
      }
      const ids = result.map((item) => item.id);
      return ids;
    } catch (error) {
      console.error("Failed to get item:", error);
      throw error;
    }
  }
  async getAllWristwearIds(): Promise<number[]> {
    try {
      const result = await this.drizzleDb
        .select()
        .from(items)
        .where(eq(items.type, "Wrist Wear"));
      if (result == null) {
        throw new Error("No Wrist Wear have been saved");
      }
      const ids = result.map((item) => item.id);
      return ids;
    } catch (error) {
      console.error("Failed to get item:", error);
      throw error;
    }
  }
}

export default SqliteItemRepo;
