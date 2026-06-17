import Camera from "@/components/Camera";
import React from "react";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");
const IMG_SIZE = width / 2 - 24;

const playground = () => {
  return <Camera />;
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
