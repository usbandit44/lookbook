// ThemeContext.tsx
import { ThemeName, themes } from "@/constants/themes";
import { Theme } from "@/functions/themeBuilder";
import { useRepo } from "@/hooks/RepoProvider";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface ThemeContextValue {
  theme: Theme;
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeName;
}

export function ThemeProvider({
  children,
  initialTheme = "default",
}: ThemeProviderProps) {
  const { userRepo } = useRepo();
  const [themeName, setName] = useState<ThemeName>(initialTheme);
  const [ready, setReady] = useState(false);

  // load the saved theme once
  useEffect(() => {
    userRepo
      .getTheme()
      .then((theme: ThemeName) => {
        if (theme && theme in themes) setName(theme as ThemeName);
      })

      .finally(() => setReady(true));
  }, [userRepo]);

  // change + save
  const setThemeName = useCallback(
    (name: ThemeName) => {
      setName(name);
      userRepo.setTheme(name).catch(() => {});
    },
    [userRepo],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ theme: themes[themeName], themeName, setThemeName }),
    [themeName, setThemeName],
  );

  // don't paint the default theme before the saved one loads
  if (!ready) return null;

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
