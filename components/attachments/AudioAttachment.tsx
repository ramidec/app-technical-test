import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { AudioAttachment as AudioAttachmentType } from '@/types/message';

interface Props {
  attachment: AudioAttachmentType;
  isUser: boolean;
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function AudioAttachment({ attachment, isUser }: Props) {
  const barColor = isUser ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.2)';
  const activeBarColor = isUser ? '#FFFFFF' : '#007AFF';

  return (
    <View style={styles.container}>
      <Pressable style={styles.playButton}>
        <Ionicons
          name="play"
          size={18}
          color={isUser ? '#007AFF' : '#FFFFFF'}
        />
      </Pressable>

      <View style={styles.waveformContainer}>
        {(attachment.waveform ?? [0.5, 0.5, 0.5, 0.5, 0.5]).map((amp, i) => (
          <View
            key={i}
            style={[
              styles.waveformBar,
              {
                height: 4 + amp * 20,
                backgroundColor: i < 3 ? activeBarColor : barColor,
              },
            ]}
          />
        ))}
      </View>

      <Text style={[styles.duration, isUser && styles.durationUser]}>
        {formatDuration(attachment.durationMs)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    minWidth: 180,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flex: 1,
  },
  waveformBar: {
    width: 3,
    borderRadius: 1.5,
  },
  duration: {
    fontSize: 12,
    color: '#8E8E93',
  },
  durationUser: {
    color: 'rgba(255,255,255,0.7)',
  },
});
