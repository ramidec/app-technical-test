import { StyleSheet } from "react-native-unistyles";

// ─── Spacing & Radius Tokens ────────────────────────────────────────────────

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  xxl: 16,
  xxxl: 20,
  xxxxl: 24,
  jumbo: 32,
} as const;

export const radius = {
  xs: 4,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  pill: 36,
  full: 100,
} as const;

export const typography = {
  size: {
    caption2: 10,
    caption: 11,
    footnote: 12,
    subhead: 13,
    callout: 14,
    body: 15,
    title3: 16,
    title2: 18,
    title1: 20,
    largeTitle: 24,
    display: 32,
    icon: 48,
  },
  weight: {
    medium: "500" as const,
    semibold: "600" as const,
  },
} as const;

// ─── Light Theme ─────────────────────────────────────────────────────────────

const lightTheme = {
  colors: {
    // Core surfaces
    background: "#FFFFFF",
    surface: "#F2F4F4",

    // Text
    textPrimary: "#002C2A",
    textSecondary: "#66807F",
    textPlaceholder: "#809594",
    textOnUser: "#002C2A",
    textOnClient: "#002C2A",
    textWhite: "#FFFFFF",

    // Message bubbles
    bubbleUser: "#E6FAF0",
    bubbleClient: "#F2F4F4",

    // Input bar
    inputBackground: "rgba(255,255,255,0.9)",
    inputBorder: "#C7C7CC",

    // Send button
    sendIdle: "#F2F4F4",
    sendActive: "#002C2A",
    sendIconIdle: "#002C2A",
    sendIconActive: "#FFFFFF",

    // Drag handle
    dragHandle: "#C7C7CC",

    // Borders & separators
    border: "#E0E0E0",
    separator: "#D1D5D5",

    // Skeleton
    skeletonBase: "#DDE1E1",
    skeletonHighlight: "#EEF0F0",

    // Gradient overlay (BottomFade)
    fadeStart: "rgba(255,255,255,0)",
    fadeEnd: "rgba(255,255,255,1)",

    // Header
    headerShadow: "#002C2A",
    headerShadowOpacity: 0.08,

    // Attachment sheet icon backgrounds
    cameraBackground: "#FEF0EB",
    cameraIcon: "#D46B3C",
    photosBackground: "#E6FAF0",
    photosIcon: "#2B8A5E",
    fileBackground: "#EBF2FE",
    fileIcon: "#4272A8",
    audioBackground: "#F3EDFC",
    audioIcon: "#7558A0",
    videoBackground: "#FCEBED",
    videoIcon: "#B84D58",
    locationBackground: "#E8F6F3",
    locationIcon: "#35806F",

    // Audio player – client
    audioTrack: "#C4CECE",
    audioButtonBg: "#E8EAEA",
    audioButtonBorder: "#D5DADA",
    audioThumb: "#002C2A",
    audioWrapperBg: "transparent",
    audioSpeedText: "#002C2A",

    // Audio player – user
    audioTrackUser: "rgba(255,255,255,0.25)",
    audioButtonBgUser: "rgba(255,255,255,0.18)",
    audioButtonBorderUser: "rgba(255,255,255,0.25)",
    audioThumbUser: "rgba(230,250,240,1)",
    audioWrapperBgUser: "rgba(255,255,255,0.12)",
    audioSpeedTextUser: "rgba(255,255,255,0.7)",

    // File attachment
    fileContainerClient: "rgba(0,0,0,0.05)",
    fileContainerUser: "rgba(255,255,255,0.15)",
    fileIconBoxClient: "#E5E5EA",
    fileIconBoxUser: "rgba(255,255,255,0.2)",
    fileDownloadUser: "rgba(255,255,255,0.7)",

    // Video
    videoOverlay: "rgba(0,0,0,0.5)",
    videoDurationBg: "rgba(0,0,0,0.6)",
    videoPlayerBg: "#000000",

    // Image
    imagePlaceholder: "#E5E5EA",

    // Close / overlay buttons
    closeButtonIcon: "rgba(255,255,255,0.85)",

    // PDF viewer
    pdfBackground: "#F8F8F8",
    pdfHeaderBorder: "#E0E0E0",

    // System blues
    systemBlue: "#007AFF",

    // Emoji keyboard
    emojiKeyboardBg: "#F2F2F7",
    emojiKeyboardHeader: "#1C1C1E",
    emojiKeyboardSearch: "#E5E5EA",
    emojiKeyboardIndicator: "#C7C7CC",

    // Misc
    black: "#000000",
    white: "#FFFFFF",
    transparent: "transparent",
  },
  spacing,
  radius,
  typography,
} as const;

