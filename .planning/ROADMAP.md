# Roadmap: MFC AI Chat Technical Test

## Overview

Professional, Slack-quality iOS chat app. Phases 1-2 built the foundation (chat screen + nav header). Phases 3-8 complete the full experience: TanStack Query state management, Figma-accurate 120fps input, chat bar with attach/emoji bottom sheets (gorhom), rich mocked messages with attachments, skeleton loading, and product strategy.

Slack is the behavioral reference. No real API calls — everything mocked with proper types and models.

## Phases

- [x] **Phase 1: Chat Screen** — Pixel-perfect input, message bubbles, keyboard behavior
- [x] **Phase 2: Navigation Header** — Figma-matched header with avatar, name, phone icon
- [ ] **Phase 3: Data Layer & State Management** — TanStack Query, mock services, rich message types
- [ ] **Phase 4: Chat Input Core Redesign** — 120fps expandable input, keyboard-controller, Figma-accurate
- [ ] **Phase 5: Send Button & Chat Bar** — Animated send button, chat bar with attach/emoji icons
- [ ] **Phase 6: Bottom Sheets** — Gorhom attachment picker, emoji picker, glow animations
- [ ] **Phase 7: Rich Messages & Skeleton Loading** — Attachment display, audio/video/image mocks, Moti skeletons
- [ ] **Phase 8: Polish & Product Strategy** — Final animations, gestures, edge cases, PRODUCT_STRATEGY.md

## Phase Details

### Phase 1: Chat Screen (COMPLETE)
**Goal**: Chat screen looks and behaves like a production iOS messaging app
**Requirements**: INP-01..10, BUB-01..04, KBD-01..03
**Status**: Complete (2026-03-04)

### Phase 2: Navigation Header (COMPLETE)
**Goal**: Screen header matches Figma design with standard navigation
**Requirements**: NAV-01..03
**Status**: Complete (2026-03-04)

### Phase 3: Data Layer & State Management
**Goal**: Industry-standard state management with TanStack Query, proper TypeScript models, and mock data services
**Depends on**: Phase 2
**New Dependencies**: `@tanstack/react-query`
**Deliverables**:
  1. Install and configure TanStack Query with QueryClientProvider
  2. Expand Message type: add attachment types (image, audio, video, file)
  3. Create mock data service with realistic messages including attachments
  4. Wire useInfiniteQuery for paginated message loading (mocked)
  5. Optimistic send mutation with cache update
  6. Replace useState messages with TanStack Query
**Success Criteria**:
  1. Messages load from mock service via useInfiniteQuery
  2. Sending a message uses useMutation with optimistic update (appears instantly, "confirms" after mock delay)
  3. Message types include text-only, image, audio, video, and file attachments
  4. All data access goes through TanStack Query hooks — no raw useState for messages
  5. TypeScript models cover all attachment variants with discriminated unions

### Phase 4: Chat Input Core Redesign
**Goal**: The input is 120fps smooth, Figma-pixel-perfect, with professional keyboard handling
**Depends on**: Phase 3
**New Dependencies**: `react-native-keyboard-controller`
**Deliverables**:
  1. Install react-native-keyboard-controller
  2. Replace KeyboardAvoidingView with keyboard-controller's translate-with-padding
  3. Rewrite ChatInput with Reanimated LinearTransition for height changes
  4. SharedValue-driven height: MIN_HEIGHT=40, MAX_HEIGHT=140 (~6 lines, Slack-style)
  5. Spring animation config: damping 15, stiffness 150, mass 0.5
  6. Figma-accurate container styling (verify border, radius, padding, colors against design)
  7. Input scrollable when exceeding max height
**Success Criteria**:
  1. Input expands/collapses at 120fps with zero jank on ProMotion displays
  2. Keyboard show/hide is perfectly synced — no layout jumps, no flash
  3. Container matches Figma specs exactly (border, background, corner radius, padding, font)
  4. After max height, content scrolls internally (Slack behavior)
  5. Height resets with smooth spring after send

### Phase 5: Send Button & Chat Bar
**Goal**: Professional send button with animated state transitions, chat bar toolbar with action icons
**Depends on**: Phase 4
**Deliverables**:
  1. Send button: ZoomIn.springify entering, FadeOut exiting (conditionally rendered)
  2. Disabled state: opacity 0.35, scale 0.92 — Active state: opacity 1.0, scale 1.0
  3. Press feedback: withSequence(scale 0.85 → spring back to 1.0) + haptic
  4. Chat bar row below input text field with: attach icon (left), emoji icon (left), plus/format (left)
  5. Chat bar icons animate on appear (FadeIn) with proper spacing
  6. Chat bar mocked — icons visible and tappable, wired to Phase 6 bottom sheets
  7. Send button replaces last right-side icon when text present (Slack pattern)
**Success Criteria**:
  1. Send button appears/disappears with smooth animation as user types/clears
  2. Press feedback is tactile — scale bounce + haptic on every send
  3. Chat bar shows attach, emoji, and additional action icons below the input
  4. Icons respond to taps (haptic + visual feedback, even if bottom sheets come in Phase 6)
  5. Layout shifts between chat bar and send button modes are animated

