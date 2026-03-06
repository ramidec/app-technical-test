import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { View } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";
import { hapticSelection } from "@/utils/haptics";

export interface AppSheetRef {
  open: () => void;
  close: () => void;
}

interface AppSheetProps {
  children: React.ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
  dismissable?: boolean;
}

const AppSheet = forwardRef<AppSheetRef, AppSheetProps>(
  ({ children, onOpen, onClose, dismissable = true }, ref) => {
    const modalRef = useRef<BottomSheetModal>(null);
    const insets = useSafeAreaInsets();

    const animationConfigs = useBottomSheetSpringConfigs({
      damping: 80,
      stiffness: 400,
      mass: 0.5,
      overshootClamping: false,
    });

    const open = useCallback(() => {
      hapticSelection();
      modalRef.current?.present();
      onOpen?.();
    }, [onOpen]);

    const close = useCallback(() => {
      modalRef.current?.dismiss();
    }, []);

    useImperativeHandle(ref, () => ({ open, close }), [open, close]);

    const handleDismiss = useCallback(() => {
      onClose?.();
    }, [onClose]);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.35}
          pressBehavior={dismissable ? "close" : "none"}
        />
      ),
      [dismissable],
    );

    const bottomPadding = Math.max(insets.bottom, 16);

    return (
      <BottomSheetModal
        ref={modalRef}
        onDismiss={handleDismiss}
        enableDynamicSizing
        enablePanDownToClose={dismissable}
        enableOverDrag={false}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        backdropComponent={renderBackdrop}
        animationConfigs={animationConfigs}
        handleIndicatorStyle={styles.indicator}
        backgroundStyle={styles.sheetBackground}
      >
        <BottomSheetView
          style={[styles.content, { paddingBottom: bottomPadding }]}
        >
          {children}
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

AppSheet.displayName = "AppSheet";
export default AppSheet;

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
    paddingTop: 4,
  },
}));
