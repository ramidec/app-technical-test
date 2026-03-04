import React from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * BottomFade
 * Decorative white-to-transparent overlay positioned at the bottom of the
 * message list, above the input bar. Creates a soft fade effect so messages
 * appear to dissolve into the input bar rather than abruptly end.
 *
 * Design spec: 96px tall, white (opacity 0) → white (opacity 1), bottom-to-top.
 * Implemented as a 10-step quadratic gradient approximation (no native gradient
 * library required). Replace with <LinearGradient> from expo-linear-gradient
 * if that package is later added for a perfectly smooth curve.
 *
 * Usage: place as an absolutely-positioned child of the flex list container.
 */

// Quadratic easing: opacity = (step / STEPS)^2  → smooth deceleration top→bottom
const STEPS = 9;
const TOTAL_HEIGHT = 96;
const STEP_HEIGHT = TOTAL_HEIGHT / STEPS;

// From transparent (top of overlay) → opaque white (bottom of overlay)
const OPACITIES = Array.from({ length: STEPS }, (_, i) =>
  Math.pow(i / (STEPS - 1), 2)
);

export default function BottomFade() {
  return (
    <View style={styles.container} pointerEvents="none">
      {OPACITIES.map((opacity, index) => (
        <View
          key={index}
          style={[
            styles.step,
            { opacity, height: STEP_HEIGHT },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: TOTAL_HEIGHT,
    flexDirection: 'column-reverse', // stack from bottom (opaque) to top (transparent)
    overflow: 'hidden',
  },
  step: {
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
});
