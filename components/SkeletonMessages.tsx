import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MotiView } from 'moti';

const SKELETON_COLOR = '#E5E5EA';
const HIGHLIGHT_COLOR = '#F2F2F7';

function SkeletonBone({
  width,
  height,
  borderRadius = 8,
  delay = 0,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  delay?: number;
}) {
  return (
    <MotiView
      from={{ opacity: 0.4 }}
      animate={{ opacity: 1 }}
      transition={{
        type: 'timing',
        duration: 800,
        loop: true,
        delay,
      }}
      style={[
        styles.bone,
        {
          width: width as number,
          height,
          borderRadius,
        },
      ]}
    />
  );
}

function SkeletonMessage({ isRight, delay }: { isRight: boolean; delay: number }) {
  return (
    <View style={[styles.messageRow, isRight && styles.messageRowRight]}>
      {!isRight && <SkeletonBone width={36} height={36} borderRadius={18} delay={delay} />}
      <View style={[styles.lines, isRight && styles.linesRight]}>
        <SkeletonBone width={isRight ? 100 : 120} height={14} delay={delay + 100} />
        <SkeletonBone width={isRight ? 160 : 200} height={14} delay={delay + 200} />
        {!isRight && <SkeletonBone width={140} height={14} delay={delay + 300} />}
      </View>
    </View>
  );
}

export default function SkeletonMessages() {
  return (
    <View style={styles.container}>
      <SkeletonMessage isRight={false} delay={0} />
      <SkeletonMessage isRight={true} delay={200} />
      <SkeletonMessage isRight={false} delay={400} />
      <SkeletonMessage isRight={true} delay={600} />
      <SkeletonMessage isRight={false} delay={800} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    maxWidth: '75%',
  },
  messageRowRight: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  lines: {
    gap: 6,
  },
  linesRight: {
    alignItems: 'flex-end',
  },
  bone: {
    backgroundColor: SKELETON_COLOR,
  },
});
