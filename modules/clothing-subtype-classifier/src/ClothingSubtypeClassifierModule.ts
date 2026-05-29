import { NativeModule, requireNativeModule } from "expo";

import {
  ClassificationResult,
  ClothingSubtypeClassifierModuleEvents,
} from "./ClothingSubtypeClassifier.types";

declare class ClothingSubtypeClassifierModule extends NativeModule<ClothingSubtypeClassifierModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
  classify(base64: string): Promise<ClassificationResult>; // 👈 add this
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ClothingSubtypeClassifierModule>(
  "ClothingSubtypeClassifier",
);
