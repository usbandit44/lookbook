import { NewPresetType } from "@/constants/constants";
import { presets, PresetType } from "@/db/schemas/presets";
import PresetsRepo from "@/repo/presets_repo/PresetsRepo";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";

class SqlitePresetsRepo extends PresetsRepo {
  private db = useSQLiteContext();
  private drizzleDb = drizzle(this.db);

  async addPreset(preset: NewPresetType): Promise<number> {
    try {
      const result = await this.drizzleDb
        .insert(presets)
        .values(preset)
        .returning();
      if (result[0].id == null) {
        throw new Error("Insert did not return an id");
      }
      return result[0].id;
    } catch (err) {
      console.error("Failed to add preset:", err);
      throw err;
    }
  }
  async getPreset(id: number): Promise<PresetType> {
    try {
      const result = await this.drizzleDb
        .select()
        .from(presets)
        .where(eq(presets.id, id));
      if (result == null) {
        throw new Error("Item doesn't exist");
      }
      return result[0];
    } catch (error) {
      console.error("Failed to get item:", error);
      throw error;
    }
  }
  async getAllPresets(): Promise<PresetType[]> {
    try {
      const result = await this.drizzleDb.select().from(presets);

      if (result == null) {
        throw new Error("Item doesn't exist");
      }
      return result;
    } catch (error) {
      console.error("Failed to get item:", error);
      throw error;
    }
  }
  async getTotalPresets(): Promise<number> {
    try {
      const result = await this.drizzleDb.$count(presets);
      if (result == null) {
        throw new Error("Count failed");
      }
      return result;
    } catch (error) {
      console.error("Failed to get count:", error);
      throw error;
    }
  }

  async deletePreset(id: number): Promise<void> {
    try {
      const result = await this.drizzleDb
        .delete(presets)
        .where(eq(presets.id, id));
      console.log(result);
      if (result == null) {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Failed to delete preset:", error);
      throw error;
    }
  }
  async updateFavorited(id: number, favorited: boolean): Promise<number> {
    try {
      const result = await this.drizzleDb
        .update(presets)
        .set({
          favorited: favorited,
        })
        .where(eq(presets.id, id))
        .returning();
      if (result == null) {
        throw new Error("Preset doesn't exist");
      }

      return result[0].id;
    } catch (error) {
      console.error("Failed to update preset:", error);
      throw error;
    }
  }
  async updatePreset(preset: PresetType): Promise<number> {
    try {
      const result = await this.drizzleDb
        .update(presets)
        .set({
          name: preset.name,
          types: preset.types,
          favorited: preset.favorited,
        })
        .where(eq(presets.id, preset.id))
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
}

export default SqlitePresetsRepo;
