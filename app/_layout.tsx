import { Stack } from "expo-router";
import { View, Text, Pressable, Alert, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

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
    <Pressable hitSlop={8}>
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
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <KeyboardProvider>
          <Stack
            screenOptions={{
              headerLeft: () => <ChatHeaderLeft />,
              headerTitle: () => <ChatHeaderTitle />,
              headerRight: () => <ChatHeaderRight />,
            }}
          />
        </KeyboardProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
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
  phoneButton: {
    paddingRight: 4,
  },
});
