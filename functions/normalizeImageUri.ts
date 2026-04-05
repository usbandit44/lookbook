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
