import React from 'react';
import { Modal, View, Pressable, ActivityIndicator, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Lazy import — native module may not be available in all dev builds
let PdfView: React.ComponentType<any> | null = null;
try {
  PdfView = require('@kishannareshpal/expo-pdf').PdfView;
} catch {
  // native module not available
}

interface Props {
  uri: string;
  fileName: string;
  visible: boolean;
  onClose: () => void;
  onDownload: () => void;
  downloading: boolean;
}

export default function PdfViewerModal({
  uri,
  fileName,
  visible,
  onClose,
  onDownload,
  downloading,
}: Props) {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header bar */}
        <View style={styles.header}>
          <Pressable onPress={onClose} hitSlop={12} style={styles.headerButton}>
            <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
          </Pressable>

          <Text style={styles.headerTitle} numberOfLines={1}>{fileName}</Text>

          <Pressable
            onPress={onDownload}
            hitSlop={12}
            disabled={downloading}
            style={styles.headerButton}
          >
            {downloading ? (
              <ActivityIndicator size="small" color={theme.colors.textPrimary} />
            ) : (
              <Ionicons name="download-outline" size={24} color={theme.colors.textPrimary} />
            )}
          </Pressable>
        </View>

        {/* PDF content */}
        {PdfView ? (
          <PdfView uri={uri} style={styles.pdf} doubleTapToZoom />
        ) : (
          <View style={styles.pdfFallback}>
            <Ionicons name="document-text-outline" size={48} color={theme.colors.textSecondary} />
            <Text style={styles.pdfFallbackText}>PDF preview unavailable</Text>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.pdfBackground,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.pdfHeaderBorder,
  },
  headerButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  pdf: {
    flex: 1,
  },
  pdfFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  pdfFallbackText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
  },
}));
