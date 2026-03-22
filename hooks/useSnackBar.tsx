import { SnackbarAction } from "@/constants/types";
import React, { useState } from "react";

interface SnackbarSettings {
  children: string;
  action?: SnackbarAction;
  type: "default" | "success" | "error";
  visibility: boolean;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  onClear?: () => void;
}

interface SettingsContextType {
  settings: SnackbarSettings;
  setSettings: React.Dispatch<React.SetStateAction<SnackbarSettings>>;
  showSnackbar: (msg: string, type?: "default" | "success" | "error") => void;
  hideSnackbar: () => void;
}

const SnackbarSettingsContext = React.createContext<
  SettingsContextType | undefined
>(undefined);

export const useSnackbar = () => React.useContext(SnackbarSettingsContext);

const SnackbarProvider = (props: any) => {
  //onst { documentIds, DocumentIdContext, setDocumentIds } = useDocumentIds();
  const [vis, setVis] = useState(false);

  const [settings, setSettings] = React.useState<SnackbarSettings>({
    children: "",
    type: "default",
    visibility: false,
    setVisibility: (v) =>
      setSettings((prev) => ({
        ...prev,
        visibility: typeof v === "function" ? v(prev.visibility) : v,
      })),
  });

  const showSnackbar = (
    msg: string,
    type: "default" | "success" | "error" = "default",
  ) => {
    setSettings((prev) => ({ ...prev, children: msg, type, visibility: true }));
  };

  const hideSnackbar = () => {
    setSettings((prev) => ({ ...prev, visibility: false }));
  };

  return (
    <SnackbarSettingsContext.Provider
      value={{ settings, setSettings, showSnackbar, hideSnackbar }}
    >
      {props.children}
    </SnackbarSettingsContext.Provider>
  );
};

export default SnackbarProvider;
