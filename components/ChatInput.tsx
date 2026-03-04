import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
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
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hapticImpact, hapticSelection } from '@/utils/haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';

const MIN_HEIGHT = 19;
const MAX_HEIGHT = 120;
const SPRING_CONFIG = { damping: 20, stiffness: 200, mass: 0.5 } as const;

interface ChatInputProps {
  onSend: (text: string) => void;
  onAttachPress?: () => void;
  onEmojiPress?: () => void;
  pendingEmoji?: string;
  onPendingEmojiConsumed?: () => void;
  placeholder?: string;
}

export default function ChatInput({
  onSend,
  onAttachPress,
  onEmojiPress,
  pendingEmoji,
  onPendingEmojiConsumed,
  placeholder = 'Text Alexandra',
}: ChatInputProps) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [scrollEnabled, setScrollEnabled] = useState(false);

  const inputHeight = useSharedValue(MIN_HEIGHT);

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
      setScrollEnabled(h > MAX_HEIGHT);
      inputHeight.value = withSpring(
        Math.min(Math.max(h, MIN_HEIGHT), MAX_HEIGHT),
        SPRING_CONFIG
      );
    },
    [inputHeight]
  );

  const handleSend = useCallback(() => {
    if (!text.trim()) return;
    hapticImpact(ImpactFeedbackStyle.Light);
    onSend(text.trim());
    setText('');
    setScrollEnabled(false);
    inputHeight.value = withSpring(MIN_HEIGHT, SPRING_CONFIG);
  }, [text, onSend, inputHeight]);

  const handleAttachPress = useCallback(() => {
    hapticSelection();
    onAttachPress?.();
  }, [onAttachPress]);

  const handleEmojiPress = useCallback(() => {
    hapticSelection();
    onEmojiPress?.();
  }, [onEmojiPress]);

  const animatedInputStyle = useAnimatedStyle(() => ({
    height: inputHeight.value,
  }));

  const paddingBottom = Math.max(insets.bottom, 8) + 8;

  return (
    <View style={[styles.container, { paddingBottom }]}>
      <View style={styles.chatbar}>
        {/* Text area */}
        <Animated.View style={animatedInputStyle}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder={placeholder}
            placeholderTextColor="#809594"
            multiline
            scrollEnabled={scrollEnabled}
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
      </View>
    </View>
  );
}

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

  // Separate opacity into a wrapper so Reanimated layout animations don't conflict
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
