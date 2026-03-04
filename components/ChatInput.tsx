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

export default function ChatInput({ onSend, placeholder = 'Type your message...' }: ChatInputProps) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [scrollEnabled, setScrollEnabled] = useState(false);

  const inputHeight = useSharedValue(MIN_HEIGHT);
  const sendOpacity = useSharedValue(0.35);
  const sendScale = useSharedValue(0.92);
  const sendPressOpacity = useSharedValue(1);

  const hasText = text.trim().length > 0;

  useEffect(() => {
    sendOpacity.value = withTiming(hasText ? 1 : 0.35, { duration: 200 });
    sendScale.value = withSpring(hasText ? 1 : 0.92, { damping: 15, stiffness: 300 });
  }, [hasText, sendOpacity, sendScale]);

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

  const animatedSendStyle = useAnimatedStyle(() => ({
    opacity: sendOpacity.value * sendPressOpacity.value,
    transform: [{ scale: sendScale.value }],
  }));

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
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

        <Pressable
          onPress={handleSend}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          hitSlop={8}
        >
          <Animated.View style={[styles.sendButton, animatedSendStyle]}>
            <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
    textAlignVertical: 'top',
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
});
