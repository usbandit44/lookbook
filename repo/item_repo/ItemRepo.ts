abstract class ItemRepo {
  constructor() {}

  abstract addItem(item: {
    name: string;
    type: string;
    size: string;
    imgUrl: string;
  }): Promise<number>;

  abstract countNumberOfItem(): Promise<number>;
}

export default ItemRepo;
