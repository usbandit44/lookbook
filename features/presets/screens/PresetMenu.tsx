import AppButton from "@/components/ui/AppButton";
import { AppIcon } from "@/components/ui/AppIcon";
import AppText from "@/components/ui/AppText";
import Searchbar from "@/components/ui/SearchBar";
import { Theme } from "@/constants/themes";
import { presets } from "@/db/schemas/presets";
import { useDrizzle } from "@/hooks/DrizzleContext";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { useTheme } from "@/hooks/ThemeProvider";
import { selectCurrentOutfitId } from "@/redux/slices/outfitSlice";
import { clearPresetState } from "@/redux/slices/presetSlice";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import Fuse from "fuse.js";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import PresetPreview from "../components/PresetPreview";

const PresetMenu = () => {
  const { theme } = useTheme();
  const t = theme;
  const styles = s(t);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentOutfit = useAppSelector(selectCurrentOutfitId);

  const drizzleDb = useDrizzle();

  const [search, setSearch] = useState<string>("");

  const { data: presetList } = useLiveQuery(drizzleDb.select().from(presets));

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const filteredData = useMemo(() => {
    const searchFilter = debouncedSearch.split(" ").filter((t) => t !== "");

    let filtered = presetList ?? [];
    if (searchFilter.length > 0) {
      filtered = filtered.filter((preset) => {
        return searchFilter.every((term) => {
          const fuse = new Fuse([preset.name], { threshold: 0.2 });
          return fuse.search(term).length > 0;
        });
      });
    }
    const sorted = [...filtered].sort(
      (a, b) => Number(b.favorited) - Number(a.favorited),
    );

    return sorted;
  }, [debouncedSearch, presetList]);

  const emptyState = () => {
    if (presetList.length > 0) {
      return (
        <View style={{ paddingTop: 15 }}>
          <AppText
            text={"No presets match " + `"${search}"`}
            type={"m5"}
          ></AppText>
        </View>
      );
    } else {
      return (
        <View style={{ paddingTop: 15 }}>
          <AppText text={"No presets saved yet."} type={"m5"}></AppText>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppButton
          type="icon"
          icon={<AppIcon name="arrowLeft" size={24} />}
          onPress={() => {
            if (currentOutfit.id == -1) {
              router.navigate("/pages");
            } else {
              router.navigate("/outfit/create-outfit");
            }
          }}
        ></AppButton>
      </View>
      <ScrollView style={styles.body}>
        <AppText
          text={
            "Start from a preset, build a new one, or pick pieces yourself."
          }
          type={"p5"}
          style={{ paddingBottom: 20 }}
        ></AppText>
        <Searchbar
          value={search}
          onChangeText={setSearch}
          placeholder="Search presets"
        ></Searchbar>
        <AppText
          text={"Your Presets"}
          type={"m5"}
          style={{ paddingBottom: 10, paddingTop: 20 }}
        ></AppText>
        <View style={styles.presetList}>
          {filteredData.map((preset, index) => {
            return (
              <PresetPreview
                id={preset.id}
                key={index}
                name={preset.name}
                types={preset.types}
                favorited={preset.favorited ?? false}
              />
            );
          })}
        </View>
        {filteredData.length > 0 ? null : emptyState()}
      </ScrollView>
      <View style={styles.footer}>
        <AppButton
          type="secondary"
          label="Select Manually"
          onPress={() => {
            router.navigate("/outfit/add-item");
          }}
        ></AppButton>
        <AppButton
          label="New Preset"
          onPress={() => {
            dispatch(clearPresetState());
            router.navigate("/presets/create-preset");
          }}
        ></AppButton>
      </View>
    </View>
  );
};

export default PresetMenu;

const s = (t: Theme) =>
  StyleSheet.create({
    container: { flex: 1 },
    header: {
      paddingHorizontal: 15,
      paddingBottom: 15,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    body: { flex: 1, width: "100%", paddingHorizontal: 15, paddingTop: 10 },
    presetList: {
      borderWidth: 1,
      borderColor: t.inkA[12],
      backgroundColor: t.inkA[12], // shows through as 1px seams between rows
      gap: 1,
    },
    footer: {
      width: "100%",
      flexDirection: "row",
      gap: 15,
      padding: 15,
      paddingBottom: 40,
      borderTopWidth: 1,
      borderTopColor: t.inkA[10],
    },
  });
