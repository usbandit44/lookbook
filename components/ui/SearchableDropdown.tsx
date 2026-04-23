import AppText from "@/components/ui/AppText";
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
      <View style={styles.container}>
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
          style={styles.input}
        />
        {open ? (
          <Pressable
            onPress={() => {
              onChangeText("");
              setOpen(false);
            }}
            hitSlop={20}
          >
            <Icon name="close" type="material" color="#888" size={20} />
          </Pressable>
        ) : null}
      </View>
      {open && (
        <View style={styles.dropdown}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            style={{ maxHeight: 200 }}
          >
            {results.map((item) => (
              <Pressable
                key={item}
                style={styles.option}
                onPress={() => {
                  onSelect(item);
                  onChangeText("");
                  setOpen(false);
                }}
              >
                <AppText>{item}</AppText>
                {onClearItem ? (
                  <Pressable
                    onPress={() => {
                      onClearItem(item);
                    }}
                    hitSlop={20}
                  >
                    <Icon name="close" type="material" color="#888" size={20} />
                  </Pressable>
                ) : null}
              </Pressable>
            ))}
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
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 200,
    marginTop: 4,
    backgroundColor: "white",
    zIndex: 100,
  },
  option: {
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
    justifyContent: "space-between",
    flexDirection: "row",
  },
});
