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
    backgroundRemoved: boolean;
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

  async getAllAccessoriesIds(): Promise<number[]> {
    try {
      const result = await this.drizzleDb
        .select()
        .from(items)
        .where(eq(items.type, "Accessories"));
      if (result == null) {
        throw new Error("No Accessories have been saved");
      }
      const ids = result.map((item) => item.id);
      return ids;
    } catch (error) {
      console.error("Failed to get item:", error);
      throw error;
    }
  }

  async getAllBeltIds(): Promise<number[]> {
    try {
      const result = await this.drizzleDb
        .select()
        .from(items)
        .where(eq(items.type, "Belt"));
      if (result == null) {
        throw new Error("No Belt have been saved");
      }
      const ids = result.map((item) => item.id);
      return ids;
    } catch (error) {
      console.error("Failed to get item:", error);
      throw error;
    }
  }

  async updateItem(item: ItemsType): Promise<number> {
    try {
      const result = await this.drizzleDb
        .update(items)
        .set({
          imgUrl: item.imgUrl,
          name: item.name,
          size: item.size,
          type: item.type,
        })
        .where(eq(items.id, item.id))
        .returning();
      if (result == null) {
        throw new Error("Item doesn't exist");
      }
      return result[0].id;
    } catch (error) {
      console.error("Failed to update item:", error);
      throw error;
    }
  }
  async deleteItem(id: number): Promise<void> {
    try {
      const result = await this.drizzleDb.delete(items).where(eq(items.id, id));
      console.log(result);
      if (result == null) {
        throw new Error("Count failed");
      }
    } catch (error) {
      console.error("Failed to add item:", error);
      throw error;
    }
  }
}

export default SqliteItemRepo;
