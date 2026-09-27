import { itemSubTypes, ItemTypeType, SubType } from "@/constants/constants";

export type VibeTag =
  | "casual"
  | "classic"
  | "streetwear"
  | "athletic"
  | "elegant"
  | "preppy"
  | "edgy"
  | "outdoor"
  | "minimalist"
  | "formal";

export interface SubTypeMeta extends SubType {
  /** 1 = very casual/athletic, 5 = black-tie formal */
  formality: number;
  tags: VibeTag[];
  /** Goes with almost anything regardless of tag overlap (within formality window) */
  versatile?: boolean;
}

function id(key: ItemTypeType, value: string): string {
  return `${key}::${value}`;
}

const META_INPUT: Record<
  string,
  { formality: number; tags: VibeTag[]; versatile?: boolean }
> = {
  // Tops
  "T-Shirt": {
    formality: 2,
    tags: [
      "casual",
      "athletic",
      "streetwear",
      "classic",
      "outdoor",
      "minimalist",
    ],
    versatile: true,
  },
  "Long Sleeve Tee": {
    formality: 2,
    tags: [
      "casual",
      "classic",
      "streetwear",
      "athletic",
      "outdoor",
      "minimalist",
    ],
    versatile: true,
  },
  "Button-Down": {
    formality: 3,
    tags: ["classic", "preppy"],
  },
  Blouse: {
    formality: 3,
    tags: ["classic", "preppy", "elegant"],
  },
  Sweater: {
    formality: 2,
    tags: ["casual", "classic", "preppy", "minimalist"],
    versatile: true,
  },
  "Tank Top": {
    formality: 1,
    tags: ["casual", "streetwear", "athletic", "minimalist"],
  },
  Polo: {
    formality: 4,
    tags: ["classic", "preppy"],
    versatile: true,
  },
  Vest: {
    formality: 3,
    tags: ["preppy", "edgy", "outdoor", "minimalist", "formal"],
  },
  "Dress Shirt": {
    formality: 5,
    tags: ["classic", "preppy", "formal"],
  },

  // Bottoms
  Jeans: {
    formality: 3,
    tags: ["casual", "classic", "streetwear", "minimalist"],
    versatile: true,
  },
  "Dress Pants": {
    formality: 5,
    tags: ["classic", "preppy", "minimalist", "formal"],
    versatile: true,
  },
  Sweatpants: {
    formality: 1,
    tags: ["casual", "streetwear", "athletic", "minimalist"],
  },
  "Cargo Pants": { formality: 2, tags: ["casual", "streetwear", "outdoor"] },
  Leggings: { formality: 1, tags: ["athletic", "casual"] },
  Shorts: {
    formality: 1,
    tags: ["casual", "streetwear", "athletic", "outdoor", "minimalist"],
  },
  "Denim Shorts": {
    formality: 1,
    tags: ["casual", "streetwear"],
  },
  Skirt: {
    formality: 3,
    tags: ["classic", "elegant", "preppy", "minimalist"],
  },
  "Mini Skirt": {
    formality: 2,
    tags: ["streetwear", "elegant", "preppy", "edgy"],
  },
  "Midi Skirt": {
    formality: 3,
    tags: ["classic", "elegant", "minimalist"],
  },
  "Maxi Skirt": {
    formality: 2,
    tags: ["elegant"],
  },
  Overalls: { formality: 2, tags: ["casual", "streetwear", "outdoor"] },

  // Outerwear
  Hoodie: {
    formality: 1,
    tags: ["casual", "athletic", "streetwear"],
    versatile: true,
  },
  "Zip-Up Jacket": {
    formality: 1,
    tags: ["casual", "athletic", "streetwear"],
    versatile: true,
  },
  Coat: {
    formality: 4,
    tags: ["classic", "elegant", "preppy", "formal"],
  },
  "Puffer Jacket": { formality: 2, tags: ["casual", "outdoor", "streetwear"] },
  Blazer: { formality: 5, tags: ["formal", "classic", "preppy"] },
  "Bomber Jacket": { formality: 2, tags: ["streetwear", "edgy", "casual"] },
  "Denim Jacket": {
    formality: 2,
    tags: ["casual", "classic", "streetwear"],
    versatile: true,
  },
  Raincoat: {
    formality: 2,
    tags: ["casual", "classic", "outdoor"],
  },
  Fleece: {
    formality: 1,
    tags: ["casual", "streetwear", "athletic", "outdoor"],
  },
  Windbreaker: {
    formality: 1,
    tags: ["athletic", "outdoor", "streetwear", "edgy"],
  },
  "Trench Coat": {
    formality: 4,
    tags: ["casual", "classic", "elegant", "preppy"],
  },

  // Dresses
  "Mini Dress": { formality: 3, tags: ["edgy", "streetwear", "elegant"] },
  "Midi Dress": {
    formality: 3,
    tags: ["classic", "elegant", "preppy", "formal"],
  },
  "Maxi Dress": {
    formality: 3,
    tags: ["classic", "elegant", "preppy", "formal"],
  },
  Sundress: {
    formality: 3,
    tags: ["casual", "classic", "elegant", "outdoor"],
  },
  "Wrap Dress": { formality: 3, tags: ["classic", "elegant"] },
  "Bodycon Dress": { formality: 3, tags: ["edgy", "elegant"] },
  "Slip Dress": { formality: 3, tags: ["elegant", "minimalist"] },
  Romper: { formality: 2, tags: ["casual"] },

  // Shoes
  Sneakers: {
    formality: 1,
    tags: [
      "casual",
      "classic",
      "streetwear",
      "athletic",
      "outdoor",
      "minimalist",
    ],
    versatile: true,
  },
  "Running Shoes": { formality: 1, tags: ["athletic", "outdoor"] },
  Boots: {
    formality: 2,
    tags: ["classic", "outdoor", "edgy"],
    versatile: true,
  },
  Loafers: {
    formality: 4,
    tags: ["classic", "elegant", "preppy", "formal"],
  },
  "Dress Shoes": { formality: 5, tags: ["formal", "classic"], versatile: true },
  Sandals: { formality: 1, tags: ["casual", "outdoor"] },
  Slides: { formality: 1, tags: ["casual", "athletic", "streetwear"] },
  Heels: {
    formality: 5,
    tags: ["elegant", "formal", "classic"],
    versatile: true,
  },
  Flats: { formality: 3, tags: ["classic", "elegant"] },
  Mules: { formality: 3, tags: ["classic", "elegant", "minimalist"] },

  // Belt
  "Leather Belt": { formality: 3, tags: ["classic"], versatile: true },
  "Canvas Belt": { formality: 2, tags: ["casual", "outdoor", "streetwear"] },
  "Chain Belt": { formality: 2, tags: ["edgy", "streetwear"] },
  "Braided Belt": { formality: 2, tags: ["classic", "preppy"] },

  // Headwear
  "Baseball Cap": {
    formality: 1,
    tags: ["casual", "athletic", "streetwear", "classic"],
    versatile: true,
  },
  Beanie: {
    formality: 1,
    tags: ["casual", "streetwear", "athletic", "edgy", "outdoor", "minimalist"],
  },
  "Bucket Hat": { formality: 1, tags: ["streetwear", "casual"] },
  Beret: { formality: 2, tags: ["classic", "edgy", "elegant", "preppy"] },
  Fedora: { formality: 2, tags: ["classic", "elegant"] },
  Visor: { formality: 1, tags: ["athletic", "outdoor"] },
  Headband: { formality: 1, tags: ["athletic", "casual", "outdoor"] },

  // Accessories
  Watch: { formality: 3, tags: ["classic"], versatile: true },
  Sunglasses: {
    formality: 2,
    tags: ["classic", "streetwear"],
    versatile: true,
  },
  Necklace: { formality: 2, tags: ["elegant"], versatile: true },
  Bracelet: { formality: 2, tags: ["edgy"], versatile: true },
  Ring: { formality: 2, tags: ["classic", "elegant"], versatile: true },
  Earrings: { formality: 2, tags: ["elegant", "classic"], versatile: true },
  Scarf: {
    formality: 3,
    tags: ["classic", "elegant", "preppy", "edgy", "outdoor"],
  },
  Gloves: { formality: 3, tags: ["classic", "outdoor"] },
  Bag: { formality: 2, tags: ["classic"], versatile: true },
  Purse: { formality: 3, tags: ["elegant", "classic"], versatile: true },
  Backpack: { formality: 1, tags: ["casual", "streetwear", "outdoor"] },
  "Tote Bag": {
    formality: 2,
    tags: ["casual", "classic", "streetwear", "elegant", "minimalist"],
  },
  Wallet: { formality: 2, tags: ["classic"], versatile: true },
  Tie: { formality: 4, tags: ["formal", "classic"] },
  "Bow Tie": { formality: 4, tags: ["formal", "classic", "edgy"] },
  Socks: { formality: 3, tags: ["casual"], versatile: true },
};

