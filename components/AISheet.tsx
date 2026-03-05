import React, { forwardRef, useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { TextInput } from "react-native-gesture-handler";
import { ImpactFeedbackStyle } from "expo-haptics";
import { StyleSheet } from "react-native-unistyles";
import { useAppTheme } from "@/hooks/useAppTheme";
import { hapticImpact, hapticNotification } from "@/utils/haptics";
import { NotificationFeedbackType } from "expo-haptics";
import GradientAIIcon, { GradientAIIconRef } from "@/components/GradientAIIcon";
import AppSheet, { AppSheetRef } from "@/components/AppSheet";
import { formatMessage } from "@/services/ai";

interface AISheetProps {
  message: string;
  onConfirm: (formattedText: string) => void;
}

const AISheet = forwardRef<AppSheetRef, AISheetProps>(
  ({ message, onConfirm }, ref) => {
    const { theme } = useAppTheme();
    const iconRef = useRef<GradientAIIconRef>(null);
    const sheetRef = useRef<AppSheetRef>(null);
    const messageInputRef = useRef<TextInput>(null);

    const [draftMessage, setDraftMessage] = useState("");
    const [intent, setIntent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canSubmit = draftMessage.trim().length > 0 && !loading;

    const handleOpen = useCallback(() => {
      // Seed draft from parent message, reset state
      setDraftMessage(message);
      setIntent("");
      setError(null);
      setLoading(false);
      iconRef.current?.shimmer();
    }, [message]);

    const handleClose = useCallback(() => {
      // Dismiss keyboard and clear everything
      Keyboard.dismiss();
      setDraftMessage("");
      setIntent("");
      setError(null);
      setLoading(false);
    }, []);

    const handleConfirm = useCallback(async () => {
      if (!canSubmit) return;

      hapticImpact(ImpactFeedbackStyle.Light);
      setError(null);
      setLoading(true);

      try {
        const result = await formatMessage(
          draftMessage.trim(),
          intent.trim() || undefined,
        );
        hapticNotification(NotificationFeedbackType.Success);
        onConfirm(result);
        sheetRef.current?.close();
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Something went wrong";
        setError(msg);
        hapticNotification(NotificationFeedbackType.Error);
      } finally {
        setLoading(false);
      }
    }, [canSubmit, draftMessage, intent, onConfirm]);

    return (
      <AppSheet
        ref={mergeRefs(ref, sheetRef)}
        onOpen={handleOpen}
        onClose={handleClose}
      >
        <View style={styles.body}>
          {/* Header */}
          <View style={styles.header}>
            <GradientAIIcon ref={iconRef} size={20} />
            <Text style={styles.headerTitle}>AI Format</Text>
          </View>

          {/* Message input */}
          <View style={styles.section}>
            <Text style={styles.label}>Your message</Text>
            <BottomSheetTextInput
              ref={messageInputRef}
              style={styles.messageInput}
              value={draftMessage}
              onChangeText={setDraftMessage}
              placeholder="Type the message you want to format..."
              placeholderTextColor={theme.colors.textPlaceholder}
              maxLength={1000}
              editable={!loading}
              returnKeyType="next"
              autoCorrect={false}
              autoComplete="off"
            />
          </View>

          {/* Intent input */}
          <View style={styles.section}>
            <Text style={styles.label}>Intent (optional)</Text>
            <BottomSheetTextInput
              style={styles.intentInput}
              value={intent}
              onChangeText={setIntent}
              placeholder="e.g. Professional, friendly, apologetic..."
              placeholderTextColor={theme.colors.textPlaceholder}
              editable={!loading}
              returnKeyType="done"
              autoCorrect={false}
              autoComplete="off"
            />
          </View>

          {/* Confirm button */}
          <Pressable
            onPress={handleConfirm}
            disabled={!canSubmit}
            style={({ pressed }) => [
              styles.confirmButton,
              pressed && canSubmit && styles.confirmButtonPressed,
              !canSubmit && styles.confirmButtonDisabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color={theme.colors.sendIconActive}
              />
            ) : (
              <Text style={styles.confirmButtonText}>Format Message</Text>
            )}
          </Pressable>

          {/* Error */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText} numberOfLines={2}>
                {error}
              </Text>
              <Pressable onPress={handleConfirm}>
                <Text style={styles.retryText}>Retry</Text>
              </Pressable>
            </View>
          )}
        </View>
      </AppSheet>
    );
  },
);

AISheet.displayName = "AISheet";
export default AISheet;

// --- Helpers ---

function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined | null)[]
): React.RefCallback<T> {
  return (instance: T | null) => {
    for (const r of refs) {
      if (typeof r === "function") {
        r(instance);
      } else if (r && typeof r === "object") {
        (r as React.MutableRefObject<T | null>).current = instance;
      }
    }
  };
}

const styles = StyleSheet.create((theme) => ({
  body: {
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  section: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  messageInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: "400",
    color: theme.colors.textPrimary,
  },
  intentInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: "400",
    color: theme.colors.textPrimary,
  },
  confirmButton: {
    backgroundColor: theme.colors.sendActive,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  confirmButtonPressed: {
    opacity: 0.7,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.sendIconActive,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 13,
    color: "#E53935",
    flex: 1,
    marginRight: 12,
  },
  retryText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.sendActive,
  },
}));
