import '../theme/unistyles';
import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { View, Text, Pressable, Alert } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
// Lazy — expo-audio uses NitroModules, unavailable in Expo Go
let setAudioModeAsync: ((opts: { playsInSilentMode: boolean }) => Promise<void>) | null = null;
try {
  setAudioModeAsync = require("expo-audio").setAudioModeAsync;
} catch {
  // not available (Expo Go)
}
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function ChatHeaderTitle() {
  const { theme } = useAppTheme();
  return (
    <View style={styles.titlePill}>
      {/* Contact avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>AV</Text>
      </View>
      {/* Name + subtitle */}
      <View style={styles.textColumn}>
        <Text style={styles.name} numberOfLines={1}>Alexandra Velcaz</Text>
        <Text style={styles.subtitle} numberOfLines={1}>NextGen Dynamics</Text>
      </View>
    </View>
  );
}

function ChatHeaderLeft() {
  const router = useRouter();
  const { theme } = useAppTheme();
  return (
    <Pressable hitSlop={8} onPress={() => router.back()} accessibilityLabel="Go back" accessibilityRole="button">
      <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
    </Pressable>
  );
}

function ChatHeaderRight() {
  const { theme } = useAppTheme();
  return (
    <Pressable
      hitSlop={8}
      onPress={() => Alert.alert("Calling...", "Alexandra Velcaz")}
    >
      <Ionicons name="call" size={24} color={theme.colors.textPrimary} />
    </Pressable>
  );
}

export default function RootLayout() {
  const { theme } = useAppTheme();
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { retry: 1, staleTime: 30_000 },
    },
  }));

  // Enable audio playback on iOS silent mode
  useEffect(() => {
    setAudioModeAsync?.({ playsInSilentMode: true });
  }, []);

  // headerStyle must be inline — React Navigation caches the prop value,
  // so Unistyles' C++ style updates don't reach it.
  const headerStyle = {
    backgroundColor: theme.colors.background,
    shadowColor: theme.colors.headerShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.colors.headerShadowOpacity,
    shadowRadius: 24,
    elevation: 4,
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <KeyboardProvider>
          <Stack
            screenOptions={{
              headerLeft: () => <ChatHeaderLeft />,
              headerTitle: () => <ChatHeaderTitle />,
              headerRight: () => <ChatHeaderRight />,
              headerStyle,
              headerShadowVisible: false,
            }}
          />
        </KeyboardProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
  },
  titlePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 36,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 4,
    paddingRight: 12,
    gap: 8,
    height: 44,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  textColumn: {
    flexDirection: 'column',
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    textAlign: 'left',
  },
}));
