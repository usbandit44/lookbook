import { DEFAULT_PRESETS, PresetTypesType } from "@/constants/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DEFAULT_PRESET_IDS_KEY = "default_preset_ids";
const DEFAULT_PRESET_NAMES = new Set(DEFAULT_PRESETS.map((p) => p.name));

// preset id -> original default preset name
let defaultPresetIds: Record<number, string> | null = null;

async function loadDefaultPresetIds(): Promise<Record<number, string>> {
  if (defaultPresetIds) return defaultPresetIds;
  try {
    const stored = await AsyncStorage.getItem(DEFAULT_PRESET_IDS_KEY);
    defaultPresetIds = stored ? JSON.parse(stored) : {};
  } catch {
    defaultPresetIds = {};
  }
  return defaultPresetIds!;
}

export async function rememberDefaultPresetIds(ids: Record<number, string>) {
  defaultPresetIds = ids;
  await AsyncStorage.setItem(DEFAULT_PRESET_IDS_KEY, JSON.stringify(ids));
}

// Tags preset events with whether the preset started as a default, and which one.
// Keyed by id so renamed defaults are still attributed to their original preset.
export async function getPresetOrigin(id: number, currentName?: string) {
  const ids = await loadDefaultPresetIds();
  const defaultName =
    ids[id] ??
    // Installs seeded before ids were recorded: fall back to the name.
    (currentName && DEFAULT_PRESET_NAMES.has(currentName)
      ? currentName
      : undefined);
  return {
    preset_origin: defaultName ? "default" : "custom",
    default_preset_name: defaultName ?? null,
  };
}

const flattenTypes = (types: PresetTypesType) =>
  Object.entries(types).flatMap(([category, subtypes]) =>
    subtypes.map((subtype) => `${category}: ${subtype}`),
  );

// Describes how a preset was edited, e.g. which categories/subtypes were added.
export function diffPresetTypes(
  before: { name: string; types: PresetTypesType },
  after: { name: string; types: PresetTypesType },
) {
  const beforeCategories = Object.keys(before.types);
  const afterCategories = Object.keys(after.types);
  const beforeSubtypes = flattenTypes(before.types);
  const afterSubtypes = flattenTypes(after.types);

  return {
    name_changed: before.name !== after.name,
    categories_added: afterCategories.filter(
      (c) => !beforeCategories.includes(c),
    ),
    categories_removed: beforeCategories.filter(
      (c) => !afterCategories.includes(c),
    ),
    subtypes_added: afterSubtypes.filter((s) => !beforeSubtypes.includes(s)),
    subtypes_removed: beforeSubtypes.filter((s) => !afterSubtypes.includes(s)),
    category_count_before: beforeCategories.length,
    category_count_after: afterCategories.length,
  };
}
