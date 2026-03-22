import SqliteUserRepo from "@/repo/user_repo/SqliteUserRepo";
import UserRepo from "@/repo/user_repo/UserRepo";

class AppUserRepo extends UserRepo {
  private sqliteRepo = new SqliteUserRepo();
  async checkUserExist(): Promise<boolean> {
    try {
      const result = await this.sqliteRepo.checkUserExist();
      return result;
    } catch (err) {
      throw err;
    }
  }
  async createUser(): Promise<number> {
    try {
      const result = await this.sqliteRepo.createUser();
      return result;
    } catch (err) {
      throw err;
    }
  }
  async checkTutorialStatus(): Promise<boolean> {
    try {
      const result = await this.sqliteRepo.checkTutorialStatus();
      return result;
    } catch (err) {
      throw err;
    }
  }
  async completeTutorial(): Promise<number> {
    try {
      const result = await this.sqliteRepo.completeTutorial();
      return result;
    } catch (err) {
      throw err;
    }
  }
}

export default AppUserRepo;
