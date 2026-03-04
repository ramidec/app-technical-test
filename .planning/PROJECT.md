# MFC AI Chat — Technical Test

## What This Is

A React Native (Expo ~54) technical test submission for MFC. The project has two parts: (1) a polished redesign of the chat input component to match a Figma spec and replicate Slack iOS input behavior, and (2) a product strategy document identifying 2-3 high-value improvements to the chat experience.

## Core Value

A production-quality chat input that rivals industry-leading apps — pixel-perfect, animated, and delightful — backed by sharp product thinking.

## Requirements

### Validated

- ✓ Expo + React Native project scaffolded — existing
- ✓ FlashList message list with startRenderingFromBottom — existing
- ✓ MessageItem component for user/client bubbles — existing
- ✓ Haptics utility wired up — existing
- ✓ ChatInput component created with dynamic height + Reanimated animations — Phase 1

### Active

- [ ] Chat input matches Figma design (colors, spacing, button shape)
- [ ] Message bubbles match Figma (received: light gray no border; sent: iOS blue)
- [ ] Dynamic height grows smoothly (1 line → max 5 lines → scrollable)
- [ ] Send button animates between empty/active states
- [ ] Keyboard avoidance feels native and smooth
- [ ] Navigation header matches Figma (contact name, avatar, phone icon)
- [ ] Message timestamps displayed under each bubble
- [ ] PRODUCT_STRATEGY.md written with 2-3 prioritized improvements

### Out of Scope

- Real backend / AI integration — test uses static messages
- Android-specific polish — iOS is the primary target per design refs
- OAuth / authentication — not part of this test
- Push notifications — out of scope for v1

## Context

- **Stack**: Expo ~54, React Native 0.81.4, Expo Router ~6, Reanimated ~4.1.1, FlashList 2.0.2, @expo/vector-icons, expo-haptics
- **Design ref**: Figma file `sKoVdC8r9K0fCpe4oKI4au` (Chat-Technical-Test) — 5 states shown: base, keyboard open, small input, expanded, max expanded
- **Behavioral ref**: Slack iOS input — dynamic height, smooth keyboard transitions, animated send button
- **Current state**: ChatInput.tsx exists but visual polish needed; MessageItem needs bubble style updates; header and timestamps missing
- **Brand colors visible in code**: `#FFE016` yellow, `#002C2A` dark green (existing button — superseded by Figma dark button design)

## Constraints

- **Tech stack**: Must stay within existing Expo/RN dependencies — no new native modules
- **iOS first**: Design references are all iPhone screenshots
- **Submission**: Forked repo with running instructions

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Extract ChatInput to separate component | Keeps index.tsx clean, reusable | — Pending |
| Use Reanimated for height + button animations | Already installed, UI-thread performance | — Pending |
| Part 2 as PRODUCT_STRATEGY.md in repo | Clean, reviewable, version-controlled | — Pending |
| Skip codebase mapping | Full context already gathered in session | ✓ Good |

---
*Last updated: 2026-03-04 after initialization*
