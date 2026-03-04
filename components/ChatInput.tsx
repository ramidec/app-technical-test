import React, { useState, useCallback, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Keyboard,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  interpolateColor,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import { hapticImpact, hapticSelection } from '@/utils/haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';

const MIN_HEIGHT = 19;
const MAX_HEIGHT = 120;
const SPRING_CONFIG = { damping: 20, stiffness: 200, mass: 0.5 } as const;
const EXPAND_SPRING = { damping: 25, stiffness: 180, mass: 0.8 } as const;
const SWIPE_THRESHOLD = 50;

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

const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(({
  onSend,
  onAttachPress,
  onEmojiPress,
  pendingEmoji,
  onPendingEmojiConsumed,
  onExpandedChange,
  placeholder = 'Text Alexandra',
  maxExpandedHeight = 400,
}, ref) => {
  const textInputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [isExpandedJS, setIsExpandedJS] = useState(false);

  const inputHeight = useSharedValue(MIN_HEIGHT);  // collapsed content height (managed by handleContentSizeChange)
  const expandHeight = useSharedValue(0);           // expand animation height (isolated from inputHeight)
  const isExpanded = useSharedValue(0);              // 0 = collapsed, 1 = expanded
  const dragTranslateY = useSharedValue(0);

  // Append emoji from picker
  useEffect(() => {
    if (pendingEmoji) {
      setText(prev => prev + pendingEmoji);
      onPendingEmojiConsumed?.();
    }
  }, [pendingEmoji, onPendingEmojiConsumed]);

  const hasText = text.trim().length > 0;

  const handleContentSizeChange = useCallback(
    (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
      const h = e.nativeEvent.contentSize.height;
      if (!isExpandedJS) {
        setScrollEnabled(h > MAX_HEIGHT);
        inputHeight.value = withSpring(
          Math.min(Math.max(h, MIN_HEIGHT), MAX_HEIGHT),
          SPRING_CONFIG
        );
      }
    },
    [inputHeight, isExpandedJS]
  );

  const setExpandedTrue = useCallback(() => {
    setIsExpandedJS(true);
    onExpandedChange?.(true);
  }, [onExpandedChange]);
  const setExpandedFalse = useCallback(() => {
    setIsExpandedJS(false);
    onExpandedChange?.(false);
  }, [onExpandedChange]);
  const fireHapticMedium = useCallback(() => hapticImpact(ImpactFeedbackStyle.Medium), []);
  const fireHapticLight = useCallback(() => hapticImpact(ImpactFeedbackStyle.Light), []);

  const panGesture = Gesture.Pan()
    .activeOffsetY([-15, 15])
    .onUpdate((event) => {
      'worklet';
      const ty = event.translationY;
      if (isExpanded.value < 0.5) {
        // Collapsed: full tracking upward, rubber-band downward
        dragTranslateY.value = ty < 0 ? ty : ty * 0.2;
      } else {
        // Expanded: full tracking downward, rubber-band upward
        dragTranslateY.value = ty > 0 ? ty : ty * 0.2;
      }
    })
    .onEnd((event) => {
      'worklet';
      const swipedUp = event.translationY < -SWIPE_THRESHOLD;
      const swipedDown = event.translationY > SWIPE_THRESHOLD;

      if (swipedUp && isExpanded.value < 0.5) {
        // Capture current visual height (content + drag extra)
        const currentH = inputHeight.value + Math.max(0, -event.translationY);
        expandHeight.value = currentH;

        isExpanded.value = 1;
        dragTranslateY.value = withSpring(0, SPRING_CONFIG);

        // Animate expand height from current visual size to target
        expandHeight.value = withSpring(maxExpandedHeight, EXPAND_SPRING);

        runOnJS(setExpandedTrue)();
        runOnJS(fireHapticMedium)();
      } else if (swipedDown && isExpanded.value > 0.5) {
        isExpanded.value = 0;
        runOnJS(setExpandedFalse)();
        runOnJS(fireHapticLight)();
      }
      dragTranslateY.value = withSpring(0, SPRING_CONFIG);
    })
    .onFinalize(() => {
      'worklet';
      dragTranslateY.value = withSpring(0, SPRING_CONFIG);
    });

  const collapse = useCallback(() => {
    if (isExpandedJS) {
      isExpanded.value = 0;
      setIsExpandedJS(false);
      onExpandedChange?.(false);
      Keyboard.dismiss();
      hapticImpact(ImpactFeedbackStyle.Light);
    }
  }, [isExpandedJS, isExpanded, onExpandedChange]);

  useImperativeHandle(ref, () => ({
    collapse,
    focus: () => textInputRef.current?.focus(),
  }), [collapse]);

  const handleSend = useCallback(() => {
    if (!text.trim()) return;
    hapticImpact(ImpactFeedbackStyle.Light);
    onSend(text.trim());
    setText('');
    setScrollEnabled(false);
    inputHeight.value = withSpring(MIN_HEIGHT, SPRING_CONFIG);
    // Collapse if expanded
    if (isExpandedJS) {
      isExpanded.value = 0;
      setIsExpandedJS(false);
      onExpandedChange?.(false);
    }
  }, [text, onSend, inputHeight, isExpanded, isExpandedJS, onExpandedChange]);

  const handleAttachPress = useCallback(() => {
    hapticSelection();
    onAttachPress?.();
  }, [onAttachPress]);

  const handleEmojiPress = useCallback(() => {
    hapticSelection();
    onEmojiPress?.();
  }, [onEmojiPress]);

  // Animated styles — always return the same property keys to avoid stale
  // property bugs when reanimated switches between flex and height.
  // flexShrink: 1 when expanding ensures the wrapper caps at the chatbar's
  // available space so the actions row stays visible.
  const animatedInputStyle = useAnimatedStyle(() => {
    if (isExpanded.value > 0.5) {
      return { height: expandHeight.value, maxHeight: expandHeight.value, flexShrink: 1 };
    }
    const dragExtra = Math.max(0, -dragTranslateY.value);
    const h = inputHeight.value + dragExtra;
    return { height: h, maxHeight: h, flexShrink: 0 };
  });

  // Container gets a fixed height when expanded (so the list keeps remaining space).
  // Inner elements use flex: 1 to fill the fixed-height container.
  const expandedContainerStyle = isExpandedJS ? { height: maxExpandedHeight } as const : undefined;
  const expandedInnerFlex = isExpandedJS ? { flex: 1 } as const : undefined;

  // When dragging down (positive), add marginTop to shrink the container from top
  const animatedDragStyle = useAnimatedStyle(() => ({
    marginTop: Math.max(0, dragTranslateY.value),
  }));

  const { progress: kbProgress } = useReanimatedKeyboardAnimation();
  const fullPadding = Math.max(insets.bottom, 8) + 8;
  const kbPadding = 8; // minimal padding when keyboard is up

  const animatedContainerStyle = useAnimatedStyle(() => ({
    paddingBottom: interpolate(kbProgress.value, [0, 1], [fullPadding, kbPadding]),
  }));

  return (
    <Animated.View style={[styles.container, animatedContainerStyle, expandedContainerStyle, animatedDragStyle]}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.chatbar, expandedInnerFlex]}>
          {/* Drag handle (visible when expanded) */}
          {isExpandedJS && (
            <View style={styles.dragHandle}>
              <View style={styles.dragHandlePill} />
            </View>
          )}

          {/* Text area */}
          <Animated.View style={animatedInputStyle}>
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
          </Animated.View>

          {/* Actions row */}
          <View style={styles.actionsRow}>
            <View style={styles.leftActions}>
              <ChatBarButton icon="attach-outline" onPress={handleAttachPress} />
              <ChatBarButton icon="happy-outline" onPress={handleEmojiPress} />
            </View>
            <SendButton hasText={hasText} onSend={handleSend} />
          </View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
});

ChatInput.displayName = 'ChatInput';
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
      withSpring(1, { damping: 10, stiffness: 200 })
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
      ['#F2F4F4', '#002C2A']
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
            color={hasText ? '#FFFFFF' : '#002C2A'}
          />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  chatbar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 12,
    shadowColor: '#002C2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  dragHandle: {
    alignItems: 'center',
    paddingBottom: 4,
  },
  dragHandlePill: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C7C7CC',
  },
  input: {
    fontSize: 16,
    fontWeight: '500',
    color: '#002C2A',
    textAlignVertical: 'top',
    padding: 0,
    margin: 0,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 36,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});
