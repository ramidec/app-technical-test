import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Keyboard,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  interpolateColor,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { hapticImpact, hapticSelection } from "@/utils/haptics";
import { ImpactFeedbackStyle } from "expo-haptics";

const MIN_HEIGHT = 19;
const SPRING_CONFIG = { damping: 20, stiffness: 200, mass: 0.5 } as const;
const EXPAND_SPRING = { damping: 25, stiffness: 180, mass: 0.8 } as const;
const SWIPE_THRESHOLD = 50;

// Vertical chrome: non-input space inside the component
// container(paddingTop 8 + paddingBottom 8) + chatbar(paddingTop 16 + paddingBottom 12 + gap 12 + border 2) + actionsRow(36)
const CHROME_BASE = 94;
// Extra chrome when drag handle is visible: dragHandle(8) + gap(12)
const CHROME_DRAG_HANDLE = 20;
// Non-input chrome excluding containerPaddingBottom:
// container.paddingTop(8) + chatbar.border(2) + chatbar.paddingTop(16)
// + chatbar.gap(12) + actionsRow(36) + chatbar.paddingBottom(12)
const CHROME_NO_BOTTOM = 86;

export interface ChatInputRef {
  collapse: () => void;
  focus: () => void;
}

interface ChatInputProps {
  onSend: (text: string) => void;
  onAttachPress?: () => void;
  onEmojiPress?: () => void;
  pendingEmoji?: string;
  onPendingEmojiConsumed?: () => void;
  onExpandedChange?: (expanded: boolean) => void;
  placeholder?: string;
  maxExpandedHeight?: number;
}

