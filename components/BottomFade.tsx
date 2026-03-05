import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native-unistyles';
import { useAppTheme } from '@/hooks/useAppTheme';

/**
 * BottomFade
 * Decorative white-to-transparent gradient overlay at the bottom of the
 * message list, above the input bar. Fades messages into the input bar.
 *
 * Design spec: 96px tall, white (opacity 1) at top -> transparent at bottom.
 * pointerEvents: none so it doesn't block scroll/taps on the list.
 */
export default function BottomFade() {
  const { theme } = useAppTheme();

  return (
    <LinearGradient
      // From opaque white at top down to transparent at bottom
      colors={[theme.colors.fadeStart, theme.colors.fadeEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 48,
  },
}));
