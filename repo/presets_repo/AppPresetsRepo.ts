import { NewPresetType } from "@/constants/constants";
import { PresetType } from "@/db/schemas/presets";
import PresetsRepo from "@/repo/presets_repo/PresetsRepo";
import SqlitePresetsRepo from "@/repo/presets_repo/SqlitePresetsRepo";

class AppPresetsRepo extends PresetsRepo {
  private sqliteRepo = new SqlitePresetsRepo();

  async addPreset(preset: NewPresetType): Promise<number> {
    try {
      const result = await this.sqliteRepo.addPreset(preset);
      return result;
    } catch (err) {
      throw err;
    }
  }
  async getPreset(id: number): Promise<PresetType> {
    try {
      const result = await this.sqliteRepo.getPreset(id);
      return result;
    } catch (err) {
      throw err;
    }
  }
  async getAllPresets(): Promise<PresetType[]> {
    try {
      const result = await this.sqliteRepo.getAllPresets();
      return result;
    } catch (err) {
      throw err;
    }
  }
  async getTotalPresets(): Promise<number> {
    try {
      const result = await this.sqliteRepo.getTotalPresets();
      return result;
    } catch (error) {
      throw error;
    }
  }
  async deletePreset(id: number): Promise<void> {
    try {
      const result = await this.sqliteRepo.deletePreset(id);
    } catch (error) {
      throw error;
    }
  }
  async updateFavorited(id: number, favorited: boolean): Promise<number> {
    try {
      const result = await this.sqliteRepo.updateFavorited(id, favorited);
      return result;
    } catch (err) {
      throw err;
    }
  }
  async updatePreset(preset: PresetType): Promise<number> {
    try {
      const result = await this.sqliteRepo.updatePreset(preset);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

export default AppPresetsRepo;