export const subtypeMetaById: Map<string, SubTypeMeta> = new Map(
  itemSubTypes.map((s) => {
    const meta = META_INPUT[s.value];
    if (!meta) {
      throw new Error(
        `Missing style metadata for subtype "${s.value}" (${s.key})`,
      );
    }
    return [s.value, { ...s, id: id(s.key, s.value), ...meta }];
  }),
);

const FORMALITY_WINDOW = 2;

function sharesTag(a: SubTypeMeta, b: SubTypeMeta): boolean {
  return a.tags.some((t) => b.tags.includes(t));
}

function isCompatible(a: SubTypeMeta, b: SubTypeMeta): boolean {
  if (a.key === b.key) return false; // never suggest within the same category
  //if (typesExcluded(a.key, b.key)) return false; // e.g. Dresses vs. Tops/Bottoms
  if (Math.abs(a.formality - b.formality) > FORMALITY_WINDOW) return false;
  return a.versatile || b.versatile || sharesTag(a, b);
}

function buildCompatibilityGraph(): Map<string, Set<string>> {
  const subtypes = Array.from(subtypeMetaById.keys());
  const graph = new Map<string, Set<string>>(
    subtypes.map((i) => [i, new Set<string>()]),
  );

  for (let i = 0; i < subtypes.length; i++) {
    for (let j = i + 1; j < subtypes.length; j++) {
      const a = subtypeMetaById.get(subtypes[i])!;
      const b = subtypeMetaById.get(subtypes[j])!;
      if (isCompatible(a, b)) {
        graph.get(a.value)!.add(b.value);
        graph.get(b.value)!.add(a.value);
      }
    }
  }

  //   for (const [x, y] of FORCE_EXCLUDE) {
  //     graph.get(x)?.delete(y);
  //     graph.get(y)?.delete(x);
  //   }
  //   for (const [x, y] of FORCE_PAIR) {
  //     graph.get(x)?.add(y);
  //     graph.get(y)?.add(x);
  //   }

  return graph;
}

