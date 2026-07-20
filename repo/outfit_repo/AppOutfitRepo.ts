import { OutfitPositions } from "@/constants/constants";
import OutfitRepo from "@/repo/outfit_repo/OutfitRepo";
import SqliteOutfitRepo from "@/repo/outfit_repo/SqliteOutfitRepo";

class AppOutfitRepo extends OutfitRepo {
  private sqliteRepo = new SqliteOutfitRepo();

  async addOutfit(outfit: {
    items: number[];
    name: string;
    imgUrl: string;
    positions: OutfitPositions;
  }): Promise<number> {
    try {
      const result = await this.sqliteRepo.addOutfit(outfit);
      return result;
    } catch (err) {
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
  }> {
    try {
      const result = await this.sqliteRepo.getOutfit(id);
      return result;
    } catch (err) {
      throw err;
    }
  }
  async updateOutfitItems(id: number, items: number[]): Promise<number> {
    try {
      const result = await this.sqliteRepo.updateOutfitItems(id, items);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateOutfit(outfit: {
    id: number;
    name: string;
    imgUrl: string;
    items: number[];
    updateImgUrl: boolean;
    positions: OutfitPositions;
  }): Promise<number> {
    try {
      const result = await this.sqliteRepo.updateOutfit(outfit);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateOutfitImgUrl(id: number, imgUrl: string): Promise<number> {
    try {
      const result = await this.sqliteRepo.updateOutfitImgUrl(id, imgUrl);
      return result;
    } catch (err) {
      throw err;
    }
  }
  async updatePositions(
    id: number,
    positions: OutfitPositions,
  ): Promise<number> {
    try {
      const result = await this.sqliteRepo.updatePositions(id, positions);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async countNumberOfOutfit(): Promise<number> {
    try {
      const result = await this.sqliteRepo.countNumberOfOutfit();
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteOutfit(id: number): Promise<void> {
    try {
      const result = await this.sqliteRepo.deleteOutfit(id);
    } catch (error) {
      throw error;
    }
  }

  async removeItemFromAllOutfits(itemId: number): Promise<void> {
    try {
      const result = await this.sqliteRepo.removeItemFromAllOutfits(itemId);
    } catch (error) {
      throw error;
    }
  }

  async updateOutfitUpdateImgUrl(
    id: number,
    updateImgUrl: boolean,
  ): Promise<number> {
    try {
      const result = await this.sqliteRepo.updateOutfitUpdateImgUrl(
        id,
        updateImgUrl,
      );
      return result;
    } catch (err) {
      throw err;
    }
  }
}

export default AppOutfitRepo;
