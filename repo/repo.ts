// repo/repos.ts
import AppItemRepo from "@/repo/item_repo/AppItemRepo";
import ItemRepo from "@/repo/item_repo/ItemRepo";
import AppOutfitRepo from "@/repo/outfit_repo/AppOutfitRepo";
import OutfitRepo from "@/repo/outfit_repo/OutfitRepo";
import AppPresetsRepo from "@/repo/presets_repo/AppPresetsRepo";
import PresetsRepo from "@/repo/presets_repo/PresetsRepo";
import AppUserRepo from "@/repo/user_repo/AppUserRepo";
import UserRepo from "@/repo/user_repo/UserRepo";

export type Repos = {
  itemRepo: ItemRepo;
  outfitRepo: OutfitRepo;
  presetsRepo: PresetsRepo;
  userRepo: UserRepo;
};

export const repos: Repos = {
  itemRepo: new AppItemRepo(),
  outfitRepo: new AppOutfitRepo(),
  presetsRepo: new AppPresetsRepo(),
  userRepo: new AppUserRepo(),
};
