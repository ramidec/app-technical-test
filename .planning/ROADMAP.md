# Roadmap: MFC AI Chat Technical Test

## Overview

The goal is a professional, Slack-quality iOS chat app. Phases 1 and 2 laid the foundation — basic chat screen and navigation header. Phases 3 and 4 complete the chat input to a production standard: Figma-accurate visuals, Slack-like behavior, attachment bottom sheet, emoji picker, and polished animations. More Slack-quality features follow after Phase 4. Slack is the behavioral reference throughout.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Chat Screen** - Pixel-perfect input, message bubbles, and keyboard behavior (completed 2026-03-04)
- [x] **Phase 2: Navigation Header** - Figma-matched header with avatar, name, and phone icon (completed 2026-03-04)
- [ ] **Phase 3: Chat Input Visual Redesign** - Figma-accurate input styling, Slack dynamic height, send button states, keyboard polish
- [ ] **Phase 4: Chat Input Advanced Features** - Attachment bottom sheet (gorhom), emoji button, left-to-right glow animation, all edge cases

## Phase Details

### Phase 1: Chat Screen
**Goal**: The chat screen looks and behaves like a production iOS messaging app
**Depends on**: Nothing (first phase)
**Requirements**: INP-01, INP-02, INP-03, INP-04, INP-05, INP-06, INP-07, INP-08, INP-09, INP-10, BUB-01, BUB-02, BUB-03, BUB-04, KBD-01, KBD-02, KBD-03
**Success Criteria** (what must be TRUE):
  1. User sees the chat input with a white background, hairline border, and gray placeholder — matching the Figma base state exactly
  2. User types a message and watches the input grow smoothly from one line up to five lines, then scroll for longer content, with the send button animating from dimmed to full opacity
  3. User sends a message and the input resets to single-line height; sent bubbles appear in iOS blue, received bubbles in light gray, each with a timestamp below
  4. User opens the keyboard and the input slides up smoothly without layout jumps; dragging the message list dismisses the keyboard
  5. User sends a message and the list auto-scrolls to show it, with the input cleared above the home indicator
**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md — Restyle MessageItem bubbles (colors, padding, radius, timestamps, max-width)
- [ ] 01-02-PLAN.md — Wire ChatScreen auto-scroll, fix KAV offset, add demo messages

### Phase 2: Navigation Header
**Goal**: The screen header matches the Figma design and provides standard navigation
**Depends on**: Phase 1
**Requirements**: NAV-01, NAV-02, NAV-03
**Success Criteria** (what must be TRUE):
  1. User sees a header with the contact's avatar (initials circle), name, and subtitle — matching Figma spacing and typography
  2. User taps the phone icon on the right and sees it respond (icon is present and tappable)
  3. User taps the back chevron and navigates away from the chat screen
**Plans**: 1 plan

Plans:
- [ ] 02-01-PLAN.md — Custom Stack header with avatar, name, subtitle, and phone icon in _layout.tsx

### Phase 3: Chat Input Visual Redesign
**Goal**: The chat input is visually pixel-perfect against the Figma design and behaves exactly like Slack's iOS input
**Depends on**: Phase 2
**Requirements**: INP-01, INP-02, INP-03, INP-04, INP-05, INP-06, INP-07, INP-08, INP-09, INP-10
**Success Criteria** (what must be TRUE):
  1. Input container matches Figma exactly — correct border, background, corner radius, padding, and font specs
  2. Input grows smoothly from 1 to ~5 lines with spring animation, then becomes scrollable — identical to Slack
  3. Send button is visually accurate to Figma; it transitions from disabled to active state with smooth opacity and scale animation as the user types
  4. Keyboard appears and disappears with zero layout jumps; input bar stays anchored above keyboard at all times
  5. Clearing text after send resets input height with a smooth spring collapse
**Plans**: TBD

### Phase 4: Chat Input Advanced Features
**Goal**: The input has Slack-level attachment, emoji, and interaction polish — mocked content, real behavior
**Depends on**: Phase 3
**Requirements**: TBD
**Success Criteria** (what must be TRUE):
  1. Attachment icon appears left of the text field; tapping it triggers a left-to-right glow sweep across the entire input bar, then opens a @gorhom/bottom-sheet with a Slack-style grid of mocked attachment options (Camera, Photos, File, Location, GIF — with Ionicons)
  2. Emoji icon appears left of the text field (next to attachment); tapping it also triggers the glow sweep and opens a mocked emoji picker bottom sheet
  3. Glow animation: a shimmer/highlight gradient sweeps from left edge to right edge of the full input container, then fades — smooth, not flashy
  4. Both bottom sheets feel native-quality: handle, backdrop, snap points, spring physics via gorhom
  5. All new interactions have haptic feedback
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Chat Screen | 2/2 | Complete   | 2026-03-04 |
| 2. Navigation Header | 1/1 | Complete   | 2026-03-04 |
| 3. Chat Input Visual Redesign | 0/TBD | Not started | - |
| 4. Chat Input Advanced Features | 0/TBD | Not started | - |
