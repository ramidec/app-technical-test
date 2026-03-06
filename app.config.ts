import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "mfc-ai-chat",
  slug: "mfc-ai-chat",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "mfcaichat",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.pablo.gdcr.mfcaichat",
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#F0E246",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    package: "com.pablo.gdcr.mfcaichat",
  },
  web: {
    output: "static" as const,
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#F0E246",
      },
    ],
    "expo-audio",
    "expo-video",
    "expo-font",
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
