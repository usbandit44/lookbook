import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { Alert, Linking } from "react-native";

const MAX_PHOTOS = 15;

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
      aspect: [3, 4],
      quality: 0.85,
    });

    if (result.canceled) return null;
    return result.assets[0].uri;
  };

  const pickMultipleImages = async (
    remainingSlots: number = MAX_PHOTOS,
  ): Promise<string[] | null> => {
    if (remainingSlots <= 0) {
      Alert.alert(
        "Limit reached",
        `You can only add up to ${MAX_PHOTOS} photos at a time.`,
      );
      return null;
    }

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
      selectionLimit: remainingSlots,
    });

    if (result.canceled) return null;

    return result.assets.map((asset) => asset.uri);
  };

  return { pickSingleImage, pickMultipleImages, MAX_PHOTOS };
}
