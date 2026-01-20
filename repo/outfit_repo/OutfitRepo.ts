abstract class OutfitRepo {
  constructor() {}

  abstract addOutfit(outfit: {
    items: string[];
    name: string;
    imgUrl: string;
  }): Promise<number>;

  abstract countNumberOfOutfit(): Promise<number>;

  abstract deleteOutfit(id: number): Promise<void>;
}

export default OutfitRepo;
