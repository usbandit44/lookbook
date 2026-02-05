import { listenForBgRemoval } from "@/firebase/firestore";
import { getBgRemovedImg, uploadForBgRemoval } from "@/firebase/storage";
import { updateNewItemImg } from "@/redux/slices/cameraSlice";
import { AppDispatch } from "@/redux/store";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

export class ApiHandler {
  constructor(private dispatch: AppDispatch) {}

  private getDocId(gsUrl: string): string {
    const filename = gsUrl.split("/").pop()!;
    return filename.split(".")[0];
  }

  private async compressImage(imgUri: string): Promise<string> {
    const result = await ImageManipulator.manipulateAsync(imgUri, [], {
      compress: 0.5,
      format: ImageManipulator.SaveFormat.JPEG,
    });
    return result.uri;
  }

  async backgroundRemoval(imgUri: string): Promise<void> {
    console.log("[ApiHandler] Start", { imgUri });

    // 1️⃣ Compress
    const compressedUri = await this.compressImage(imgUri);

    // 2️⃣ Upload → triggers backend
    const gsUrl = await uploadForBgRemoval(compressedUri);
    console.log("[ApiHandler] Uploaded:", gsUrl);

    // 3️⃣ Predict Firestore doc ID
    const docId = this.getDocId(gsUrl);

    // 4️⃣ Listen for backend completion
    return new Promise((resolve, reject) => {
      listenForBgRemoval(
        docId,
        async (location) => {
          console.log("[ApiHandler] BG removal done:", location);

          // 5️⃣ Download processed image
          const { downloadUrl, fileName } = await getBgRemovedImg(
            `gs://${location}`,
          );

          const tempUri = `${FileSystem.cacheDirectory}${fileName}`;
          await FileSystem.downloadAsync(downloadUrl, tempUri);

          // 6️⃣ Update Redux
          this.dispatch(updateNewItemImg(tempUri));
          resolve();
        },
        (error) => {
          console.error("[ApiHandler] BG removal failed:", error);
          reject(new Error(error));
        },
      );
    });
  }
}
