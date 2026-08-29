import { OutfitPositions } from "@/constants/constants";
import { outfits } from "@/db/schemas/outfits";
import OutfitRepo from "@/repo/outfit_repo/OutfitRepo";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";

class SqliteOutfitRepo extends OutfitRepo {
  private db = useSQLiteContext();
  private drizzleDb = drizzle(this.db);

  async addOutfit(outfit: {
    items: number[];
    name: string;
    imgUrl: string;
    positions: OutfitPositions;
    favorited: boolean;
  }): Promise<number> {
    try {
      const itemsString = outfit.items.map((item) => {
        return item.toString();
      });
      const result = await this.drizzleDb
        .insert(outfits)
        .values({
          name: outfit.name,
          imgUrl: outfit.imgUrl,
          items: itemsString,
          positions: outfit.positions,
        })
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

  async getOutfit(id: number): Promise<{
    id: number;
    name: string;
    items: number[];
    imgUrl: string;
    updateImgUrl: boolean;
    positions: OutfitPositions;
    favorited: boolean;
  }> {
    try {
      const result = await this.drizzleDb
        .select()
        .from(outfits)
        .where(eq(outfits.id, id));
      if (result == null) {
        throw new Error("Outfit doesn't exist");
      }
      const positions = result[0].positions ?? ({} as OutfitPositions);
      const returningOutfit = {
        id: result[0].id,
        name: result[0].name,
        items: result[0].items.map((item) => {
          return parseInt(item, 10);
        }),
        imgUrl: result[0].imgUrl ?? "",
        updateImgUrl: result[0].updateImgUrl,
        positions,
        favorited: result[0].favorited ?? false,
      };
      return returningOutfit;
    } catch (error) {
      console.error("Failed to get outfit:", error);
      throw error;
    }
  }

  async updateOutfitItems(id: number, items: number[]): Promise<number> {
    try {
      const itemsString = items.map((item) => {
        return item.toString();
      });
      const result = await this.drizzleDb
        .update(outfits)
        .set({ items: itemsString })
        .where(eq(outfits.id, id))
        .returning();
      if (result == null) {
        throw new Error("Outfit doesn't exist");
      }
      return result[0].id;
    } catch (error) {
      console.error("Failed to update outfit:", error);
      throw error;
    }
  }

  async updateOutfit(outfit: {
    id: number;
    name: string;
    imgUrl: string;
    items: number[];
    updateImgUrl: boolean;
    positions: OutfitPositions;
    favorited: boolean;
  }): Promise<number> {
    try {
      const itemsString = outfit.items.map((item) => {
        return item.toString();
      });
      const result = await this.drizzleDb
        .update(outfits)
        .set({
          name: outfit.name,
          imgUrl: outfit.imgUrl,
          items: itemsString,
          positions: outfit.positions,
        })
        .where(eq(outfits.id, outfit.id))
        .returning();
      if (result == null) {
        throw new Error("Outfit doesn't exist");
      }
      return result[0].id;
    } catch (error) {
      console.error("Failed to update outfit:", error);
      throw error;
    }
  }

  async updateOutfitImgUrl(id: number, imgUrl: string): Promise<number> {
    try {
      const result = await this.drizzleDb
        .update(outfits)
        .set({ imgUrl: imgUrl })
        .where(eq(outfits.id, id))
        .returning();
      if (result == null) {
        throw new Error("Outfit doesn't exist");
      }
      console.log(result);
      return result[0].id;
    } catch (error) {
      console.error("Failed to update outfit:", error);
      throw error;
    }
  }

  async updatePositions(
    id: number,
    positions: OutfitPositions,
  ): Promise<number> {
    try {
      const result = await this.drizzleDb
        .update(outfits)
        .set({ positions: positions })
        .where(eq(outfits.id, id))
        .returning();
      if (result == null) {
        throw new Error("Outfit doesn't exist");
      }
      console.log(JSON.stringify(result, null, 2));
      return result[0].id;
    } catch (error) {
      console.error("Failed to update outfit:", error);
      throw error;
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

  async removeItemFromAllOutfits(itemId: number): Promise<void> {
    try {
      const itemIdToRemove = itemId.toString();

      const result = await this.drizzleDb
        .update(outfits)
        .set({
          items: sql`(
          SELECT json_group_array(value)
          FROM json_each(items)
          WHERE value != ${itemIdToRemove}
        )`,
          updateImgUrl: true,
        })
        .where(
          sql`EXISTS (
          SELECT 1 FROM json_each(items)
          WHERE value = ${itemIdToRemove}
        )`,
        )
        .returning({ id: outfits.id, items: outfits.items }); // optional, for debugging
      console.log(result);
    } catch (error) {
      console.error("Failed to remove item from outfits:", error);
      throw error;
    }
  }

  async updateOutfitUpdateImgUrl(
    id: number,
    updateImgUrl: boolean,
  ): Promise<number> {
    try {
      const result = await this.drizzleDb
        .update(outfits)
        .set({ updateImgUrl: updateImgUrl })
        .where(eq(outfits.id, id))
        .returning();
      if (result == null) {
        throw new Error("Outfit doesn't exist");
      }
      return result[0].id;
    } catch (error) {
      console.error("Failed to update outfit:", error);
      throw error;
    }
  }

  async updateOutfitFavorited(id: number, favorited: boolean): Promise<number> {
    try {
      const result = await this.drizzleDb
        .update(outfits)
        .set({ favorited: favorited })
        .where(eq(outfits.id, id))
        .returning();
      if (result == null) {
        throw new Error("Outfit doesn't exist");
      }
      return result[0].id;
    } catch (error) {
      console.error("Failed to update outfit:", error);
      throw error;
    }
  }
}

export default SqliteOutfitRepo;
