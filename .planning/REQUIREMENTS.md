# Requirements: MFC AI Chat Technical Test

**Defined:** 2026-03-04
**Core Value:** Production-quality Slack-grade iOS chat — 120fps animations, rich mocked content, industry-standard architecture

## v1 Requirements (Original — Phases 1-2)

### Input Design
- [x] **INP-01**: Chat input container has white background with hairline top border (#E5E5EA)
- [x] **INP-02**: TextInput is borderless, multiline, with gray placeholder text (#9FA0A4)
- [x] **INP-03**: Input height grows smoothly from 1 line (40px) to max ~6 lines (~140px) using spring animation
- [x] **INP-04**: Input becomes scrollable when content exceeds max height
- [x] **INP-05**: Send button is a dark (#1C1C1E) circle (34px) with white arrow-up icon
- [x] **INP-06**: Send button animates to full opacity + scale=1 when text is present
- [x] **INP-07**: Send button is dimmed (opacity 0.35, scale 0.92) when input is empty
- [x] **INP-08**: Send button press triggers haptic feedback (Light impact)
- [x] **INP-09**: Input resets to single line height after message is sent
- [x] **INP-10**: Safe area bottom inset handled so input clears home indicator

### Message Bubbles
- [x] **BUB-01**: Received (client) bubbles have light gray background (#E9E9EB), 16px border radius
- [x] **BUB-02**: Sent (user) bubbles have iOS blue background (#007AFF), white text, 16px border radius
- [x] **BUB-03**: Bubble padding is 10px vertical, 14px horizontal
- [x] **BUB-04**: Timestamp displayed below each bubble in gray, small font (12px)

### Navigation Header
- [x] **NAV-01**: Header shows contact avatar (initials circle), name, and subtitle
- [x] **NAV-02**: Header has phone icon on the right
- [x] **NAV-03**: Header back button navigates back (chevron left)

### Keyboard Behavior
- [x] **KBD-01**: Keyboard avoidance is smooth — input slides up with keyboard on iOS
- [x] **KBD-02**: Dragging the message list dismisses keyboard (on-drag mode)
- [x] **KBD-03**: Message list auto-scrolls to bottom when new message is added

## v2 Requirements (Expanded Scope — Phases 3-8)

### State Management (Phase 3)
- [ ] **STM-01**: TanStack Query configured with QueryClientProvider at app root
- [ ] **STM-02**: Messages loaded via useInfiniteQuery from mock service
- [ ] **STM-03**: Send message uses useMutation with optimistic cache update
- [ ] **STM-04**: Message type supports discriminated union for attachment variants (text, image, audio, video, file)
- [ ] **STM-05**: Mock data service returns realistic paginated messages with mixed attachment types

### Input Redesign (Phase 4)
- [ ] **INP-11**: react-native-keyboard-controller replaces KeyboardAvoidingView (translate-with-padding)
- [ ] **INP-12**: Input height animation runs at 120fps via Reanimated UI thread (spring: damping 15, stiffness 150)
- [ ] **INP-13**: Input container matches Figma pixel-perfect (verify against design file)
- [ ] **INP-14**: Keyboard show/hide produces zero layout jumps

### Chat Bar & Send Button (Phase 5)
- [ ] **BAR-01**: Chat bar row with attach icon, emoji icon, additional action icons
- [ ] **BAR-02**: Send button uses Entering/Exiting animations (ZoomIn/FadeOut)
- [ ] **BAR-03**: Send button disabled state: opacity 0.35, scale 0.92; active: full
- [ ] **BAR-04**: Send press feedback: scale bounce (0.85 → spring 1.0) + haptic
- [ ] **BAR-05**: Send button replaces right-side chat bar icon when text present (Slack pattern)
- [ ] **BAR-06**: Chat bar icons are tappable with haptic feedback

### Bottom Sheets (Phase 6)
- [ ] **SHT-01**: @gorhom/bottom-sheet installed with BottomSheetModalProvider
- [ ] **SHT-02**: Attachment bottom sheet: grid of mocked options with Ionicons
- [ ] **SHT-03**: Emoji picker bottom sheet: rn-emoji-keyboard integration
- [ ] **SHT-04**: Glow animation: shimmer gradient sweep left→right on icon tap
- [ ] **SHT-05**: Both sheets have native spring physics, snap points, handle, backdrop
- [ ] **SHT-06**: Haptic feedback on sheet open/close and item selection

### Rich Messages (Phase 7)
- [ ] **RCH-01**: Image attachments render inline in bubbles (rounded, constrained width)
- [ ] **RCH-02**: Audio attachments show play button + waveform + duration
- [ ] **RCH-03**: Video attachments show thumbnail with play overlay
- [ ] **RCH-04**: Mocked messages include diverse attachment types

### Skeleton Loading (Phase 7)
- [ ] **SKL-01**: Skeleton loading screen on initial load (1-2 sec)
- [ ] **SKL-02**: Skeleton shapes mimic message layout (avatar circles + text lines)
- [ ] **SKL-03**: Moti Skeleton.Group with shimmer animation and staggered delays

### Product Strategy (Phase 8)
- [ ] **STR-01**: PRODUCT_STRATEGY.md identifies current state and limitations
- [ ] **STR-02**: Proposes 2-3 prioritized improvements with user/business justification
- [ ] **STR-03**: Includes solution design and technical feasibility
- [ ] **STR-04**: Includes implementation roadmap

### Polish (Phase 8)
- [ ] **POL-01**: All animations consistent and 120fps
- [ ] **POL-02**: Edge cases handled (empty input, long text, rapid keyboard toggle)
- [ ] **POL-03**: New messages animate in (FadeInDown)
- [ ] **POL-04**: Accessibility labels on interactive elements

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INP-01..10 | Phase 1 | Complete |
| BUB-01..04 | Phase 1 | Complete |
| KBD-01..03 | Phase 1 | Complete |
| NAV-01..03 | Phase 2 | Complete |
| STM-01..05 | Phase 3 | Pending |
| INP-11..14 | Phase 4 | Pending |
| BAR-01..06 | Phase 5 | Pending |
| SHT-01..06 | Phase 6 | Pending |
| RCH-01..04 | Phase 7 | Pending |
| SKL-01..03 | Phase 7 | Pending |
| STR-01..04 | Phase 8 | Pending |
| POL-01..04 | Phase 8 | Pending |

**Coverage:**
- Total requirements: 47
- Completed: 20 (Phases 1-2)
- Pending: 27 (Phases 3-8)
- Unmapped: 0

---
*Last updated: 2026-03-04*
