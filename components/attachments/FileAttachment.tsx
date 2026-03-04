import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { FileAttachment as FileAttachmentType } from '@/types/message';

interface Props {
  attachment: FileAttachmentType;
  isUser: boolean;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileAttachment({ attachment, isUser }: Props) {
  return (
    <View style={[styles.container, isUser ? styles.containerUser : styles.containerClient]}>
      <View style={[styles.iconBox, isUser ? styles.iconBoxUser : styles.iconBoxClient]}>
        <Ionicons name="document" size={20} color={isUser ? '#FFFFFF' : '#007AFF'} />
      </View>
      <View style={styles.info}>
        <Text
          style={[styles.fileName, isUser && styles.textUser]}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {attachment.fileName}
        </Text>
        <Text style={[styles.fileSize, isUser && styles.fileSizeUser]}>
          {formatSize(attachment.fileSizeBytes)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
    padding: 10,
    borderRadius: 10,
    minWidth: 180,
  },
  containerClient: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  containerUser: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxClient: {
    backgroundColor: '#E5E5EA',
  },
  iconBoxUser: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  info: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  textUser: {
    color: '#FFFFFF',
  },
  fileSize: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  fileSizeUser: {
    color: 'rgba(255,255,255,0.7)',
  },
});
