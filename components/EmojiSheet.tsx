import React, { forwardRef, useCallback, useMemo } from 'react';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import type { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { EmojiKeyboard } from 'rn-emoji-keyboard';
import { hapticSelection } from '@/utils/haptics';
import { StyleSheet } from 'react-native-unistyles';
import { useAppTheme } from '@/hooks/useAppTheme';

const SNAP_POINTS = ['50%', '80%'];

interface EmojiSheetProps {
  onEmojiSelected: (emoji: string) => void;
}

const EmojiSheet = forwardRef<BottomSheet, EmojiSheetProps>(({ onEmojiSelected }, ref) => {
  const { theme } = useAppTheme();

  const emojiKeyboardTheme = useMemo(() => ({
    container: theme.colors.background,
    header: theme.colors.emojiKeyboardHeader,
    category: {
      icon: theme.colors.emojiKeyboardIndicator,
      iconActive: theme.colors.systemBlue,
      container: theme.colors.emojiKeyboardBg,
      containerActive: theme.colors.emojiKeyboardSearch,
    },
  } as const), [theme]);

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
          theme={emojiKeyboardTheme}
        />
      </BottomSheetView>
    </BottomSheet>
  );
});

EmojiSheet.displayName = 'EmojiSheet';

export default EmojiSheet;

const styles = StyleSheet.create((theme) => ({
  sheetBackground: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  indicator: {
    backgroundColor: theme.colors.dragHandle,
    width: 36,
  },
  content: {
    flex: 1,
  },
}));
