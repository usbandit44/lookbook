import { db } from "@/firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";

type BgRemovalDoc = {
  done: boolean;
  location: string;
  status: "processing" | "completed" | "failed";
  error?: string;
};

export function listenForBgRemoval(
  docId: string,
  onComplete: (location: string) => void,
  onError: (error: string) => void,
) {
  console.log("[BgRemoval] Listening to document:", docId);

  const ref = doc(db, "bgRemoval", docId);

  const unsubscribe = onSnapshot(ref, (snapshot) => {
    if (!snapshot.exists()) return;

    const data = snapshot.data() as BgRemovalDoc;
    console.log("[BgRemoval] Update:", data);

    if (data.status === "failed") {
      onError(data.error ?? "Background removal failed");
      unsubscribe();
    }

    if (data.done && data.location) {
      onComplete(data.location);
      unsubscribe();
    }
  });

  return unsubscribe;
}
