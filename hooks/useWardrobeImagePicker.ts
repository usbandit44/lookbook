import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { Alert, Linking } from "react-native";

export function useWardrobeImagePicker() {
  const pickSingleImage = async (): Promise<string | null> => {
    const { status, accessPrivileges } =
      await MediaLibrary.getPermissionsAsync();

    if (status === "denied") {
      Alert.alert(
        "Photos access required",
        "Enable photo access in Settings to add wardrobe items.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ],
      );
      return null;
    }

    if (status === "undetermined") {
      const { status: newStatus } =
        await MediaLibrary.requestPermissionsAsync();
      if (newStatus !== "granted") return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [3, 4], // portrait crop — good for clothing
      quality: 0.85,
    });

    if (result.canceled) return null;
    return result.assets[0].uri;
  };
  const pickMultipleImages = async (): Promise<string[] | null> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Photos access required",
        "Enable photo access in Settings to add wardrobe items.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ],
      );
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.85,
      allowsMultipleSelection: true,
      selectionLimit: 0,
    });

    if (result.canceled) return null;

    return result.assets.map((asset) => asset.uri);
  };
  return { pickSingleImage, pickMultipleImages };
}
