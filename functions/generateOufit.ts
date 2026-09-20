import { PresetTypesType } from "@/constants/constants";
import AppItemRepo from "@/repo/item_repo/AppItemRepo";
// export enum itemTypes {
//   Tops = "Tops",
//   Bottoms = "Bottoms",
//   Outerwear = "Outerwear",
//   Shoes = "Shoes",
//   Belt = "Belts",
//   Headwear = "Headwear",
//   Accessories = "Accessories",
// }

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * (max - 0)) + 0;
};

async function GenerateOutfit(presetTypes: PresetTypesType): Promise<number[]> {
  console.log("GenerateOutfit called");
  try {
    const repo = new AppItemRepo();
    console.log("repo created", JSON.stringify(presetTypes, null, 2));
    const items: number[] = [];
    for (const key of Object.keys(presetTypes)) {
      const list = await repo.getIdsByTags(presetTypes[key]);
      if (!list.length) continue;
      const randomIndex = getRandomInt(list.length);
      items.push(list[randomIndex]);
    }
    console.log("GenerateOutfit result", items);
    return items;
  } catch (err) {
    console.log("GenerateOutfit threw:", err);
    throw err;
  }
}
