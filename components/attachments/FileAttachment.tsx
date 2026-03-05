import React, { useState, useCallback } from 'react';
import { Alert, StyleSheet, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { hapticImpact } from '@/utils/haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { downloadAndOpenFile } from '@/utils/fileDownload';
import PdfViewerModal from '@/components/PdfViewerModal';
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

function isPdf(fileName: string): boolean {
  return fileName.toLowerCase().endsWith('.pdf');
}

export default function FileAttachment({ attachment, isUser }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [pdfVisible, setPdfVisible] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!attachment.uri) return;
    hapticImpact(ImpactFeedbackStyle.Light);
    setDownloading(true);
    try {
      await downloadAndOpenFile(attachment.uri, attachment.fileName);
    } catch (e) {
      Alert.alert('Error', 'Failed to open file. Please try again.');
    } finally {
      setDownloading(false);
    }
  }, [attachment.uri, attachment.fileName]);

  const handlePress = useCallback(() => {
    if (!attachment.uri) return;
    hapticImpact(ImpactFeedbackStyle.Light);

    if (isPdf(attachment.fileName)) {
      setPdfVisible(true);
    } else {
      handleDownload();
    }
  }, [attachment.uri, attachment.fileName, handleDownload]);

  return (
    <>
      <Pressable onPress={handlePress} disabled={downloading}>
        <View style={[styles.container, isUser ? styles.containerUser : styles.containerClient]}>
          {/* File icon */}
          <View style={[styles.iconBox, isUser ? styles.iconBoxUser : styles.iconBoxClient]}>
            <Ionicons
              name={isPdf(attachment.fileName) ? 'document-text' : 'document'}
              size={20}
              color={isUser ? '#FFFFFF' : '#007AFF'}
            />
          </View>

          {/* File info */}
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

          {/* Download button */}
          <Pressable
            onPress={handleDownload}
            disabled={downloading}
            hitSlop={8}
            style={styles.downloadButton}
          >
            {downloading ? (
              <ActivityIndicator size="small" color={isUser ? '#FFFFFF' : '#007AFF'} />
            ) : (
              <Ionicons
                name="download-outline"
                size={20}
                color={isUser ? 'rgba(255,255,255,0.7)' : '#8E8E93'}
              />
            )}
          </Pressable>
        </View>
      </Pressable>

      {/* PDF Viewer Modal */}
      {isPdf(attachment.fileName) && attachment.uri ? (
        <PdfViewerModal
          uri={attachment.uri}
          fileName={attachment.fileName}
          visible={pdfVisible}
          onClose={() => setPdfVisible(false)}
          onDownload={handleDownload}
          downloading={downloading}
        />
      ) : null}
    </>
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
  downloadButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
