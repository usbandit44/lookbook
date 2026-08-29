import AppButton from "@/components/ui/AppButton";
import AppText from "@/components/ui/AppText";
import SearchableDropdown from "@/components/ui/SearchableDropdown";
import Tag from "@/components/ui/Tag";
import {
  Colors,
  itemColors,
  itemSubTypes,
  itemTypesArray,
  NewItemType,
} from "@/constants/constants";
import { ItemsType } from "@/db/schemas/items";
import { user } from "@/db/schemas/user";
import {
  ensurePersistedItemImageUri,
  normalizeImageUri,
} from "@/functions/imageHandling";
import { useDrizzle } from "@/hooks/DrizzleContext";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { useTheme } from "@/hooks/ThemeProvider";
import { useSnackbar } from "@/hooks/useSnackBar";

import { AppIcon } from "@/components/ui/AppIcon";
import ColorSelector from "@/features/add-item/components/ColorSelector";
import {
  addItemTag,
  addItemTagToFront,
  clearCurrentItemId,
  clearItemColor,
  clearItems,
  clearItemType,
  increaseIndex,
  removeItemTag,
  selectCurrentItem,
  selectIndex,
  selectItems,
  setItemBackgroundRemoved,
  setItemColor,
  setItemFavorited,
  setItemImgUrl,
  setItemName,
  setItemType,
} from "@/redux/slices/itemSlice";
import AppItemRepo from "@/repo/item_repo/AppItemRepo";
import AppOutfitRepo from "@/repo/outfit_repo/AppOutfitRepo";
import AppUserRepo from "@/repo/user_repo/AppUserRepo";
import { useFocusEffect } from "@react-navigation/native";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type FormValues = {
  img: string;
  type: string;
};

