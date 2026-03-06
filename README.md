# mfc-ai-chat

A Slack-quality iOS chat app built with Expo and React Native. Features an expandable input with spring animations, AI-powered message formatting, rich media attachments, emoji picker, and a full design system with light/dark themes.

> See [INSTRUCTIONS.md](./INSTRUCTIONS.md) for the original technical test brief.
> See [PRODUCT_STRATEGY.html](./PRODUCT_STRATEGY.html) for the Part 2 product strategy deliverable (open in browser).

---

## Getting Started

### Prerequisites

- Node.js 18+
- Xcode 15+ (for iOS simulator)
- CocoaPods (`gem install cocoapods`)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Install iOS native pods
cd ios && pod install && cd ..

# 3. Start the app on iOS simulator
npm run ios
```

### AI Message Formatter (optional)

The sparkle button in the chat toolbar connects to **Google Gemini 2.5 Flash** to reformat messages. It works without an API key (the button just won't appear), but to enable it:

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **"Get API key"** in the left sidebar
3. Create an API key (free tier, no billing required)
4. Set it up:

```bash
cp .env.example .env
# Edit .env and paste your key:
# EXPO_PUBLIC_GEMINI_API_KEY=your_key_here
```

5. Restart Metro:

```bash
npx expo start --clear
```

---

## What's Inside

### Chat Screen

- **Message list** powered by `@shopify/flash-list` with message grouping and avatar clustering
- **Optimistic updates** via TanStack Query: messages appear instantly on send, with rollback on failure
- **Skeleton loading** with staggered pulse animations while data loads
- **Keyboard sync** through `react-native-keyboard-controller` for frame-perfect keyboard transitions

### Chat Input

- **Expandable height** from 1 to 6 lines using Reanimated spring animations on the UI thread
- **Swipe-to-expand** gesture with haptic feedback at the threshold
- **Dynamic send button** with scale/fade animations, conditional rendering based on input content
- **Toolbar** with three actions: attachments, emoji, and AI formatter

### Attachments

- **Attachment sheet**: bottom sheet with camera, photos, file, audio, video, and location options
- **Image attachments**: inline rendering with tap-to-view fullscreen modal
- **Audio player**: play/pause, waveform visualization, gesture-driven scrubbing, speed toggle (1x/1.5x/2x)
- **Video attachments**: thumbnail with play overlay
- **File attachments**: icon + metadata with PDF viewer integration

### Emoji Picker

- Full emoji set organized by category with search
- Recently used emojis persisted in MMKV
- 8-column grid layout in a bottom sheet (50%/80% snap points)

### AI Message Formatter

- Tap the sparkle icon to open the AI sheet
- Type a rough draft, optionally set a tone (professional, friendly, apologetic)
- Gemini 2.5 Flash returns a polished, Slack-appropriate message
- Animated gradient sparkle icon with shimmer effect (MaskedView + LinearGradient)
- Connection status visible in the Debug Dashboard

### Debug Dashboard

The app's home screen includes a debug panel with three feature toggles:

| Toggle | What it does |
|--------|-------------|
| Skeleton Loading | Forces the skeleton loading animation |
| Persist Messages | Enables/disables MMKV message persistence |
| AI Formatter | Shows/hides the AI button + displays Gemini API connection status |

### Theming

Light and dark themes configured via `react-native-unistyles`. 
To toggle themes in the iOS Simulator, go to **Features > Toggle Appearance**. For best results, use a fresh session rather than one with hot-reloaded changes.

The theme file (`theme/unistyles.ts`) defines:

- Spacing scale (xxs through jumbo)
- Typography scale (caption2 through display)
- Border radius tokens
- Color palette for message bubbles, input bar, attachments, and system elements

The app respects the system color scheme setting.

---

## Tech Stack

| Layer | Library | Version |
|-------|---------|---------|
| Framework | Expo | ~54.0 |
| Runtime | React Native | 0.81.4 |
| Navigation | expo-router | ~6.0 |
| Animations | react-native-reanimated | ~4.1.1 |
| Gestures | react-native-gesture-handler | ~2.28.0 |
| Message List | @shopify/flash-list | 2.0.2 |
| State | @tanstack/react-query | ^5.90.21 |
| Keyboard | react-native-keyboard-controller | 1.18.5 |
| Bottom Sheets | @gorhom/bottom-sheet | ^5.2.8 |
| Storage | react-native-mmkv | ^4.2.0 |
| Theming | react-native-unistyles | ^3.0.24 |
| Haptics | expo-haptics | ~15.0.7 |

---

## Project Structure

```
app/
  _layout.tsx          Root layout (providers + navigation)
  index.tsx            Debug dashboard
  chat.tsx             Main chat screen

components/
  ChatInput.tsx        Expandable input with swipe gesture
  MessageItem.tsx      Message bubble + attachment rendering
  AttachmentSheet.tsx  Attachment picker bottom sheet
  EmojiSheet.tsx       Emoji picker with search/recents
  AISheet.tsx          AI formatter dialog
  GradientAIIcon.tsx   Animated sparkle icon
  SkeletonMessages.tsx Loading skeleton
  ImageViewer.tsx      Fullscreen image modal
  VideoPlayerModal.tsx Video player
  PdfViewerModal.tsx   PDF viewer

hooks/
  useMessages.ts       Infinite query wrapper + cache merging
  useSendMessage.ts    Mutation with optimistic updates
  useAppTheme.ts       Theme consumer
  useContact.ts        Contact info

services/
  ai.ts                Gemini API client
  mockMessages.ts      Mock conversation data + asset loading
  storage.ts           MMKV persistence wrapper
  debugSettings.ts     Feature flag getters/setters

theme/
  unistyles.ts         Light/dark theme + design tokens

types/
  message.ts           Message, MessageRole, MessageAttachment

utils/
  haptics.ts           Haptic feedback helpers
  emojiRecents.ts      MMKV-backed recent emoji history
  messageGrouping.ts   Avatar grouping logic
  safeAudio.ts         Lazy audio wrapper
  fileDownload.ts      File sharing utilities
```

---

## Architecture Notes

- **New Architecture** enabled (`newArchEnabled: true`)
- **React Compiler** enabled via Expo experiments
- **Typed routes** for compile-time route safety
- **Provider stack** in `_layout.tsx`: GestureHandler > QueryClient > Keyboard > BottomSheet > Stack Navigator
- **Discriminated unions** for attachment types (image | audio | video | file) with exhaustive rendering
- **UI-thread animations** via Reanimated shared values for all transitions

---

Built by Ramiro Decono for the mobile.first technical test.
