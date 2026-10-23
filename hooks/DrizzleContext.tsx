// db/DrizzleContext.tsx
import { drizzleDb } from "@/db/db"; // ✅ the one shared connection
import migrations from "@/drizzle/migrations";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { ActivityIndicator, View } from "react-native";

export const DrizzleProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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

  return <>{children}</>;
};

export const useDrizzle = () => drizzleDb;
