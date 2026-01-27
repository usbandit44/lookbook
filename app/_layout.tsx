import { Colors } from "@/constants/constants";
import migrations from "@/drizzle/migrations";
import { store } from "@/redux/store";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useFonts } from "expo-font";
import { Slot, usePathname } from "expo-router";
import { SQLiteProvider, openDatabaseSync } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { Suspense } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Provider } from "react-redux";

export const DATABASE_NAME = "tasks";

/* ------------------ INNER APP ------------------ */

function AppShell() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isCamera = pathname.includes("/camera-screen");

  const backgroundColor = isCamera ? "black" : Colors.light.background;

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  useMigrations(db, migrations);

  if (!loaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
      {/* 🔹 Paint status bar background */}
      <View
        style={{
          height: insets.top,
          backgroundColor,
        }}
      />

      {/* 🔹 App content */}
      <GestureHandlerRootView style={{ flex: 1, backgroundColor }}>
        <Slot />
      </GestureHandlerRootView>

      {/* 🔹 Status bar text */}
      <StatusBar style={isCamera ? "light" : "dark"} />
    </View>
  );
}

/* ------------------ ROOT ------------------ */

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Suspense fallback={<ActivityIndicator size="large" />}>
        <SQLiteProvider
          databaseName={DATABASE_NAME}
          options={{ enableChangeListener: true }}
          useSuspense
        >
          <ThemeProvider value={DefaultTheme}>
            <Provider store={store}>
              <AppShell />
            </Provider>
          </ThemeProvider>
        </SQLiteProvider>
      </Suspense>
    </SafeAreaProvider>
  );
}