### Phase 6: Bottom Sheets (Gorhom)
**Goal**: Native-quality bottom sheets for attachment picker and emoji picker, triggered from chat bar
**Depends on**: Phase 5
**New Dependencies**: `@gorhom/bottom-sheet`, `rn-emoji-keyboard`
**Deliverables**:
  1. Install @gorhom/bottom-sheet + BottomSheetModalProvider at app root
  2. Attachment bottom sheet: grid of mocked options (Camera, Photos, File, Audio, Video) with Ionicons
  3. Emoji picker bottom sheet: rn-emoji-keyboard or custom grid inside BottomSheetModal
  4. Glow animation: shimmer gradient sweep left→right across input container on icon tap
  5. Both sheets: snap points, spring physics, handle, backdrop, enablePanDownToClose
  6. Keyboard handling: keyboardBehavior="extend", keyboardBlurBehavior="restore"
  7. Haptic feedback on sheet open/close and item selection
**Success Criteria**:
  1. Tapping attach icon triggers glow sweep then opens attachment sheet
  2. Tapping emoji icon triggers glow sweep then opens emoji picker
  3. Both sheets feel native — smooth spring animations, proper snap points
  4. Selecting an emoji inserts it into the input
  5. Selecting an attachment type shows a mocked response (e.g., "Photo selected")
  6. Glow animation is subtle shimmer, not flashy

### Phase 7: Rich Messages & Skeleton Loading
**Goal**: Messages display image/audio/video attachments, channel loading shows Slack-style skeletons
**Depends on**: Phase 6
**New Dependencies**: `moti` (for skeleton), `expo-linear-gradient`
**Deliverables**:
  1. Install moti + expo-linear-gradient
  2. Skeleton loading screen: avatar circles + text line rectangles mimicking message layout
  3. Skeleton.Group with staggered delays for visual polish
  4. MessageItem expanded: renders image attachments (mocked URI), audio waveform placeholder, video thumbnail placeholder
  5. Mocked messages include diverse attachment types in initial data
  6. Image attachments: rounded corners, max-width constrained, tap to... (mocked)
  7. Audio attachments: play button + waveform bar + duration text
  8. Video attachments: thumbnail with play overlay
**Success Criteria**:
  1. On initial load, skeleton placeholders pulse for 1-2 seconds before messages appear
  2. Skeleton shapes match message bubble layout (avatar + lines)
  3. Image attachments render inline in message bubbles with proper aspect ratio
  4. Audio attachments show a recognizable player UI (play icon + waveform + time)
  5. Video attachments show thumbnail with centered play button
  6. All attachment displays are mocked but look production-ready

### Phase 8: Polish & Product Strategy
**Goal**: Final refinements, edge cases, gesture polish, and Part 2 product strategy document
**Depends on**: Phase 7
**Deliverables**:
  1. Review all animations for consistency (spring configs, timing, easing)
  2. Edge cases: empty input send prevention, very long messages, rapid typing, fast keyboard toggle
  3. Message entering animations (FadeInDown for new messages)
  4. Accessibility review (labels, roles, hints on interactive elements)
  5. PRODUCT_STRATEGY.md: current state assessment, 2-3 prioritized improvements, solution design, technical feasibility, implementation roadmap
  6. Final code cleanup: remove dead code, ensure consistent style patterns
**Success Criteria**:
  1. Every animation runs at 120fps with no dropped frames
  2. No edge case crashes or visual glitches
  3. New messages animate in smoothly
  4. PRODUCT_STRATEGY.md is comprehensive, well-reasoned, and addresses all Part 2 requirements (STR-01..04)
  5. Codebase is clean, well-typed, no warnings

## Progress

| Phase | Status | Completed |
|-------|--------|-----------|
| 1. Chat Screen | Complete | 2026-03-04 |
| 2. Navigation Header | Complete | 2026-03-04 |
| 3. Data Layer & State Management | Not started | — |
| 4. Chat Input Core Redesign | Not started | — |
| 5. Send Button & Chat Bar | Not started | — |
| 6. Bottom Sheets | Not started | — |
| 7. Rich Messages & Skeleton Loading | Not started | — |
| 8. Polish & Product Strategy | Not started | — |

## Dependency Graph

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8
                      (TanStack)  (Input)   (Buttons)  (Sheets)  (Rich+Skel) (Polish)
```

## New Dependencies to Install

| Phase | Package | Purpose |
|-------|---------|---------|
| 3 | @tanstack/react-query | State management, caching, mutations |
| 4 | react-native-keyboard-controller | Native keyboard sync, translate-with-padding |
| 6 | @gorhom/bottom-sheet | Native bottom sheets |
| 6 | rn-emoji-keyboard | Emoji picker |
| 7 | moti | Skeleton loading animations |
| 7 | expo-linear-gradient | Required by moti skeleton |
