import Snackbar from "@/components/ui/Snackbar";
import { DrizzleProvider } from "@/hooks/DrizzleContext";
import { ThemeProvider, useTheme } from "@/hooks/ThemeProvider";
import { AppModalProvider } from "@/hooks/useAppModal";
import SnackbarProvider, { useSnackbar } from "@/hooks/useSnackBar";
import { store } from "@/redux/store";
import {
  Archivo_400Regular,
  Archivo_500Medium,
  Archivo_600SemiBold,
  Archivo_700Bold,
  useFonts,
} from "@expo-google-fonts/archivo";
import {
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
} from "@expo-google-fonts/ibm-plex-mono";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, usePathname } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
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

export const DATABASE_NAME = "lookbook";

/* ------------------ INNER APP ------------------ */

function AppShell() {
  const { theme } = useTheme();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const snackbarSettingsContext = useSnackbar();

  const isCamera = pathname.includes("/camera-screen");
  const backgroundColor = isCamera ? theme.inkAlt : theme.surface;

  // ← merge both useFonts into one call
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    "InriaSerif-Bold": require("@/assets/fonts/InriaSerif-Bold.ttf"),
    "InriaSerif-BoldItalic": require("@/assets/fonts/InriaSerif-BoldItalic.ttf"),
    "InriaSerif-Italic": require("@/assets/fonts/InriaSerif-Italic.ttf"),
    "InriaSerif-Light": require("@/assets/fonts/InriaSerif-Light.ttf"),
    "InriaSerif-LightItalic": require("@/assets/fonts/InriaSerif-LightItalic.ttf"),
    "InriaSerif-Regular": require("@/assets/fonts/InriaSerif-Regular.ttf"),
    "Lora-Bold": require("@/assets/fonts/Lora-Bold.ttf"),
    "Lora-BoldItalic": require("@/assets/fonts/Lora-BoldItalic.ttf"),
    "Lora-Italic-VariableFont_wght": require("@/assets/fonts/Lora-Italic-VariableFont_wght.ttf"),
    "Lora-Italic": require("@/assets/fonts/Lora-Italic.ttf"),
    "Lora-Medium": require("@/assets/fonts/Lora-Medium.ttf"),
    "Lora-MediumItalic": require("@/assets/fonts/Lora-MediumItalic.ttf"),
    "Lora-SemiBold": require("@/assets/fonts/Lora-SemiBold.ttf"),
    "Lora-SemiBoldItalic": require("@/assets/fonts/Lora-SemiBoldItalic.ttf"),
    "Lora-Regular": require("@/assets/fonts/Lora-Regular.ttf"),
    "Lora-VariableFont_wght": require("@/assets/fonts/Lora-VariableFont_wght.ttf"),
    "SpaceMono-Regular": require("@/assets/fonts/SpaceMono-Regular.ttf"),
    "Nunito-VariableFont_wght": require("@/assets/fonts/Nunito-VariableFont_wght.ttf"),
    Archivo_400Regular,
    Archivo_500Medium,
    Archivo_600SemiBold,
    Archivo_700Bold,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
  });

  // ← early returns AFTER all hooks
  if (!fontsLoaded) return null;

  if (!snackbarSettingsContext) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }

  const { settings, hideSnackbar } = snackbarSettingsContext;

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor }}>
        {/* Status bar fill */}
        <View style={{ height: insets.top, backgroundColor }} />

        {/* Content — now flex: 1 so it fills remaining space */}
        <View style={{ flex: 1 }}>
          <Slot />
        </View>

        <Snackbar
          visibility={settings.visibility}
          onClose={hideSnackbar}
          type={settings.type}
        >
          {settings.children}
        </Snackbar>
      </GestureHandlerRootView>
      <StatusBar style={isCamera ? "light" : "dark"} />
    </View>
  );
}

/* ------------------ ROOT ------------------ */

export default function RootLayout() {
  const queryClient = new QueryClient();
  return (
    <SafeAreaProvider>
      <Suspense fallback={<ActivityIndicator size="large" />}>
        <SQLiteProvider
          databaseName={DATABASE_NAME}
          options={{ enableChangeListener: true }}
          useSuspense
        >
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <AppModalProvider>
                <SnackbarProvider>
                  <DrizzleProvider>
                    <Provider store={store}>
                      <AppShell />
                    </Provider>
                  </DrizzleProvider>
                </SnackbarProvider>
              </AppModalProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </SQLiteProvider>
      </Suspense>
    </SafeAreaProvider>
  );
}
