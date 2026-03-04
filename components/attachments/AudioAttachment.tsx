import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, LayoutChangeEvent } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from '@/utils/safeAudio';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { hapticImpact, hapticSelection } from '@/utils/haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import type { AudioAttachment as AudioAttachmentType } from '@/types/message';

interface Props {
  attachment: AudioAttachmentType;
  isUser: boolean;
}

const SPEEDS = [1, 1.5, 2] as const;
const THUMB_SIZE = 12;

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function AudioAttachment({ attachment, isUser }: Props) {
  const player = useAudioPlayer(attachment.uri || undefined, { updateInterval: 100 });
  const status = useAudioPlayerStatus(player);

  const [speedIndex, setSpeedIndex] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const thumbScale = useSharedValue(1);

  // --- Colour tokens ---
  // Inbound (client) bubble: dark teal on light gray
  // Outbound (user) bubble: white on green
  const iconColor = isUser ? '#FFFFFF' : '#002C2A';
  const elapsedColor = isUser ? '#FFFFFF' : '#002C2A';
  const durationColor = isUser ? '#FFFFFF' : '#002C2A';
  const trackFilledColor = isUser ? '#FFFFFF' : '#002C2A';
  const trackUnfilledColor = isUser ? 'rgba(255,255,255,0.25)' : '#C4CECE';
  const thumbStrokeColor = isUser ? '#FFFFFF' : '#002C2A';
  const thumbFillColor = isUser ? 'rgba(230,250,240,1)' : '#F2F4F4';
  const buttonBg = isUser ? 'rgba(255,255,255,0.18)' : '#E8EAEA';
  const buttonBorder = isUser ? 'rgba(255,255,255,0.25)' : '#D5DADA';
  const speedColor = isUser ? 'rgba(255,255,255,0.7)' : '#002C2A';
  const wrapperBg = isUser ? 'rgba(255,255,255,0.12)' : '#FFFFFF';

  // --- Computed ---
  const duration = status.duration > 0 ? status.duration : (attachment.durationMs / 1000);
  const currentTime = status.currentTime ?? 0;
  const progress = duration > 0 ? currentTime / duration : 0;

  // Reset when finished
  useEffect(() => {
    if (status.didJustFinish) {
      player.seekTo(0);
    }
  }, [status.didJustFinish, player]);

  // Play/Pause
  const handlePlayPause = useCallback(() => {
    hapticImpact(ImpactFeedbackStyle.Light);
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  }, [status.playing, player]);

  // Speed toggle
  const handleSpeedToggle = useCallback(() => {
    hapticSelection();
    const nextIndex = (speedIndex + 1) % SPEEDS.length;
    setSpeedIndex(nextIndex);
    player.setPlaybackRate(SPEEDS[nextIndex]);
  }, [speedIndex, player]);

  // Seek handler
  const seekToPosition = useCallback((x: number) => {
    if (trackWidth <= 0 || duration <= 0) return;
    const ratio = Math.max(0, Math.min(1, x / trackWidth));
    player.seekTo(ratio * duration);
  }, [trackWidth, duration, player]);

  // Track layout
  const onTrackLayout = useCallback((e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  }, []);

  // Gesture: tap to seek
  const tapGesture = Gesture.Tap()
    .onStart((e) => {
      runOnJS(seekToPosition)(e.x);
      thumbScale.value = withTiming(1.3, { duration: 80 });
    })
    .onFinalize(() => {
      thumbScale.value = withTiming(1, { duration: 150 });
    });

  // Gesture: pan to scrub
  const panGesture = Gesture.Pan()
    .activeOffsetX([-5, 5])
    .onStart(() => {
      thumbScale.value = withTiming(1.3, { duration: 80 });
    })
    .onUpdate((e) => {
      runOnJS(seekToPosition)(e.x);
    })
    .onEnd(() => {
      thumbScale.value = withTiming(1, { duration: 150 });
    });

  const composed = Gesture.Exclusive(panGesture, tapGesture);

  // Animated thumb style
  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: thumbScale.value }],
  }));

  return (
    <View style={[styles.wrapper, { backgroundColor: wrapperBg }]}>
    <View style={styles.container}>
      {/* ▶ Play / Pause rounded-rect button */}
      <Pressable
        onPress={handlePlayPause}
        style={[styles.controlButton, { backgroundColor: buttonBg, borderColor: buttonBorder }]}
      >
        <Ionicons
          name={status.playing ? 'pause' : 'play'}
          size={16}
          color={iconColor}
          style={!status.playing && styles.playIconNudge}
        />
      </Pressable>

      {/* Elapsed time */}
      <Text style={[styles.timeText, { color: elapsedColor }]}>
        {formatTime(currentTime)}
      </Text>

      {/* Seekable progress slider */}
      <GestureDetector gesture={composed}>
        <View style={styles.sliderHitArea} onLayout={onTrackLayout}>
          {/* Unfilled track */}
          <View style={[styles.track, { backgroundColor: trackUnfilledColor }]} />
          {/* Filled track */}
          <View
            style={[
              styles.trackFill,
              {
                backgroundColor: trackFilledColor,
                width: `${progress * 100}%`,
              },
            ]}
          />
          {/* Hollow ring thumb */}
          <Animated.View
            style={[
              styles.thumb,
              {
                left: `${progress * 100}%`,
                borderColor: thumbStrokeColor,
                backgroundColor: thumbFillColor,
              },
              thumbAnimatedStyle,
            ]}
          />
        </View>
      </GestureDetector>

      {/* Duration */}
      <Text style={[styles.timeText, { color: durationColor }]}>
        {formatTime(duration)}
      </Text>

      {/* ×1 Speed rounded-rect badge */}
      <Pressable
        onPress={handleSpeedToggle}
        style={[styles.controlButton, { backgroundColor: buttonBg, borderColor: buttonBorder }]}
      >
        <Text style={[styles.speedText, { color: speedColor }]}>
          ×{SPEEDS[speedIndex]}
        </Text>
      </Pressable>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 14,
    padding: 8,
    marginTop: 6,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 240,
  },
  // Rounded button shared by play & speed
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconNudge: {
    marginLeft: 2,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
    minWidth: 34,
  },
  // Generous hit area for the slider
  sliderHitArea: {
    flex: 1,
    height: 28,
    justifyContent: 'center',
  },
  track: {
    height: 2,
    borderRadius: 1,
    width: '100%',
  },
  trackFill: {
    position: 'absolute',
    height: 2,
    borderRadius: 1,
    top: 13, // centred in 28px hit area
  },
  // Hollow ring thumb
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: 2,
    top: (28 - THUMB_SIZE) / 2,
    marginLeft: -(THUMB_SIZE / 2),
  },
  speedText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
