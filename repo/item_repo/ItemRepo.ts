abstract class ItemRepo {
  constructor() {}

  abstract addItem(item: { type: string; imgUrl: string }): Promise<number>;
}

export default ItemRepo;
