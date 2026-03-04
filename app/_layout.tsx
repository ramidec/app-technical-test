import { Stack } from "expo-router";
import { View, Text, Pressable, Alert, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function ChatHeaderTitle() {
  return (
    <View style={styles.headerTitleContainer}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>AV</Text>
      </View>
      <View style={styles.textColumn}>
        <Text style={styles.name}>Alexandra Voltec</Text>
        <Text style={styles.subtitle}>Active now</Text>
      </View>
    </View>
  );
}

function ChatHeaderLeft() {
  return (
    <Pressable hitSlop={8} style={styles.backButton}>
      <Ionicons name="chevron-back" size={28} color="#007AFF" />
    </Pressable>
  );
}

function ChatHeaderRight() {
  return (
    <Pressable
      hitSlop={8}
      onPress={() => Alert.alert("Calling...", "Alexandra Voltec")}
      style={styles.phoneButton}
    >
      <Ionicons name="call" size={22} color="#007AFF" />
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
      }}
    />
  );
}

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#5E5CE6",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  textColumn: {
    flexDirection: "column",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  subtitle: {
    fontSize: 12,
    color: "#8E8E93",
  },
  backButton: {
    paddingLeft: 4,
  },
  phoneButton: {
    paddingRight: 4,
  },
});
