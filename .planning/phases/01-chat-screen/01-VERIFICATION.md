---
phase: 01-chat-screen
verified: 2026-03-04T00:00:00Z
status: human_needed
score: 17/17 must-haves verified
human_verification:
  - test: "Keyboard avoidance on iOS device/simulator"
    expected: "Tap input field — keyboard rises, ChatInput slides up cleanly with full input row visible above keyboard. Stack navigator header visible above."
    why_human: "keyboardVerticalOffset = insets.top + 56 is structurally correct but cannot verify visual correctness of the 56pt offset without running on iOS."
  - test: "Spring animation on input height growth"
    expected: "Typing until text wraps causes input to grow smoothly (spring, not linear) from 40px to up to 120px. Growth feels elastic, not abrupt."
    why_human: "Spring animation is wired via Reanimated withSpring — correctness of feel requires visual inspection."
  - test: "Send button animation states"
    expected: "Empty input: button visibly dim (opacity 0.35) and slightly smaller (scale 0.92). Any text present: button snaps to full opacity and scale=1 with spring animation."
    why_human: "Animation values are correct in code. Perceptual correctness (visible difference, smooth transition) requires visual confirmation."
  - test: "Haptic feedback on send"
    expected: "Pressing Send triggers a Light haptic impact felt on device."
    why_human: "Haptics cannot be verified without physical device."
  - test: "Auto-scroll to new message"
    expected: "Send a message — the FlashList scrolls down to reveal the new sent bubble immediately (within 50ms)."
    why_human: "scrollToEnd is wired correctly but animated scroll behavior requires visual verification."
  - test: "Drag to dismiss keyboard"
    expected: "While keyboard is open, dragging the message list upward dismisses the keyboard."
    why_human: "keyboardDismissMode='on-drag' is set correctly. Gesture behavior requires device/simulator testing."
  - test: "Safe area bottom inset clears home indicator"
    expected: "On a notched iPhone (home indicator device), the ChatInput sits above the home indicator with no overlap."
    why_human: "paddingBottom = insets.bottom + 10 is correct structurally. Requires visual confirmation on device."
  - test: "Input scroll when exceeding max height"
    expected: "Type enough text to exceed ~5 lines (120px). Input stops growing and becomes internally scrollable."
    why_human: "scrollEnabled logic is wired to MAX_HEIGHT threshold. Cannot verify scroll feel without interaction."
---

# Phase 1: Chat Screen Verification Report

