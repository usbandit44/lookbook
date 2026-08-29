import { OutfitPositions } from "@/constants/constants";

abstract class OutfitRepo {
  constructor() {}

  abstract addOutfit(outfit: {
    items: number[];
    name: string;
    imgUrl: string;
    positions: OutfitPositions;
    favorited: boolean;
  }): Promise<number>;

  abstract getOutfit(id: number): Promise<{
    id: number;
    name: string;
    items: number[];
    imgUrl: string;
    updateImgUrl: boolean;
    favorited: boolean;
  }>;

  abstract updateOutfitItems(id: number, items: number[]): Promise<number>;

  abstract updateOutfit(outfit: {
    id: number;
    name: string;
    imgUrl: string;
    items: number[];
    updateImgUrl: boolean;
    favorited: boolean;
  }): Promise<number>;

  abstract updateOutfitImgUrl(id: number, imgUrl: string): Promise<number>;

  abstract updatePositions(
    id: number,
    positions: OutfitPositions,
  ): Promise<number>;

  abstract countNumberOfOutfit(): Promise<number>;

  abstract deleteOutfit(id: number): Promise<void>;

  abstract removeItemFromAllOutfits(itemId: number): Promise<void>;

  abstract updateOutfitUpdateImgUrl(
    id: number,
    updateImgUrl: boolean,
  ): Promise<number>;

  abstract updateOutfitFavorited(
    id: number,
    favorited: boolean,
  ): Promise<number>;
}

export default OutfitRepo;
