import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Message, MessageRole, MessageAttachment } from '@/types/message';
import ImageAttachmentView from '@/components/attachments/ImageAttachment';
import AudioAttachmentView from '@/components/attachments/AudioAttachment';
import VideoAttachmentView from '@/components/attachments/VideoAttachment';
import FileAttachmentView from '@/components/attachments/FileAttachment';

const MessageItem = ({ message }: { message: Message }) => {
  const isUser = message.role === MessageRole.User;
  const isSending = message.status === 'sending';

  const timestamp = new Date(message.createdAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <Animated.View
      entering={FadeInDown.duration(250).springify().damping(14)}
      style={[styles.outerRow, isUser ? styles.outerRowRight : styles.outerRowLeft]}
    >
      <View style={[
        styles.bubble,
        isUser ? styles.bubbleUser : styles.bubbleClient,
        isSending && styles.bubbleSending,
      ]}>
        <Text style={[styles.messageText, isUser ? styles.messageTextUser : styles.messageTextClient]}>
          {message.content}
        </Text>

        {message.attachments?.map((attachment, index) => (
          <AttachmentRenderer
            key={index}
            attachment={attachment}
            isUser={isUser}
          />
        ))}
      </View>
      <Text style={[styles.timestamp, isUser ? styles.timestampRight : styles.timestampLeft]}>
        {isSending ? 'Sending...' : timestamp}
      </Text>
    </Animated.View>
  );
};

function AttachmentRenderer({ attachment, isUser }: { attachment: MessageAttachment; isUser: boolean }) {
  switch (attachment.type) {
    case 'image':
      return <ImageAttachmentView attachment={attachment} isUser={isUser} />;
    case 'audio':
      return <AudioAttachmentView attachment={attachment} isUser={isUser} />;
    case 'video':
      return <VideoAttachmentView attachment={attachment} />;
    case 'file':
      return <FileAttachmentView attachment={attachment} isUser={isUser} />;
  }
}

const styles = StyleSheet.create({
  outerRow: {
    marginBottom: 8,
    maxWidth: '75%',
  },
  outerRowLeft: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  outerRowRight: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  bubble: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  bubbleClient: {
    backgroundColor: '#E9E9EB',
  },
  bubbleUser: {
    backgroundColor: '#007AFF',
  },
  bubbleSending: {
    opacity: 0.7,
  },
  messageText: {
    fontSize: 16,
    fontWeight: '400',
  },
  messageTextClient: {
    color: '#1C1C1E',
  },
  messageTextUser: {
    color: '#FFFFFF',
  },
  timestamp: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 4,
  },
  timestampLeft: {
    textAlign: 'left',
  },
  timestampRight: {
    textAlign: 'right',
  },
});

export default MessageItem;
