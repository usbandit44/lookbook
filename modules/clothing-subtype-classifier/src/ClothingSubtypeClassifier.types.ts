import type { StyleProp, ViewStyle } from "react-native";

export type OnLoadEventPayload = {
  url: string;
};

export type ClothingSubtypeClassifierModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type ClothingSubtypeClassifierViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};

export type ChangeEvent = {
  value: string;
};

export type ClassificationResult = {
  label: string;
  confidence: number;
  allLabels: Record<string, number>;
};
