import React, { useState, useCallback } from 'react';
import { Alert, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useAppTheme } from '@/hooks/useAppTheme';
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
  const { theme } = useAppTheme();

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
              color={isUser ? theme.colors.textWhite : theme.colors.fileIcon}
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
              <ActivityIndicator size="small" color={isUser ? theme.colors.textWhite : theme.colors.fileIcon} />
            ) : (
              <Ionicons
                name="download-outline"
                size={20}
                color={isUser ? theme.colors.fileDownloadUser : theme.colors.textSecondary}
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

const styles = StyleSheet.create((theme) => ({
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
    backgroundColor: theme.colors.fileContainerClient,
  },
  containerUser: {
    backgroundColor: theme.colors.fileContainerUser,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxClient: {
    backgroundColor: theme.colors.fileIconBoxClient,
  },
  iconBoxUser: {
    backgroundColor: theme.colors.fileIconBoxUser,
  },
  info: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  textUser: {
    color: theme.colors.textWhite,
  },
  fileSize: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  fileSizeUser: {
    color: theme.colors.fileDownloadUser,
  },
  downloadButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
