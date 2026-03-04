# Requirements: MFC AI Chat Technical Test

**Defined:** 2026-03-04
**Core Value:** A production-quality chat input that rivals industry-leading apps — pixel-perfect, animated, and delightful

## v1 Requirements

### Input Design

- [ ] **INP-01**: Chat input container has white background with hairline top border (#E5E5EA)
- [ ] **INP-02**: TextInput is borderless, multiline, with gray placeholder text (#9FA0A4)
- [ ] **INP-03**: Input height grows smoothly from 1 line (40px) to max 5 lines (~120px) using spring animation
- [ ] **INP-04**: Input becomes scrollable when content exceeds max height
- [ ] **INP-05**: Send button is a dark (#1C1C1E) circle (34px) with white arrow-up icon, bottom-anchored in row
- [ ] **INP-06**: Send button animates to full opacity + scale=1 when text is present
- [ ] **INP-07**: Send button is dimmed (opacity 0.35, scale 0.92) when input is empty
- [ ] **INP-08**: Send button press triggers haptic feedback (Light impact)
- [ ] **INP-09**: Input resets to single line height after message is sent
- [ ] **INP-10**: Safe area bottom inset handled so input clears home indicator

### Message Bubbles

- [ ] **BUB-01**: Received (client) bubbles have light gray background (#E9E9EB), no border, 16px border radius
- [ ] **BUB-02**: Sent (user) bubbles have iOS blue background (#007AFF), white text, 16px border radius
- [ ] **BUB-03**: Bubble padding is 10px vertical, 14px horizontal
- [ ] **BUB-04**: Timestamp displayed below each bubble in gray, small font (12px)

### Navigation Header

- [ ] **NAV-01**: Header shows contact avatar (initials circle), name, and subtitle
- [ ] **NAV-02**: Header has phone icon on the right
- [ ] **NAV-03**: Header back button navigates back (chevron left)

### Keyboard Behavior

- [ ] **KBD-01**: Keyboard avoidance is smooth — input slides up with keyboard on iOS
- [ ] **KBD-02**: Dragging the message list dismisses keyboard (on-drag mode)
- [ ] **KBD-03**: Message list auto-scrolls to bottom when new message is added

### Product Strategy

- [ ] **STR-01**: PRODUCT_STRATEGY.md identifies current state and limitations of Part 1 implementation
- [ ] **STR-02**: PRODUCT_STRATEGY.md proposes 2-3 prioritized improvements with user/business justification
- [ ] **STR-03**: PRODUCT_STRATEGY.md includes solution design and technical feasibility for each improvement
- [ ] **STR-04**: PRODUCT_STRATEGY.md includes implementation roadmap

## v2 Requirements

### Enhancements (deferred)

- **ENH-01**: Typing indicator animation (three dots)
- **ENH-02**: Message read receipts
- **ENH-03**: Swipe-to-reply gesture
- **ENH-04**: Emoji reaction picker

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real AI backend | Test uses static messages, no API integration needed |
| Android polish | iOS is primary target per design references |
| Authentication | Not part of this test scope |
| Push notifications | Out of scope for this submission |
| Dark mode | Design only shows light mode |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INP-01 | Phase 1 | Pending |
| INP-02 | Phase 1 | Pending |
| INP-03 | Phase 1 | Pending |
| INP-04 | Phase 1 | Pending |
| INP-05 | Phase 1 | Pending |
| INP-06 | Phase 1 | Pending |
| INP-07 | Phase 1 | Pending |
| INP-08 | Phase 1 | Pending |
| INP-09 | Phase 1 | Pending |
| INP-10 | Phase 1 | Pending |
| BUB-01 | Phase 1 | Pending |
| BUB-02 | Phase 1 | Pending |
| BUB-03 | Phase 1 | Pending |
| BUB-04 | Phase 1 | Pending |
| KBD-01 | Phase 1 | Pending |
| KBD-02 | Phase 1 | Pending |
| KBD-03 | Phase 1 | Pending |
| NAV-01 | Phase 2 | Pending |
| NAV-02 | Phase 2 | Pending |
| NAV-03 | Phase 2 | Pending |
| STR-01 | Phase 3 | Pending |
| STR-02 | Phase 3 | Pending |
| STR-03 | Phase 3 | Pending |
| STR-04 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-04*
*Last updated: 2026-03-03 — traceability updated after roadmap creation*
