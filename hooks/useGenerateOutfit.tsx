import { PresetTypesType } from "@/constants/constants";
import AppItemRepo from "@/repo/item_repo/AppItemRepo";

export function useGenerateOutfit() {
  const repo = new AppItemRepo();
  const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * (max - 0)) + 0;
  };

  const generate = async (presetTypes: PresetTypesType): Promise<number[]> => {
    try {
      const items: number[] = [];
      for (const key of Object.keys(presetTypes)) {
        const list = await repo.getIdsByTags(presetTypes[key]);
        if (!list.length) continue;
        const randomIndex = getRandomInt(list.length);
        items.push(list[randomIndex]);
      }
      return items;
    } catch (err) {
      console.log("GenerateOutfit threw:", err);
      throw err;
    }
  };
  return { generate };
}
