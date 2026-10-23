// ThemeContext.tsx
import { Theme, ThemeName, themes } from "@/constants/themes";
import React, { createContext, ReactNode, useContext, useState } from "react";

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
  const [themeName, setThemeName] = useState<ThemeName>(initialTheme);

  const value: ThemeContextValue = {
    theme: themes[themeName],
    themeName,
    setThemeName,
  };

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
