abstract class OutfitRepo {
  constructor() {}

  abstract addOutfit(outfit: {
    items: number[];
    name: string;
    imgUrl: string;
  }): Promise<number>;

  abstract getOutfit(id: number): Promise<{
    id: number;
    name: string;
    items: number[];
    imgUrl: string;
  }>;

  abstract updateOutfitItems(id: number, items: number[]): Promise<number>;

  abstract updateOutfit(outfit: {
    id: number;
    name: string;
    imgUrl: string;
    items: number[];
  }): Promise<number>;

  abstract countNumberOfOutfit(): Promise<number>;

  abstract deleteOutfit(id: number): Promise<void>;
}

export default OutfitRepo;
