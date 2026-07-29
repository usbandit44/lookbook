import AppButton from "@/components/ui/AppButton";
import AppModal from "@/components/ui/AppModal";
import AppText from "@/components/ui/AppText";
import FormElement from "@/components/ui/FormElement";
import SearchableDropdown from "@/components/ui/SearchableDropdown";
import Tag from "@/components/ui/Tag";
import {
  Colors,
  itemColors,
  itemSubTypes,
  itemTypesArray,
} from "@/constants/constants";
import { ItemsType } from "@/db/schemas/items";
import { user } from "@/db/schemas/user";
import {
  ensurePersistedItemImageUri,
  normalizeImageUri,
} from "@/functions/imageHandling";
import { useDrizzle } from "@/hooks/DrizzleContext";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { useSnackbar } from "@/hooks/useSnackBar";

import {
  addItemTag,
  clearCurrentItemId,
  clearItems,
  clearItemType,
  increaseIndex,
  removeItemTag,
  selectCurrentItem,
  selectIndex,
  selectItems,
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
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";

type FormValues = {
  img: string;
  type: string;
};

const AddItemForm = () => {
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

  const [deleteModal, setDeleteModal] = useState(false);

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

  const insertItem = async (item: {
    name: string;
    type: string;
    color: string;
    tags: string[];
    imgUrl: string;
    backgroundRemoved: boolean;
  }) => {
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
      await insertItem(newItem);
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
    console.log(currentItem?.imgUrl);
    console.log(item.imgUrl);
    if (
      currentItem?.imgUrl != item.imgUrl ||
      currentItem?.name != item.name ||
      currentItem?.color != item.color ||
      currentItem.type != item.type ||
      currentItem.tags != item.tags
    ) {
      try {
        console.log("hello");
        const persistedUri = await ensurePersistedItemImageUri(item.imgUrl);
        const newItem: ItemsType = {
          id: currentItemId,
          name: item.name,
          type: item.type,
          color: item.color,
          tags: item.tags,
          imgUrl: persistedUri,
          backgroundRemoved: true,
        };

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

  if (!item) return null;

  return (
    <View style={[styles.container]}>
      <AppButton
        onPress={() => {
          router.navigate("/pages");
          dispatch(clearCurrentItemId());
          dispatch(clearItems());
        }}
        style={{
          padding: 15,
          position: "absolute",
          top: 0,
          left: 0,
          backgroundColor: "transparent",
          zIndex: 100,
        }}
      >
        <Icon
          name="arrow-back-ios-new"
          type="material"
          color="black"
          size={24}
        />
      </AppButton>
      {currentItemId == -1 ? null : (
        <AppButton
          type="text"
          onPress={() => {
            setDeleteModal(!deleteModal);
          }}
          style={{
            padding: 15,
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "transparent",
            zIndex: 100,
          }}
        >
          <AppText style={{ color: Colors.light.destructive }}>Delete</AppText>
        </AppButton>
      )}

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
          <FormElement showError={showImgError} errorMsg="Add a Image">
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: item.imgUrl }}
                contentFit="cover"
                style={{ aspectRatio: 1, width: "100%", borderRadius: 2 }}
              />
              <AppButton
                type="text"
                onPress={() => {
                  router.navigate("/camera-screen");
                  //dispatch(updateNewItemImg(""));
                }}
              >
                <AppText type="p3">Retake Image</AppText>
              </AppButton>
            </View>
          </FormElement>

          <View style={styles.tagSection}>
            {item.tags.length != 0 ? (
              <ScrollView
                bounces={true}
                horizontal={true}
                style={{ width: "100%" }}
                contentContainerStyle={{ gap: 8 }}
                showsHorizontalScrollIndicator={false}
              >
                {item.tags.map((tag, index) => {
                  return (
                    <Tag
                      key={index}
                      onClear={() => {
                        dispatch(removeItemTag({ index: itemsIndex, tag }));
                        if (item.type == tag) {
                          dispatch(clearItemType({ index: itemsIndex }));
                          const subTypes = itemSubTypes.filter(
                            (item) => item.key === tag,
                          );

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
                      }}
                    >
                      {tag}
                    </Tag>
                  );
                })}
              </ScrollView>
            ) : null}

            {item.type != "" ? (
              <View
                style={{
                  alignItems: "flex-start",
                  width: "100%",
                  gap: 8,
                }}
              >
                <AppText type="p3">Subtypes</AppText>
                <ScrollView
                  bounces={true}
                  horizontal={true}
                  style={{ width: "100%", gap: 50 }}
                  contentContainerStyle={{ gap: 8 }}
                  showsHorizontalScrollIndicator={false}
                >
                  {itemSubTypes
                    .filter((i) => i.key === item.type)
                    .map((i) => i.value)
                    .map((type, index) => {
                      const selected = item.tags.includes(type);

                      return (
                        <AppButton
                          onPress={() => {
                            dispatch(
                              addItemTag({ index: itemsIndex, tag: type }),
                            );
                          }}
                          type={selected ? "primary" : "secondary"}
                          key={index}
                          style={styles.tagSelects}
                        >
                          <AppText
                            style={
                              selected ? { color: "white" } : { color: "black" }
                            }
                          >
                            {type}
                          </AppText>
                        </AppButton>
                      );
                    })}
                </ScrollView>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "flex-start",
                  width: "100%",
                  gap: 8,
                }}
              >
                <AppText type="p3">Type</AppText>
                <FormElement showError={showTypeError} errorMsg="Select a type">
                  <ScrollView
                    bounces={true}
                    horizontal={true}
                    style={{ height: 50, width: "100%", gap: 50 }}
                    contentContainerStyle={{ gap: 8 }}
                    showsHorizontalScrollIndicator={false}
                  >
                    {itemTypesArray.map((type, index) => {
                      const selected = item.tags.includes(type);

                      return (
                        <AppButton
                          onPress={() => {
                            dispatch(
                              addItemTag({ index: itemsIndex, tag: type }),
                            );
                            dispatch(setItemType({ index: itemsIndex, type }));

                            if (showTypeError) setShowTypeError(false);
                          }}
                          type={selected ? "primary" : "secondary"}
                          key={index}
                          style={styles.tagSelects}
                        >
                          <AppText
                            style={
                              selected ? { color: "white" } : { color: "black" }
                            }
                          >
                            {type}
                          </AppText>
                        </AppButton>
                      );
                    })}
                  </ScrollView>
                </FormElement>
              </View>
            )}
            <View
              style={{
                alignItems: "flex-start",
                width: "100%",
                gap: 8,
              }}
            >
              <AppText type="p3">Color</AppText>
              <ScrollView
                bounces={true}
                horizontal={true}
                style={{ height: 50, width: "100%", gap: 50 }}
                contentContainerStyle={{ gap: 8 }}
                showsHorizontalScrollIndicator={false}
              >
                {itemColors.map((color, index) => {
                  const selected = item.tags.includes(color);

                  return (
                    <AppButton
                      onPress={() => {
                        dispatch(addItemTag({ index: itemsIndex, tag: color }));
                      }}
                      type={selected ? "primary" : "secondary"}
                      key={index}
                      style={styles.tagSelects}
                    >
                      <AppText
                        style={
                          selected ? { color: "white" } : { color: "black" }
                        }
                      >
                        {color}
                      </AppText>
                    </AppButton>
                  );
                })}
              </ScrollView>
            </View>
            <View
              style={{
                alignItems: "flex-start",
                width: "100%",
                gap: 8,
              }}
            >
              <AppText type="p3">Custom Tags</AppText>
              <SearchableDropdown
                options={customTags}
                onSelect={(value) => {
                  dispatch(addItemTag({ index: itemsIndex, tag: value }));
                }}
                value={searchCustomTags}
                onChangeText={setSearchCustomTags}
                scrollRef={scrollRef}
                footer={
                  <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
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
                      style={{ width: "100%", alignItems: "center" }}
                    >
                      <AppText style={{ color: "black" }}>+ Add Tag</AppText>
                    </Pressable>
                  </View>
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
              ></SearchableDropdown>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={{ zIndex: -10, gap: 15, paddingBottom: 15 }}>
        {currentItemId == -1 ? (
          <AppButton
            onPress={async () => {
              const completed = await createItem();
            }}
          >
            <AppText style={{ color: "white" }}>Done</AppText>
          </AppButton>
        ) : (
          <AppButton
            onPress={async () => {
              const ok = await updateItem();
              if (ok) router.navigate("/pages");
            }}
          >
            <AppText style={{ color: "white" }}>Update Item</AppText>
          </AppButton>
        )}

        {currentItemId != -1 ? null : (
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
          >
            <AppText>Skip</AppText>
          </AppButton>
        )}
      </View>

      <AppModal modalVisible={deleteModal} setModalVisible={setDeleteModal}>
        <AppText>Do you delete this item</AppText>
        <AppButton
          fullWidth={true}
          onPress={async () => {
            router.navigate("/pages");
            itemRepo.deleteItem(currentItemId);
            outfitRepo.removeItemFromAllOutfits(currentItemId);
            dispatch(clearCurrentItemId());
            dispatch(clearItems());
          }}
        >
          <AppText style={{ color: "white" }}>Delete</AppText>
        </AppButton>
        <AppButton
          fullWidth={true}
          onPress={() => {
            setDeleteModal(!deleteModal);
          }}
          type="secondary"
        >
          <AppText>Cancel</AppText>
        </AppButton>
      </AppModal>
    </View>
  );
};

export default AddItemForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    justifyContent: "space-between",
    paddingTop: 50,
  },
  form: {
    width: "100%",
    //aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingBottom: 30,
  },
  imageWrapper: {
    position: "relative",
    width: "90%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
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
  tagSelects: { height: 40, padding: 0 },
  tagSection: {
    width: "100%",
    //aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
});
