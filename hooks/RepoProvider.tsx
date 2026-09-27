import AppItemRepo from "@/repo/item_repo/AppItemRepo";
import ItemRepo from "@/repo/item_repo/ItemRepo";
import AppOutfitRepo from "@/repo/outfit_repo/AppOutfitRepo";
import OutfitRepo from "@/repo/outfit_repo/OutfitRepo";
import AppPresetsRepo from "@/repo/presets_repo/AppPresetsRepo";
import PresetsRepo from "@/repo/presets_repo/PresetsRepo";
import AppUserRepo from "@/repo/user_repo/AppUserRepo";
import UserRepo from "@/repo/user_repo/UserRepo";
import { createContext, ReactNode, useContext } from "react";

type RepoContextValue = {
  itemRepo: ItemRepo;
  outfitRepo: OutfitRepo;
  presetsRepo: PresetsRepo;
  userRepo: UserRepo;
};

const RepoContext = createContext<RepoContextValue | undefined>(undefined);

interface RepoProviderProps {
  children: ReactNode;
}

export function RepoProvider({ children }: RepoProviderProps) {
  const value: RepoContextValue = {
    itemRepo: new AppItemRepo(),
    outfitRepo: new AppOutfitRepo(),
    presetsRepo: new AppPresetsRepo(),
    userRepo: new AppUserRepo(),
  };

  return <RepoContext.Provider value={value}>{children}</RepoContext.Provider>;
}

export function useRepo(): RepoContextValue {
  const context = useContext(RepoContext);
  if (context === undefined) {
    throw new Error("useRepo must be used within a RepoProvider");
  }
  return context;
}
