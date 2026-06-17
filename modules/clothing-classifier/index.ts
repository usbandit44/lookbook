import { NativeModulesProxy } from "expo-modules-core";

const { ClothingClassifier } = NativeModulesProxy;

export interface ClassificationResult {
  label: string;
  confidence: number;
  allLabels: Record<string, number>;
}

export async function classifyClothing(
  fileUri: string,
): Promise<ClassificationResult> {
  return ClothingClassifier.classify(fileUri);
}
