import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { hapticImpact } from '@/utils/haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useAppTheme } from '@/hooks/useAppTheme';
import VideoPlayerModal from '@/components/VideoPlayerModal';
import type { VideoAttachment as VideoAttachmentType } from '@/types/message';

interface Props {
  attachment: VideoAttachmentType;
}

const MAX_WIDTH = 220;

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function VideoAttachment({ attachment }: Props) {
  const { theme } = useAppTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const aspectRatio = attachment.width / attachment.height;
  const displayWidth = Math.min(MAX_WIDTH, attachment.width);
  const displayHeight = displayWidth / aspectRatio;

  return (
    <>
      <Pressable
        onPress={() => {
          hapticImpact(ImpactFeedbackStyle.Light);
          setModalVisible(true);
        }}
      >
        <View style={[styles.container, { width: displayWidth, height: displayHeight }]}>
          <Image
            source={{ uri: attachment.thumbnailUri }}
            style={styles.thumbnail}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.overlay}>
            <View style={styles.playCircle}>
              <Ionicons name="play" size={24} color={theme.colors.textWhite} />
            </View>
          </View>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>
              {formatDuration(attachment.durationMs)}
            </Text>
          </View>
        </View>
      </Pressable>
      {modalVisible && (
        <VideoPlayerModal
          uri={attachment.uri}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 6,
    backgroundColor: theme.colors.imagePlaceholder,
  },
  thumbnail: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.videoOverlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 3,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: theme.colors.videoDurationBg,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  durationText: {
    color: theme.colors.textWhite,
    fontSize: 11,
    fontFamily: theme.typography.font.medium,
  },
}));
