import { ItemsType } from "@/db/schemas/items";
import ItemRepo from "@/repo/item_repo/ItemRepo";
import SqliteItemRepo from "@/repo/item_repo/SqliteItemRepo";

class AppItemRepo extends ItemRepo {
  private sqliteRepo = new SqliteItemRepo();

  async addItem(item: {
    name: string;
    type: string;
    size: string;
    imgUrl: string;
  }): Promise<number> {
    try {
      const result = await this.sqliteRepo.addItem(item);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getItem(id: number): Promise<ItemsType> {
    try {
      const result = await this.sqliteRepo.getItem(id);
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

  async getAllTopIds(): Promise<number[]> {
    try {
      const result = await this.sqliteRepo.getAllTopIds();
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getAllBottomIds(): Promise<number[]> {
    try {
      const result = await this.sqliteRepo.getAllBottomIds();
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getAllOuterwearIds(): Promise<number[]> {
    try {
      const result = await this.sqliteRepo.getAllOuterwearIds();
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getAllShoeIds(): Promise<number[]> {
    try {
      const result = await this.sqliteRepo.getAllShoeIds();
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getAllHeadwearIds(): Promise<number[]> {
    try {
      const result = await this.sqliteRepo.getAllHeadwearIds();
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getAllAccessoriesIds(): Promise<number[]> {
    try {
      const result = await this.sqliteRepo.getAllAccessoriesIds();
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getAllBeltIds(): Promise<number[]> {
    try {
      const result = await this.sqliteRepo.getAllBeltIds();
      return result;
    } catch (error) {
      throw error;
    }
  }
  async updateItem(item: ItemsType): Promise<number> {
    try {
      const result = await this.sqliteRepo.updateItem(item);
      return result;
    } catch (err) {
      throw err;
    }
  }
  async deleteItem(id: number): Promise<void> {
    try {
      const result = await this.sqliteRepo.deleteItem(id);
    } catch (error) {
      throw error;
    }
  }
}

export default AppItemRepo;
