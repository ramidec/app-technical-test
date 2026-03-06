import React, { useMemo } from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Message, MessageRole, MessageAttachment } from '@/types/message';
import ImageAttachmentView from '@/components/attachments/ImageAttachment';
import AudioAttachmentView from '@/components/attachments/AudioAttachment';
import VideoAttachmentView from '@/components/attachments/VideoAttachment';
import FileAttachmentView from '@/components/attachments/FileAttachment';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BUBBLE_MAX_WIDTH = SCREEN_WIDTH * 0.75;

interface MessageItemProps {
  message: Message;
  isLastInGroup: boolean;
}

const MessageItem = React.memo(function MessageItem({ message, isLastInGroup }: MessageItemProps) {
  const isUser = message.role === MessageRole.User;
  const isSending = message.status === 'sending';

  const timestamp = useMemo(
    () => new Date(message.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    [message.createdAt],
  );

  return (
    <View
      style={[styles.outerRow, isUser ? styles.outerRowRight : styles.outerRowLeft]}
    >
      <View style={[
        styles.messageRow,
        { flexDirection: isUser ? 'row-reverse' : 'row' },
      ]}>
        {/* Avatar column */}
        <View style={styles.avatarColumn}>
          {isLastInGroup ? (
            <AvatarThumbnail name={message.senderName} uri={message.senderAvatar} />
          ) : (
            <View style={styles.avatarSpacer} />
          )}
        </View>

        {/* Bubble */}
        <View
          accessibilityRole="text"
          style={[
            styles.bubble,
            isUser ? styles.bubbleUser : styles.bubbleClient,
            isSending && styles.bubbleSending,
          ]}
        >
          <Text style={[styles.messageText, isUser ? styles.messageTextUser : styles.messageTextClient]}>
            {message.content}
          </Text>

          {message.attachments?.map((attachment) => (
            <AttachmentRenderer
              key={attachment.uri}
              attachment={attachment}
              isUser={isUser}
            />
          ))}

          <Text style={[styles.timestamp, isUser ? styles.timestampRight : styles.timestampLeft]}>
            {isSending ? 'Sending...' : timestamp}
          </Text>
        </View>
      </View>
    </View>
  );
});

function AvatarThumbnail({ name, uri }: { name?: string; uri?: string }) {
  if (uri) {
    return <Image source={{ uri }} style={styles.avatarImage} />;
  }
  const initials = (name || '??')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <View style={styles.avatarInitials}>
      <Text style={styles.avatarInitialsText}>{initials}</Text>
    </View>
  );
}

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

const styles = StyleSheet.create((theme) => ({
  outerRow: {
    marginBottom: 8,
    maxWidth: BUBBLE_MAX_WIDTH,
  },
  outerRowLeft: {
    alignSelf: 'flex-start',
  },
  outerRowRight: {
    alignSelf: 'flex-end',
  },
  messageRow: {
    gap: 4,
    alignItems: 'flex-end',
  },
  avatarColumn: {
    width: 28,
    justifyContent: 'flex-end',
    paddingBottom: 2,
  },
  avatarSpacer: {
    width: 28,
    height: 28,
  },
  avatarImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  avatarInitials: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitialsText: {
    fontSize: 10,
    fontFamily: theme.typography.font.semibold,
    color: theme.colors.textSecondary,
  },
  bubble: {
    flexShrink: 1,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 4,
  },
  bubbleClient: {
    backgroundColor: theme.colors.bubbleClient,
  },
  bubbleUser: {
    backgroundColor: theme.colors.bubbleUser,
  },
  bubbleSending: {
    opacity: 0.7,
  },
  messageText: {
    fontSize: 16,
    fontFamily: theme.typography.font.medium,
    lineHeight: 20,
  },
  messageTextClient: {
    color: theme.colors.textOnClient,
  },
  messageTextUser: {
    color: theme.colors.textOnUser,
  },
  timestamp: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontFamily: theme.typography.font.medium,
  },
  timestampLeft: {
    textAlign: 'left',
  },
  timestampRight: {
    textAlign: 'right',
  },
}));

export default MessageItem;
