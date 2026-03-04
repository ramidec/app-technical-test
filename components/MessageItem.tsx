import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Message, MessageRole } from '@/types/message';

const MessageItem = ({ message }: { message: Message }) => {
  const isUser = message.role === MessageRole.User;

  const timestamp = new Date(message.createdAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <View style={[styles.outerRow, isUser ? styles.outerRowRight : styles.outerRowLeft]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleClient]}>
        <Text style={[styles.messageText, isUser ? styles.messageTextUser : styles.messageTextClient]}>
          {message.content}
        </Text>
      </View>
      <Text style={[styles.timestamp, isUser ? styles.timestampRight : styles.timestampLeft]}>
        {timestamp}
      </Text>
    </View>
  );
};

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
