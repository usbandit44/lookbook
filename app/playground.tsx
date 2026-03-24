import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useBackgroundRemover } from "../hooks/useBackgroundRemover";

const { width } = Dimensions.get("window");
const IMG_SIZE = width / 2 - 24;

const playground = () => {
  const { state, process, reset } = useBackgroundRemover();

  if (Platform.OS !== "ios") {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>iOS only feature</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Background Remover</Text>
      <Text style={styles.subtitle}>
        Powered by VNGenerateForegroundInstanceMaskRequest
      </Text>

      {/* Pick button */}
      <TouchableOpacity
        style={[
          styles.button,
          state.status === "loading" && styles.buttonDisabled,
        ]}
        onPress={() => process()}
        disabled={state.status === "loading"}
      >
        <Text style={styles.buttonText}>
          {state.status === "idle" ? "Pick a Photo" : "Pick Another"}
        </Text>
      </TouchableOpacity>

      {/* Loading */}
      {state.status === "loading" && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>Removing background...</Text>
        </View>
      )}

      {/* Error */}
      {state.status === "error" && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {state.message}</Text>
          <TouchableOpacity onPress={reset}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Result */}
      {state.status === "done" && (
        <View style={styles.resultContainer}>
          <View style={styles.imageColumn}>
            <Text style={styles.label}>Original</Text>
            <Image
              source={{ uri: state.originalUri }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <View style={styles.imageColumn}>
            <Text style={styles.label}>Result</Text>
            {/* Checkered pattern background to show transparency */}
            <View style={[styles.image, styles.checkerboard]}>
              <Image
                source={{ uri: state.resultUri }}
                style={StyleSheet.absoluteFill}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default playground;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
    paddingTop: 60,
    gap: 20,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a1a2e",
  },
  subtitle: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#6C63FF",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  loadingText: {
    color: "#666",
    fontSize: 14,
  },
  errorBox: {
    backgroundColor: "#fff0f0",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    gap: 8,
    width: "100%",
  },
  errorText: {
    color: "#cc0000",
    fontSize: 14,
    textAlign: "center",
  },
  retryText: {
    color: "#6C63FF",
    fontWeight: "600",
  },
  resultContainer: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  imageColumn: {
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
  },
  image: {
    width: IMG_SIZE,
    height: IMG_SIZE,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  checkerboard: {
    // Simulate transparency with a grid pattern
    backgroundColor: "#fff",
    backgroundImage: undefined, // RN doesn't support this natively
  },
});
