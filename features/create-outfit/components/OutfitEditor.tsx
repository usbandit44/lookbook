import AppButton from "@/components/ui/AppButton";
import AppModal from "@/components/ui/AppModal";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/constants/constants";
import icons from "@/constants/icons";
import { ItemsType } from "@/db/schemas/items";
import {
  ensurePersistedItemImageUri,
  normalizeImageUri,
} from "@/functions/imageHandling";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { useSnackbar } from "@/hooks/useSnackBar";
import {
  clearAllItems,
  clearCurrentOutfit,
  clearOutfitPosition,
  getItemsPositions,
  removeItem,
  removeItemPosition,
  selectCurrentOutfitId,
  selectOutfit,
  setItems,
} from "@/redux/slices/outfitSlice";
import AppItemRepo from "@/repo/item_repo/AppItemRepo";
import AppOutfitRepo from "@/repo/outfit_repo/AppOutfitRepo";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { InteractionManager, Pressable, StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { captureRef } from "react-native-view-shot";
import Movable from "./Movable";

const BASE_SIZE = 100;

function arraysEqualUnordered(arr1: number[], arr2: number[]) {
  const sorted1 = [...arr1].sort((a, b) => a - b);
  const sorted2 = [...arr2].sort((a, b) => a - b);
  return JSON.stringify(sorted1) === JSON.stringify(sorted2);
}

const OutfitEditor: React.FC = () => {
  const snackbarSettingsContext = useSnackbar();
  if (!snackbarSettingsContext) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }

  const { showSnackbar, hideSnackbar, settings } = snackbarSettingsContext;

  const dispatch = useAppDispatch();
  const viewRef = useRef<View>(null);
  const moreButtonRef = useRef<View>(null);

  const outfitRepo = new AppOutfitRepo();
  const [saved, setSaved] = useState(false);
  const [outfitName, setOutfitName] = useState("");
  const [defaultName, setDefaultName] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);

  const repo = new AppItemRepo();
  const items = useAppSelector(selectOutfit);
  const currentOutfit = useAppSelector(selectCurrentOutfitId);
  const itemsPositions = useAppSelector(getItemsPositions);

  const [outfit, setOutfit] = useState<ItemsType[]>([]);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });
  const [savedOutfitId, setSavedOutfitId] = useState<number>(-1);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [editing, setEditing] = useState(false);

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

  // ── Dropdown menu state/animation ─────────────────────────────────────────
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  const toggleMenu = (show: boolean) => {
    setMenuVisible(show);
    scale.value = withSpring(show ? 1 : 0.8, { damping: 15, stiffness: 250 });
    opacity.value = withTiming(show ? 1 : 0, { duration: 150 });
  };

  const openMenu = () => {
    moreButtonRef.current?.measureInWindow((x, y, width, height) => {
      setMenuPosition({ top: 45, right: 15 });
      toggleMenu(true);
    });
  };

  const menuStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  // ───────────────────────────────────────────────────────────────────────────

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
      });

      console.log("4 - created outfit:", createdOutfitId);

      setSavedOutfitId(createdOutfitId);
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
    };
    outfitRepo.updateOutfit(newOutfit);
  };

  const deleteOutfit = () => {
    outfitRepo.deleteOutfit(currentOutfit.id);
  };

  const undoOutfitChanges = async () => {
    const oldOutfit = await outfitRepo.getOutfit(currentOutfit.id);
    setOutfitName(oldOutfit.name);
    dispatch(setItems(oldOutfit.items));
  };

  const leftButton = () => {
    return editing ? (
      <AppButton
        type="icon"
        onPress={() => {
          undoOutfitChanges();
        }}
      >
        <Icon name="close" type="material" size={24} />
      </AppButton>
    ) : (
      <AppButton
        type="icon"
        onPress={async () => {
          if (currentOutfit.id != -1) {
            if (
              !arraysEqualUnordered(oldOutfit.items, items) ||
              oldOutfit.name != outfitName
            ) {
              setModalVisible(!modalVisible);
            } else {
              if (oldOutfit.updateImgUrl) {
                await updateOutfit();
              }
              dispatch(clearAllItems());
              dispatch(clearCurrentOutfit());
              dispatch(clearOutfitPosition());
              router.navigate("/pages/outfits");
            }
          } else {
            dispatch(clearAllItems());
            dispatch(clearCurrentOutfit());
            dispatch(clearOutfitPosition());
            router.navigate("/pages/outfits");
          }
        }}
      >
        <Icon name="arrow-back-ios" type="material" size={24} />
      </AppButton>
    );
  };

  const rightButton = () => {
    if (currentOutfit.id != -1) {
      return editing ? (
        <AppButton type="icon">
          <Icon
            name="check"
            type="material"
            size={24}
            onPress={async () => {
              await updateOutfit();
              showSnackbar("Outfit saved!", "success");
              setTimeout(() => hideSnackbar(), 3000);
            }}
          />
        </AppButton>
      ) : (
        <AppButton type="icon" onPress={openMenu}>
          <View ref={moreButtonRef} collapsable={false}>
            <Icon name="more-vert" type="material" size={24} />
          </View>
        </AppButton>
      );
    } else {
      return (
        <AppButton
          type="text"
          onPress={async () => {
            await saveOutfit();
            dispatch(clearAllItems());
            dispatch(clearCurrentOutfit());
            dispatch(clearOutfitPosition());
            showSnackbar("Outfit added!", "success");

            setTimeout(() => router.navigate("/pages/outfits"), 300);
            setTimeout(() => hideSnackbar(), 3000);
          }}
        >
          <AppText>Save</AppText>
        </AppButton>
      );
    }
  };

  useEffect(() => {
    console.log(itemsPositions);
    console.log(items);
    async function setup() {
      const results = await Promise.all(items.map((id) => repo.getItem(id)));
      setOutfit(results);
      if (currentOutfit.id != -1) {
        console.log(itemsPositions);
        setOutfitName(currentOutfit.name);

        const pastOutfit = await outfitRepo.getOutfit(currentOutfit.id);

        if (!arraysEqualUnordered(pastOutfit.items, items)) {
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
  }, [items, settings]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        {leftButton()}
        {rightButton()}
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
            console.log("Pos: " + pos);
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

      <View style={styles.footerContainer}>
        <View style={styles.navButtonContainer}>
          <Pressable
            onPress={() => router.navigate("/outfit/add-item")}
            style={styles.navButton}
          >
            <Icon name="shirt-outline" type="ionicon" size={35} />
          </Pressable>
          <AppText type="p3SemiBold">Add Item</AppText>
        </View>
        <View style={styles.navButtonContainer}>
          <Pressable
            onPress={() => router.navigate("/outfit/generate-outfit")}
            style={styles.navButton}
          >
            <Image
              source={icons.generateOutfitIcon}
              style={{ width: 45, height: 45, resizeMode: "contain" }}
            />
          </Pressable>
          <AppText type="p3SemiBold">Generate Outfit</AppText>
        </View>
      </View>

      {/* Tap-outside catcher — invisible, fills screen, only active while menu is open */}
      <Pressable
        style={styles.optionsScreen}
        onPress={() => toggleMenu(false)}
        pointerEvents={menuVisible ? "auto" : "none"}
      >
        <Animated.View
          style={[
            styles.optionsMenu,
            menuStyle,
            {
              position: "absolute",
              top: menuPosition.top,
              right: menuPosition.right,
              transformOrigin: "top right",
            },
          ]}
        >
          <AppButton
            type="text"
            onPress={async () => {
              toggleMenu(false);
              await updateOutfit();
              showSnackbar("Cover photo updated!", "success");
              setTimeout(() => hideSnackbar(), 3000);
            }}
          >
            <AppText style={{ fontSize: 16 }}>Update Cover Photo</AppText>
          </AppButton>
          <AppButton
            type="text"
            onPress={() => {
              toggleMenu(false);
              setDeleteModalVisible(true);
            }}
          >
            <AppText style={{ color: Colors.light.destructive, fontSize: 16 }}>
              Delete
            </AppText>
          </AppButton>
        </Animated.View>
      </Pressable>

      <AppModal
        modalVisible={deleteModalVisible}
        setModalVisible={setDeleteModalVisible}
      >
        <AppText>Do you want to delete this outfit?</AppText>
        <AppButton
          fullWidth={true}
          onPress={async () => {
            deleteOutfit();
            setDeleteModalVisible(!deleteModalVisible);
            dispatch(clearAllItems());
            dispatch(clearCurrentOutfit());
            dispatch(clearOutfitPosition());
            router.navigate("/pages/outfits");
          }}
        >
          <AppText style={{ color: "white" }}>Yes</AppText>
        </AppButton>
        <AppButton
          fullWidth={true}
          onPress={() => setDeleteModalVisible(!deleteModalVisible)}
        >
          <AppText style={{ color: "white" }}>Cancel</AppText>
        </AppButton>
      </AppModal>
    </View>
  );
};

export default OutfitEditor;

const styles = StyleSheet.create({
  editor: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {
    width: "100%",
    paddingHorizontal: 15,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 25,
  },
  name: {
    flex: 1,
    height: 50,
    borderColor: "black",
    borderWidth: 1.1,
    borderRadius: 8,
    color: "black",
    padding: 8,
    textAlign: "center",
    fontSize: 25,
    fontFamily: "Lora-SemiBold",
    letterSpacing: 1,
  },
  footerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 75,
    padding: 30,
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
  optionsMenu: {
    flexDirection: "column",
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 7,
    minWidth: 180,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
});
