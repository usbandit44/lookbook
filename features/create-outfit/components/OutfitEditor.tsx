import AppButton from "@/components/ui/AppButton";
import { AppIcon } from "@/components/ui/AppIcon";
import AppText from "@/components/ui/AppText";
import { OutfitPositions } from "@/constants/constants";
import { Theme } from "@/constants/themes";
import { ItemsType } from "@/db/schemas/items";
import {
  ensurePersistedItemImageUri,
  normalizeImageUri,
} from "@/functions/imageHandling";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { useRepo } from "@/hooks/RepoProvider";
import { useTheme } from "@/hooks/ThemeProvider";
import { useAppModal } from "@/hooks/useAppModal";
import { useSnackbar } from "@/hooks/useSnackBar";
import {
  clearAllItems,
  clearCurrentOutfit,
  clearOutfitPosition,
  getFavorited,
  getItemsPositions,
  removeItem,
  removeItemPosition,
  selectCurrentOutfitId,
  selectOutfit,
  setFavorited,
  setOutfitItems,
} from "@/redux/slices/outfitSlice";
import { clearPresetState } from "@/redux/slices/presetSlice";
import { Image } from "expo-image";
import { router } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { syncAnalyticsProperties } from "@/config/posthog";
import { consumeGeneratedOutfitSource } from "@/hooks/useGenerateOutfit";
import React, { useEffect, useRef, useState } from "react";
import {
  InteractionManager,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import Movable from "./Movable";

const BASE_SIZE = 100;

function arraysEqualUnordered(arr1: number[], arr2: number[]) {
  const sorted1 = [...arr1].sort((a, b) => a - b);
  const sorted2 = [...arr2].sort((a, b) => a - b);
  return JSON.stringify(sorted1) === JSON.stringify(sorted2);
}

function areItemPositionsEqual(
  a: OutfitPositions | string | null | undefined,
  b: OutfitPositions | string | null | undefined,
): boolean {
  const parse = (v: typeof a): OutfitPositions =>
    typeof v === "string" ? JSON.parse(v) : (v ?? {});

  const pa = parse(a);
  const pb = parse(b);

  const aKeys = Object.keys(pa);
  if (aKeys.length !== Object.keys(pb).length) return false;

  const EPS = 0.5; // ignore sub-pixel drift
  const close = (x = 0, y = 0) => Math.abs(x - y) < EPS;

  return aKeys.every((key) => {
    const p1 = pa[Number(key)];
    const p2 = pb[Number(key)];
    return (
      p2 !== undefined &&
      close(p1.x, p2.x) &&
      close(p1.y, p2.y) &&
      Math.abs((p1.scale ?? 1) - (p2.scale ?? 1)) < 0.01
    );
  });
}
const OutfitEditor: React.FC = () => {
  const posthog = usePostHog();
  const { theme } = useTheme();
  const t = theme;
  const styles = s(t);

  const snackbarSettingsContext = useSnackbar();
  if (!snackbarSettingsContext) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }

  const { showSnackbar, hideSnackbar, settings } = snackbarSettingsContext;

  const dispatch = useAppDispatch();
  const viewRef = useRef<View>(null);
  const moreButtonRef = useRef<View>(null);

  const repos = useRepo();
  const { outfitRepo, itemRepo } = repos;

  const items = useAppSelector(selectOutfit);
  const currentOutfit = useAppSelector(selectCurrentOutfitId);
  const itemsPositions = useAppSelector(getItemsPositions);
  const favorited = useAppSelector(getFavorited);
  const [outfit, setOutfit] = useState<ItemsType[]>([]);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });
  const [savedOutfitId, setSavedOutfitId] = useState<number>(-1);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [outfitName, setOutfitName] = useState(currentOutfit.name);
  const [defaultName, setDefaultName] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);

  const [oldOutfit, setOldOutfit] = useState<{
    id: number;
    name: string;
    items: number[];
    imgUrl: string;
    updateImgUrl: boolean;
  }>({
    id: 0,
    name: "",
    items: [],
    imgUrl: "",
    updateImgUrl: false,
  });

  const { show, hide } = useAppModal();

  const modalContent = () => {
    return (
      <View>
        <View style={styles.modalTitleRow}>
          <AppText
            text={currentOutfit.name}
            type={"m22"}
            style={{ fontSize: 12 }}
          ></AppText>
        </View>
        <Pressable
          style={styles.modalRow}
          onPress={() => {
            hide();
            console.log(favorited);
            outfitRepo.updateOutfitFavorited(currentOutfit.id, !favorited);
            posthog.capture("favorite_toggled", {
              target: "outfit",
              favorited: !favorited,
            });
            dispatch(setFavorited(!favorited));
          }}
        >
          <AppIcon name={favorited ? "star" : "starOutline"}></AppIcon>
          <AppText
            text={favorited ? "Remove from Favorites" : "Add to Favorites"}
            type={"p3"}
            style={{ fontSize: 15 }}
          ></AppText>
        </Pressable>
        <Pressable
          style={styles.modalRow}
          onPress={async () => {
            hide();
            await deleteOutfit();
            showSnackbar("Outfit Deleted", "success");
            setTimeout(() => hideSnackbar(), 3000);
          }}
        >
          <AppIcon name="trash" color={theme.danger}></AppIcon>
          <AppText
            text={"Delete"}
            type={"p3"}
            style={{ fontSize: 15, color: theme.danger }}
          ></AppText>
        </Pressable>
      </View>
    );
  };

  const captureOutfit = async (): Promise<string> => {
    const view = viewRef.current;

    if (!view) {
      throw new Error("viewRef is null");
    }

    setIsCapturing(true);

    await new Promise<void>((resolve) => {
      InteractionManager.runAfterInteractions(() => {
        setTimeout(resolve, 100);
      });
    });

    const imgUri = await captureRef(view, {
      format: "jpg",
      quality: 0.9,
    });

    setIsCapturing(false);
    return imgUri;
  };

  const saveOutfit = async () => {
    try {
      console.log("1 - starting save");

      const imgUri = await captureOutfit();
      const persistedUri = await ensurePersistedItemImageUri(imgUri);
      // console.log("2 - captured image:", imgUri);

      // const fileName = `screenshot_${Date.now()}.jpg`;
      // const dest = (FileSystem.documentDirectory ?? "") + fileName;

      // await FileSystem.copyAsync({ from: imgUri, to: dest });
      // console.log("3 - copied file");

      const finalName = outfitName === "" ? defaultName : outfitName;

      const createdOutfitId = await outfitRepo.addOutfit({
        items: items,
        name: finalName,
        imgUrl: persistedUri,
        positions: itemsPositions,
        favorited: favorited,
      });

      console.log("4 - created outfit:", createdOutfitId);

      setSavedOutfitId(createdOutfitId);
      const outfitCount = await outfitRepo.countNumberOfOutfit();
      const { source, edited } = consumeGeneratedOutfitSource(items);
      posthog.capture("outfit_created", {
        item_count: items.length,
        source,
        edited_after_generation: edited,
        is_first: outfitCount === 1,
        outfit_count: outfitCount,
      });
      syncAnalyticsProperties(repos);
    } catch (err) {
      console.error("❌ SAVE FAILED:", err);
    }
  };

  const updateOutfit = async () => {
    const imgUri = await captureOutfit();
    const persistedUri = await ensurePersistedItemImageUri(imgUri);

    const newOutfit = {
      id: currentOutfit.id,
      name: outfitName,
      imgUrl: persistedUri,
      items: items,
      updateImgUrl: false,
      positions: itemsPositions,
      favorited: favorited,
    };
    await outfitRepo.updateOutfit(newOutfit);
    posthog.capture("outfit_updated", { item_count: items.length });
  };

  const deleteOutfit = async () => {
    await outfitRepo.deleteOutfit(currentOutfit.id);
    posthog.capture("outfit_deleted", { item_count: items.length });
    syncAnalyticsProperties(repos);
    router.navigate("/pages/outfits");
  };

  const undoOutfitChanges = async () => {
    const oldOutfit = await outfitRepo.getOutfit(currentOutfit.id);
    setOutfitName(oldOutfit.name);
    dispatch(
      setOutfitItems({
        items: oldOutfit.items,
        positions: oldOutfit.positions,
      }),
    );
  };

  const leftButton = () => {
    return editing ? (
      <AppButton
        type="icon"
        icon={<AppIcon name="close" size={24} />}
        onPress={() => {
          undoOutfitChanges();
        }}
      ></AppButton>
    ) : (
      <AppButton
        type="icon"
        icon={<AppIcon name="arrowLeft" size={24} />}
        onPress={async () => {
          dispatch(clearAllItems());
          dispatch(clearCurrentOutfit());
          dispatch(clearOutfitPosition());
          router.navigate("/pages/outfits");
        }}
      ></AppButton>
    );
  };

  const rightButton = () => {
    if (currentOutfit.id != -1) {
      return editing ? (
        <AppButton
          type="icon"
          icon={<AppIcon name="check" size={24} />}
          onPress={async () => {
            await updateOutfit();
            showSnackbar("Outfit saved!", "success");
            setTimeout(() => hideSnackbar(), 3000);
          }}
        ></AppButton>
      ) : (
        <AppButton
          type="icon"
          onPress={() => {
            show(modalContent());
          }}
          icon={<AppIcon name="more" size={24} />}
        ></AppButton>
      );
    } else {
      return (
        <AppButton
          type="text"
          label="Save"
          onPress={async () => {
            await saveOutfit();
            dispatch(clearAllItems());
            dispatch(clearCurrentOutfit());
            dispatch(clearOutfitPosition());
            setTimeout(() => router.navigate("/pages/outfits"), 300);
            showSnackbar("Outfit created", "success");
            setTimeout(() => hideSnackbar(), 3000);
          }}
        ></AppButton>
      );
    }
  };

  useEffect(() => {
    console.log(itemsPositions);
    console.log(items);
    async function setup() {
      const results = await Promise.all(
        items.map((id) => itemRepo.getItem(id)),
      );
      setOutfit(results);
      if (currentOutfit.id != -1) {
        console.log(itemsPositions);
        // setOutfitName(currentOutfit.name);

        const pastOutfit = await outfitRepo.getOutfit(currentOutfit.id);

        if (
          !arraysEqualUnordered(pastOutfit.items, items) ||
          outfitName != pastOutfit.name ||
          !areItemPositionsEqual(pastOutfit.positions, itemsPositions)
        ) {
          setEditing(true);
        } else {
          setEditing(false);
        }

        setOldOutfit(pastOutfit);
      } else {
        async function getItemCount() {
          const count = await outfitRepo.countNumberOfOutfit();
          setDefaultName("Outfit #" + (Number(count) + 1));
        }
        getItemCount();
      }
    }
    setup();
  }, [items, settings, outfitName, itemsPositions]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <View style={styles.headerAction}>
          {leftButton()}
          {rightButton()}
        </View>
        <TextInput
          value={outfitName}
          onChangeText={(value: string) => setOutfitName(value)}
          placeholder={defaultName}
          placeholderTextColor={theme.inkA[38]}
          style={[theme.text.p2, styles.headerTitle]}
        ></TextInput>
      </View>
      <View
        style={styles.editor}
        onLayout={(e) =>
          setParentSize({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
          })
        }
        ref={viewRef}
      >
        {parentSize.width > 0 &&
          parentSize.height > 0 &&
          outfit.map((item) => {
            const pos = itemsPositions[item.id] ?? { x: 0, y: 0, scale: 1 };
            return (
              <Movable
                key={item.id}
                id={item.id}
                parentW={parentSize.width}
                parentH={parentSize.height}
                initialX={pos.x}
                initialY={pos.y}
                initialScale={pos.scale}
                onClear={() => {
                  dispatch(removeItem(item.id));
                  dispatch(removeItemPosition({ id: item.id }));
                }}
                isCapturing={isCapturing}
                modalName={item.color + " / " + item.type}
              >
                <Image
                  source={{ uri: normalizeImageUri(item.imgUrl ?? "") }}
                  contentFit="contain"
                  style={{ width: "100%", height: "100%", borderRadius: 8 }}
                />
              </Movable>
            );
          })}
      </View>
      <View style={styles.footer}>
        <AppButton
          type="secondary"
          label="Add Item"
          onPress={() => {
            router.navigate("/outfit/add-item");
          }}
        ></AppButton>
        <AppButton
          type="secondary"
          label="Generate"
          onPress={() => {
            dispatch(clearPresetState());
            router.navigate("/presets/create-preset");
          }}
        ></AppButton>
      </View>
    </View>
  );
};

export default OutfitEditor;

const s = (t: Theme) =>
  StyleSheet.create({
    editor: {
      flex: 1,
      backgroundColor: t.surfaceSunken,
      borderTopWidth: 1,
      borderColor: t.inkA[10],
    },
    header: { paddingBottom: 15, paddingHorizontal: 15, gap: 25 },
    headerAction: {
      width: "100%",

      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 25,
    },
    headerTitle: {
      width: "100%",

      paddingBottom: 10,
      borderBottomWidth: 1,
      borderColor: t.inkA[16],
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
    navButtonContainer: {
      justifyContent: "center",
      alignItems: "center",
      gap: 5,
    },
    navButton: {
      height: 70,
      width: 70,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 20,
    },
    optionsScreen: {
      ...StyleSheet.absoluteFillObject,
    },

    modalTitleRow: {
      paddingHorizontal: 20,
      paddingTop: 15,
      paddingBottom: 13,
      borderBottomWidth: 1,
      borderBottomColor: t.inkA[10],
    },
    modalRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 13,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: t.inkA[8],
    },
  });
