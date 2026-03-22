import { Colors } from "@/constants/constants";
import { auth } from "@/firebase/firebase";
import AppUserRepo from "@/repo/user_repo/AppUserRepo";
import { useRouter } from "expo-router";
import { signInAnonymously } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export function LoginPage() {
  const userRepo = new AppUserRepo();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        // Create anonymous user
        try {
          await signInAnonymously(auth);
        } catch (error) {
          console.error("Anonymous sign-in failed:", error);
        }
      } else {
        // User exists, route to /pages
        if (await userRepo.checkUserExist()) {
          console.log(await userRepo.checkUserExist());
          if (await userRepo.checkTutorialStatus()) {
            router.navigate("/pages");
          } else {
            router.navigate("/tutorial");
          }
        } else {
          await userRepo.createUser();
          router.navigate("/tutorial");
        }
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Optional loading indicator
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <View
      style={{ flex: 1, backgroundColor: Colors.light.background, gap: 20 }}
    >
      {/* <Text>LoginPage</Text>
      <Link href="/pages">View App</Link>
      <Link href="/playground">Playground</Link> */}
    </View>
  );
}

export default LoginPage;
