import { Stack } from "expo-router";
import { View, Text, Pressable, Alert, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**
 * Header title: avatar pill + name + subtitle
 * Design: cornerRadius 36 pill wrapper, 32×32 avatar, name ES Rebond Grotesque 600 16px,
 * subtitle Inter 500 12px #66807F. Colors from Primary color tokens.
 * NOTE: "ES Rebond Grotesque" must be loaded via expo-font for full fidelity;
 *       the component falls back to the system font if not loaded.
 */
function ChatHeaderTitle() {
  return (
    <View style={styles.titlePill}>
      {/* 32×32 avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>AV</Text>
      </View>
      {/* Name + subtitle */}
      <View style={styles.textColumn}>
        <Text style={styles.name} numberOfLines={1}>
          Alexandra Velcaz
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          NextGen Dynamics
        </Text>
      </View>
    </View>
  );
}

function ChatHeaderLeft() {
  return (
    <Pressable hitSlop={8}>
      <Ionicons name="chevron-back" size={24} color="#002C2A" />
    </Pressable>
  );
}

function ChatHeaderRight() {
  return (
    <Pressable
      hitSlop={8}
      onPress={() => Alert.alert("Calling...", "Alexandra Velcaz")}
    >
      <Ionicons name="call-outline" size={24} color="#002C2A" />
    </Pressable>
  );
}

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerLeft: () => <ChatHeaderLeft />,
        headerTitle: () => <ChatHeaderTitle />,
        headerRight: () => <ChatHeaderRight />,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#FFFFFF",
        },
        // Use custom shadow via headerShadowVisible + headerStyle
        headerShadowVisible: true,
        // React Navigation shadow props (iOS)
        headerTransparent: false,
      }}
    />
  );
}

const styles = StyleSheet.create({
  // Pill wrapper: horizontal, radius 36, padding 4/12/4/4, gap 8
  titlePill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 36,
    paddingTop: 4,
    paddingRight: 12,
    paddingBottom: 4,
    paddingLeft: 4,
    gap: 8,
    backgroundColor: "#FFFFFF",
  },
  // Avatar: 32×32 circle, Primary/5 background, Primary/60 text
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F2F4F4",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#66807F",
    fontSize: 12,
    fontWeight: "600",
  },
  textColumn: {
    flexDirection: "column",
    gap: 2,
  },
  // Name: ES Rebond Grotesque 600 16px #002C2A (falls back to system font)
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#002C2A",
    // fontFamily: 'ESRebondGrotesque-SemiBold',  // Uncomment after loading font
  },
  // Subtitle: Inter 500 12px #66807F
  subtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#66807F",
    // fontFamily: 'Inter-Medium',  // Uncomment after loading font
  },
});
