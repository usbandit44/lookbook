import { posthogLogger, syncAnalyticsProperties } from "@/config/posthog";
import { Colors, DEFAULT_PRESETS, NOTIFICATIONS } from "@/constants/constants";
import { items } from "@/db/schemas/items";
import { scheduleNotification } from "@/functions/notifications";
import { rememberDefaultPresetIds } from "@/functions/presetAnalytics";
import { useDrizzle } from "@/hooks/DrizzleContext";
import { useRepo } from "@/hooks/RepoProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export function LoginPage() {
  const drizzleDb = useDrizzle();
  const posthog = usePostHog();

  const repos = useRepo();
  const { itemRepo, userRepo, presetsRepo } = repos;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  async function checkUser() {
    if (await userRepo.checkUserExist()) {
      if (await userRepo.checkTutorialStatus()) {
        posthogLogger?.info("startup_route_resolved", {
          destination: "pages",
        });
        router.navigate("/pages");
      } else {
        posthogLogger?.info("startup_route_resolved", {
          destination: "tutorial",
        });
        router.navigate("/tutorial");
      }
    } else {
      await userRepo.createUser();
      posthog?.setPersonProperties(
        undefined,
        { first_open_date: new Date().toISOString() },
        false,
      );
      posthogLogger?.info("startup_route_resolved", {
        destination: "tutorial",
      });
      router.navigate("/tutorial");
    }
  }
  async function initNotifications() {
    const alreadyScheduled = await AsyncStorage.getItem(
      "notifications_scheduled",
    );
    if (alreadyScheduled) return;

    NOTIFICATIONS.forEach((n) => {
      scheduleNotification(n.title, n.body, {
        type: "weekly",
        weekday: n.weekday,
        hour: n.hour,
        minute: n.minute,
        repeats: true,
      } as Notifications.WeeklyTriggerInput);
    });

    await AsyncStorage.setItem("notifications_scheduled", "true");

    const { status } = await Notifications.getPermissionsAsync();
    posthog.capture("notifications_scheduled", {
      count: NOTIFICATIONS.length,
      permission_status: status,
    });
  }

  async function initDefaultPresets() {
    const defaultPresetsSet = await AsyncStorage.getItem("default_presets_set");
    if (defaultPresetsSet) return;

    const seededIds: Record<number, string> = {};
    for (const preset of DEFAULT_PRESETS) {
      const id = await presetsRepo.addPreset(preset);
      seededIds[id] = preset.name;
    }
    await rememberDefaultPresetIds(seededIds);

    await AsyncStorage.setItem("default_presets_set", "true");
    posthog.capture("default_presets_seeded", {
      count: DEFAULT_PRESETS.length,
    });
  }

  useEffect(() => {
    initNotifications();
    checkUser().then(() => syncAnalyticsProperties(repos));
    initDefaultPresets();
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
