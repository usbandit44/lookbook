import { NewItemType } from "@/constants/constants";
import { ItemsType } from "@/db/schemas/items";

abstract class ItemRepo {
  constructor() {}

  abstract addItem(item: NewItemType): Promise<number>;

  abstract getItem(id: number): Promise<ItemsType>;

  abstract countNumberOfItem(): Promise<number>;

  abstract getAllTopIds(): Promise<number[]>;
  abstract getAllBottomIds(): Promise<number[]>;
  abstract getAllOuterwearIds(): Promise<number[]>;
  abstract getAllShoeIds(): Promise<number[]>;
  abstract getAllHeadwearIds(): Promise<number[]>;
  abstract getAllAccessoriesIds(): Promise<number[]>;
  abstract getAllBeltIds(): Promise<number[]>;

  abstract getIdsByTags(tags: string[]): Promise<number[]>;

  abstract updateItem(item: ItemsType): Promise<number>;
  abstract updateTags(id: number, tags: string[]): Promise<number>;
  abstract updateFavorited(id: number, favorited: boolean): Promise<number>;

  abstract deleteItem(id: number): Promise<void>;
}

export default ItemRepo;
