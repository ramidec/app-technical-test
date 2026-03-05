import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';
import { useAppTheme } from '@/hooks/useAppTheme';

function Bone({
  width,
  height,
  borderRadius = 8,
  progress,
  color,
}: {
  width: number;
  height: number;
  borderRadius?: number;
  progress: SharedValue<number>;
  color: string;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [0, 0.5, 1],
      [0.15, 0.3, 0.15],
    ),
  }));

  return (
    <Animated.View
      style={[{ width, height, borderRadius, backgroundColor: color }, animatedStyle]}
    />
  );
}

function SkeletonRow({
  isRight,
  widths,
  showAvatar,
  progress,
  boneColor,
}: {
  isRight: boolean;
  widths: number[];
  showAvatar: boolean;
  progress: SharedValue<number>;
  boneColor: string;
}) {
  return (
    <View style={[styles.outerRow, isRight ? styles.outerRowRight : styles.outerRowLeft]}>
      <View style={[styles.messageRow, { flexDirection: isRight ? 'row-reverse' : 'row' }]}>
        <View style={styles.avatarCol}>
          {showAvatar && <Bone width={28} height={28} borderRadius={14} progress={progress} color={boneColor} />}
        </View>
        <View style={[styles.lines, isRight ? styles.linesRight : styles.linesLeft]}>
          {widths.map((w, i) => (
            <Bone key={i} width={w} height={14} borderRadius={7} progress={progress} color={boneColor} />
          ))}
        </View>
      </View>
    </View>
  );
}

export default function SkeletonMessages() {
  const progress = useSharedValue(0);
  const { theme } = useAppTheme();

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);

  return (
    <View style={styles.container}>
      <SkeletonRow isRight={false} widths={[160, 230, 100]} showAvatar={true}  progress={progress} boneColor={theme.colors.skeletonBase} />
      <SkeletonRow isRight={true}  widths={[140]}           showAvatar={true}  progress={progress} boneColor={theme.colors.skeletonBase} />
      <SkeletonRow isRight={false} widths={[200, 180]}      showAvatar={true}  progress={progress} boneColor={theme.colors.skeletonBase} />
      <SkeletonRow isRight={true}  widths={[180, 130]}      showAvatar={false} progress={progress} boneColor={theme.colors.skeletonBase} />
      <SkeletonRow isRight={true}  widths={[110]}           showAvatar={true}  progress={progress} boneColor={theme.colors.skeletonBase} />
      <SkeletonRow isRight={false} widths={[190, 220, 120]} showAvatar={false} progress={progress} boneColor={theme.colors.skeletonBase} />
      <SkeletonRow isRight={false} widths={[170]}           showAvatar={true}  progress={progress} boneColor={theme.colors.skeletonBase} />
      <SkeletonRow isRight={true}  widths={[150, 110]}      showAvatar={true}  progress={progress} boneColor={theme.colors.skeletonBase} />
      <SkeletonRow isRight={false} widths={[130]}           showAvatar={true}  progress={progress} boneColor={theme.colors.skeletonBase} />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 12,
  },
  outerRow: {
    maxWidth: 300,
  },
  outerRowLeft: {
    alignSelf: 'flex-start',
  },
  outerRowRight: {
    alignSelf: 'flex-end',
  },
  messageRow: {
    gap: 6,
    alignItems: 'flex-end',
  },
  avatarCol: {
    width: 28,
    height: 28,
    justifyContent: 'flex-end',
  },
  lines: {
    gap: 6,
  },
  linesLeft: {
    alignItems: 'flex-start',
  },
  linesRight: {
    alignItems: 'flex-end',
  },
}));
