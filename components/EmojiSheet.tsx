import React, { forwardRef, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import type { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { EmojiKeyboard } from 'rn-emoji-keyboard';
import { hapticSelection } from '@/utils/haptics';

const SNAP_POINTS = ['50%', '80%'];

const EMOJI_KEYBOARD_THEME = {
  container: '#FFFFFF',
  header: '#1C1C1E',
  category: {
    icon: '#8E8E93',
    iconActive: '#007AFF',
    container: '#F2F2F7',
    containerActive: '#E5E5EA',
  },
} as const;

interface EmojiSheetProps {
  onEmojiSelected: (emoji: string) => void;
}

const EmojiSheet = forwardRef<BottomSheet, EmojiSheetProps>(({ onEmojiSelected }, ref) => {
  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    stiffness: 400,
    mass: 0.5,
    overshootClamping: false,
  });

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
    if (index >= 0) hapticSelection();
  }, []);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={SNAP_POINTS}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onChange={handleSheetChange}
      animationConfigs={animationConfigs}
      handleIndicatorStyle={styles.indicator}
      backgroundStyle={styles.sheetBackground}
    >
      <BottomSheetView style={styles.content}>
        <EmojiKeyboard
          onEmojiSelected={(emojiObject) => {
            hapticSelection();
            onEmojiSelected(emojiObject.emoji);
          }}
          enableSearchBar
          enableRecentlyUsed
          categoryPosition="top"
          theme={EMOJI_KEYBOARD_THEME}
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
