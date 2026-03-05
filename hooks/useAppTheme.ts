import { useUnistyles } from "react-native-unistyles";
import { lightTheme, darkTheme } from "@/theme/unistyles";

/**
 * useAppTheme — returns the active theme object, reactive to live appearance changes.
 *
 * Unistyles 3's `useUnistyles().theme` doesn't refresh on adaptive theme
 * switches because the C++ layer emits ThemeName/ColorScheme changes (not
 * Theme). Accessing `rt.colorScheme` registers the ColorScheme dependency,
 * which DOES trigger a re-render, so we select the correct exported theme
 * object ourselves.
 */
export function useAppTheme() {
  const { rt } = useUnistyles();
  // Accessing rt.colorScheme registers the dependency → component
  // re-renders when the device appearance changes.
  return {
    theme: rt.colorScheme === "dark" ? darkTheme : lightTheme,
    colorScheme: rt.colorScheme as "dark" | "light",
  };
}
