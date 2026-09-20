import AppButton from "@/components/ui/AppButton";
import { AppIcon } from "@/components/ui/AppIcon";
import AppText from "@/components/ui/AppText";
import {
  itemSubTypes,
  itemTypesArray,
  PresetTypesType,
} from "@/constants/constants";
import { Theme } from "@/constants/themes";
import { PresetType } from "@/db/schemas/presets";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { useTheme } from "@/hooks/ThemeProvider";
import { useGenerateOutfit } from "@/hooks/useGenerateOutfit";
import { useSnackbar } from "@/hooks/useSnackBar";
import { clearAllItems, setOutfitItems } from "@/redux/slices/outfitSlice";
import {
  addToTypes,
  clearPresetState,
  clearPresetType,
  clearPresetTypes,
  removeFromTypes,
  selectCurrentPreset,
  setPresetState,
} from "@/redux/slices/presetSlice";
import AppPresetsRepo from "@/repo/presets_repo/AppPresetsRepo";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const CreatePresetForm = () => {
  const { theme } = useTheme();
  const t = theme;
  const styles = s(t);
  const presetRepo = new AppPresetsRepo();
  const dispatch = useAppDispatch();
  const preset = useAppSelector(selectCurrentPreset);
  const [currentPreset, setCurrentPreset] = useState<PresetType>({
    id: -1,
    name: "",
    types: {},
    favorited: false,
  });
  const [name, setName] = useState<string>("");
  const [placeholder, setPlaceholder] = useState<string>("");
  const [disablePrimary, setDisablePrimaey] = useState<boolean>(false);
  const router = useRouter();
  const { generate } = useGenerateOutfit();
  // useEffect(() => {
  //   dispatch(setPresetName({ name: name }));
  // }, [name]);
  const snackbarSettingsContext = useSnackbar();
  if (!snackbarSettingsContext) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }

  const { setSettings, showSnackbar, hideSnackbar, settings } =
    snackbarSettingsContext;

  const disable = preset == currentPreset;
  useEffect(() => {
    if (preset.id == -1) {
      async function getPlaceholder() {
        const count = await presetRepo.getTotalPresets();
        setPlaceholder("Preset #" + (count + 1));
      }
      getPlaceholder();
    } else {
      async function setupCurrentPreset() {
        const current = await presetRepo.getPreset(preset.id);
        dispatch(setPresetState(current));
        setCurrentPreset(current);
        setName(current.name);
      }
      setupCurrentPreset();
    }
  }, []);

  async function handleGenerate() {
    dispatch(clearAllItems());
    const items = await generate(preset.types);
    console.log(items);
    dispatch(setOutfitItems({ items }));
    router.navigate("/outfit/create-outfit");
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppButton
          type="icon"
          icon={<AppIcon name="arrowLeft" size={24} />}
          onPress={() => {
            dispatch(clearPresetState());
            router.navigate("/presets");
          }}
        ></AppButton>
        <AppButton
          type="text"
          label="reset"
          textColor={theme.danger}
          onPress={() => {
            if (preset.id == -1) {
              dispatch(clearPresetTypes());
            }
          }}
        ></AppButton>
      </View>
      <ScrollView
        style={styles.form}
        contentContainerStyle={styles.formContent}
      >
        <View style={{ gap: 8 }}>
          <AppText type="m5" text="Preset Name"></AppText>
          <TextInput
            value={name}
            onChangeText={(value: string) => setName(value)}
            placeholder={placeholder}
            placeholderTextColor={theme.inkA[38]}
            style={[theme.text.p4, styles.presetName]}
          ></TextInput>
        </View>
        <AppText
          text={
            "Pick the categories to include in your outfit, we will take it from there."
          }
          type={"p5"}
        ></AppText>

        {itemTypesArray.map((type, index) => {
          const selected = (preset.types[type] ?? []).includes(type);

          const subtypeArray = itemSubTypes
            .filter((i) => i.key === type)
            .map((i) => i.value);

          return (
            <View style={{ gap: 10 }} key={index}>
              <AppText type="m5" text={type}></AppText>
              <View key={index} style={styles.typesSection}>
                <AppButton
                  onPress={() => {
                    dispatch(clearPresetType({ key: type }));
                    if (selected) {
                      return;
                    } else {
                      dispatch(addToTypes({ key: type, value: type }));
                    }
                  }}
                  type={selected ? "primary" : "secondary"}
                  key={index}
                  label={"Any " + type}
                  style={{ flex: 0 }}
                ></AppButton>
                {subtypeArray.map((subtype, index) => {
                  const selected = (preset.types[type] ?? []).includes(subtype);
                  return (
                    <AppButton
                      onPress={() => {
                        if (selected) {
                          if (preset.types[type].length > 1) {
                            dispatch(
                              removeFromTypes({ key: type, value: subtype }),
                            );
                          } else {
                            dispatch(clearPresetType({ key: type }));
                          }
                        } else {
                          dispatch(addToTypes({ key: type, value: subtype }));
                          if ((preset.types[type] ?? []).includes(type)) {
                            dispatch(
                              removeFromTypes({ key: type, value: type }),
                            );
                          }
                        }
                      }}
                      type={selected ? "primary" : "secondary"}
                      key={index}
                      label={subtype}
                      style={{ flex: 0 }}
                    ></AppButton>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.footer}>
        <AppButton
          type={
            Object.keys(preset.types).length === 0
              ? "ghostSecondary"
              : "secondary"
          }
          disabled={Object.keys(preset.types).length === 0 ? true : false}
          label="Only Generate"
          onPress={() => {
            handleGenerate();
          }}
        ></AppButton>
        <AppButton
          label={preset.id == -1 ? "Save Preset" : "Update Preset"}
          type={
            preset.id != -1
              ? presetsEqual(preset, currentPreset)
                ? "ghostPrimary"
                : "primary"
              : Object.keys(preset.types).length === 0
                ? "ghostPrimary"
                : "primary"
          }
          disabled={
            preset.id != -1
              ? presetsEqual(preset, currentPreset)
                ? true
                : false
              : Object.keys(preset.types).length === 0
                ? true
                : false
          }
          onPress={() => {
            if (preset.types && Object.keys(preset.types).length > 0) {
              if (preset.id == -1) {
                const nameToSave =
                  preset.name === "" ? placeholder : preset.name;
                presetRepo.addPreset({
                  name: nameToSave,
                  types: preset.types,
                  favorited: preset.favorited,
                });
                showSnackbar("Preset Saved", "success");
                setTimeout(() => hideSnackbar(), 3000);
              } else {
                const nameToSave = name === "" ? preset.name : name;
                presetRepo.updatePreset({
                  id: preset.id,
                  name: nameToSave,
                  types: preset.types,
                  favorited: preset.favorited,
                });
                showSnackbar("Preset Updated", "success");
                setTimeout(() => hideSnackbar(), 3000);
              }
              handleGenerate();
            }
          }}
        ></AppButton>
      </View>
    </View>
  );
};

export default CreatePresetForm;

const s = (t: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 15,
      paddingBottom: 15,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    form: {
      flex: 1,
      padding: 15,
    },
    formContent: { flexDirection: "column", gap: 25, paddingBottom: 30 },
    footer: {
      width: "100%",
      flexDirection: "row",
      gap: 15,
      padding: 15,
      paddingBottom: 40,
      borderTopWidth: 1,
      borderTopColor: t.inkA[10],
    },
    presetName: {
      borderWidth: 1,
      borderColor: t.inkA[10],
      height: 52,
      paddingHorizontal: 10,
      color: t.ink,
    },
    typesSection: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  });

function presetsEqual(a: PresetType, b: PresetType): boolean {
  if (a === b) return true;
  if (a.id !== b.id || a.name !== b.name || a.favorited !== b.favorited) {
    return false;
  }
  return typesEqual(a.types, b.types);
}

function typesEqual(a: PresetTypesType, b: PresetTypesType): boolean {
  const aKeys = Object.keys(a);
  if (aKeys.length !== Object.keys(b).length) return false;
  return aKeys.every((key) => {
    const aArr = a[key];
    const bArr = b[key];
    return (
      !!bArr &&
      aArr.length === bArr.length &&
      aArr.every((v, i) => v === bArr[i])
    );
  });
}
