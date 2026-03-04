# MFC AI Chat — Technical Test

## What This Is

A React Native (Expo ~54) technical test. Two parts: (1) polished Slack-grade chat input with rich mocked messages, and (2) product strategy document.

## Core Value

Production-quality chat that rivals Slack — 120fps animations, TanStack Query state management, gorhom bottom sheets, rich attachment types, skeleton loading. All mocked, but architecture-ready for real APIs.

## Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Expo | ~54 |
| Runtime | React Native | 0.81.4 |
| React | React | 19.1 |
| Router | Expo Router | ~6 |
| Animations | react-native-reanimated | ~4.1 |
| Gestures | react-native-gesture-handler | ~2.28 |
| List | @shopify/flash-list | 2.0.2 |
| Icons | @expo/vector-icons (Ionicons) | ^15 |
| Haptics | expo-haptics | ~15 |
| State | @tanstack/react-query | v5 (Phase 3) |
| Keyboard | react-native-keyboard-controller | latest (Phase 4) |
| Sheets | @gorhom/bottom-sheet | v5 (Phase 6) |
| Emoji | rn-emoji-keyboard | latest (Phase 6) |
| Skeleton | moti + expo-linear-gradient | latest (Phase 7) |

## Design References

- **Figma**: `sKoVdC8r9K0fCpe4oKI4au` (Chat-Technical-Test)
- **Behavioral**: Slack iOS input — dynamic height, keyboard sync, animated send, chat bar, bottom sheets, skeleton loading

## Architecture Decisions

| Decision | Rationale | Phase |
|----------|-----------|-------|
| TanStack Query over Zustand/Redux | Industry standard for server state, optimistic updates, infinite scroll | 3 |
| react-native-keyboard-controller over KAV | Native keyboard sync at 120fps, translate-with-padding for chat | 4 |
| Reanimated SharedValues for input height | UI thread execution, 120fps, spring physics | 4 |
| Reanimated Entering/Exiting for send button | Declarative mount/unmount animations | 5 |
| @gorhom/bottom-sheet over RN Modal | Native spring physics, snap points, keyboard integration | 6 |
| Moti skeleton over raw reanimated | Declarative API, Skeleton.Group, shimmer built-in | 7 |
| Discriminated union for message attachments | Type-safe rendering, exhaustive switch | 3 |
| Mock services over real API | Test requirement — no backend, but architecture-ready | 3 |

## Constraints

- **iOS first**: All design references are iPhone screenshots
- **No real API**: Everything mocked with proper types/models
- **Existing stack preferred**: New packages only where essential (listed in roadmap)
- **120fps target**: All animations must run on UI thread via Reanimated

## File Structure (Current + Planned)

```
app/
  _layout.tsx          # Root layout, QueryClientProvider, BottomSheetProvider
  index.tsx            # ChatScreen

components/
  ChatInput.tsx        # Expandable input (rewrite Phase 4)
  ChatBar.tsx          # Action bar with icons (Phase 5)
  MessageItem.tsx      # Bubble + attachment rendering (expand Phase 7)
  SendButton.tsx       # Animated send button (Phase 5)
  SkeletonMessages.tsx # Loading skeletons (Phase 7)
  AttachmentSheet.tsx  # Attachment picker sheet (Phase 6)
  EmojiSheet.tsx       # Emoji picker sheet (Phase 6)
  attachments/
    ImageAttachment.tsx  # Inline image (Phase 7)
    AudioAttachment.tsx  # Waveform player (Phase 7)
    VideoAttachment.tsx  # Thumbnail + play (Phase 7)

hooks/
  useMessages.ts       # useInfiniteQuery wrapper (Phase 3)
  useSendMessage.ts    # useMutation + optimistic update (Phase 3)

services/
  mockMessages.ts      # Mock data generator (Phase 3)

types/
  message.ts           # Expanded with attachment types (Phase 3)

utils/
  haptics.ts           # Haptic feedback (existing)
```

---
*Last updated: 2026-03-04*
