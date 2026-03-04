import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
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
  const aspectRatio = attachment.width / attachment.height;
  const displayWidth = Math.min(MAX_WIDTH, attachment.width);
  const displayHeight = displayWidth / aspectRatio;

  return (
    <View style={[styles.container, { width: displayWidth, height: displayHeight }]}>
      <Image
        source={{ uri: attachment.thumbnailUri }}
        style={styles.thumbnail}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.overlay}>
        <View style={styles.playCircle}>
          <Ionicons name="play" size={24} color="#FFFFFF" />
        </View>
      </View>
      <View style={styles.durationBadge}>
        <Text style={styles.durationText}>
          {formatDuration(attachment.durationMs)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 6,
    backgroundColor: '#1C1C1E',
  },
  thumbnail: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 3,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
  },
});
