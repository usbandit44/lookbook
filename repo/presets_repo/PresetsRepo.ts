import { NewPresetType } from "@/constants/constants";
import { PresetType } from "@/db/schemas/presets";

abstract class PresetsRepo {
  constructor() {}

  abstract addPreset(preset: NewPresetType): Promise<number>;
  abstract getPreset(id: number): Promise<PresetType>;
  abstract getAllPresets(): Promise<PresetType[]>;
  abstract getTotalPresets(): Promise<number>;
  abstract updateFavorited(id: number, favorited: boolean): Promise<number>;
  abstract updatePreset(preset: PresetType): Promise<number>;
  abstract deletePreset(id: number): Promise<void>;
}

export default PresetsRepo;