const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(
  (
    {
      onSend,
      onAttachPress,
      onEmojiPress,
      pendingEmoji,
      onPendingEmojiConsumed,
      onExpandedChange,
      placeholder = "Text Alexandra",
      maxExpandedHeight = 400,
    },
    ref,
  ) => {
    const textInputRef = useRef<TextInput>(null);
    const insets = useSafeAreaInsets();
    const [text, setText] = useState("");
    const [scrollEnabled, setScrollEnabled] = useState(false);
    const [isExpandedJS, setIsExpandedJS] = useState(false);

    // Max input-wrapper height derived from total component budget
    const maxAutoGrowHeight = maxExpandedHeight - CHROME_BASE;

    const inputHeight = useSharedValue(MIN_HEIGHT); // collapsed content height (managed by handleContentSizeChange)
    const containerHeight = useSharedValue(0); // 0 = auto (collapsed); > 0 = explicit height
    const isExpanded = useSharedValue(0); // 0 = collapsed, 1 = expanded

    // Append emoji from picker
    useEffect(() => {
      if (pendingEmoji) {
        setText((prev) => prev + pendingEmoji);
        onPendingEmojiConsumed?.();
      }
    }, [pendingEmoji, onPendingEmojiConsumed]);

    const hasText = text.trim().length > 0;

    const handleContentSizeChange = useCallback(
      (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
        const h = e.nativeEvent.contentSize.height;
        if (!isExpandedJS) {
          const clamped = Math.min(Math.max(h, MIN_HEIGHT), maxAutoGrowHeight);
          setScrollEnabled(h > maxAutoGrowHeight);
          inputHeight.value = clamped; // keep for gesture calculations
        }
      },
      [inputHeight, isExpandedJS, maxAutoGrowHeight],
    );

    const setExpandedTrue = useCallback(() => {
      setIsExpandedJS(true);
      onExpandedChange?.(true);
    }, [onExpandedChange]);
    const setExpandedFalse = useCallback(() => {
      setIsExpandedJS(false);
      onExpandedChange?.(false);
    }, [onExpandedChange]);
    const fireHapticMedium = useCallback(
      () => hapticImpact(ImpactFeedbackStyle.Medium),
      [],
    );
    const fireHapticLight = useCallback(
      () => hapticImpact(ImpactFeedbackStyle.Light),
      [],
    );

    // Keyboard animation — needed in gesture worklets for padding calculation
    const { progress: kbProgress } = useReanimatedKeyboardAnimation();
    const fullPadding = Math.max(insets.bottom, 8) + 8;
    const kbPadding = 8;

    const panGesture = Gesture.Pan()
      .activeOffsetY([-15, 15])
      .onUpdate((event) => {
        "worklet";
        const ty = event.translationY;
        const currentPadBottom = interpolate(
          kbProgress.value,
          [0, 1],
          [fullPadding, kbPadding],
        );

        if (isExpanded.value < 0.5) {
          // Collapsed: swiping up grows height, swiping down rubber-bands
          const collapsedH =
            CHROME_NO_BOTTOM + inputHeight.value + currentPadBottom;
          if (ty < 0) {
            containerHeight.value = collapsedH + Math.abs(ty);
          } else {
            containerHeight.value = Math.max(0, collapsedH - ty * 0.2);
          }
        } else {
          // Expanded: swiping down shrinks, swiping up rubber-bands
          const minH = CHROME_NO_BOTTOM + MIN_HEIGHT + currentPadBottom;
          if (ty > 0) {
            containerHeight.value = Math.max(minH, maxExpandedHeight - ty);
          } else {
            containerHeight.value = maxExpandedHeight + Math.abs(ty) * 0.2;
          }
        }
      })
      .onEnd((event) => {
        "worklet";
        const swipedUp = event.translationY < -SWIPE_THRESHOLD;
        const swipedDown = event.translationY > SWIPE_THRESHOLD;
        const currentPadBottom = interpolate(
          kbProgress.value,
          [0, 1],
          [fullPadding, kbPadding],
        );

        if (swipedUp && isExpanded.value < 0.5) {
          // Expand
          isExpanded.value = 1;
          containerHeight.value = withSpring(maxExpandedHeight, EXPAND_SPRING);
          runOnJS(setExpandedTrue)();
          runOnJS(fireHapticMedium)();
        } else if (swipedDown && isExpanded.value > 0.5) {
          // Collapse — hide drag handle immediately, spring height down
          isExpanded.value = 0;
          runOnJS(setExpandedFalse)();
          const collapsedH =
            CHROME_NO_BOTTOM + inputHeight.value + currentPadBottom;
          containerHeight.value = withSpring(
            collapsedH,
            SPRING_CONFIG,
            (finished) => {
              if (finished) {
                containerHeight.value = 0;
              }
            },
          );
          runOnJS(fireHapticLight)();
        } else {
          // Snap back to current state
          if (isExpanded.value > 0.5) {
            containerHeight.value = withSpring(
              maxExpandedHeight,
              SPRING_CONFIG,
            );
          } else {
            containerHeight.value = withSpring(0, SPRING_CONFIG);
          }
        }
      });

    const collapse = useCallback(() => {
      if (isExpandedJS) {
        isExpanded.value = 0;
        setIsExpandedJS(false);
        onExpandedChange?.(false);
        const collapsedH =
          CHROME_NO_BOTTOM + inputHeight.value + fullPadding;
        containerHeight.value = withSpring(
          collapsedH,
          SPRING_CONFIG,
          (finished) => {
            if (finished) {
              containerHeight.value = 0;
            }
          },
        );
        Keyboard.dismiss();
        hapticImpact(ImpactFeedbackStyle.Light);
      }
    }, [
      isExpandedJS,
      isExpanded,
      containerHeight,
      inputHeight,
      fullPadding,
      onExpandedChange,
    ]);

    useImperativeHandle(
      ref,
      () => ({
        collapse,
        focus: () => textInputRef.current?.focus(),
      }),
      [collapse],
    );

    const handleSend = useCallback(() => {
      if (!text.trim()) return;
      hapticImpact(ImpactFeedbackStyle.Light);
      onSend(text.trim());
      setText("");
      setScrollEnabled(false);
      inputHeight.value = MIN_HEIGHT;
      // Always reset container height (safety: ensures no stuck gesture state)
      containerHeight.value = 0;
      if (isExpandedJS) {
        isExpanded.value = 0;
        setIsExpandedJS(false);
        onExpandedChange?.(false);
      }
    }, [
      text,
      onSend,
      inputHeight,
      containerHeight,
      isExpanded,
      isExpandedJS,
      onExpandedChange,
    ]);

    const handleAttachPress = useCallback(() => {
      hapticSelection();
      onAttachPress?.();
    }, [onAttachPress]);

    const handleEmojiPress = useCallback(() => {
      hapticSelection();
      onEmojiPress?.();
    }, [onEmojiPress]);

    // Input wrapper: in collapsed mode, auto-sizes from TextInput content
    // (minHeight/maxHeight constrain growth). In expanded mode, flex:1 fills
    // the chatbar's remaining space.
    const inputWrapperStyle = isExpandedJS
      ? ({ flex: 1 } as const)
      : ({ minHeight: MIN_HEIGHT, maxHeight: maxAutoGrowHeight } as const);

    // IMPORTANT: Reanimated animated styles have a "sticky property" bug where
    // properties returned in one frame (e.g. flex:1, height:X) persist in the
    // native view even after the animated style stops returning them (returns {}).
    // To avoid this, ALL animated styles below ALWAYS return the same set of
    // properties with different values — properties are never added or removed.

    // Container height: always explicit. Tracks inputHeight + keyboard padding
    // in collapsed mode, containerHeight in gesture/expanded mode.
    const animatedContainerStyle = useAnimatedStyle(() => {
      const padBottom = interpolate(
        kbProgress.value,
        [0, 1],
        [fullPadding, kbPadding],
      );
      if (containerHeight.value <= 0) {
        return {
          height: CHROME_NO_BOTTOM + inputHeight.value + padBottom,
          paddingBottom: padBottom,
        };
      }
      return {
        height: containerHeight.value,
        paddingBottom: padBottom,
      };
    });

    // Chatbar flex: auto-size from children in collapsed mode (Yoga handles
    // auto-grow as TextInput content grows), flex-fill in gesture/expanded mode.
    const chatbarAnimatedStyle = useAnimatedStyle(() => ({
      flexGrow: containerHeight.value > 0 ? 1 : 0,
      flexShrink: containerHeight.value > 0 ? 1 : 0,
    }));

    return (
      <Animated.View
        style={[styles.container, animatedContainerStyle]}
      >
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.chatbar, chatbarAnimatedStyle]}>
            {/* Drag handle (visible when expanded) */}
            {isExpandedJS && (
              <View style={styles.dragHandle}>
                <View style={styles.dragHandlePill} />
              </View>
            )}

            {/* Text area */}
            <View style={inputWrapperStyle}>
              <TextInput
                ref={textInputRef}
                style={[styles.input, isExpandedJS && { flex: 1 }]}
                value={text}
                onChangeText={setText}
                placeholder={placeholder}
                placeholderTextColor="#809594"
                multiline
                scrollEnabled={scrollEnabled || isExpandedJS}
                onContentSizeChange={handleContentSizeChange}
              />
            </View>

            {/* Actions row */}
            <View style={styles.actionsRow}>
              <View style={styles.leftActions}>
                <ChatBarButton
                  icon="attach-outline"
                  onPress={handleAttachPress}
                />
                <ChatBarButton
                  icon="happy-outline"
                  onPress={handleEmojiPress}
                />
              </View>
              <SendButton hasText={hasText} onSend={handleSend} />
            </View>
          </Animated.View>
        </GestureDetector>
      </Animated.View>
    );
  },
);

