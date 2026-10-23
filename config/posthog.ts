import Constants from "expo-constants";
import PostHog from "posthog-react-native";

const extra = Constants.expoConfig?.extra;
const projectToken = extra?.posthogProjectToken as string | undefined;
const host = extra?.posthogHost as string | undefined;

export const isPostHogConfigured = Boolean(projectToken && host);

if (!isPostHogConfigured && __DEV__) {
  const missingVariable = projectToken
    ? "EXPO_PUBLIC_POSTHOG_HOST"
    : "EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN";

  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

export const posthog = isPostHogConfigured
  ? new PostHog(projectToken!, {
      host: host!,
      captureAppLifecycleEvents: true,
      logs: {
        serviceName: "lookbook-mobile",
        environment: __DEV__ ? "development" : "production",
        serviceVersion: Constants.expoConfig?.version,
      },
      errorTracking: {
        autocapture: {
          uncaughtExceptions: true,
          unhandledRejections: true,
          console: [],
        },
      },
      debug: __DEV__,
    })
  : null;

export const posthogLogger = posthog?.logger;

// Tag every event so dev traffic can be filtered out of real user data.
posthog?.register({ environment: __DEV__ ? "development" : "production" });

type AnalyticsRepos = {
  itemRepo: { countNumberOfItem(): Promise<number> };
  outfitRepo: { countNumberOfOutfit(): Promise<number> };
  presetsRepo: { getTotalPresets(): Promise<number> };
  userRepo: { checkTutorialStatus(): Promise<boolean> };
};

// Keeps person properties current so retention can be broken down by wardrobe size.
export async function syncAnalyticsProperties(repos: AnalyticsRepos) {
  if (!posthog) return;
  try {
    const [wardrobeItemCount, outfitCount, presetCount, tutorialCompleted] =
      await Promise.all([
        repos.itemRepo.countNumberOfItem(),
        repos.outfitRepo.countNumberOfOutfit(),
        repos.presetsRepo.getTotalPresets(),
        repos.userRepo.checkTutorialStatus(),
      ]);
    posthog.setPersonProperties(
      {
        wardrobe_item_count: wardrobeItemCount,
        outfit_count: outfitCount,
        preset_count: presetCount,
        tutorial_completed: tutorialCompleted,
      },
      undefined,
      false,
    );
  } catch (err) {
    posthogLogger?.error("analytics_property_sync_failed", {
      message: String(err),
    });
  }
}
