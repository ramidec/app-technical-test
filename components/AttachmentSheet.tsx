import React, { forwardRef, useCallback, useMemo } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import type { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hapticImpact, hapticSelection } from '@/utils/haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// --- Individual Option ---

interface AttachmentOptionData {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  bg: string;
  fg: string;
}

function AttachmentOption({
  option,
  onPress,
}: {
  option: AttachmentOptionData;
  onPress: (label: string) => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
      onPress={() => onPress(option.label)}
    >
      <View style={[styles.iconContainer, { backgroundColor: option.bg }]}>
        <Ionicons name={option.icon} size={24} color={option.fg} />
      </View>
      <Text style={styles.optionLabel}>{option.label}</Text>
    </Pressable>
  );
}

const AttachmentSheet = forwardRef<BottomSheet>((_, ref) => {
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();

  const attachmentOptions: readonly AttachmentOptionData[] = useMemo(() => [
    { icon: 'camera' as const, label: 'Camera', bg: theme.colors.cameraBackground, fg: theme.colors.cameraIcon },
    { icon: 'images' as const, label: 'Photos', bg: theme.colors.photosBackground, fg: theme.colors.photosIcon },
    { icon: 'document-text' as const, label: 'File', bg: theme.colors.fileBackground, fg: theme.colors.fileIcon },
    { icon: 'mic' as const, label: 'Audio', bg: theme.colors.audioBackground, fg: theme.colors.audioIcon },
    { icon: 'videocam' as const, label: 'Video', bg: theme.colors.videoBackground, fg: theme.colors.videoIcon },
    { icon: 'location' as const, label: 'Location', bg: theme.colors.locationBackground, fg: theme.colors.locationIcon },
  ], [theme]);

  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    stiffness: 400,
    mass: 0.5,
    overshootClamping: false,
  });

  const handleOptionPress = useCallback((label: string) => {
    hapticImpact(ImpactFeedbackStyle.Light);
    Alert.alert(`${label} selected`, `Opening ${label.toLowerCase()}...`);
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.35}
        pressBehavior="close"
      />
    ),
    []
  );

  const handleSheetChange = useCallback((index: number) => {
    if (index >= 0) hapticSelection();
  }, []);

  const bottomPadding = Math.max(insets.bottom, 16);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      enableDynamicSizing
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onChange={handleSheetChange}
      animationConfigs={animationConfigs}
      handleIndicatorStyle={styles.indicator}
      backgroundStyle={styles.sheetBackground}
    >
      <BottomSheetView style={[styles.content, { paddingBottom: bottomPadding }]}>
        {/* Row 1 */}
        <View style={styles.row}>
          {attachmentOptions.slice(0, 3).map((option) => (
            <AttachmentOption key={option.label} option={option} onPress={handleOptionPress} />
          ))}
        </View>
        {/* Row 2 */}
        <View style={styles.row}>
          {attachmentOptions.slice(3).map((option) => (
            <AttachmentOption key={option.label} option={option} onPress={handleOptionPress} />
          ))}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

AttachmentSheet.displayName = 'AttachmentSheet';
export default AttachmentSheet;

const styles = StyleSheet.create((theme) => ({
  sheetBackground: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: theme.colors.textPrimary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  indicator: {
    backgroundColor: theme.colors.separator,
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  option: {
    alignItems: 'center',
    paddingVertical: 10,
    width: 80,
  },
  optionPressed: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
}));