export const compatibilityGraph: Map<
  string,
  Set<string>
> = buildCompatibilityGraph();

function getCompatibility(checkAgainst: string, subtypeToCheck: string) {
  const compatibaleSubtypes = compatibilityGraph.get(checkAgainst);
  if (compatibaleSubtypes?.has(subtypeToCheck)) {
    return true;
  }
  return false;
}

export function compatabilityOrder(
  outfitSubTypes: string[],
  subtypesToCheck: string[],
) {
  const subtypesCompatability: Record<string, number> = {};
  for (let i = 0; i < subtypesToCheck.length; i++) {
    for (let j = 0; j < outfitSubTypes.length; j++) {
      if (getCompatibility(outfitSubTypes[j], subtypesToCheck[i])) {
        subtypesCompatability[subtypesToCheck[i]] =
          (subtypesCompatability[subtypesToCheck[i]] ?? 0) + 1;
      }
    }
    if (!subtypesCompatability[subtypesToCheck[i]]) {
      subtypesCompatability[subtypesToCheck[i]] = 0;
    }
  }
  const orderedByScore = Object.entries(subtypesCompatability).sort(
    ([, a], [, b]) => b - a,
  );
  const subTypesOrdered = orderedByScore.map((entry) => {
    return entry[0];
  });
  return subTypesOrdered;
}
