import { functions } from "@/firebase/firebase";
import { httpsCallable } from "firebase/functions";

export type RemoveBackgroundResult = {
  success: boolean;
  download_url: string;
  output_path: string;
};

export async function removeBackgroundCallable(
  imgUrl: string,
): Promise<RemoveBackgroundResult> {
  console.log("[removeBackgroundCallable] Start", { imgUrl });

  try {
    const removeBackground = httpsCallable<
      { imageUrl: string },
      RemoveBackgroundResult
    >(functions, "remove_background_callable");

    const result = await removeBackground({ imageUrl: imgUrl });

    console.log("[removeBackgroundCallable] Response", result.data);

    if (!result.data?.success) {
      throw new Error("Background removal failed");
    }

    return result.data;
  } catch (error) {
    console.error("[removeBackgroundCallable] Failed", {
      imgUrl,
      error,
    });
    throw error;
  }
}
