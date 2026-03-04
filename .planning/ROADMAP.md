# Roadmap: MFC AI Chat Technical Test

## Overview

Three phases deliver a complete technical test submission. Phase 1 makes the chat screen pixel-perfect — input, bubbles, and keyboard behavior all working together as one cohesive interaction. Phase 2 completes the screen with a polished navigation header. Phase 3 produces the product strategy document. The result is a runnable, reviewable submission that demonstrates both implementation quality and product thinking.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Chat Screen** - Pixel-perfect input, message bubbles, and keyboard behavior (completed 2026-03-04)
- [x] **Phase 2: Navigation Header** - Figma-matched header with avatar, name, and phone icon (completed 2026-03-04)
- [ ] **Phase 3: Product Strategy** - Written PRODUCT_STRATEGY.md with prioritized improvements

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

### Phase 3: Product Strategy
**Goal**: PRODUCT_STRATEGY.md is a sharp, reviewable product document that demonstrates product thinking
**Depends on**: Phase 1
**Requirements**: STR-01, STR-02, STR-03, STR-04
**Success Criteria** (what must be TRUE):
  1. Reader opens PRODUCT_STRATEGY.md and finds an honest assessment of the current implementation's limitations
  2. Reader sees 2-3 prioritized improvements, each with a clear user and business justification
  3. Reader sees a solution design and technical feasibility assessment for each improvement
  4. Reader sees an implementation roadmap that makes the proposal actionable
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Chat Screen | 2/2 | Complete   | 2026-03-04 |
| 2. Navigation Header | 1/1 | Complete   | 2026-03-04 |
| 3. Product Strategy | 0/TBD | Not started | - |
