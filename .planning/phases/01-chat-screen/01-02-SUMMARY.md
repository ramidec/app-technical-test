---
phase: 01-chat-screen
plan: 02
subsystem: ui
tags: [react-native, flash-list, keyboard-avoiding-view, chat, scroll, ios]

# Dependency graph
requires:
  - phase: 01-chat-screen
    provides: ChatInput component satisfying INP-01 through INP-10
provides:
  - ChatScreen with FlashList ref and auto-scroll on send (KBD-03)
  - Correct keyboardVerticalOffset accounting for Stack navigator header (KBD-01)
  - on-drag keyboard dismiss confirmed (KBD-02)
  - 7-message realistic demo conversation with mixed roles
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "FlashListRef<T> type for useRef — FlashList is a generic fn component, not a class"
    - "setTimeout 50ms after setState before scrollToEnd to let FlashList render first"
    - "keyboardVerticalOffset = insets.top + 56 for Stack navigator header on iOS"

key-files:
  created: []
  modified:
    - app/index.tsx

key-decisions:
  - "Use FlashListRef<Message> (not FlashList<Message>) for useRef type — FlashList is typed as a generic function component in this version of @shopify/flash-list"
  - "keyboardVerticalOffset uses insets.top + 56 to account for Expo Router Stack header height"
  - "50ms setTimeout before scrollToEnd gives FlashList time to render new item"

patterns-established:
  - "FlashListRef<T> pattern: import { FlashList, FlashListRef } and useRef<FlashListRef<T>>(null)"
  - "Auto-scroll on send: setTimeout 50ms then flashListRef.current?.scrollToEnd({ animated: true })"

requirements-completed: [INP-01, INP-02, INP-03, INP-04, INP-05, INP-06, INP-07, INP-08, INP-09, INP-10, KBD-01, KBD-02, KBD-03]

# Metrics
duration: 1min
completed: 2026-03-04
---

# Phase 1 Plan 02: ChatScreen Auto-Scroll, KAV Offset Fix, and Demo Messages Summary

**ChatScreen wired with FlashListRef auto-scroll on send, correct Stack-header KAV offset (+56pt), and 7-message realistic demo conversation**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-04T04:34:26Z
- **Completed:** 2026-03-04T04:35:42Z
- **Tasks:** 1 of 1
- **Files modified:** 1

## Accomplishments
- Added `FlashListRef<Message>` ref to `FlashList` enabling imperative scroll control
- Wired `scrollToEnd({ animated: true })` in `handleSend` with 50ms render-settle timeout (KBD-03)
- Fixed `keyboardVerticalOffset` from `insets.top + 16` to `insets.top + 56` to account for Expo Router Stack navigator header (KBD-01)
- Replaced 2-message stub with 7 realistic back-and-forth messages mixing `MessageRole.User` and `MessageRole.Client`, including one long multi-line received message (wraps, shows max-width)
- `keyboardDismissMode="on-drag"` confirmed preserved (KBD-02)
- All INP-01 through INP-10 requirements satisfied by existing `ChatInput.tsx` — no changes needed

## Task Commits

Each task was committed atomically:

1. **Task 1: Add FlashList ref, auto-scroll on send, fix KAV offset, and demo messages** - `84c7de2` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `app/index.tsx` - ChatScreen with FlashListRef ref, scrollToEnd on send, corrected KAV offset, 7 demo messages

## Decisions Made
- Used `FlashListRef<Message>` instead of `FlashList<Message>` for `useRef` type. This version of `@shopify/flash-list` exports `FlashList` as a generic function component (`RecyclerView`), not a class, so using it as a type annotation directly causes TS2749. The correct ref type is the explicitly-exported `FlashListRef<T>` interface.
- `keyboardVerticalOffset` set to `insets.top + 56`: the plan specified this value to account for the Expo Router Stack navigator header (~56pt on iOS). To be adjusted on device if visually incorrect.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript error: FlashList cannot be used as a type**
- **Found during:** Task 1 (Add FlashList ref, auto-scroll on send, fix KAV offset, and demo messages)
- **Issue:** Plan's code snippet used `useRef<FlashList<Message>>(null)` but `@shopify/flash-list` types `FlashList` as a generic function (`RecyclerViewType`), not a class. TypeScript error TS2749: `'FlashList' refers to a value, but is being used as a type here.`
- **Fix:** Imported `FlashListRef` from `@shopify/flash-list` and changed ref type to `useRef<FlashListRef<Message>>(null)`
- **Files modified:** app/index.tsx
- **Verification:** `npx tsc --noEmit` passes with zero errors
- **Committed in:** `84c7de2` (part of Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — type bug in plan's code snippet)
**Impact on plan:** Fix required for TypeScript correctness. No functional scope creep; `scrollToEnd` API is identical.

## Issues Encountered
None beyond the auto-fixed type error above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 1 fully complete: ChatInput component (plan 01) and ChatScreen wiring (plan 02) both done
- All 13 requirements (INP-01 through INP-10, KBD-01 through KBD-03) satisfied
- App is ready for manual verification on iOS simulator

---
*Phase: 01-chat-screen*
*Completed: 2026-03-04*
