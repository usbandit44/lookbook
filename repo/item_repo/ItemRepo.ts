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

  abstract getAllTops(): Promise<ItemsType[]>;
  abstract getAllBottoms(): Promise<ItemsType[]>;
  abstract getAllOuterwear(): Promise<ItemsType[]>;
  abstract getAllShoes(): Promise<ItemsType[]>;
  abstract getAllEyewear(): Promise<ItemsType[]>;
  abstract getAllHeadwear(): Promise<ItemsType[]>;
  abstract getAllNecklaces(): Promise<ItemsType[]>;
  abstract getAllWristwear(): Promise<ItemsType[]>;
}

export default ItemRepo;