// ─── Dark Theme ──────────────────────────────────────────────────────────────

const darkTheme = {
  colors: {
    // Core surfaces
    background: "#1C1C1E",
    surface: "#2C2C2E",

    // Text
    textPrimary: "#F2F4F4",
    textSecondary: "#9FA6A5",
    textPlaceholder: "#6B7A79",
    textOnUser: "#E6FAF0",
    textOnClient: "#F2F4F4",
    textWhite: "#FFFFFF",

    // Message bubbles
    bubbleUser: "#1A3D2E",
    bubbleClient: "#2C2C2E",

    // Input bar
    inputBackground: "rgba(44,44,46,0.9)",
    inputBorder: "#3A3A3C",

    // Send button
    sendIdle: "#2C2C2E",
    sendActive: "#E6FAF0",
    sendIconIdle: "#9FA6A5",
    sendIconActive: "#1C1C1E",

    // Drag handle
    dragHandle: "#48484A",

    // Borders & separators
    border: "#3A3A3C",
    separator: "#3A3A3C",

    // Skeleton
    skeletonBase: "#3A3A3C",
    skeletonHighlight: "#48484A",

    // Gradient overlay (BottomFade)
    fadeStart: "rgba(28,28,30,0)",
    fadeEnd: "rgba(28,28,30,1)",

    // Header
    headerShadow: "#000000",
    headerShadowOpacity: 0.3,

    // Attachment sheet icon backgrounds (muted for dark)
    cameraBackground: "#3D2A20",
    cameraIcon: "#E8956A",
    photosBackground: "#1A3D2E",
    photosIcon: "#5CBC8E",
    fileBackground: "#1E2D42",
    fileIcon: "#6A9BD4",
    audioBackground: "#2D2340",
    audioIcon: "#A088C8",
    videoBackground: "#3D2024",
    videoIcon: "#D87B84",
    locationBackground: "#1A3330",
    locationIcon: "#5CB8A0",

    // Audio player – client
    audioTrack: "#48484A",
    audioButtonBg: "#3A3A3C",
    audioButtonBorder: "#48484A",
    audioThumb: "#F2F4F4",
    audioWrapperBg: "transparent",
    audioSpeedText: "#F2F4F4",

    // Audio player – user
    audioTrackUser: "rgba(255,255,255,0.2)",
    audioButtonBgUser: "rgba(255,255,255,0.12)",
    audioButtonBorderUser: "rgba(255,255,255,0.2)",
    audioThumbUser: "rgba(26,61,46,1)",
    audioWrapperBgUser: "rgba(255,255,255,0.08)",
    audioSpeedTextUser: "rgba(255,255,255,0.6)",

    // File attachment
    fileContainerClient: "rgba(255,255,255,0.05)",
    fileContainerUser: "rgba(255,255,255,0.1)",
    fileIconBoxClient: "#3A3A3C",
    fileIconBoxUser: "rgba(255,255,255,0.15)",
    fileDownloadUser: "rgba(255,255,255,0.6)",

    // Video
    videoOverlay: "rgba(0,0,0,0.6)",
    videoDurationBg: "rgba(0,0,0,0.7)",
    videoPlayerBg: "#000000",

    // Image
    imagePlaceholder: "#3A3A3C",

    // Close / overlay buttons
    closeButtonIcon: "rgba(255,255,255,0.85)",

    // PDF viewer
    pdfBackground: "#1C1C1E",
    pdfHeaderBorder: "#3A3A3C",

    // System blues
    systemBlue: "#0A84FF",

    // Emoji keyboard
    emojiKeyboardBg: "#2C2C2E",
    emojiKeyboardHeader: "#F2F4F4",
    emojiKeyboardSearch: "#3A3A3C",
    emojiKeyboardIndicator: "#48484A",

    // Misc
    black: "#000000",
    white: "#FFFFFF",
    transparent: "transparent",
  },
  spacing,
  radius,
  typography,
} as const;

// ─── Unistyles Configuration ─────────────────────────────────────────────────

type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  settings: {
    adaptiveThemes: true,
  },
});
