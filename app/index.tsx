import React, { useRef, useCallback, useState, useMemo } from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  ActivityIndicator,
  Keyboard,
  Pressable,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import BottomSheet from '@gorhom/bottom-sheet';
import MessageItem from '@/components/MessageItem';
import { computeMessageGrouping, MessageWithGrouping } from '@/utils/messageGrouping';
import ChatInput, { ChatInputRef } from '@/components/ChatInput';
import AttachmentSheet from '@/components/AttachmentSheet';
import EmojiSheet from '@/components/EmojiSheet';
import SkeletonMessages from '@/components/SkeletonMessages';
import BottomFade from '@/components/BottomFade';
import { useMessages } from '@/hooks/useMessages';
import { useSendMessage } from '@/hooks/useSendMessage';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const flashListRef = useRef<FlashListRef<MessageWithGrouping>>(null);
  const chatInputRef = useRef<ChatInputRef>(null);
  const attachmentSheetRef = useRef<BottomSheet>(null);
  const emojiSheetRef = useRef<BottomSheet>(null);
  const [pendingEmoji, setPendingEmoji] = useState('');
  const [availableHeight, setAvailableHeight] = useState(0);
  const [isInputExpanded, setIsInputExpanded] = useState(false);

  const { messages, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useMessages();
  const sendMutation = useSendMessage();
  const groupedMessages = useMemo(() => computeMessageGrouping(messages), [messages]);

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
    emojiSheetRef.current?.close();
    setTimeout(() => {
      chatInputRef.current?.focus();
    }, 100);
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
        onLayout={(e) => setAvailableHeight(e.nativeEvent.layout.height)}
      >
        <StatusBar barStyle="dark-content" />

        <View style={styles.listWrapper}>
          <FlashList<MessageWithGrouping>
            ref={flashListRef}
            data={groupedMessages}
            renderItem={({ item }) => <MessageItem message={item} isLastInGroup={item.isLastInGroup} />}
            keyExtractor={(item) => item.id}
            estimatedItemSize={80}
            initialScrollIndex={groupedMessages.length > 0 ? groupedMessages.length - 1 : undefined}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            maintainVisibleContentPosition={{
              autoscrollToTopThreshold: 10,
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
          <BottomFade />
          {isInputExpanded && (
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => {
                chatInputRef.current?.collapse();
              }}
            />
          )}
        </View>

        <ChatInput
          ref={chatInputRef}
          onSend={handleSend}
          onAttachPress={handleAttachPress}
          onEmojiPress={handleEmojiPress}
          pendingEmoji={pendingEmoji}
          onPendingEmojiConsumed={() => setPendingEmoji('')}
          onExpandedChange={setIsInputExpanded}
          maxExpandedHeight={availableHeight > 0 ? availableHeight * 0.7 : undefined}
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
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listWrapper: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: 8,
    paddingRight: 16,
    paddingBottom: 32,
    paddingLeft: 16,
  },
  paginationLoader: {
    paddingVertical: 12,
    alignItems: 'center',
  },
});
