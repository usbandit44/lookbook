import AppText from "@/components/ui/AppText";
import { useTheme } from "@/hooks/ThemeProvider";
import AppUserRepo from "@/repo/user_repo/AppUserRepo";
import Fuse from "fuse.js";
import { useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Icon } from "react-native-elements";

const SearchableDropdown: React.FC<{
  value: string;
  onChangeText: React.Dispatch<React.SetStateAction<string>>;
  options: string[];
  onSelect: (value: string) => void;
  placeholder?: string;
  footer?: React.ReactNode;
  scrollRef?: React.RefObject<ScrollView | null>;
  onClearItem?: (value: string) => void;
}> = ({
  options,
  onSelect,
  placeholder,
  footer,
  value,
  onChangeText,
  scrollRef,
  onClearItem,
}) => {
  const { theme } = useTheme();
  const userRepo = new AppUserRepo();
  const [open, setOpen] = useState(false);

  const fuse = new Fuse(options, { threshold: 0.4 });

  const results = value ? fuse.search(value).map((r) => r.item) : options;
  const containerRef = useRef<View>(null);
  const scrollToDropdown = () => {
    scrollRef?.current?.scrollToEnd({ animated: true });
  };
  return (
    <View style={{ width: "100%" }}>
      <View
        style={[
          styles.container,
          { borderColor: theme.inkA[16], backgroundColor: theme.surface },
          open && styles.fieldOpen,
        ]}
      >
        <Icon name="search" type="material" size={16} color={theme.inkA[45]} />
        <TextInput
          value={value}
          onChangeText={(text) => {
            onChangeText(text);
            setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            setTimeout(() => scrollToDropdown(), 300);
          }}
          placeholder={placeholder}
          placeholderTextColor={theme.inkA[38]}
          style={[styles.input, theme.text.p4]}
        />

        <Pressable
          onPress={() => {
            if (open) {
              onChangeText("");
              setOpen(!open);
            } else {
              setOpen(!open);
            }
          }}
          hitSlop={20}
        >
          {open ? (
            <Icon
              name="keyboard-arrow-up"
              type="material"
              color={theme.inkA[55]}
              size={20}
            />
          ) : (
            <Icon
              name="expand-more"
              type="material"
              color={theme.inkA[55]}
              size={20}
            />
          )}
        </Pressable>
      </View>
      {open && (
        <View
          style={[
            styles.dropdown,
            { borderColor: theme.inkA[16], backgroundColor: theme.surface },
          ]}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={{ maxHeight: 196 }}
          >
            {results.length ? (
              results.map((item) => (
                <Pressable
                  key={item}
                  style={({ pressed }) => [
                    styles.option,
                    { borderBottomColor: theme.inkA[8] },
                    pressed && { backgroundColor: theme.inkA[7] },
                  ]}
                  onPress={() => {
                    onSelect(item);
                    onChangeText("");
                    setOpen(false);
                  }}
                >
                  <AppText
                    type="p4"
                    style={[styles.optionLabel]}
                    text={item}
                  ></AppText>
                  {onClearItem ? (
                    <Pressable onPress={() => onClearItem(item)} hitSlop={20}>
                      <Icon
                        name="close"
                        type="material"
                        color={theme.inkA[35]}
                        size={16}
                      />
                    </Pressable>
                  ) : null}
                </Pressable>
              ))
            ) : (
              <AppText
                type="p6"
                style={[styles.empty]}
                text="No matching tags"
              ></AppText>
            )}
          </ScrollView>
          {footer}
        </View>
      )}
    </View>
  );
};

export default SearchableDropdown;

const styles = StyleSheet.create({
  input: { flex: 1 },
  container: {
    height: 46,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 0,
  },
  fieldOpen: { borderBottomWidth: 1 },
  dropdown: {
    borderWidth: 1,
    borderTopWidth: 0, // shares the seam with the field above
    borderRadius: 0,
  },
  option: {
    height: 44,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    borderBottomWidth: 1,
  },
  optionLabel: {
    flex: 1,
  },
  empty: {
    padding: 14,
    textAlign: "center",
  },
});
