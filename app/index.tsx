import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import { Message, MessageRole } from '@/types/message';
import MessageItem from '@/components/MessageItem';
import ChatInput from '@/components/ChatInput';
import BottomFade from '@/components/BottomFade';

const initialMessages: Message[] = [
  {
    id: '1',
    role: MessageRole.Client,
    content: "Hey! Are you free to catch up this afternoon? I wanted to go over the project timeline with you before the team meeting tomorrow.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    role: MessageRole.User,
    content: "Sure, I'm free after 2pm.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    role: MessageRole.Client,
    content: "Perfect. Let's say 2:30?",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    role: MessageRole.User,
    content: "Works for me. Should we do a video call or just voice?",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    role: MessageRole.Client,
    content: "Video would be better — I'll share my screen to walk through the Figma designs.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    role: MessageRole.User,
    content: "Sounds good, I'll send you the link.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    role: MessageRole.Client,
    content: "Thanks! See you then.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const flashListRef = useRef<FlashListRef<Message>>(null);

  const handleSend = (text: string) => {
    setMessages(prev => [...prev, {
      id: Math.random().toString(36),
      role: MessageRole.User,
      content: text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }]);
    // Small timeout gives FlashList time to render the new item before scrolling
    setTimeout(() => {
      flashListRef.current?.scrollToEnd({ animated: true });
    }, 50);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={(Platform.OS === 'ios' ? insets.top : 0) + 56}
    >
      <StatusBar barStyle="dark-content" />

      <View style={styles.listContainer}>
        <FlashList
          ref={flashListRef}
          data={messages}
          renderItem={({ item }) => <MessageItem message={item} />}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          maintainVisibleContentPosition={{
            autoscrollToBottomThreshold: 0.2,
            startRenderingFromBottom: true,
          }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        />
        {/* Decorative white-to-transparent fade above input bar */}
        <BottomFade />
      </View>

      <ChatInput
        onSend={handleSend}
        placeholder="Text Alexandra"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContainer: {
    flex: 1,
    // Relative positioning so BottomFade can sit absolutely at its bottom
    position: 'relative',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
});
