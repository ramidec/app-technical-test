import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';

const COLOR_A = '#DDE1E1';
const COLOR_B = '#EEF0F0';

function Bone({
  width,
  height,
  borderRadius = 8,
  delay = 0,
}: {
  width: number;
  height: number;
  borderRadius?: number;
  delay?: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      ),
    );
  }, [delay, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [COLOR_A, COLOR_B]),
  }));

  return (
    <Animated.View style={[{ width, height, borderRadius }, animatedStyle]} />
  );
}

function SkeletonRow({
  isRight,
  widths,
  showAvatar,
  delay,
}: {
  isRight: boolean;
  widths: number[];
  showAvatar: boolean;
  delay: number;
}) {
  return (
    <View style={[styles.outerRow, isRight ? styles.outerRowRight : styles.outerRowLeft]}>
      <View style={[styles.messageRow, { flexDirection: isRight ? 'row-reverse' : 'row' }]}>
        <View style={styles.avatarCol}>
          {showAvatar && <Bone width={28} height={28} borderRadius={14} delay={delay} />}
        </View>
        <View style={[styles.lines, isRight ? styles.linesRight : styles.linesLeft]}>
          {widths.map((w, i) => (
            <Bone key={i} width={w} height={14} borderRadius={7} delay={delay + i * 70} />
          ))}
        </View>
      </View>
    </View>
  );
}

export default function SkeletonMessages() {
  return (
    <View style={styles.container}>
      <SkeletonRow isRight={false} widths={[160, 230, 100]} showAvatar={true}  delay={0} />
      <SkeletonRow isRight={true}  widths={[140]}           showAvatar={true}  delay={100} />
      <SkeletonRow isRight={false} widths={[200, 180]}      showAvatar={true}  delay={200} />
      <SkeletonRow isRight={true}  widths={[180, 130]}      showAvatar={false} delay={300} />
      <SkeletonRow isRight={true}  widths={[110]}           showAvatar={true}  delay={400} />
      <SkeletonRow isRight={false} widths={[190, 220, 120]} showAvatar={false} delay={500} />
      <SkeletonRow isRight={false} widths={[170]}           showAvatar={true}  delay={600} />
      <SkeletonRow isRight={true}  widths={[150, 110]}      showAvatar={true}  delay={700} />
      <SkeletonRow isRight={false} widths={[130]}           showAvatar={true}  delay={800} />
    </View>
  );
}

const styles = StyleSheet.create({
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
});
