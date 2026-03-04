# Phase 2: Navigation Header - Context

**Gathered:** 2026-03-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the current `title: 'MFC AI Chat'` Stack header with a custom iOS-style navigation header. Delivers: circular initials avatar + contact name + subtitle (centered), phone icon (right), back chevron (left). No new screens or navigation flows — this is purely a header UI update.

</domain>

<decisions>
## Implementation Decisions

### Implementation strategy
- Configure via `screenOptions` in `app/_layout.tsx` Stack — use `headerTitle` (custom component), `headerRight`, and let Expo Router provide the native back button for NAV-03
- No `headerShown: false` — keep native Stack header so back gesture works automatically
- Custom `ChatHeaderTitle` component renders avatar + name + subtitle inline

### Contact info content
- Name: "Alexandra Voltec" (matches Figma)
- Subtitle: "Active now" (short status line visible in Figma below name)
- Avatar initials: "AV"
- Avatar background: #5E5CE6 (iOS purple, consistent with iOS system palette and Figma tone)
- Avatar size: 34px circle, white initials text, 14px font weight 600
- Name: 16px, weight 600, color #000000
- Subtitle: 12px, color #8E8E93 (gray, same as timestamp color from Phase 1)

### Phone icon tap behavior
- Show `Alert.alert('Calling...', 'Alexandra Voltec')` on press — gives reviewers visual feedback without requiring phone functionality
- Icon: Ionicons `call` (filled), size 22, color #007AFF (iOS blue)
- Tappable via Pressable with hitSlop={8}

### Back button
- Use Expo Router's default back button — automatically provides chevron-left + "Back" label on iOS
- No customization needed — NAV-03 is satisfied by default Stack behavior

### Claude's Discretion
- Exact header title component layout (View nesting, alignment)
- Header background color (default white from Stack)
- Whether to extract ChatHeaderTitle into a separate file or keep inline in _layout.tsx

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `@expo/vector-icons` Ionicons: already imported in ChatInput.tsx — use `call` icon for phone button
- `useSafeAreaInsets`: available if needed, but Stack header handles safe area automatically
- Color #8E8E93: established in Phase 1 as the gray/muted text color — reuse for subtitle
- Color #007AFF: established in Phase 1 as iOS blue — reuse for phone icon

### Established Patterns
- `Ionicons` from `@expo/vector-icons` — use same import pattern as ChatInput
- `StyleSheet.create` for styles
- No Reanimated needed — static header, no animations

### Integration Points
- `app/_layout.tsx`: Only file to modify — set `screenOptions` on Stack with `headerTitle`, `headerRight`
- `app/index.tsx`: No changes needed — header config lives in layout, not screen
- Expo Router Stack automatically provides back button + native swipe-back gesture (NAV-03)

</code_context>

<specifics>
## Specific Ideas

- Figma shows centered header content (avatar + name stacked vertically or side by side)
- Avatar and name appear to be in a column: avatar left, name+subtitle stacked right — or avatar above with name below (confirm from Figma)
- Looking at Figma: avatar is left of name+subtitle, arranged in a row — standard iOS Messages header pattern
- Phone icon is on the far right, matching Figma placement exactly

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-navigation-header*
*Context gathered: 2026-03-04*