ChatInput.displayName = "ChatInput";
export default ChatInput;

// --- Chat Bar Button ---

interface ChatBarButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

function ChatBarButton({ icon, onPress }: ChatBarButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.chatBarButton,
        pressed && styles.chatBarButtonPressed,
      ]}
    >
      <Ionicons name={icon} size={22} color="#66807F" />
    </Pressable>
  );
}

// --- Send Button (animated state transitions) ---

interface SendButtonProps {
  hasText: boolean;
  onSend: () => void;
}

function SendButton({ hasText, onSend }: SendButtonProps) {
  const progress = useSharedValue(0);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    progress.value = withTiming(hasText ? 1 : 0, { duration: 200 });
  }, [hasText, progress]);

  const handlePressIn = useCallback(() => {
    if (!hasText) return;
    pressScale.value = withTiming(0.85, { duration: 80 });
  }, [hasText, pressScale]);

  const handlePressOut = useCallback(() => {
    pressScale.value = withSequence(
      withTiming(0.85, { duration: 50 }),
      withSpring(1, { damping: 10, stiffness: 200 }),
    );
  }, [pressScale]);

  const animatedOpacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.35, 1.0]),
  }));

  const animatedButtonStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [0.92, 1.0]);
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ["#F2F4F4", "#002C2A"],
    );
    return {
      transform: [{ scale: scale * pressScale.value }],
      backgroundColor,
    };
  });

  return (
    <Animated.View style={animatedOpacityStyle}>
      <Pressable
        onPress={hasText ? onSend : undefined}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        hitSlop={8}
      >
        <Animated.View style={[styles.sendButton, animatedButtonStyle]}>
          <Ionicons
            name="arrow-up"
            size={18}
            color={hasText ? "#FFFFFF" : "#002C2A"}
          />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  chatbar: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    paddingTop: 16,
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12.5,
    elevation: 8,
  },
  dragHandle: {
    alignItems: "center",
    paddingBottom: 4,
  },
  dragHandlePill: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#C7C7CC",
  },
  input: {
    fontSize: 16,
    fontWeight: "500",
    color: "#002C2A",
    textAlignVertical: "top",
    padding: 0,
    margin: 0,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 36,
  },
  leftActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  chatBarButton: {
    padding: 4,
    borderRadius: 12,
  },
  chatBarButtonPressed: {
    opacity: 0.5,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});
