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
  interpolateColor,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hapticImpact } from '@/utils/haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';

const MIN_HEIGHT = 40;
const MAX_HEIGHT = 120;
const SPRING_CONFIG = { damping: 20, stiffness: 200 } as const;

interface ChatInputProps {
  onSend: (text: string) => void;
  placeholder?: string;
}

export default function ChatInput({ onSend, placeholder = 'Text Alexandra' }: ChatInputProps) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [scrollEnabled, setScrollEnabled] = useState(false);

  const inputHeight = useSharedValue(MIN_HEIGHT);
  // sendProgress: 0 = idle (no text), 1 = active (has text)
  const sendProgress = useSharedValue(0);
  const sendScale = useSharedValue(0.92);
  const sendPressOpacity = useSharedValue(1);

  const hasText = text.trim().length > 0;

  useEffect(() => {
    sendProgress.value = withTiming(hasText ? 1 : 0, { duration: 200 });
    sendScale.value = withSpring(hasText ? 1 : 0.92, { damping: 15, stiffness: 300 });
  }, [hasText, sendProgress, sendScale]);

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

  const handlePressIn = useCallback(() => {
    if (!text.trim()) return;
    sendPressOpacity.value = withTiming(0.65, { duration: 80 });
  }, [text, sendPressOpacity]);

  const handlePressOut = useCallback(() => {
    sendPressOpacity.value = withTiming(1, { duration: 120 });
  }, [sendPressOpacity]);

  const animatedInputStyle = useAnimatedStyle(() => ({
    height: inputHeight.value,
  }));

  const animatedSendStyle = useAnimatedStyle(() => {
    // Opacity: 0.35 when idle → 1.0 when active, multiplied by press feedback
    const opacity = (0.35 + 0.65 * sendProgress.value) * sendPressOpacity.value;
    return {
      opacity,
      transform: [{ scale: sendScale.value }],
      backgroundColor: interpolateColor(
        sendProgress.value,
        [0, 1],
        ['#F2F4F4', '#002C2A']
      ),
    };
  });

  // Icon color switches with text presence (instant, matches bg transition)
  const iconColor = hasText ? '#FFFFFF' : '#002C2A';

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 8 }]}>
      {/* Chatbar: rounded pill with shadow */}
      <View style={styles.chatbar}>
        <Animated.View style={[styles.inputWrapper, animatedInputStyle]}>
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

        <View style={styles.actionsRow}>
          <Pressable
            onPress={handleSend}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            hitSlop={8}
          >
            <Animated.View style={[styles.sendButton, animatedSendStyle]}>
              <Ionicons name="arrow-up" size={18} color={iconColor} />
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  chatbar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 8,
    // Shadow matching design: x:0 y:2 blur:24 color:#002C2A 8%
    shadowColor: '#002C2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  inputWrapper: {
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    fontWeight: '500',
    color: '#002C2A',
    textAlignVertical: 'top',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 36,
    marginTop: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