**Phase Goal:** The chat screen looks and behaves like a production iOS messaging app
**Verified:** 2026-03-04
**Status:** HUMAN_NEEDED — all automated checks pass; 8 items require device/simulator testing
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Received bubbles render with #E9E9EB background, no border, 16px border radius | VERIFIED | `bubbleClient: { backgroundColor: '#E9E9EB' }`, `bubble: { borderRadius: 16 }`, no borderWidth/borderColor found |
| 2 | Sent bubbles render with #007AFF background, white text, 16px border radius | VERIFIED | `bubbleUser: { backgroundColor: '#007AFF' }`, `messageTextUser: { color: '#FFFFFF' }`, shared `borderRadius: 16` |
| 3 | All bubbles have 10px vertical and 14px horizontal padding | VERIFIED | `bubble: { paddingVertical: 10, paddingHorizontal: 14 }` |
| 4 | Each bubble has a timestamp displayed below it in gray (#8E8E93), 12px font | VERIFIED | `timestamp: { color: '#8E8E93', fontSize: 12 }`, rendered via `toLocaleTimeString` from `message.createdAt` |
| 5 | Timestamp is left-aligned for received, right-aligned for sent | VERIFIED | `timestampLeft: { textAlign: 'left' }`, `timestampRight: { textAlign: 'right' }`, applied via `isUser` ternary |
| 6 | Bubble max-width is capped at 75% of screen width | VERIFIED | `outerRow: { maxWidth: '75%' }` |
| 7 | Demo conversation has 6-8 realistic messages mixing sent and received, including one long received message | VERIFIED | 7 messages in `initialMessages`, alternating `MessageRole.Client` / `MessageRole.User`; id '1' is a long multi-line received message |
| 8 | Sending a new message auto-scrolls FlashList to show it immediately | VERIFIED | `flashListRef.current?.scrollToEnd({ animated: true })` called in `handleSend` with 50ms timeout after `setMessages` |
| 9 | KeyboardAvoidingView offset correctly accounts for navigation header | VERIFIED | `keyboardVerticalOffset={(Platform.OS === 'ios' ? insets.top : 0) + 56}` — includes Stack header height baseline |
| 10 | Dragging the message list dismisses the keyboard | VERIFIED | `keyboardDismissMode="on-drag"` present on FlashList |
| 11 | ChatInput handles safe area so it clears the home indicator | VERIFIED | `paddingBottom: insets.bottom + 10` applied to ChatInput container via `useSafeAreaInsets()` |
| 12 | Chat input container has white background with hairline top border (#E5E5EA) | VERIFIED | `backgroundColor: '#FFFFFF'`, `borderTopWidth: StyleSheet.hairlineWidth`, `borderTopColor: '#E5E5EA'` |
| 13 | TextInput is borderless, multiline, with gray placeholder (#9FA0A4) | VERIFIED | No borderWidth on input, `multiline` prop set, `placeholderTextColor="#9FA0A4"` |
| 14 | Input height grows via spring animation from 40px to max 120px | VERIFIED | `MIN_HEIGHT=40`, `MAX_HEIGHT=120`, `withSpring(..., SPRING_CONFIG)` in `handleContentSizeChange` |
| 15 | Send button is dark circle (34px) with white arrow-up icon, bottom-anchored | VERIFIED | `width: 34, height: 34, borderRadius: 17, backgroundColor: '#1C1C1E'`, `<Ionicons name="arrow-up" color="#FFFFFF">`, `alignItems: 'flex-end'` on row |
| 16 | Send button animates to full opacity+scale=1 when text present; dimmed (0.35, 0.92) when empty | VERIFIED | `sendOpacity: useSharedValue(0.35)`, `sendScale: useSharedValue(0.92)`, `withTiming(hasText ? 1 : 0.35)`, `withSpring(hasText ? 1 : 0.92)` |
| 17 | Input resets to single-line height after send; haptic Light impact fires on send | VERIFIED | `inputHeight.value = withSpring(MIN_HEIGHT, ...)` and `hapticImpact(ImpactFeedbackStyle.Light)` both called in `handleSend` |

**Score: 17/17 truths verified**

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `components/MessageItem.tsx` | Fully styled message bubble with timestamp | VERIFIED | 74 lines, substantive implementation; imports `Message`, `MessageRole`; exports default `MessageItem`; no stubs |
| `components/ChatInput.tsx` | Animated chat input with send button, spring height, haptics, safe area | VERIFIED | 149 lines, full implementation with Reanimated, Haptics, SafeAreaInsets; no stubs |
| `app/index.tsx` | ChatScreen with FlashList ref, auto-scroll, demo messages, correct KAV offset | VERIFIED | 129 lines, FlashListRef wired, 7 demo messages, offset +56, all props confirmed |
| `types/message.ts` | Message interface and MessageRole enum | VERIFIED | Exports `MessageRole` (User/Client) and `Message` interface with all required fields |
| `utils/haptics.ts` | hapticImpact utility for ChatInput | VERIFIED | Exports `hapticImpact(style)` wrapping `expo-haptics` |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `components/MessageItem.tsx` | `types/message.ts` | `Message` interface and `MessageRole` enum | VERIFIED | `import { Message, MessageRole } from '@/types/message'`; `MessageRole.User` used in `isUser` check |
| `app/index.tsx` | `components/ChatInput.tsx` | `onSend` prop triggers `handleSend` which appends message then `scrollToEnd` | VERIFIED | `<ChatInput onSend={handleSend} ...>`; `handleSend` calls `setMessages` then `flashListRef.current?.scrollToEnd` |
| `app/index.tsx FlashList` | `components/MessageItem.tsx` | `renderItem` prop | VERIFIED | `renderItem={({ item }) => <MessageItem message={item} />}` |
| `components/ChatInput.tsx` | `utils/haptics.ts` | `hapticImpact` call on send | VERIFIED | `import { hapticImpact }` used in `handleSend` with `ImpactFeedbackStyle.Light` |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|---------|
| BUB-01 | 01-01-PLAN | Received bubbles: #E9E9EB, no border, 16px radius | SATISFIED | `bubbleClient: { backgroundColor: '#E9E9EB' }`, `borderRadius: 16`, no borderWidth |
| BUB-02 | 01-01-PLAN | Sent bubbles: #007AFF, white text, 16px radius | SATISFIED | `bubbleUser: { backgroundColor: '#007AFF' }`, `messageTextUser: { color: '#FFFFFF' }` |
| BUB-03 | 01-01-PLAN | Bubble padding: 10px vertical, 14px horizontal | SATISFIED | `paddingVertical: 10, paddingHorizontal: 14` |
| BUB-04 | 01-01-PLAN | Timestamp below each bubble, gray, 12px | SATISFIED | `timestamp: { color: '#8E8E93', fontSize: 12 }`, rendered below bubble in JSX |
| INP-01 | 01-02-PLAN | White background with hairline top border (#E5E5EA) | SATISFIED | `backgroundColor: '#FFFFFF'`, `borderTopWidth: StyleSheet.hairlineWidth`, `borderTopColor: '#E5E5EA'` |
| INP-02 | 01-02-PLAN | Borderless multiline TextInput, gray placeholder (#9FA0A4) | SATISFIED | No borderWidth on input, `multiline` set, `placeholderTextColor="#9FA0A4"` |
| INP-03 | 01-02-PLAN | Spring height growth 40px to 120px | SATISFIED | `MIN_HEIGHT=40`, `MAX_HEIGHT=120`, `withSpring` in `handleContentSizeChange` |
| INP-04 | 01-02-PLAN | Scrollable when content exceeds max height | SATISFIED | `setScrollEnabled(h > MAX_HEIGHT)`, passed as `scrollEnabled` to TextInput |
| INP-05 | 01-02-PLAN | Dark (#1C1C1E) circle 34px send button with white arrow-up | SATISFIED | `width: 34, height: 34, borderRadius: 17, backgroundColor: '#1C1C1E'`, `Ionicons arrow-up #FFFFFF` |
| INP-06 | 01-02-PLAN | Send button full opacity+scale=1 when text present | SATISFIED | `withTiming(hasText ? 1 : 0.35)`, `withSpring(hasText ? 1 : 0.92)` |
| INP-07 | 01-02-PLAN | Send button dimmed (opacity 0.35, scale 0.92) when empty | SATISFIED | Initial values `useSharedValue(0.35)` and `useSharedValue(0.92)`, animated back when empty |
| INP-08 | 01-02-PLAN | Haptic Light impact on send | SATISFIED | `hapticImpact(ImpactFeedbackStyle.Light)` called at start of `handleSend` |
| INP-09 | 01-02-PLAN | Input resets to single line after send | SATISFIED | `inputHeight.value = withSpring(MIN_HEIGHT, SPRING_CONFIG)` in `handleSend` |
| INP-10 | 01-02-PLAN | Safe area bottom inset clears home indicator | SATISFIED | `paddingBottom: insets.bottom + 10` applied to ChatInput container |
| KBD-01 | 01-02-PLAN | Keyboard avoidance smooth on iOS | SATISFIED (needs human) | `KeyboardAvoidingView behavior='padding'`, `keyboardVerticalOffset=insets.top+56`; visual correctness needs device test |
| KBD-02 | 01-02-PLAN | Drag message list dismisses keyboard | SATISFIED (needs human) | `keyboardDismissMode="on-drag"` confirmed on FlashList; gesture behavior needs device test |
| KBD-03 | 01-02-PLAN | Auto-scroll to bottom on new message | SATISFIED (needs human) | `flashListRef.current?.scrollToEnd({ animated: true })` wired in `handleSend`; animated behavior needs device test |

**Orphaned requirements from REQUIREMENTS.md for other phases (not in scope for Phase 1):**
- NAV-01, NAV-02, NAV-03 — Phase 2 (pending, correctly deferred)
- STR-01, STR-02, STR-03, STR-04 — Phase 3 (pending, correctly deferred)

No orphaned requirements for Phase 1 — all 17 IDs (INP-01 through INP-10, BUB-01 through BUB-04, KBD-01 through KBD-03) are claimed by either 01-01-PLAN or 01-02-PLAN and have implementation evidence.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `app/index.tsx` | 94-107 | `estimatedItemSize` missing from FlashList | Info | FlashList requires this prop for optimal virtualization; omitting it causes a dev-mode warning but does not break rendering. Not a blocker. |

No TODO/FIXME comments found. No empty implementations. No stub handlers. No placeholder returns.

---

### Human Verification Required

The following must be confirmed on iOS simulator or physical device. All supporting code is structurally correct.

#### 1. Keyboard avoidance offset

**Test:** Launch app, tap the message input field. Keyboard rises.
**Expected:** The entire ChatInput row (text field + send button) is fully visible above the keyboard. The Stack navigator header is not obscured.
**Why human:** `keyboardVerticalOffset = insets.top + 56` is structurally correct. The 56pt Stack header approximation may need adjustment on device. Cannot verify visual alignment without running iOS.

#### 2. Spring animation on input height growth

**Test:** Type text in the input until it wraps to a second, third, and fourth line.
**Expected:** Input grows smoothly with a spring feel (slight overshoot and settle) from 40px up to 120px max. Growth should not feel linear or abrupt.
**Why human:** `withSpring(height, { damping: 20, stiffness: 200 })` is wired. Perceptual quality of the spring requires visual inspection.

#### 3. Send button animation states

**Test:** Launch app with empty input — observe button. Type a character — observe button.
**Expected:** Empty: button visibly dim and slightly small. With text: button snaps to full brightness and normal size with a spring transition.
**Why human:** Opacity 0.35 vs 1.0 and scale 0.92 vs 1.0 are correct values in code. The visual perceptibility of the difference requires seeing it.

#### 4. Haptic feedback on send

**Test:** On a physical iOS device, type a message and press the send button.
**Expected:** A Light haptic impact is felt immediately on button press.
**Why human:** Haptics require physical device. Simulator does not produce haptic output.

#### 5. Auto-scroll to new message

**Test:** Scroll up in the message list to an older message, then type and send a new message.
**Expected:** The list animates back down to show the newly sent bubble within ~50ms.
**Why human:** `scrollToEnd({ animated: true })` is wired with a 50ms timeout. Animated scroll correctness requires visual verification.

#### 6. Drag to dismiss keyboard

**Test:** Tap input to open keyboard, then drag the message list upward.
**Expected:** Keyboard slides down and dismisses as you drag.
**Why human:** `keyboardDismissMode="on-drag"` is set. Gesture responsiveness requires device/simulator interaction.

#### 7. Safe area bottom inset

**Test:** Run on a notched iPhone (e.g., iPhone 14, 15). Observe ChatInput position.
**Expected:** The ChatInput bar sits above the home indicator line with visible padding. Send button is not clipped.
**Why human:** `paddingBottom: insets.bottom + 10` is structurally correct. Requires visual confirmation on a device with a home indicator.

#### 8. Input scroll when exceeding max height

**Test:** Type continuously until input reaches its maximum height (~5 lines / 120px). Continue typing.
**Expected:** Input stops growing. Additional text is scrollable within the fixed-height input box.
**Why human:** `setScrollEnabled(h > MAX_HEIGHT)` passed to TextInput `scrollEnabled`. Internal scroll behavior requires interaction testing.

---

### Notes

- TypeScript compilation passes without errors (confirmed by Summary — `npx tsc --noEmit` zero errors after each commit).
- The `estimatedItemSize` omission on FlashList is a dev-warning-level issue only. FlashList renders correctly without it.
- The `ImpactFeedbackStyle.Light` import path differs between ChatInput (`import { ImpactFeedbackStyle } from 'expo-haptics'`) and haptics.ts (uses `Haptics.ImpactFeedbackStyle`) — this works correctly as both reference the same enum from the same package.
- All 17 Phase 1 requirements have direct code evidence. No requirement is satisfied only by SUMMARY claim.

---

_Verified: 2026-03-04_
_Verifier: Claude (gsd-verifier)_
