// hooks/useAppModal.tsx
import AppModal from "@/components/ui/AppModal";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type AppModalContextType = {
  show: (content: React.ReactNode, style?: object) => void;
  hide: () => void;
  visible: boolean;
};

const AppModalContext = createContext<AppModalContextType | null>(null);

export const AppModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);
  const [modalStyle, setModalStyle] = useState<object | undefined>(undefined);

  const show = useCallback((node: React.ReactNode, style?: object) => {
    setContent(node);
    setModalStyle(style);
    setVisible(true);
  }, []);

  const hide = useCallback(() => setVisible(false), []);

  const value = useMemo(() => ({ show, hide, visible }), [show, hide, visible]);

  return (
    <AppModalContext.Provider value={value}>
      {children}
      <AppModal
        modalVisible={visible}
        setModalVisible={setVisible}
        style={modalStyle}
      >
        {content}
      </AppModal>
    </AppModalContext.Provider>
  );
};

export const useAppModal = () => {
  const ctx = useContext(AppModalContext);
  if (!ctx) {
    throw new Error("useAppModal must be used within an AppModalProvider");
  }
  return ctx;
};
