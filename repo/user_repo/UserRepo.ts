abstract class UserRepo {
  constructor() {}

  abstract checkUserExist(): Promise<boolean>;

  abstract createUser(): Promise<number>;

  abstract checkTutorialStatus(): Promise<boolean>;

  abstract completeTutorial(): Promise<number>;
}

export default UserRepo;
