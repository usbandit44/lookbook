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

  //   private async compressImage(imgUri: string): Promise<string> {
  //     const result = await ImageManipulator.manipulateAsync(imgUri, [], {
  //       compress: 0.5,
  //       format: ImageManipulator.SaveFormat.JPEG,
  //     });
  //     return result.uri;
  //   }
  private async compressImage(imgUri: string): Promise<string> {
    console.log("[ApiHandler] Compressing image...");

    // Get original image dimensions
    const imageInfo = await ImageManipulator.manipulateAsync(imgUri, [], {
      format: ImageManipulator.SaveFormat.JPEG,
    });

    const originalWidth = imageInfo.width;
    const originalHeight = imageInfo.height;

    console.log(
      `[ApiHandler] Original size: ${originalWidth}×${originalHeight}`,
    );

    // Resize to max 1024px on longest side
    const maxDimension = 1024;
    let resize = {};

    if (originalWidth > maxDimension || originalHeight > maxDimension) {
      if (originalWidth > originalHeight) {
        // Landscape: resize width to 1024, height scales proportionally
        resize = { width: maxDimension };
      } else {
        // Portrait: resize height to 1024, width scales proportionally
        resize = { height: maxDimension };
      }
    }

    // Apply resize + compression
    const result = await ImageManipulator.manipulateAsync(
      imgUri,
      resize ? [{ resize }] : [], // Resize if needed
      {
        compress: 0.7, // 70% quality (good balance)
        format: ImageManipulator.SaveFormat.JPEG,
      },
    );

    console.log(
      `[ApiHandler] Compressed size: ${result.width}×${result.height}`,
    );
    console.log(
      `[ApiHandler] File size reduced: ${((1 - result.uri.length / imgUri.length) * 100).toFixed(1)}%`,
    );

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
