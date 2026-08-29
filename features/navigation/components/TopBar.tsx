import AppText from "@/components/ui/AppText";
import { Colors } from "@/constants/constants";
import { Theme } from "@/constants/themes";
import { useTheme } from "@/hooks/ThemeProvider";
import AppItemRepo from "@/repo/item_repo/AppItemRepo";
import AppOutfitRepo from "@/repo/outfit_repo/AppOutfitRepo";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function TopBar({ backgroundColor = Colors.light.background }) {
  const itemRepo = new AppItemRepo();
  const outfitRepo = new AppOutfitRepo();
  const { theme } = useTheme();
  const styles = s(theme);
  const pathname = usePathname();

  let isItems = false;
  const isOutfits = pathname.includes("outfits");

  if (isOutfits == false) {
    isItems = true;
  }
  const [itemCount, setItemCount] = useState<number>();
  const [outfitCount, setOutfitCount] = useState<number>();

  const router = useRouter();
  useEffect(() => {
    async function getCounts() {
      const c1 = await itemRepo.countNumberOfItem();
      const c2 = await outfitRepo.countNumberOfOutfit();
      setItemCount(c1);
      setOutfitCount(c2);
    }
    getCounts();
  });

  return (
    <View style={styles.textContainer}>
      <AppText type="p1" text="LOOKBOOK"></AppText>
      <AppText
        type="m8"
        text={isOutfits ? outfitCount + " Outfits" : itemCount + " pieces"}
      ></AppText>
    </View>
    // <>
    //   <View
    //     style={{
    //       flexDirection: "row",
    //       alignItems: "center",
    //       justifyContent: "space-between",
    //       padding: 16,
    //       backgroundColor: backgroundColor,
    //       height: 97,
    //       width: "100%",
    //     }}
    //   >
    //     <View style={{ width: 90 }} />

    //     <IconButton
    //       onPress={() => router.replace("/")}
    //       backgroundColor={backgroundColor}
    //       icon={
    //         <Image
    //           source={icons.noTextLogo}
    //           style={{ width: 90, height: 90, resizeMode: "contain" }}
    //         />
    //       }
    //       style={{ height: 90, width: 90 }}
    //     />

    //     <View style={{ width: 90 }} />

    //     {/* <IconButton
    //       onPress={() => router.replace("/pages/profile")}
    //       backgroundColor="transparent"
    //       icon={
    //         <Image
    //           source={icons.user}
    //           style={{ width: 35, height: 35, resizeMode: "contain" }}
    //         />
    //       }
    //       style={{
    //         height: 90,
    //         width: 90,
    //         alignItems: "flex-end",
    //         paddingRight: 8,
    //       }}
    //     /> */}
    //   </View>
    //   <View
    //     style={{
    //       display: "flex",
    //       flexDirection: "row",
    //       alignItems: "center",
    //       justifyContent: "space-between",
    //       height: 48,
    //       width: "100%",
    //       backgroundColor: Colors.light.background,
    //     }}
    //   >
    //     <TouchableOpacity
    //       onPress={() => {
    //         router.navigate("/pages");
    //         // router.replace("../items");
    //       }}
    //       style={{
    //         backgroundColor: isItems
    //           ? Colors.light.text
    //           : Colors.light.background,
    //         padding: 16,
    //         width: "50%",
    //         alignItems: "center",
    //         borderColor: "black",
    //         borderTopWidth: 1,
    //         borderBottomWidth: 1,
    //       }}
    //     >
    //       <Text
    //         style={{
    //           fontFamily: "Lora-SemiBold",
    //           color: isItems ? Colors.light.background : Colors.light.text,
    //         }}
    //       >
    //         Items
    //       </Text>
    //     </TouchableOpacity>

    //     <TouchableOpacity
    //       onPress={() => {
    //         router.navigate("/pages/outfits");
    //         // router.replace("../outfits");
    //       }}
    //       style={{
    //         backgroundColor: isOutfits
    //           ? Colors.light.text
    //           : Colors.light.background,
    //         padding: 16,
    //         width: "50%",
    //         alignItems: "center",
    //         borderColor: "black",
    //         borderTopWidth: 1,
    //         borderBottomWidth: 1,
    //       }}
    //     >
    //       <Text
    //         style={{
    //           fontFamily: "Lora-SemiBold",
    //           color: isOutfits ? Colors.light.background : Colors.light.text,
    //         }}
    //       >
    //         Outfits
    //       </Text>
    //     </TouchableOpacity>
    //   </View>
    // </>
  );
}

const s = (t: Theme) =>
  StyleSheet.create({
    textContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      paddingBottom: 15,
      borderBottomColor: t.inkA[14],
    },
  });
