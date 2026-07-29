import * as FileSystem from "expo-file-system";

/**
 * iOS file URIs can embed a container UUID that may change across installs/updates.
 * Rebuild a stable document path using the file name when we detect a stale container path.
 */
export function normalizeImageUri(uri: string | null | undefined): string {
  if (!uri) return "";

  const docDir = FileSystem.documentDirectory ?? "";
  if (!docDir) return uri;
  if (uri.startsWith(docDir)) return uri;

  const docsSegment = "/Documents/";
  const docsIndex = uri.indexOf(docsSegment);
  if (docsIndex === -1) return uri;

  const fileName = uri.slice(docsIndex + docsSegment.length);
  if (!fileName) return uri;

  return `${docDir}${fileName}`;
}

/** Cache/temp paths (e.g. background-remover output) are deleted by the OS; only documentDirectory is stable. */
export async function ensurePersistedItemImageUri(
  uri: string,
): Promise<string> {
  const doc = FileSystem.documentDirectory;
  if (!doc) throw new Error("documentDirectory unavailable");

  if (uri.startsWith(doc)) {
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists) return uri;
  }

  const ext = uri.toLowerCase().endsWith(".png") ? "png" : "jpg";
  const dest = `${doc}photo_${Date.now()}.${ext}`;
  await FileSystem.copyAsync({ from: uri, to: dest });
  return dest;
}