const AddItemForm = () => {
  const { theme } = useTheme();
  const drizzleDb = useDrizzle();
  const { data: liveUserData } = useLiveQuery(drizzleDb.select().from(user));

  const customTags = liveUserData?.[0]?.customTags ?? [];

  const scrollRef = useRef<ScrollView>(null);

  const snackbarSettingsContext = useSnackbar();
  if (!snackbarSettingsContext) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }

  const { setSettings, showSnackbar, hideSnackbar, settings } =
    snackbarSettingsContext;

  const itemRepo = new AppItemRepo();
  const outfitRepo = new AppOutfitRepo();
  const userRepo = new AppUserRepo();

  const currentItemId = useAppSelector(selectCurrentItem);
  const itemsIndex = useAppSelector(selectIndex);
  const itemsList = useAppSelector(selectItems);
  const item = itemsList[itemsIndex];

  useFocusEffect(
    useCallback(() => {
      return () => {
        setShowImgError(false);
        setShowTypeError(false);
        // setshowSizeError(false);
      };
    }, []),
  );

  const [searchCustomTags, setSearchCustomTags] = useState("");

  const [currentItem, setCurrentItem] = useState<ItemsType | null>(null);
  let gap = { gap: 180 };
  if (currentItemId != -1) {
    gap = { gap: 150 };
  }

  useEffect(() => {
    if (currentItemId != -1) {
      async function getCurrentItem() {
        const oldItem = await itemRepo.getItem(currentItemId);
        const normalizedImgUrl = normalizeImageUri(item.imgUrl);

        setCurrentItem(oldItem);
        dispatch(setItemImgUrl({ index: itemsIndex, url: normalizedImgUrl }));
        // dispatch(
        //   addItem({
        //     name: queriedItem.name,
        //     type: queriedItem.type,
        //     color: queriedItem.color ?? "",
        //     tags: queriedItem.tags,
        //     imgUrl: queriedItem.imgUrl,
        //     backgroundRemoved: queriedItem.backgroundRemoved,
        //   }),
        // );
        console.log("new: " + item.imgUrl);
      }
      getCurrentItem();
    } else {
      async function getItemCount() {
        const count = await itemRepo.countNumberOfItem();

        dispatch(
          setItemName({
            index: itemsIndex,
            name: "Item #" + (Number(count) + 1),
          }),
        );
        //setImg(item.imgUrl);
      }
      getItemCount();
    }
  }, [currentItemId, settings]);

  const dispatch = useAppDispatch();

  const router = useRouter();

  const [showImgError, setShowImgError] = useState(false);
  const [showTypeError, setShowTypeError] = useState(false);

  const updatable = () => {
    if (!currentItem) return false;
    if (currentItem.imgUrl !== item.imgUrl) return true;
    if (currentItem.name !== item.name) return true;
    if (currentItem.color !== item.color) return true;
    if (currentItem.type !== item.type) return true;
    if (currentItem.favorited !== item.favorited) return true;
    const a = currentItem.tags ?? [];
    const b = item.tags ?? [];
    if (a.length !== b.length) return true;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return true;
    }
    return false;
  };

  const insertItem = async (item: NewItemType) => {
    try {
      await itemRepo.addItem(item);
    } catch (err) {
      console.log(err);
    }
  };

  const createItem = async () => {
    console.log(item);
    if (item.imgUrl === "" || item.type == null) {
      if (item.imgUrl === "") setShowImgError(true);
      if (item.type == null) setShowTypeError(true);

      return false;
    }
    const persistedUri = await ensurePersistedItemImageUri(item.imgUrl);
    try {
      const newItem = {
        name: item.name,
        type: item.type,
        color: item.color,
        tags: item.tags,
        imgUrl: persistedUri,
        backgroundRemoved: true,
      };
      dispatch(setItemImgUrl({ index: itemsIndex, url: persistedUri }));
      dispatch(
        setItemBackgroundRemoved({
          index: itemsIndex,
          backgroundRemoved: true,
        }),
      );
      await insertItem(item);
      if (itemsIndex + 1 != itemsList.length) {
        console.log("hello");
        dispatch(increaseIndex());
      } else {
        dispatch(clearItems());
        router.navigate("/pages");
      }

      //setVisablity(!visablity);
      showSnackbar("Item successfully added", "success");

      setTimeout(() => hideSnackbar(), 3000);
      return true;
    } catch (error) {
      console.error("Failed to copy photo:", error);
      return false;
    }
  };

  const updateItem = async (): Promise<boolean> => {
    if (item.imgUrl === "" || item.type == null) {
      if (item.imgUrl === "") setShowImgError(true);
      if (item.type == null) setShowTypeError(true);

      // if (size == "") setshowSizeError(true);
      return false;
    }
    if (updatable()) {
      try {
        console.log("hello");
        const persistedUri = await ensurePersistedItemImageUri(item.imgUrl);
        const newItem: ItemsType = {
          id: currentItemId,
          name: item.name,
          type: item.type,
          color: item.color,
          tags: item.tags,
          favorited: item.favorited,
          imgUrl: persistedUri,
          backgroundRemoved: true,
        };
        console.log("test: " + JSON.stringify(newItem, null, 2));
        await itemRepo.updateItem(newItem);
        //setUpdateVisablity(!updateVisablity);
        dispatch(clearItems());
        dispatch(clearCurrentItemId());
        showSnackbar("Item successfully updated", "success");

        setTimeout(() => hideSnackbar(), 3000);
        return true;
      } catch (e) {
        console.error("Failed to persist item image:", e);
        showSnackbar("Could not save image. Try again.", "error");
        return false;
      }
    }
    return false;
  };

  function removeSubtypeOfType(type: string) {
    const subTypes = itemSubTypes.filter((item) => item.key === type);
    console.log(item.tags);

    for (const subType of subTypes) {
      if (item.tags.includes(subType.value)) {
        dispatch(
          removeItemTag({
            index: itemsIndex,
            tag: subType.value,
          }),
        );
      }
    }
  }

  if (!item) return null;

  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        <AppButton
          onPress={() => {
            router.navigate("/pages");
            dispatch(clearCurrentItemId());
            dispatch(clearItems());
          }}
          // style={{
          //   padding: 15,
          //   position: "absolute",
          //   top: 0,
          //   left: 0,
          //   backgroundColor: "transparent",
          //   zIndex: 100,
          // }}
          type="icon"
          icon={<AppIcon name="arrowLeft" color="black" size={24} />}
        ></AppButton>
        {currentItemId == -1 ? (
          <AppText
            text={`${String(itemsIndex + 1).padStart(2, "0")}/${String(itemsList.length).padStart(2, "0")}`}
            type="m8"
          />
        ) : (
          <AppButton
            type="icon"
            onPress={async () => {
              router.navigate("/pages");
              itemRepo.deleteItem(currentItemId);
              outfitRepo.removeItemFromAllOutfits(currentItemId);
              dispatch(clearCurrentItemId());
              dispatch(clearItems());
            }}
            // style={{
            //   padding: 15,
            //   position: "absolute",
            //   top: 0,
            //   right: 0,
            //   backgroundColor: "transparent",
            //   zIndex: 100,
            // }}
            icon={<AppIcon name="trash" color={theme.danger} size={24} />}
          ></AppButton>
        )}
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.form}
          bounces={true}
          ref={scrollRef}
        >
          <View style={[styles.imageBlock]}>
            <Image
              source={{ uri: item.imgUrl }}
              contentFit="cover"
              style={[
                styles.imageWrapper,
                {
                  backgroundColor: theme.surfaceSunken,
                  borderColor: theme.inkA[10],
                },
              ]}
            />
            <AppButton
              type="icon"
              style={{
                position: "absolute",
                top: 1,
                right: 1,
                padding: 9,
                backgroundColor: theme.surface,
              }}
              icon={
                item.favorited ? (
                  <AppIcon name={"star"}></AppIcon>
                ) : (
                  <AppIcon name={"starOutline"}></AppIcon>
                )
              }
              onPress={() => {
                console.log(!item.favorited);
                dispatch(
                  setItemFavorited({
                    index: itemsIndex,
                    favorited: !item.favorited,
                  }),
                );
              }}
            ></AppButton>
            <AppButton
              type="link"
              onPress={() => {
                router.navigate("/camera-screen");
                //dispatch(updateNewItemImg(""));
              }}
              label="Replace Image"
            ></AppButton>
          </View>

          <View style={styles.tagSection}>
            {item.tags.length != 0 ? (
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                {item.tags.map((tag, index) => {
                  return (
                    <Tag
                      key={index}
                      onClear={() => {
                        dispatch(removeItemTag({ index: itemsIndex, tag }));
                        if (item.type == tag) {
                          dispatch(clearItemType({ index: itemsIndex }));
                          removeSubtypeOfType(tag);
                        }
                        if (item.color == tag) {
                          dispatch(clearItemColor({ index: itemsIndex }));
                        }
                      }}
                      label={tag}
                    ></Tag>
                  );
                })}
              </View>
            ) : null}

            <View
              style={{
                alignItems: "flex-start",
                width: "100%",
                gap: 8,
              }}
            >
              <AppText type="m5" text="Type"></AppText>

              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                {itemTypesArray.map((type, index) => {
                  const selected = item.tags.includes(type);

                  return (
                    <AppButton
                      onPress={() => {
                        if (selected) {
                          dispatch(
                            removeItemTag({ index: itemsIndex, tag: type }),
                          );
                          dispatch(clearItemType({ index: itemsIndex }));
                          removeSubtypeOfType(type);
                        } else {
                          if (item.type != "") {
                            return;
                          }
                          dispatch(
                            addItemTagToFront({ index: itemsIndex, tag: type }),
                          );
                          dispatch(setItemType({ index: itemsIndex, type }));
                        }
                      }}
                      type={selected ? "primary" : "secondary"}
                      key={index}
                      style={styles.tagSelects}
                      label={type}
                    ></AppButton>
                  );
                })}
              </View>
            </View>

            <View
              style={{
                alignItems: "flex-start",
                width: "100%",
                gap: 8,
              }}
            >
              <AppText
                type="m5"
                text={"Subtypes" + (item.type != "" ? " - " + item.type : "")}
              ></AppText>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                {item.type == "" ? (
                  <AppText
                    type="p6"
                    text="Select a type above to see its subtypes."
                  ></AppText>
                ) : null}
                {itemSubTypes
                  .filter((i) => i.key === item.type)
                  .map((i) => i.value)
                  .map((type, index) => {
                    const selected = item.tags.includes(type);

                    return (
                      <AppButton
                        onPress={() => {
                          if (selected) {
                            dispatch(
                              removeItemTag({ index: itemsIndex, tag: type }),
                            );
                          } else {
                            dispatch(
                              addItemTag({ index: itemsIndex, tag: type }),
                            );
                          }
                        }}
                        type={selected ? "primary" : "secondary"}
                        key={index}
                        style={styles.tagSelects}
                        label={type}
                      ></AppButton>
                    );
                  })}
              </View>
            </View>

            <View
              style={{
                alignItems: "flex-start",
                width: "100%",
                gap: 8,
              }}
            >
              <AppText type="m5" text={"Color"}></AppText>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                {itemColors.map((color, index) => {
                  const selected = item.tags.includes(color);

                  return (
                    <ColorSelector
                      key={index}
                      label={color}
                      selected={selected}
                      onPress={() => {
                        if (selected) {
                          dispatch(
                            removeItemTag({ index: itemsIndex, tag: color }),
                          );
                          dispatch(clearItemColor({ index: itemsIndex }));
                        } else {
                          if (item.color != "") {
                            return;
                          }
                          dispatch(
                            addItemTag({ index: itemsIndex, tag: color }),
                          );
                          dispatch(
                            setItemColor({ index: itemsIndex, color: color }),
                          );
                        }
                      }}
                    ></ColorSelector>
                  );
                })}
              </View>
            </View>
            <View
              style={{
                alignItems: "flex-start",
                width: "100%",
                gap: 8,
              }}
            >
              <AppText type="m5" text="Custom Tags"></AppText>
              <SearchableDropdown
                options={customTags}
                onSelect={(value) => {
                  dispatch(addItemTag({ index: itemsIndex, tag: value }));
                }}
                value={searchCustomTags}
                onChangeText={setSearchCustomTags}
                scrollRef={scrollRef}
                footer={
                  // <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
                  //   <Pressable
                  //     onPress={() => {
                  //       if (!customTags.includes(searchCustomTags.trim())) {
                  //         userRepo.addCustomTag(searchCustomTags.trim());

                  //         dispatch(
                  //           addItemTag({
                  //             index: itemsIndex,
                  //             tag: searchCustomTags.trim(),
                  //           }),
                  //         );
                  //       }
                  //     }}
                  //     style={{ width: "100%", alignItems: "center" }}
                  //   >
                  //     <AppText style={{ color: "black" }}>+ Add Tag</AppText>
                  //   </Pressable>
                  // </View>
                  <Pressable
                    onPress={() => {
                      if (!customTags.includes(searchCustomTags.trim())) {
                        userRepo.addCustomTag(searchCustomTags.trim());

                        dispatch(
                          addItemTag({
                            index: itemsIndex,
                            tag: searchCustomTags.trim(),
                          }),
                        );
                      }
                    }}
                    style={{
                      height: 46,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: theme.surfaceAlt,
                    }}
                    disabled={!searchCustomTags.trim()}
                  >
                    <Text
                      style={[
                        styles.addTagLabel,
                        !searchCustomTags.trim()
                          ? { color: theme.inkA[30] }
                          : { color: theme.ink },
                      ]}
                    >
                      + Add tag
                    </Text>
                  </Pressable>
                }
                onClearItem={(item) => {
                  userRepo.removeCustomTag(item);
                  dispatch(
                    removeItemTag({
                      index: itemsIndex,
                      tag: searchCustomTags.trim(),
                    }),
                  );
                }}
                placeholder="Search or create a tag"
              ></SearchableDropdown>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={[styles.footer, { borderTopColor: theme.inkA[10] }]}>
        {currentItemId == -1 ? (
          <AppButton
            type="secondary"
            onPress={() => {
              if (itemsIndex + 1 != itemsList.length) {
                dispatch(increaseIndex());
              } else {
                dispatch(clearItems());
                router.navigate("/pages");
              }
            }}
            label="Discard"
          ></AppButton>
        ) : (
          <AppButton
            type={updatable() ? "secondary" : "ghost"}
            onPress={async () => {
              const ok = await updateItem();
              if (ok) router.navigate("/pages");
            }}
            label="Update"
          ></AppButton>
        )}

        {currentItemId != -1 ? (
          <AppButton
            onPress={async () => {
              const ok = await updateItem();
              if (ok) router.navigate("/pages");
            }}
            label="BUILD FROM ITEM"
          ></AppButton>
        ) : (
          <AppButton
            onPress={async () => {
              const completed = await createItem();
            }}
            label="Done"
          ></AppButton>
        )}
      </View>
    </View>
  );
};

