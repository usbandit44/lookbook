// db/DrizzleContext.tsx
import migrations from "@/drizzle/migrations";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useSQLiteContext } from "expo-sqlite";
import { createContext, useContext } from "react";
import { ActivityIndicator, View } from "react-native";

const DrizzleContext = createContext<ReturnType<typeof drizzle> | null>(null);

export const DrizzleProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const sqlite = useSQLiteContext();
  const drizzleDb = drizzle(sqlite);
  const { success, error } = useMigrations(drizzleDb, migrations);

  if (error) {
    console.error("Database migration failed:", error);
    throw error;
  }

  if (!success) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <DrizzleContext.Provider value={drizzleDb}>
      {children}
    </DrizzleContext.Provider>
  );
};

export const useDrizzle = () => {
  const ctx = useContext(DrizzleContext);
  if (!ctx) throw new Error("useDrizzle must be used within DrizzleProvider");
  return ctx;
};
