import { ItemsType } from "@/db/schemas/items";

abstract class ItemRepo {
  constructor() {}

  abstract addItem(item: {
    name: string;
    type: string;
    color: string;
    imgUrl: string;
    backgroundRemoved: boolean;
  }): Promise<number>;

  abstract getItem(id: number): Promise<ItemsType>;

  abstract countNumberOfItem(): Promise<number>;

  abstract getAllTopIds(): Promise<number[]>;
  abstract getAllBottomIds(): Promise<number[]>;
  abstract getAllOuterwearIds(): Promise<number[]>;
  abstract getAllShoeIds(): Promise<number[]>;
  abstract getAllHeadwearIds(): Promise<number[]>;
  abstract getAllAccessoriesIds(): Promise<number[]>;
  abstract getAllBeltIds(): Promise<number[]>;

  abstract updateItem(item: ItemsType): Promise<number>;

  abstract deleteItem(id: number): Promise<void>;
}

export default ItemRepo;
