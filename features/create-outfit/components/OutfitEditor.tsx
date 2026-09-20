import AppButton from "@/components/ui/AppButton";
import { AppIcon } from "@/components/ui/AppIcon";
import AppText from "@/components/ui/AppText";
import { Theme } from "@/constants/themes";
import { ItemsType } from "@/db/schemas/items";
import {
  ensurePersistedItemImageUri,
  normalizeImageUri,
} from "@/functions/imageHandling";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
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
import AppItemRepo from "@/repo/item_repo/AppItemRepo";
import AppOutfitRepo from "@/repo/outfit_repo/AppOutfitRepo";
import { Image } from "expo-image";
import { router } from "expo-router";
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

const OutfitEditor: React.FC = () => {
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

  const outfitRepo = new AppOutfitRepo();

  const repo = new AppItemRepo();
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
          onPress={() => {
            hide();
            updateOutfit();
            showSnackbar("Cover Image Updated`", "success");
            setTimeout(() => hideSnackbar(), 3000);
          }}
        >
          <AppIcon name={"image"}></AppIcon>
          <AppText
            text={"Update Cover Image"}
            type={"p3"}
            style={{ fontSize: 15 }}
          ></AppText>
        </Pressable>

        <Pressable
          style={styles.modalRow}
          onPress={() => {
            hide();
            deleteOutfit();
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
    outfitRepo.updateOutfit(newOutfit);
  };

  const deleteOutfit = () => {
    outfitRepo.deleteOutfit(currentOutfit.id);
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
      const results = await Promise.all(items.map((id) => repo.getItem(id)));
      setOutfit(results);
      if (currentOutfit.id != -1) {
        console.log(itemsPositions);
        // setOutfitName(currentOutfit.name);

        const pastOutfit = await outfitRepo.getOutfit(currentOutfit.id);

        if (
          !arraysEqualUnordered(pastOutfit.items, items) ||
          outfitName != pastOutfit.name
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
  }, [items, settings, outfitName]);

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
      {/* <View style={styles.footerContainer}>
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
      </View> */}

      {/* Tap-outside catcher — invisible, fills screen, only active while menu is open
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
      </AppModal> */}
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
