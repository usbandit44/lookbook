import { ItemsType } from "@/db/schemas/items";

abstract class ItemRepo {
  constructor() {}

  abstract addItem(item: {
    name: string;
    type: string;
    size: string;
    imgUrl: string;
  }): Promise<number>;

  abstract getItem(id: number): Promise<ItemsType>;

  abstract countNumberOfItem(): Promise<number>;

  abstract getAllTopIds(): Promise<number[]>;
  abstract getAllBottomIds(): Promise<number[]>;
  abstract getAllOuterwearIds(): Promise<number[]>;
  abstract getAllShoeIds(): Promise<number[]>;
  abstract getAllEyewearIds(): Promise<number[]>;
  abstract getAllHeadwearIds(): Promise<number[]>;
  abstract getAllNecklaceIds(): Promise<number[]>;
  abstract getAllWristwearIds(): Promise<number[]>;
}

export default ItemRepo;
