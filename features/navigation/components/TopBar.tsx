import AppText from "@/components/ui/AppText";
import { Colors } from "@/constants/constants";
import { Theme } from "@/constants/themes";
import { useRepo } from "@/hooks/RepoProvider";
import { useTheme } from "@/hooks/ThemeProvider";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function TopBar({ backgroundColor = Colors.light.background }) {
  const { outfitRepo, itemRepo } = useRepo();
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
      margin: 15,
      borderBottomColor: t.inkA[14],
    },
  });
