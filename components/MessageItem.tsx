import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Message, MessageRole, MessageAttachment } from '@/types/message';
import ImageAttachmentView from '@/components/attachments/ImageAttachment';
import AudioAttachmentView from '@/components/attachments/AudioAttachment';
import VideoAttachmentView from '@/components/attachments/VideoAttachment';
import FileAttachmentView from '@/components/attachments/FileAttachment';

interface MessageItemProps {
  message: Message;
  isLastInGroup: boolean;
}

const MessageItem = ({ message, isLastInGroup }: MessageItemProps) => {
  const isUser = message.role === MessageRole.User;
  const isSending = message.status === 'sending';

  const timestamp = new Date(message.createdAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

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

          <Text style={[styles.timestamp, isUser ? styles.timestampRight : styles.timestampLeft]}>
            {isSending ? 'Sending...' : timestamp}
          </Text>
        </View>
      </View>
    </View>
  );
};

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

const styles = StyleSheet.create({
  outerRow: {
    marginBottom: 8,
    maxWidth: 358,
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
    backgroundColor: '#F2F4F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitialsText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#66807F',
  },
  bubble: {
    flexShrink: 1,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 4,
  },
  bubbleClient: {
    backgroundColor: '#F2F4F4',
  },
  bubbleUser: {
    backgroundColor: '#E6FAF0',
  },
  bubbleSending: {
    opacity: 0.7,
  },
  messageText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
  },
  messageTextClient: {
    color: '#002C2A',
  },
  messageTextUser: {
    color: '#002C2A',
  },
  timestamp: {
    color: '#66807F',
    fontSize: 12,
    fontWeight: '500',
  },
  timestampLeft: {
    textAlign: 'left',
  },
  timestampRight: {
    textAlign: 'right',
  },
});

export default MessageItem;
