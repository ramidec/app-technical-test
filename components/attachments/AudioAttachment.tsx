import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Pressable, LayoutChangeEvent } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useAppTheme } from '@/hooks/useAppTheme';
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
  const { theme } = useAppTheme();

  const [speedIndex, setSpeedIndex] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const thumbScale = useSharedValue(1);

  // --- Colour tokens ---
  const colors = isUser
    ? {
        icon: theme.colors.textWhite,
        elapsed: theme.colors.textWhite,
        duration: theme.colors.textWhite,
        trackFilled: theme.colors.textWhite,
        trackUnfilled: theme.colors.audioTrackUser,
        thumbStroke: theme.colors.textWhite,
        thumbFill: theme.colors.audioThumbUser,
        buttonBg: theme.colors.audioButtonBgUser,
        buttonBorder: theme.colors.audioButtonBorderUser,
        speed: theme.colors.audioSpeedTextUser,
        wrapperBg: theme.colors.audioWrapperBgUser,
      }
    : {
        icon: theme.colors.textPrimary,
        elapsed: theme.colors.textPrimary,
        duration: theme.colors.textPrimary,
        trackFilled: theme.colors.textPrimary,
        trackUnfilled: theme.colors.audioTrack,
        thumbStroke: theme.colors.textPrimary,
        thumbFill: theme.colors.audioThumb,
        buttonBg: theme.colors.audioButtonBg,
        buttonBorder: theme.colors.audioButtonBorder,
        speed: theme.colors.audioSpeedText,
        wrapperBg: theme.colors.audioWrapperBg,
      };

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
    <View style={[styles.wrapper, { backgroundColor: colors.wrapperBg }]}>
    <View style={styles.container}>
      {/* Play / Pause rounded-rect button */}
      <Pressable
        onPress={handlePlayPause}
        style={[styles.controlButton, { backgroundColor: colors.buttonBg, borderColor: colors.buttonBorder }]}
      >
        <Ionicons
          name={status.playing ? 'pause' : 'play'}
          size={16}
          color={colors.icon}
          style={!status.playing && styles.playIconNudge}
        />
      </Pressable>

      {/* Elapsed time */}
      <Text style={[styles.timeText, { color: colors.elapsed }]}>
        {formatTime(currentTime)}
      </Text>

      {/* Seekable progress slider */}
      <GestureDetector gesture={composed}>
        <View style={styles.sliderHitArea} onLayout={onTrackLayout}>
          {/* Unfilled track */}
          <View style={[styles.track, { backgroundColor: colors.trackUnfilled }]} />
          {/* Filled track */}
          <View
            style={[
              styles.trackFill,
              {
                backgroundColor: colors.trackFilled,
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
                borderColor: colors.thumbStroke,
                backgroundColor: colors.thumbFill,
              },
              thumbAnimatedStyle,
            ]}
          />
        </View>
      </GestureDetector>

      {/* Duration */}
      <Text style={[styles.timeText, { color: colors.duration }]}>
        {formatTime(duration)}
      </Text>

      {/* Speed rounded-rect badge */}
      <Pressable
        onPress={handleSpeedToggle}
        style={[styles.controlButton, { backgroundColor: colors.buttonBg, borderColor: colors.buttonBorder }]}
      >
        <Text style={[styles.speedText, { color: colors.speed }]}>
          x{SPEEDS[speedIndex]}
        </Text>
      </Pressable>
    </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  wrapper: {
    borderRadius: 14,
    padding: 8,
    marginTop: 6,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  // Rounded button shared by play & speed
  controlButton: {
    width: 28,
    height: 28,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconNudge: {
    marginLeft: 2,
  },
  timeText: {
    fontSize: 11,
    fontFamily: theme.typography.font.medium,
    fontVariant: ['tabular-nums'],
  },
  // Generous hit area for the slider
  sliderHitArea: {
    flex: 1,
    height: 28,
    justifyContent: 'center',
    paddingHorizontal: 0,
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
    fontSize: 11,
    fontFamily: theme.typography.font.semibold,
  },
}));
