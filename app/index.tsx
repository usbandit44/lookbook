import { Colors } from "@/constants/constants";
import { items } from "@/db/schemas/items";
import { useDrizzle } from "@/hooks/DrizzleContext";
import AppItemRepo from "@/repo/item_repo/AppItemRepo";
import AppUserRepo from "@/repo/user_repo/AppUserRepo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export function LoginPage() {
  const drizzleDb = useDrizzle();

  const itemRepo = new AppItemRepo();
  const userRepo = new AppUserRepo();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      if (await userRepo.checkUserExist()) {
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
    checkUser();
  }, []);

  useEffect(() => {
    async function tagsMigration() {
      const tagsUpdate = await AsyncStorage.getItem("tagsUpdate");
      if (tagsUpdate) return;
      const itemsList = await drizzleDb.select().from(items);
      itemsList.forEach((item) => {
        if (item.tags.length == 0) {
          const tempTags = [item.type];
          if (item.color) tempTags.push(item.color);
          itemRepo.updateTags(item.id, tempTags);
        }
      });
      await AsyncStorage.setItem("tagsUpdate", "true");
    }

    tagsMigration();
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
