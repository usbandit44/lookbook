abstract class UserRepo {
  constructor() {}

  abstract checkUserExist(): Promise<boolean>;

  abstract createUser(): Promise<number>;

  abstract checkTutorialStatus(): Promise<boolean>;

  abstract completeTutorial(): Promise<number>;
  abstract getCustomTags(): Promise<string[]>;
  abstract addCustomTag(tag: string): Promise<void>;
  abstract removeCustomTag(tag: string): Promise<void>;
}

export default UserRepo;
