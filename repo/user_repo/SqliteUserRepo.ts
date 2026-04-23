import { user } from "@/db/schemas/user";
import UserRepo from "@/repo/user_repo/UserRepo";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";

class SqliteUserRepo extends UserRepo {
  private db = useSQLiteContext();
  private drizzleDb = drizzle(this.db);

  async checkUserExist(): Promise<boolean> {
    try {
      const result = await this.drizzleDb.select().from(user).limit(1);
      return result.length > 0;
    } catch (error) {
      console.error("Failed to get user:", error);
      throw error;
    }
  }
  async createUser(): Promise<number> {
    try {
      const result = await this.drizzleDb
        .insert(user)
        .values({
          completedTutorial: false,
        })
        .returning();
      if (result.length < 0) {
        throw new Error("Insert failed");
      }
      return 1;
    } catch (error) {
      console.error("Failed to add user:", error);
      throw error;
    }
  }
  async checkTutorialStatus(): Promise<boolean> {
    try {
      const result = await this.drizzleDb.select().from(user).limit(1);
      return result[0].completedTutorial;
    } catch (error) {
      console.error("Failed to get user:", error);
      throw error;
    }
  }
  async completeTutorial(): Promise<number> {
    try {
      await this.drizzleDb.update(user).set({ completedTutorial: true });
      return 1;
    } catch (error) {
      console.error("Failed to update tutorial status:", error);
      throw error;
    }
  }

  async getCustomTags(): Promise<string[]> {
    try {
      const result = await this.drizzleDb.select().from(user).limit(1);
      return result[0].customTags;
    } catch (error) {
      console.error("Failed to get user:", error);
      throw error;
    }
  }
  async addCustomTag(tag: string): Promise<void> {
    try {
      const result = await this.drizzleDb.select().from(user).limit(1);
      const current = result[0]?.customTags ?? [];
      await this.drizzleDb.update(user).set({ customTags: [...current, tag] });
    } catch (error) {
      console.error("Failed to add custom tag:", error);
      throw error;
    }
  }
  async removeCustomTag(tag: string): Promise<void> {
    try {
      const result = await this.drizzleDb.select().from(user).limit(1);
      const current = result[0]?.customTags ?? [];
      const newTags = current.filter((currentTag) => currentTag !== tag);
      await this.drizzleDb.update(user).set({ customTags: newTags });
    } catch (error) {
      console.error("Failed to add custom tag:", error);
      throw error;
    }
  }
}

export default SqliteUserRepo;