export default AddItemForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingLeft: 20,
    // paddingRight: 20,
    // paddingBottom: 20,
    // justifyContent: "space-between",
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  form: {
    paddingTop: 6,
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: "center",
    gap: 20,
  },
  imageBlock: {
    alignItems: "center",
    gap: 10,
  },
  imageWrapper: {
    position: "relative",
    width: "90%",
    aspectRatio: 1,
    borderWidth: 1,
    overflow: "hidden",
  },
  clearIcon: {
    position: "absolute",
    top: -15,
    right: -15,
    backgroundColor: Colors.light.background,
    borderRadius: 50,
    padding: 1,
    zIndex: 2,
  },
  cameraButton: {
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    aspectRatio: 1,
  },
  tagSelects: { flex: 0, height: "auto" },
  tagSection: {
    width: "100%",
    //aspectRatio: 1,

    justifyContent: "flex-start",
    gap: 20,
  },
  footer: {
    flexDirection: "row",
    gap: 15,
    padding: 15,
    paddingBottom: 40,
    borderTopWidth: 1,
  },
  addTagLabel: {
    fontFamily: "IBMPlexMono-SemiBold",
    fontSize: 9.5,
    letterSpacing: 1.14, // .12em × 9.5
    textTransform: "uppercase",
  },
});
