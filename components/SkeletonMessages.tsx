import React, { useEffect } from 'react';
import { Dimensions, View } from 'react-native';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BUBBLE_MAX_WIDTH = SCREEN_WIDTH * 0.75;

// ─── Animated bone element ───────────────────────────────────────────────

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
    opacity: interpolate(progress.value, [0, 0.5, 1], [0.3, 0.55, 0.3]),
  }));

  return (
    <Animated.View
      style={[{ width, height, borderRadius, backgroundColor: color }, animatedStyle]}
    />
  );
}

// ─── Message bubble skeleton (mirrors MessageItem layout) ────────────────

function SkeletonBubble({
  isRight,
  bubbleWidth,
  lines,
  showAvatar,
  showImage,
  progress,
  boneColor,
  bubbleColor,
}: {
  isRight: boolean;
  bubbleWidth: number;
  lines: number;
  showAvatar: boolean;
  showImage?: boolean;
  progress: SharedValue<number>;
  boneColor: string;
  bubbleColor: string;
}) {
  const contentWidth = bubbleWidth - 32;

  return (
    <View style={[styles.outerRow, isRight ? styles.outerRowRight : styles.outerRowLeft]}>
      <View
        style={[
          styles.messageRow,
          { flexDirection: isRight ? 'row-reverse' : 'row' },
        ]}
      >
        <View style={styles.avatarCol}>
          {showAvatar && (
            <Bone
              width={28}
              height={28}
              borderRadius={14}
              progress={progress}
              color={boneColor}
            />
          )}
        </View>

        <View
          style={[styles.bubble, { backgroundColor: bubbleColor, width: bubbleWidth }]}
        >
          {Array.from({ length: lines }, (_, i) => {
            const isLast = i === lines - 1 && lines > 1;
            return (
              <Bone
                key={i}
                width={isLast ? contentWidth * 0.55 : contentWidth}
                height={12}
                borderRadius={6}
                progress={progress}
                color={boneColor}
              />
            );
          })}
          {showImage && (
            <Bone
              width={contentWidth}
              height={130}
              borderRadius={12}
              progress={progress}
              color={boneColor}
            />
          )}
          <View style={{ alignSelf: isRight ? 'flex-end' : 'flex-start' }}>
            <Bone
              width={45}
              height={9}
              borderRadius={4}
              progress={progress}
              color={boneColor}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Input bar skeleton (mirrors ChatInput layout) ───────────────────────

function SkeletonInputBar({
  progress,
  boneColor,
  inputBg,
  borderColor,
  bottomPadding,
}: {
  progress: SharedValue<number>;
  boneColor: string;
  inputBg: string;
  borderColor: string;
  bottomPadding: number;
}) {
  return (
    <View style={[styles.inputContainer, { paddingBottom: bottomPadding }]}>
      <View style={[styles.inputBar, { backgroundColor: inputBg, borderColor }]}>
        <Bone
          width={120}
          height={14}
          borderRadius={7}
          progress={progress}
          color={boneColor}
        />
        <View style={styles.inputActionsRow}>
          <View style={styles.inputLeftActions}>
            <Bone
              width={22}
              height={22}
              borderRadius={11}
              progress={progress}
              color={boneColor}
            />
            <Bone
              width={22}
              height={22}
              borderRadius={11}
              progress={progress}
              color={boneColor}
            />
          </View>
          <Bone
            width={36}
            height={36}
            borderRadius={18}
            progress={progress}
            color={boneColor}
          />
        </View>
      </View>
    </View>
  );
}

// ─── Main skeleton component ─────────────────────────────────────────────

export default function SkeletonMessages() {
  const progress = useSharedValue(0);
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);

  const bone = theme.colors.skeletonBase;
  const clientBg = theme.colors.bubbleClient;
  const userBg = theme.colors.bubbleUser;
  const W = BUBBLE_MAX_WIDTH;
  const bottomPad = Math.max(insets.bottom, 8) + 8;

  return (
    <View style={styles.container}>
      <View style={styles.messagesArea}>
        <SkeletonBubble
          isRight={false}
          bubbleWidth={Math.round(W * 0.88)}
          lines={2}
          showAvatar
          showImage
          progress={progress}
          boneColor={bone}
          bubbleColor={clientBg}
        />
        <SkeletonBubble
          isRight
          bubbleWidth={Math.round(W * 0.92)}
          lines={3}
          showAvatar
          progress={progress}
          boneColor={bone}
          bubbleColor={userBg}
        />
        <SkeletonBubble
          isRight={false}
          bubbleWidth={Math.round(W * 0.82)}
          lines={2}
          showAvatar={false}
          progress={progress}
          boneColor={bone}
          bubbleColor={clientBg}
        />
        <SkeletonBubble
          isRight={false}
          bubbleWidth={Math.round(W * 0.78)}
          lines={2}
          showAvatar
          progress={progress}
          boneColor={bone}
          bubbleColor={clientBg}
        />
        <SkeletonBubble
          isRight
          bubbleWidth={Math.round(W * 0.72)}
          lines={1}
          showAvatar
          progress={progress}
          boneColor={bone}
          bubbleColor={userBg}
        />
        <SkeletonBubble
          isRight={false}
          bubbleWidth={Math.round(W * 0.64)}
          lines={1}
          showAvatar
          progress={progress}
          boneColor={bone}
          bubbleColor={clientBg}
        />
        <SkeletonBubble
          isRight
          bubbleWidth={Math.round(W * 0.88)}
          lines={4}
          showAvatar
          progress={progress}
          boneColor={bone}
          bubbleColor={userBg}
        />
        <SkeletonBubble
          isRight={false}
          bubbleWidth={Math.round(W * 0.7)}
          lines={1}
          showAvatar
          progress={progress}
          boneColor={bone}
          bubbleColor={clientBg}
        />
      </View>
      <SkeletonInputBar
        progress={progress}
        boneColor={bone}
        inputBg={theme.colors.inputBackground}
        borderColor={theme.colors.background}
        bottomPadding={bottomPad}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
  },
  messagesArea: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'flex-end',
    paddingBottom: 16,
  },
  outerRow: {
    maxWidth: BUBBLE_MAX_WIDTH,
    marginBottom: 8,
  },
  outerRowLeft: {
    alignSelf: 'flex-start',
  },
  outerRowRight: {
    alignSelf: 'flex-end',
  },
  messageRow: {
    gap: 4,
    alignItems: 'flex-end',
  },
  avatarCol: {
    width: 28,
    justifyContent: 'flex-end',
    paddingBottom: 2,
  },
  bubble: {
    flexShrink: 1,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 6,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  inputBar: {
    borderRadius: 24,
    borderWidth: 1,
    paddingTop: 16,
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 12,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12.5,
    elevation: 8,
  },
  inputActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 36,
  },
  inputLeftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
}));
