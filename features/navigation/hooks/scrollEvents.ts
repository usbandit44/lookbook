// utils/scrollEvents.ts
import { useEffect } from "react";
import { DeviceEventEmitter } from "react-native";

export type ScrollTab = "items" | "outfits";

export const emitScrollToTop = (tab: ScrollTab) => {
  DeviceEventEmitter.emit("scrollToTop", tab);
};

export const useScrollToTopListener = (
  tab: ScrollTab,
  onTrigger: () => void,
) => {
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      "scrollToTop",
      (firedTab: ScrollTab) => {
        if (firedTab === tab) onTrigger();
      },
    );
    return () => sub.remove();
  }, [tab, onTrigger]);
};
