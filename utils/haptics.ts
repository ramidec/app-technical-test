import * as Haptics from 'expo-haptics';

export function hapticImpact(style: Haptics.ImpactFeedbackStyle): void {
  Haptics.impactAsync(style).catch(() => {});
}

export function hapticSelection(): void {
  Haptics.selectionAsync().catch(() => {});
}

export function hapticNotification(type: Haptics.NotificationFeedbackType): void {
  Haptics.notificationAsync(type).catch(() => {});
}
