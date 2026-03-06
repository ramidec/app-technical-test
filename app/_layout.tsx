import "../theme/unistyles";
import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { View, Text, Pressable, Alert, Image } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { useContact } from "@/hooks/useContact";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();
// Lazy — expo-audio uses NitroModules, unavailable in Expo Go
let setAudioModeAsync:
  | ((opts: { playsInSilentMode: boolean }) => Promise<void>)
  | null = null;
try {
  setAudioModeAsync = require("expo-audio").setAudioModeAsync;
} catch {
  // not available (Expo Go)
}

function ChatHeaderTitle() {
  const { contactName, contactOrg, contactAvatar } = useContact();
  const initials = contactName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <View style={styles.titlePill}>
      {/* Contact avatar */}
      {contactAvatar ? (
        <Image source={{ uri: contactAvatar }} style={styles.avatarImage} />
      ) : (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      )}
      {/* Name + subtitle */}
      <View style={styles.textColumn}>
        <Text style={styles.name} numberOfLines={1}>
          {contactName}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {contactOrg}
        </Text>
      </View>
    </View>
  );
}

function ChatHeaderLeft() {
  const router = useRouter();
  const { theme } = useAppTheme();
  return (
    <Pressable
      hitSlop={8}
      onPress={() => router.back()}
      accessibilityLabel="Go back"
      accessibilityRole="button"
    >
      <Ionicons
        name="chevron-back"
        size={24}
        color={theme.colors.textPrimary}
      />
    </Pressable>
  );
}

function ChatHeaderRight() {
  const { theme } = useAppTheme();
  const { contactName } = useContact();
  return (
    <Pressable
      hitSlop={8}
      onPress={() => Alert.alert("Calling...", contactName)}
    >
      <Ionicons name="call" size={24} color={theme.colors.textPrimary} />
    </Pressable>
  );
}

export default function RootLayout() {
  const { theme } = useAppTheme();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, staleTime: 30_000 },
        },
      }),
  );

  // Enable audio playback on iOS silent mode
  useEffect(() => {
    setAudioModeAsync?.({ playsInSilentMode: true });
  }, []);

  // Hide splash once fonts are ready
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

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
          <BottomSheetModalProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen
                name="chat"
                options={{
                  headerLeft: () => <ChatHeaderLeft />,
                  headerTitle: () => <ChatHeaderTitle />,
                  headerRight: () => <ChatHeaderRight />,
                  headerStyle,
                  headerShadowVisible: false,
                }}
              />
            </Stack>
          </BottomSheetModalProvider>
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
    flexDirection: "row",
    alignItems: "center",
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
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontFamily: theme.typography.font.semibold,
  },
  textColumn: {
    flexDirection: "column",
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontFamily: theme.typography.font.semibold,
    color: theme.colors.textPrimary,
    textAlign: "left",
  },
  subtitle: {
    fontSize: 12,
    fontFamily: theme.typography.font.medium,
    color: theme.colors.textSecondary,
    textAlign: "left",
  },
}));
