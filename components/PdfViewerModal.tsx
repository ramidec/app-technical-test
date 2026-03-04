import React from 'react';
import { Modal, View, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { PdfView } from '@kishannareshpal/expo-pdf';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  visible,
  onClose,
  onDownload,
  downloading,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header bar */}
        <View style={styles.header}>
          <Pressable onPress={onClose} hitSlop={12} style={styles.headerButton}>
            <Ionicons name="close" size={24} color="#002C2A" />
          </Pressable>

          <Pressable
            onPress={onDownload}
            hitSlop={12}
            disabled={downloading}
            style={styles.headerButton}
          >
            {downloading ? (
              <ActivityIndicator size="small" color="#002C2A" />
            ) : (
              <Ionicons name="download-outline" size={24} color="#002C2A" />
            )}
          </Pressable>
        </View>

        {/* PDF content */}
        <PdfView
          uri={uri}
          style={styles.pdf}
          doubleTapToZoom
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  headerButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdf: {
    flex: 1,
  },
});
