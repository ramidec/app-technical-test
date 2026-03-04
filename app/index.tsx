import React, { useRef, useCallback, useState } from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  ActivityIndicator,
  Keyboard,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import BottomSheet from '@gorhom/bottom-sheet';
import { Message } from '@/types/message';
import MessageItem from '@/components/MessageItem';
import ChatInput from '@/components/ChatInput';
import AttachmentSheet from '@/components/AttachmentSheet';
import EmojiSheet from '@/components/EmojiSheet';
import SkeletonMessages from '@/components/SkeletonMessages';
import { useMessages } from '@/hooks/useMessages';
import { useSendMessage } from '@/hooks/useSendMessage';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const flashListRef = useRef<FlashListRef<Message>>(null);
  const attachmentSheetRef = useRef<BottomSheet>(null);
  const emojiSheetRef = useRef<BottomSheet>(null);
  const [pendingEmoji, setPendingEmoji] = useState('');

  const { messages, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useMessages();
  const sendMutation = useSendMessage();

  const handleSend = useCallback((text: string) => {
    sendMutation.mutate(text);
    setTimeout(() => {
      flashListRef.current?.scrollToEnd({ animated: true });
    }, 50);
  }, [sendMutation]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleAttachPress = useCallback(() => {
    Keyboard.dismiss();
    attachmentSheetRef.current?.snapToIndex(0);
  }, []);

  const handleEmojiPress = useCallback(() => {
    Keyboard.dismiss();
    emojiSheetRef.current?.snapToIndex(0);
  }, []);

  const handleEmojiSelected = useCallback((emoji: string) => {
    setPendingEmoji(prev => prev + emoji);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <SkeletonMessages />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={insets.top + 56}
      >
        <StatusBar barStyle="dark-content" />

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
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          ListHeaderComponent={
            isFetchingNextPage ? (
              <View style={styles.paginationLoader}>
                <ActivityIndicator size="small" color="#8E8E93" />
              </View>
            ) : null
          }
        />

        <ChatInput
          onSend={handleSend}
          onAttachPress={handleAttachPress}
          onEmojiPress={handleEmojiPress}
          pendingEmoji={pendingEmoji}
          onPendingEmojiConsumed={() => setPendingEmoji('')}
          placeholder="Type your message..."
        />
      </KeyboardAvoidingView>

      <AttachmentSheet ref={attachmentSheetRef} />
      <EmojiSheet ref={emojiSheetRef} onEmojiSelected={handleEmojiSelected} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 8,
  },
  paginationLoader: {
    paddingVertical: 12,
    alignItems: 'center',
  },
});
