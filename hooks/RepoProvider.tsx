import ItemRepo from "@/repo/item_repo/ItemRepo";
import OutfitRepo from "@/repo/outfit_repo/OutfitRepo";
import PresetsRepo from "@/repo/presets_repo/PresetsRepo";
import { repos } from "@/repo/repo";
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
    itemRepo: repos.itemRepo,
    outfitRepo: repos.outfitRepo,
    presetsRepo: repos.presetsRepo,
    userRepo: repos.userRepo,
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
