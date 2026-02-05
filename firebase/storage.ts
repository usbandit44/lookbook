import { storage } from "@/firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// Get a reference to the storage service, which is used to create references in your storage bucket

// Create a storage reference from our storage service

// export async function uploadForBgRemoval(imgUri: string): Promise<string> {
//   const originalFileName = imgUri.split("/").pop() ?? `image-${Date.now()}.jpg`;

//   // 2️⃣ Create unique storage path
//   const storagePath = `images/${Date.now()}-${originalFileName}`;
//   const imgRef = ref(storage, storagePath);

//   // 3️⃣ Convert file URI → Blob
//   const response = await fetch(imgUri);
//   const blob = await response.blob();
//   const snapshot = await uploadBytes(imgRef, blob);
//   const gsUrl = `gs://${snapshot.ref.bucket}/${snapshot.ref.fullPath}`;
//   return gsUrl;
// }

export async function uploadForBgRemoval(imgUri: string): Promise<string> {
  try {
    // 1️⃣ Get original file name
    const originalFileName =
      imgUri.split("/").pop() ?? `image-${Date.now()}.jpg`;

    // 2️⃣ Create unique storage path
    const storagePath = `img/${Date.now()}-${originalFileName}`;
    const imgRef = ref(storage, storagePath);

    // 3️⃣ Convert file URI → Blob
    const response = await fetch(imgUri);
    console.log(response);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch file URI: ${response.status} ${response.statusText}`,
      );
    }

    const blob = await response.blob();

    // 4️⃣ Upload to Firebase Storage
    const snapshot = await uploadBytes(imgRef, blob);

    // 5️⃣ Construct gs:// URL
    const gsUrl = `gs://${snapshot.ref.bucket}/${snapshot.ref.fullPath}`;

    console.log("✅ Upload successful:", gsUrl);
    return gsUrl;
  } catch (error: any) {
    console.error("❌ Upload failed:", error.message || error);
    throw error; // re-throw so the caller can handle it
  }
}

// export async function getBgRemovedImg(
//   gsUrl: string,
// ): Promise<{ downloadUrl: string; fileName: string }> {
//   console.log("[getBgRemovedImg] Start", { gsUrl });

//   try {
//     const fileRef = ref(storage, gsUrl);
//     console.log("[getBgRemovedImg] File reference created", {
//       fullPath: fileRef.fullPath,
//     });

//     // 2️⃣ Get HTTPS download URL
//     const downloadUrl = await getDownloadURL(fileRef);
//     console.log("[getBgRemovedImg] Download URL fetched");

//     const fileName = fileRef.fullPath.split("/").pop() ?? `temp-${Date.now()}`;

//     console.log("[getBgRemovedImg] Success", {
//       fileName,
//       downloadUrl,
//     });

//     return { downloadUrl, fileName };
//   } catch (error) {
//     console.error("[getBgRemovedImg] Failed to get image", {
//       gsUrl,
//       error,
//     });
//     throw error;
//   }
// }

const STORAGE_BUCKET = "lookbook-34a13.firebasestorage.app";

function normalizeGsUrl(input: string): string {
  // Already correct
  if (input.startsWith("gs://") && input.includes("/")) {
    const [, rest] = input.split("gs://");
    // If bucket is already present, return as-is
    if (rest.startsWith(STORAGE_BUCKET)) {
      return input;
    }
  }

  // Input like: bgremoved/xxx.webp
  // or mistakenly: gs://bgremoved/xxx.webp
  const cleanPath = input
    .replace("gs://", "")
    .replace(/^bgremoved\//, "bgremoved/");

  return `gs://${STORAGE_BUCKET}/${cleanPath}`;
}

export async function getBgRemovedImg(
  input: string,
): Promise<{ downloadUrl: string; fileName: string }> {
  console.log("[getBgRemovedImg] Start", { input });

  try {
    const gsUrl = normalizeGsUrl(input);

    console.log("[getBgRemovedImg] Normalized gsUrl", { gsUrl });

    const fileRef = ref(storage, gsUrl);

    console.log("[getBgRemovedImg] File reference created", {
      fullPath: fileRef.fullPath,
    });

    const downloadUrl = await getDownloadURL(fileRef);

    const fileName =
      fileRef.fullPath.split("/").pop() ?? `temp-${Date.now()}.webp`;

    console.log("[getBgRemovedImg] Success", { downloadUrl, fileName });

    return { downloadUrl, fileName };
  } catch (error) {
    console.error("[getBgRemovedImg] Failed to get image", {
      input,
      error,
    });
    throw error;
  }
}
