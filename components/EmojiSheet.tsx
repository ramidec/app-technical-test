import React, { forwardRef, useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import type { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import EmojiPicker from 'rn-emoji-keyboard';
import { hapticSelection } from '@/utils/haptics';

interface EmojiSheetProps {
  onEmojiSelected: (emoji: string) => void;
}

const EmojiSheet = forwardRef<BottomSheet, EmojiSheetProps>(({ onEmojiSelected }, ref) => {
  const snapPoints = useMemo(() => ['50%', '80%'], []);

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
    if (index >= 0) {
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
        <EmojiPicker
          onEmojiSelected={(emojiObject) => {
            hapticSelection();
            onEmojiSelected(emojiObject.emoji);
          }}
          open={true}
          onClose={() => {
            // Sheet handles close via pan
          }}
          enableSearchBar
          enableRecentlyUsed
          categoryPosition="top"
          theme={{
            container: '#FFFFFF',
            header: '#1C1C1E',
            category: {
              icon: '#8E8E93',
              iconActive: '#007AFF',
              container: '#F2F2F7',
              containerActive: '#E5E5EA',
            },
          }}
        />
      </BottomSheetView>
    </BottomSheet>
  );
});

EmojiSheet.displayName = 'EmojiSheet';

export default EmojiSheet;

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
    flex: 1,
  },
});
