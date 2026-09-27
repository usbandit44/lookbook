import {
  itemColors,
  itemSubTypes,
  ItemTypeType,
  PresetTypesType,
} from "@/constants/constants";
import { generateColorCombo, HarmonyType } from "@/functions/colorTheory";
import { compatabilityOrder } from "@/functions/itemCompatibilty";
import { useRepo } from "@/hooks/RepoProvider";
import { posthog, posthogLogger } from "@/config/posthog";

// Remembers the last generated outfit so saves can be attributed to generation.
let lastGeneratedItems: number[] = [];

export function consumeGeneratedOutfitSource(savedItems: number[]) {
  const generated =
    lastGeneratedItems.length > 0 &&
    lastGeneratedItems.some((id) => savedItems.includes(id));
  const edited =
    generated &&
    (lastGeneratedItems.length !== savedItems.length ||
      !lastGeneratedItems.every((id) => savedItems.includes(id)));
  lastGeneratedItems = [];
  return { source: generated ? "generated" : "manual", edited };
}

type GenerateResult =
  | { ok: true; items: number[] }
  | { ok: false; missing: string[] };

export function useGenerateOutfit() {
  const { itemRepo } = useRepo();
  const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * (max - 0)) + 0;
  };
  let TYPE_ORDER: ItemTypeType[] = [
    "Tops",
    "Bottoms",
    "Dresses",
    "Outerwear",
    "Shoes",
    "Belt",
    "Headwear",
    "Accessories",
  ];

  const COLOR_COMBO_TYPES: HarmonyType[] = [
    "monochromatic",
    "analogous",
    "complementary",
    "splitComplementary",
    "triadic",
    "neutral",
  ];
  const COLOR_NAMES = new Set(itemColors); // itemColors = your 15-string array

  function getItemColor(item: { tags: string[] }): string | undefined {
    return item.tags.find((tag) => COLOR_NAMES.has(tag));
  }

  const checkMissingSubtypes = async (
    presetTypes: PresetTypesType,
  ): Promise<string[]> => {
    const avaliableSubtypes = Object.values(presetTypes).flat();
    const subtypesNotInCloset = await itemRepo.getSubtypesMissingFromCloset(
      Object.values(presetTypes).flat(),
    );
    return subtypesNotInCloset;
  };

  const generate = async (
    presetTypes: PresetTypesType,
    startingItem?: { id: number; type: string; subtype: string },
  ): Promise<GenerateResult> => {
    try {
      const missingSubtypes = await checkMissingSubtypes(presetTypes);
      if (missingSubtypes.length > 0) {
        posthog?.capture("outfit_generation_failed", {
          reason: "missing_items",
          missing_subtypes: missingSubtypes,
          missing_count: missingSubtypes.length,
          starts_from_item: startingItem != null,
        });
        return { ok: false, missing: missingSubtypes };
      }
      const items: number[] = [];
      const subtypes: string[] = [];
      let baseColor: string = "";

      if (startingItem != null) {
        items.push(startingItem.id);
        subtypes.push(startingItem.subtype);
        const baseItem = await itemRepo.getItem(startingItem.id);
        baseColor = baseItem.color ?? getItemColor(baseItem) ?? "";

        TYPE_ORDER = TYPE_ORDER.filter((type) => type != startingItem.type);
      }

      for (const key of TYPE_ORDER) {
        if (!(key in presetTypes)) continue;
        if (key == presetTypes[key][0]) {
          const candidates = itemSubTypes
            .filter((s) => s.key === key)
            .map((s) => s.value);

          const notOwned =
            await itemRepo.getSubtypesMissingFromCloset(candidates);
          const have = candidates.filter((s) => !notOwned.includes(s));
          presetTypes[key] = have.length > 0 ? have : [key];
        }
        if (subtypes.length == 0) {
          const subtypePosition = getRandomInt(presetTypes[key].length);
          const subTypeToSelect = presetTypes[key][subtypePosition];
          subtypes.push(subTypeToSelect);
          const itemOptions = await itemRepo.getIdsByTags([subTypeToSelect]);
          if (!itemOptions.length) continue;
          const itemIndex = getRandomInt(itemOptions.length);
          items.push(itemOptions[itemIndex]);
          const baseItem = await itemRepo.getItem(itemOptions[itemIndex]);
          baseColor = baseItem.color ?? getItemColor(baseItem) ?? "";
          continue;
        }
        console.log(presetTypes[key]);
        const subtypesToCheck = presetTypes[key];
        const subtypesOrderByCompatability = compatabilityOrder(
          subtypes,
          subtypesToCheck,
        );
        console.log(subtypesOrderByCompatability);
        subtypes.push(subtypesOrderByCompatability[0]);
      }

      let colorCombo: string[] = [];
      let found = true;

      if (baseColor != "") {
        console.log("color found");
        for (let i = 0; i < COLOR_COMBO_TYPES.length; i++) {
          const combo = generateColorCombo(baseColor, COLOR_COMBO_TYPES[i]);
          found = true;
          for (let j = 1; j < subtypes.length; j++) {
            if (
              (await itemRepo.getIdsByTagsMatchSome([subtypes[j]], combo))
                .length <= 0
            ) {
              found = false;
              break;
            }
          }
          if (found) {
            colorCombo = combo;
            break;
          }
        }
        if (!found) {
          colorCombo = itemColors;
        }
        for (let i = 1; i < subtypes.length; i++) {
          const list = await itemRepo.getIdsByTagsMatchSome(
            [subtypes[i]],
            colorCombo,
          );
          if (!list.length) continue;
          const randomIndex = getRandomInt(list.length);
          items.push(list[randomIndex]);
        }
      } else {
        for (let i = 1; i < subtypes.length; i++) {
          const list = await itemRepo.getIdsByTags([subtypes[i]]);
          console.log("subtype: " + JSON.stringify(subtypes[i]));
          if (!list.length) {
            console.log("hi");
            continue;
          }
          const randomIndex = getRandomInt(list.length);

          items.push(list[randomIndex]);
        }
      }
      console.log(items);
      posthog?.capture("outfit_generated", {
        item_count: items.length,
        category_count: Object.keys(presetTypes).length,
        starts_from_item: startingItem != null,
      });
      posthogLogger?.info("outfit_generation_completed", {
        item_count: items.length,
        category_count: Object.keys(presetTypes).length,
        starts_from_item: startingItem != null,
      });
      lastGeneratedItems = [...items];
      return { ok: true, items };
    } catch (err) {
      posthogLogger?.error("outfit_generation_failed", {
        operation: "outfit_generation",
      });
      posthog?.capture("outfit_generation_failed", {
        reason: "error",
        starts_from_item: startingItem != null,
      });
      console.log("GenerateOutfit threw:", err);
      throw err;
    }
  };
  return { generate };
}
