# Phase 1: Chat Screen - Context

**Gathered:** 2026-03-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Pixel-perfect chat input, message bubbles, and keyboard behavior matching a production iOS messaging app. Phase includes: input container styling, send button animation, bubble colors/layout, timestamps, and keyboard avoidance. Navigation header is Phase 2. Product strategy doc is Phase 3.

</domain>

<decisions>
## Implementation Decisions

### Timestamp format
- Use absolute time format: "h:mm a" (e.g., "2:32 PM") — iOS Messages convention
- All test messages share the same time (static data), so timestamps are cosmetically set on creation
- Format via `toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })`

### Bubble max-width
- Cap bubble width at 75% of screen width — matches Figma visual proportions
- Both sent and received bubbles use the same cap
- Implement via `maxWidth: '75%'` in StyleSheet

### Bubble styling
- Received (client): #E9E9EB background, no border, 16px border radius — replace current fdfdfd + border
- Sent (user): #007AFF background (not #007bff), white text, 16px border radius
- Padding: 10px vertical, 14px horizontal — replace current 16px all-around
- Timestamp: below bubble, gray (#8E8E93), 12px font, left-aligned for received, right-aligned for sent

### Demo conversation content
- 6-8 messages total, realistic back-and-forth to demonstrate both bubble types
- Messages long enough to show multi-line bubbles and proper wrapping
- At least one long received message to verify max-width behavior
- All messages use current timestamp (static demo data)

### Keyboard avoidance
- Use Stack navigator header height: `keyboardVerticalOffset` should include navigation header (~56pt on iOS) + status bar inset
- Pattern: `insets.top + 56` (approximate nav header height) to prevent input from hiding behind keyboard
- Test and adjust if offset is visually wrong on device

### Auto-scroll on send
- Use FlashList ref + `scrollToEnd({ animated: true })` on message send
- Always scroll to bottom when user sends (matches iOS Messages behavior)
- `maintainVisibleContentPosition` kept for natural scroll behavior while reading

### Claude's Discretion
- Exact keyboardVerticalOffset value (test on device, adjust from 56pt baseline)
- Loading/empty states (none required for demo)
- InputAccessoryView vs KeyboardAvoidingView (keep existing KAV approach)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ChatInput.tsx`: Already implements Reanimated spring height (MIN_HEIGHT=40, MAX_HEIGHT=120), send button opacity/scale animation, haptics, safe area bottom padding — covers INP-01 through INP-10 substantially
- `utils/haptics.ts`: `hapticImpact` utility already wired to ChatInput send
- `types/message.ts`: `Message` interface and `MessageRole` enum (User/Client) — no changes needed
- `@shopify/flash-list`: Already installed and in use in ChatScreen

### Established Patterns
- Reanimated `useSharedValue` + `withSpring`/`withTiming` + `useAnimatedStyle` — use this pattern for all animations
- `useSafeAreaInsets()` for safe area handling — already in both ChatInput and ChatScreen
- StyleSheet.hairlineWidth for borders — already used correctly in ChatInput

### Integration Points
- `app/index.tsx` ChatScreen: message state lives here, `handleSend` appends to array — FlashList ref for `scrollToEnd` goes here
- `components/MessageItem.tsx`: full restyle needed — colors, padding, border-radius, add timestamp
- `app/_layout.tsx`: Stack navigator with existing "MFC AI Chat" header — affects KAV offset

</code_context>

<specifics>
## Specific Ideas

- Figma design shows flat, borderless input in white bottom bar — no rounded pill background on TextInput wrapper
- Figma shows timestamps visible below each bubble in a smaller muted style
- Figma shows bubbles with clear max-width constraint (not full-width)
- Existing ChatInput already correctly implements hairline border (#E5E5EA) and white container background

</specifics>

<deferred>
## Deferred Ideas

- Typing indicator animation — ENH-01 (v2)
- Message read receipts — ENH-02 (v2)
- Swipe-to-reply — ENH-03 (v2)

</deferred>

---

*Phase: 01-chat-screen*
*Context gathered: 2026-03-03*
