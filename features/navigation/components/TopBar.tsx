import { Colors } from "@/constants/constants";
import icons from "@/constants/icons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import IconButton from "../../../components/ui/IconButton";

export default function TopBar({ backgroundColor = Colors.light.background }) {
  const pathname = usePathname();

  let isItems = false;
  const isOutfits = pathname.includes("outfits");

  if (isOutfits == false) {
    isItems = true;
  }
  const router = useRouter();

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 16,
          backgroundColor: backgroundColor,
          height: 97,
          width: "100%",
        }}
      >
        <View style={{ width: 90 }} />

        <IconButton
          onPress={() => alert("Logo pressed!")}
          backgroundColor={backgroundColor}
          icon={
            <Image
              source={icons.noTextLogo}
              style={{ width: 90, height: 90, resizeMode: "contain" }}
            />
          }
          style={{ height: 90, width: 90 }}
        />

        <IconButton
          onPress={() => router.replace("../profile")}
          backgroundColor="transparent"
          icon={
            <Image
              source={icons.user}
              style={{ width: 35, height: 35, resizeMode: "contain" }}
            />
          }
          style={{
            height: 90,
            width: 90,
            alignItems: "flex-end",
            paddingRight: 8,
          }}
        />
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: 48,
          width: "100%",
          backgroundColor: Colors.light.background,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            router.navigate("/pages");
            // router.replace("../items");
          }}
          style={{
            backgroundColor: isItems
              ? Colors.light.text
              : Colors.light.background,
            padding: 16,
            width: "50%",
            alignItems: "center",
            borderColor: "black",
            borderTopWidth: 1,
            borderBottomWidth: 1,
          }}
        >
          <Text
            style={{
              fontFamily: "Lora-SemiBold",
              color: isItems ? Colors.light.background : Colors.light.text,
            }}
          >
            Items
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.navigate("/pages/outfits");
            // router.replace("../outfits");
          }}
          style={{
            backgroundColor: isOutfits
              ? Colors.light.text
              : Colors.light.background,
            padding: 16,
            width: "50%",
            alignItems: "center",
            borderColor: "black",
            borderTopWidth: 1,
            borderBottomWidth: 1,
          }}
        >
          <Text
            style={{
              fontFamily: "Lora-SemiBold",
              color: isOutfits ? Colors.light.background : Colors.light.text,
            }}
          >
            Outfits
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
