import { requireNativeModule } from "expo-modules-core";

const BackgroundRemoverModule = requireNativeModule("BackgroundRemover");

export async function removeBackground(base64: string): Promise<string> {
  return BackgroundRemoverModule.removeBackground(base64);
}
