import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import { Platform } from "react-native";
import { removeBackground } from "../modules/background-remover";

export type RemoverState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; originalUri: string; resultUri: string }
  | { status: "error"; message: string };

export function useBackgroundRemover() {
  const [state, setState] = useState<RemoverState>({ status: "idle" });

  const process = useCallback(async (uri?: string) => {
    if (Platform.OS !== "ios") {
      setState({ status: "error", message: "Only supported on iOS 17+" });
      return;
    }

    let imageUri = uri;

    // If no URI passed, open image picker
    if (!imageUri) {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setState({
          status: "error",
          message: "Photo library permission denied",
        });
        return;
      }

      const picked = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
      });

      if (picked.canceled || !picked.assets[0]) return;
      imageUri = picked.assets[0].uri;
    }

    setState({ status: "loading" });

    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const resultBase64 = await removeBackground(base64);

      const outputPath = `${FileSystem.cacheDirectory}bg_removed_${Date.now()}.png`;
      await FileSystem.writeAsStringAsync(outputPath, resultBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setState({
        status: "done",
        originalUri: imageUri,
        resultUri: outputPath,
      });
    } catch (e: any) {
      setState({ status: "error", message: e?.message ?? "Unknown error" });
    }
  }, []);

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, process, reset };
}
