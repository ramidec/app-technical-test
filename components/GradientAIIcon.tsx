import React, { useCallback, useImperativeHandle, forwardRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";

export interface GradientAIIconRef {
  shimmer: () => void;
}

interface GradientAIIconProps {
  size?: number;
}

const GradientAIIcon = forwardRef<GradientAIIconRef, GradientAIIconProps>(
  function GradientAIIcon({ size = 22 }, ref) {
    const translateX = useSharedValue(0);

    const shimmer = useCallback(() => {
      translateX.value = withSequence(
        withTiming(-size, { duration: 300, easing: Easing.inOut(Easing.ease) }),
        withTiming(size, { duration: 0 }),
        withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) }),
      );
    }, [size, translateX]);

    useImperativeHandle(ref, () => ({ shimmer }), [shimmer]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
    }));

    return (
      <MaskedView
        style={{ width: size, height: size }}
        maskElement={
          <Ionicons name="sparkles" size={size} color="black" />
        }
      >
        <Animated.View style={[{ width: size * 3, height: size, flexDirection: "row" }, animatedStyle]}>
          <LinearGradient
            colors={["#A855F7", "#7C3AED", "#06B6D4"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ width: size, height: size }}
          />
          <LinearGradient
            colors={["#06B6D4", "#EC4899", "#A855F7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ width: size, height: size }}
          />
          <LinearGradient
            colors={["#A855F7", "#7C3AED", "#06B6D4"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ width: size, height: size }}
          />
        </Animated.View>
      </MaskedView>
    );
  },
);

export default GradientAIIcon;
