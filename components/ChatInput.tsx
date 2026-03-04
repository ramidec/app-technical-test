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
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hapticImpact, hapticSelection } from '@/utils/haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';

const MIN_HEIGHT = 40;
const MAX_HEIGHT = 140;
const SPRING_CONFIG = { damping: 15, stiffness: 150, mass: 0.5 } as const;

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
  placeholder = 'Type your message...',
}: ChatInputProps) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');

  // Append emoji from picker
  useEffect(() => {
    if (pendingEmoji) {
      setText(prev => prev + pendingEmoji);
      onPendingEmojiConsumed?.();
    }
  }, [pendingEmoji, onPendingEmojiConsumed]);
  const [scrollEnabled, setScrollEnabled] = useState(false);

  const inputHeight = useSharedValue(MIN_HEIGHT);

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

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
      {/* Chat bar: action icons row */}
      <View style={styles.chatBar}>
        <ChatBarButton
          icon="add-circle-outline"
          onPress={handleAttachPress}
        />
        <ChatBarButton
          icon="happy-outline"
          onPress={handleEmojiPress}
        />
      </View>

      {/* Input row */}
      <View style={styles.row}>
        <Animated.View style={[styles.inputWrapper, animatedInputStyle]}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder={placeholder}
            placeholderTextColor="#9FA0A4"
            multiline
            scrollEnabled={scrollEnabled}
            onContentSizeChange={handleContentSizeChange}
          />
        </Animated.View>

        <SendButton hasText={hasText} onSend={handleSend} />
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
      <Ionicons name={icon} size={24} color="#8E8E93" />
    </Pressable>
  );
}

// --- Send Button (animated enter/exit) ---

interface SendButtonProps {
  hasText: boolean;
  onSend: () => void;
}

function SendButton({ hasText, onSend }: SendButtonProps) {
  const pressScale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    pressScale.value = withTiming(0.85, { duration: 100 });
  }, [pressScale]);

  const handlePressOut = useCallback(() => {
    pressScale.value = withSequence(
      withTiming(0.85, { duration: 50 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );
  }, [pressScale]);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  if (!hasText) {
    return (
      <Animated.View
        key="send-disabled"
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(150)}
        style={styles.sendButtonDisabled}
      >
        <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
      </Animated.View>
    );
  }

  return (
    <Animated.View
      key="send-active"
      entering={ZoomIn.springify().damping(12)}
      exiting={ZoomOut.duration(150)}
    >
      <Pressable
        onPress={onSend}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        hitSlop={8}
      >
        <Animated.View style={[styles.sendButton, pressStyle]}>
          <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  chatBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingBottom: 6,
  },
  chatBarButton: {
    padding: 4,
    borderRadius: 12,
  },
  chatBarButtonPressed: {
    opacity: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
    textAlignVertical: 'top',
    paddingTop: 10,
    paddingBottom: 10,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  sendButtonDisabled: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#C7C7CC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
    opacity: 0.5,
  },
});
