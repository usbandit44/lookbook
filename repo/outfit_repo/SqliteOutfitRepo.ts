import { outfits } from "@/db/schemas/outfits";
import OutfitRepo from "@/repo/outfit_repo/OutfitRepo";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";

class SqliteOutfitRepo extends OutfitRepo {
  private db = useSQLiteContext();
  private drizzleDb = drizzle(this.db);

  async addOutfit(outfit: {
    items: string[];
    name: string;
    imgUrl: string;
  }): Promise<number> {
    try {
      const result = await this.drizzleDb
        .insert(outfits)
        .values(outfit)
        .returning();
      if (result[0].id == null) {
        throw new Error("Insert did not return an id");
      }
      return result[0].id;
    } catch (err) {
      console.error("Failed to add outfit:", err);
      throw err;
    }
  }

  async countNumberOfOutfit(): Promise<number> {
    try {
      const result = await this.drizzleDb.$count(outfits);
      if (result == null) {
        throw new Error("Count failed");
      }
      return result;
    } catch (error) {
      console.error("Failed to add item:", error);
      throw error;
    }
  }

  async deleteOutfit(id: number): Promise<void> {
    try {
      const result = await this.drizzleDb
        .delete(outfits)
        .where(eq(outfits.id, id));
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

export default SqliteOutfitRepo;
