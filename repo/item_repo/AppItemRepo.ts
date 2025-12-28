import ItemRepo from "@/repo/item_repo/ItemRepo";
import SqliteItemRepo from "@/repo/item_repo/SqliteItemRepo";

class AppItemRepo extends ItemRepo {
  private sqliteRepo = new SqliteItemRepo();

  async addItem(item: { type: string; imgUrl: string }): Promise<number> {
    try {
      const result = await this.sqliteRepo.addItem(item);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

export default AppItemRepo;
