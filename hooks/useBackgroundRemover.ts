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

export type RemoverResult = {
  originalUri: string;
  resultUri: string;
};

const TAG = "[bgRemover]";

export function useBackgroundRemover() {
  const [state, setState] = useState<RemoverState>({ status: "idle" });

  const process = useCallback(
    async (uri?: string): Promise<RemoverResult | null> => {
      console.log(TAG, "process() called", { uri, platform: Platform.OS });

      if (Platform.OS !== "ios") {
        console.warn(TAG, "Unsupported platform:", Platform.OS);
        setState({ status: "error", message: "Only supported on iOS 17+" });
        return null;
      }

      let imageUri = uri;

      if (!imageUri) {
        console.log(TAG, "No uri passed, requesting media library permission");
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log(TAG, "Permission result:", permission.status);

        if (!permission.granted) {
          console.warn(TAG, "Photo library permission denied");
          setState({
            status: "error",
            message: "Photo library permission denied",
          });
          return null;
        }

        const picked = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          quality: 1,
        });

        if (picked.canceled || !picked.assets[0]) {
          console.log(TAG, "Picker canceled or no asset returned");
          return null;
        }
        imageUri = picked.assets[0].uri;
        console.log(TAG, "Picked image:", imageUri);
      }

      setState({ status: "loading" });

      let step = "init";
      try {
        step = "check input";
        const inputInfo = await FileSystem.getInfoAsync(imageUri);
        console.log(TAG, "Input file info:", inputInfo);
        if (!inputInfo.exists) {
          throw new Error(`Input file does not exist: ${imageUri}`);
        }

        step = "read input";
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        console.log(TAG, "Read input, base64 length:", base64.length);

        step = "removeBackground";
        const t0 = Date.now();
        const resultBase64 = await removeBackground(base64);
        console.log(
          TAG,
          `removeBackground finished in ${Date.now() - t0}ms, result length:`,
          resultBase64?.length,
        );
        if (!resultBase64) {
          throw new Error("removeBackground returned empty result");
        }

        step = "write output";
        const outputPath = `${FileSystem.cacheDirectory}bg_removed_${Date.now()}.png`;
        console.log(TAG, "Writing output to:", outputPath);
        await FileSystem.writeAsStringAsync(outputPath, resultBase64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        step = "verify output";
        const outInfo = await FileSystem.getInfoAsync(outputPath);
        console.log(TAG, "Output file info:", outInfo);
        if (!outInfo.exists) {
          throw new Error(
            `Output file missing right after write: ${outputPath}`,
          );
        }

        const result = {
          originalUri: imageUri,
          resultUri: outputPath,
        };

        console.log(TAG, "Done:", result);
        setState({ status: "done", ...result });
        return result;
      } catch (e: any) {
        console.error(TAG, `Failed at step "${step}":`, e?.message ?? e, e);
        setState({ status: "error", message: e?.message ?? "Unknown error" });
        return null;
      }
    },
    [],
  );

  const reset = useCallback(() => {
    console.log(TAG, "reset()");
    setState({ status: "idle" });
  }, []);

  return { state, process, reset };
}
