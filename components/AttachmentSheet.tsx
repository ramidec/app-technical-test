import React, { forwardRef, useCallback, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import type { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { Ionicons } from '@expo/vector-icons';
import { hapticImpact, hapticSelection } from '@/utils/haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';

const ATTACHMENT_OPTIONS = [
  { icon: 'camera' as const, label: 'Camera', color: '#FF6B35' },
  { icon: 'images' as const, label: 'Photos', color: '#34C759' },
  { icon: 'document' as const, label: 'File', color: '#007AFF' },
  { icon: 'mic' as const, label: 'Audio', color: '#AF52DE' },
  { icon: 'videocam' as const, label: 'Video', color: '#FF3B30' },
  { icon: 'location' as const, label: 'Location', color: '#5856D6' },
];

const AttachmentSheet = forwardRef<BottomSheet>((_, ref) => {
  const snapPoints = useMemo(() => ['35%'], []);

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
        opacity={0.4}
      />
    ),
    []
  );

  const handleSheetChange = useCallback((index: number) => {
    if (index === 0) {
      hapticSelection();
    }
  }, []);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onChange={handleSheetChange}
      handleIndicatorStyle={styles.indicator}
      backgroundStyle={styles.sheetBackground}
    >
      <BottomSheetView style={styles.content}>
        <Text style={styles.title}>Share</Text>
        <View style={styles.grid}>
          {ATTACHMENT_OPTIONS.map((option) => (
            <Pressable
              key={option.label}
              style={({ pressed }) => [
                styles.option,
                pressed && styles.optionPressed,
              ]}
              onPress={() => handleOptionPress(option.label)}
            >
              <View style={[styles.iconCircle, { backgroundColor: option.color }]}>
                <Ionicons name={option.icon} size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.optionLabel}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

AttachmentSheet.displayName = 'AttachmentSheet';

export default AttachmentSheet;

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  indicator: {
    backgroundColor: '#C7C7CC',
    width: 36,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 20,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  option: {
    alignItems: 'center',
    width: '30%',
    paddingVertical: 8,
  },
  optionPressed: {
    opacity: 0.6,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
