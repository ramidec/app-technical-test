# Product Strategy: Chat Experience Evolution

## Current State Assessment

### What Works Well
The Part 1 implementation delivers a polished, Slack-grade chat input experience:

- **120fps expandable input**: Spring-animated height transitions via Reanimated shared values, running on the native UI thread. The input grows smoothly from 1 to 6 lines, then becomes scrollable.
- **Professional keyboard handling**: react-native-keyboard-controller provides native-synced keyboard transitions with zero layout jumps.
- **Animated send button**: ZoomIn/FadeOut entering/exiting animations with press-feedback scale bounce and haptic feedback create a tactile, satisfying interaction.
- **Chat bar with bottom sheets**: Attach and emoji icons trigger @gorhom/bottom-sheet panels with native spring physics, snap points, and backdrop.
- **Rich message types**: The architecture supports text, image, audio, video, and file attachments via TypeScript discriminated unions, each with dedicated rendering components.
- **Industry-standard state management**: TanStack Query powers message loading with useInfiniteQuery for pagination and useMutation with optimistic updates for sending.
- **Skeleton loading**: Moti-powered skeleton placeholders with staggered pulse animations mimic Slack's channel loading pattern.

### Limitations
- Messages are mocked; no real-time data flow
- No conversation threading or reply context
- No read receipts or delivery indicators
- No typing indicators
- Audio/video attachments are display-only (no playback)
- No message search or pinning

---

## Improvement 1: Real-Time Typing Indicators & Presence

### Problem
Users in chat apps expect immediate feedback about whether the other person is actively engaged. Without typing indicators, conversations feel one-sided and users often send unnecessary "are you there?" messages. Without presence (online/offline/away), users waste time waiting for responses from people who aren't available.

### Solution Design

**Typing Indicator Component:**
- Three-dot animation below the last received message, appearing when the other party is typing
- Implemented with Reanimated: three circles animate sequentially with `withDelay` and `withRepeat`, creating a breathing/bouncing effect
- The indicator fades in with `FadeIn` and out with `FadeOut` (same pattern as the send button)
- Positioned as a "ghost message" at the bottom of the list, visually distinct from real messages

**Presence System:**
- Header subtitle changes from static "Active now" to dynamic: "Online", "Away (5m)", "Offline"
- Small colored dot on the avatar: green (online), yellow (away), gray (offline)
- Presence updates arrive via the same mock service pattern, driven by TanStack Query polling or WebSocket subscription

**Technical Approach:**
- `useTypingIndicator` hook manages typing state with debounce (stop showing after 3 seconds of inactivity)
- `usePresence` hook wraps a TanStack Query subscription with 30-second polling
- Both hooks consume mocked data initially, but the architecture is WebSocket-ready
- Typing events fire from `onChangeText` with a 1-second throttle to avoid spamming

### Business Impact
- **Engagement**: Typing indicators keep users in the conversation longer (they wait instead of leaving)
- **Reduced anxiety**: Users know their message was seen and a response is coming
- **Perceived responsiveness**: The app feels "alive" and real-time, even before backend integration

---

## Improvement 2: Swipe-to-Reply with Quoted Context

### Problem
In multi-topic conversations, messages lose context. Users currently have no way to reference which specific message they're responding to, leading to confusion in longer threads. This is especially problematic with rich media — "that looks great" could refer to any of several shared images.

### Solution Design

**Swipe Gesture:**
- Right-swipe on any message bubble triggers reply mode (Telegram/WhatsApp pattern)
- Gesture uses `react-native-gesture-handler` v2 Pan gesture with `activeOffsetX(20)` and `failOffsetY([-10, 10])` to avoid conflicting with vertical scroll
- Shared value `translateX` drives the message position; at 80px threshold, haptic fires and reply mode activates
- On release, message springs back to origin with `withSpring(0)`

**Reply Context UI:**
- A reply banner appears above the input field showing the quoted message (author name + truncated text + attachment thumbnail)
- The banner has a colored left border matching the original sender's bubble color
- Close button (X) dismisses the reply context
- Banner enters with `SlideInUp` and exits with `SlideOutDown` (Reanimated layout animations)

**In-Message Reply Display:**
- When a message is a reply, a compact quote block renders above the message text
- Tapping the quote scrolls the list to the original message and briefly highlights it with a pulse animation

**Data Model Extension:**
```typescript
interface Message {
  // ...existing fields
  replyTo?: {
    id: string;
    content: string;
    role: MessageRole;
    attachment?: { type: string; thumbnailUri?: string };
  };
}
```

### Business Impact
- **Conversation clarity**: Users can follow complex discussions without losing context
- **Richer interactions**: Reply-with-media-context makes sharing and feedback loops more productive
- **Engagement**: Threading keeps conversations going longer; users reference and build on each other's messages
- **Competitive parity**: Every major chat app (Slack, WhatsApp, Telegram, iMessage) has reply functionality

---

## Improvement 3: Message Reactions with Emoji

### Problem
Not every message warrants a full text response. Users often want to acknowledge, agree, or react emotionally without typing. Without reactions, chats fill up with low-value messages like "ok", "lol", "nice", which dilute meaningful content and create notification fatigue.

### Solution Design

**Long-Press Reaction Bar:**
- Long-press (500ms) on any message bubble triggers haptic feedback and shows a floating reaction bar
- The bar appears above the message with a blur backdrop (similar to iMessage)
- Pre-populated with 6 common emoji: thumbs up, heart, laugh, surprise, sad, fire
- "+" button at the end opens the full emoji picker bottom sheet (already built)
- Bar enters with `ZoomIn.springify()` and individual emoji stagger with `FadeIn.delay(i * 50)`

**Reaction Display:**
- Reactions appear below the message bubble as small, rounded pills
- Each pill shows the emoji + count (e.g., "thumbs up 2")
- Tapping a reaction toggles the current user's reaction (add/remove)
- Multiple reactions stack horizontally with `FlexWrap`

**Technical Approach:**
- `useLongPress` custom gesture (Gesture Handler v2 `Gesture.LongPress()`)
- Reaction bar is a portal rendered above the message list (absolute positioning)
- Position calculated from the pressed message's layout measurements via `measure()`
- Reactions stored as `Map<string, string[]>` (emoji -> array of user IDs)
- Optimistic updates via TanStack Query cache manipulation (same pattern as send)

**Data Model Extension:**
```typescript
interface Message {
  // ...existing fields
  reactions?: Record<string, string[]>; // emoji -> userIds
}
```

### Business Impact
- **Reduced noise**: Reactions replace one-word acknowledgment messages, keeping the chat clean
- **Higher engagement**: Low-friction interactions (one tap) increase total interaction count by 2-3x
- **Emotional expression**: Users can respond authentically without composing text
- **Social proof**: Visible reactions create a sense of community and shared experience

---

## Implementation Roadmap

| Priority | Feature | Effort | Dependencies |
|----------|---------|--------|-------------|
| 1 | Typing Indicators & Presence | 2-3 days | New hooks, header update, animated component |
| 2 | Swipe-to-Reply | 3-4 days | Gesture handler integration, data model update, reply banner |
| 3 | Message Reactions | 3-4 days | Long-press gesture, floating bar, reaction pills |

**Recommended sequence:** Typing indicators first (smallest scope, highest perceived value), then swipe-to-reply (enables threading), then reactions (adds engagement layer on top of the richer conversation model).

All three features build on the existing architecture: Reanimated for animations, Gesture Handler for interactions, TanStack Query for state, and the established component patterns. No new native dependencies are required.
