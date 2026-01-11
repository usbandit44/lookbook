import ItemRepo from "@/repo/item_repo/ItemRepo";
import SqliteItemRepo from "@/repo/item_repo/SqliteItemRepo";

class AppItemRepo extends ItemRepo {
  private sqliteRepo = new SqliteItemRepo();

  async addItem(item: {
    name: string;
    type: string;
    imgUrl: string;
  }): Promise<number> {
    try {
      const result = await this.sqliteRepo.addItem(item);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async countNumberOfItem(): Promise<number> {
    try {
      const result = await this.sqliteRepo.countNumberOfItem();
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default AppItemRepo;
