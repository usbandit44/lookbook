import OutfitRepo from "@/repo/outfit_repo/OutfitRepo";
import SqliteOutfitRepo from "@/repo/outfit_repo/SqliteOutfitRepo";

class AppOutfitRepo extends OutfitRepo {
  private sqliteRepo = new SqliteOutfitRepo();

  async addOutfit(outfit: {
    items: string[];
    name: string;
    imgUrl: string;
  }): Promise<number> {
    try {
      const result = await this.sqliteRepo.addOutfit(outfit);
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
}

export default AppOutfitRepo;
