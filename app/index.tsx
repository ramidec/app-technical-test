import React, { useRef, useCallback, useState, useMemo, useEffect } from "react";
import {
  StyleSheet,
  StatusBar,
  View,
  ActivityIndicator,
  Keyboard,
  Pressable,
} from "react-native";
import { runOnJS } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import {
  KeyboardAvoidingView,
  useKeyboardHandler,
} from "react-native-keyboard-controller";
import BottomSheet from "@gorhom/bottom-sheet";
import MessageItem from "@/components/MessageItem";
import {
  computeMessageGrouping,
  MessageWithGrouping,
} from "@/utils/messageGrouping";
import ChatInput, { ChatInputRef } from "@/components/ChatInput";
import AttachmentSheet from "@/components/AttachmentSheet";
import EmojiSheet from "@/components/EmojiSheet";
import SkeletonMessages from "@/components/SkeletonMessages";
import BottomFade from "@/components/BottomFade";
import { useMessages } from "@/hooks/useMessages";
import { useSendMessage } from "@/hooks/useSendMessage";

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const flashListRef = useRef<FlashListRef<MessageWithGrouping>>(null);
  const chatInputRef = useRef<ChatInputRef>(null);
  const attachmentSheetRef = useRef<BottomSheet>(null);
  const emojiSheetRef = useRef<BottomSheet>(null);
  const [pendingEmoji, setPendingEmoji] = useState("");
  const [availableHeight, setAvailableHeight] = useState(0);
  const [isInputExpanded, setIsInputExpanded] = useState(false);

  const {
    messages,
    isLoading: dataLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useMessages();
  const sendMutation = useSendMessage();
  const groupedMessages = useMemo(
    () => computeMessageGrouping(messages),
    [messages],
  );

  // Skeleton: show for a minimum duration so the user sees it
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), 600);
    return () => clearTimeout(timer);
  }, []);

  // Hide skeleton once data is ready AND minimum time has passed.
  // Scroll to end repeatedly behind skeleton — each call lets FlashList
  // render more items at the new position. setTimeout gives render time.
  const dataReady = !dataLoading && groupedMessages.length > 0;

  useEffect(() => {
    if (dataReady && minTimeElapsed && showSkeleton) {
      let count = 0;
      const scroll = () => {
        flashListRef.current?.scrollToEnd({ animated: false });
        count++;
        if (count < 15) {
          setTimeout(scroll, 100);
        } else {
          setShowSkeleton(false);
          // After skeleton removal, maintainVisibleContentPosition switches on
          // which can shift scroll position. Do final scrolls after layout settles.
          setTimeout(() => {
            flashListRef.current?.scrollToEnd({ animated: false });
          }, 100);
          setTimeout(() => {
            flashListRef.current?.scrollToEnd({ animated: false });
          }, 300);
        }
      };
      scroll();
    }
  }, [dataReady, minTimeElapsed, showSkeleton]);

  const scrollToEndInstant = useCallback(() => {
    flashListRef.current?.scrollToEnd({ animated: false });
  }, []);

  const scrollToEndDelayed = useCallback(() => {
    setTimeout(() => {
      flashListRef.current?.scrollToEnd({ animated: false });
    }, 50);
  }, []);

  // Scroll list to bottom in sync with keyboard — animated:false so it
  // tracks the keyboard frame-by-frame instead of triggering a separate animation.
  // onEnd does a final precise scroll after layout settles to fix any drift
  // from runOnJS latency during the animation.
  useKeyboardHandler({
    onMove: (e) => {
      "worklet";
      if (e.height > 0) {
        runOnJS(scrollToEndInstant)();
      }
    },
    onEnd: (e) => {
      "worklet";
      if (e.height > 0) {
        runOnJS(scrollToEndDelayed)();
      }
    },
  });

  const handleSend = useCallback(
    (text: string) => {
      sendMutation.mutate(text);
      setTimeout(() => {
        flashListRef.current?.scrollToEnd({ animated: true });
      }, 50);
    },
    [sendMutation],
  );

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
    setPendingEmoji((prev) => prev + emoji);
    emojiSheetRef.current?.close();
    setTimeout(() => {
      chatInputRef.current?.focus();
    }, 100);
  }, []);

  return (
    <View style={styles.root}>
      {showSkeleton && (
        <View style={styles.skeletonOverlay}>
          <SkeletonMessages />
        </View>
      )}
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={insets.top + 56}
      >
        <StatusBar barStyle="dark-content" />

        <View
          style={styles.listWrapper}
          onLayout={(e) => setAvailableHeight(e.nativeEvent.layout.height)}
        >
          <View style={styles.listArea}>
            <FlashList<MessageWithGrouping>
              ref={flashListRef}
              data={groupedMessages}
              renderItem={({ item }) => (
                <MessageItem message={item} isLastInGroup={item.isLastInGroup} />
              )}
              keyExtractor={(item) => item.id}
              estimatedItemSize={120}
              initialScrollIndex={
                groupedMessages.length > 0
                  ? groupedMessages.length - 1
                  : undefined
              }
              style={styles.list}
              contentContainerStyle={styles.listContent}
              maintainVisibleContentPosition={
                showSkeleton ? undefined : { autoscrollToTopThreshold: 10 }
              }
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
          </View>
          {isInputExpanded && (
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => {
                chatInputRef.current?.collapse();
              }}
            />
          )}
          <ChatInput
            ref={chatInputRef}
            onSend={handleSend}
            onAttachPress={handleAttachPress}
            onEmojiPress={handleEmojiPress}
            pendingEmoji={pendingEmoji}
            onPendingEmojiConsumed={() => setPendingEmoji("")}
            onExpandedChange={setIsInputExpanded}
            maxExpandedHeight={
              availableHeight > 0 ? availableHeight : undefined
            }
          />
        </View>
      </KeyboardAvoidingView>

      <AttachmentSheet ref={attachmentSheetRef} />
      <EmojiSheet ref={emojiSheetRef} onEmojiSelected={handleEmojiSelected} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  skeletonOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    backgroundColor: "#FFFFFF",
  },
  listWrapper: {
    flex: 1,
  },
  listArea: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: 8,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
  },
  paginationLoader: {
    paddingVertical: 12,
    alignItems: "center",
  },
});
