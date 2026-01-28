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
    updateImgUrl: boolean;
  }>;

  abstract updateOutfitItems(id: number, items: number[]): Promise<number>;

  abstract updateOutfit(outfit: {
    id: number;
    name: string;
    imgUrl: string;
    items: number[];
    updateImgUrl: boolean;
  }): Promise<number>;

  abstract updateOutfitImgUrl(id: number, imgUrl: string): Promise<number>;

  abstract countNumberOfOutfit(): Promise<number>;

  abstract deleteOutfit(id: number): Promise<void>;

  abstract removeItemFromAllOutfits(itemId: number): Promise<void>;

  abstract updateOutfitUpdateImgUrl(
    id: number,
    updateImgUrl: boolean,
  ): Promise<number>;
}

export default OutfitRepo;
