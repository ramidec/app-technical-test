# Phase 5: Persistence & Media Playback

## Status: Pending

## 5.1 — MMKV Message Persistence
- Save new messages to MMKV (react-native-mmkv) for offline/local storage
- On app launch, display cached messages instantly from MMKV while fetching fresh data
- Sync strategy: local-first display, reconcile with server response

## 5.2 — Attachment Bottom Sheet Redesign
- Current issue: sheet is visually cut off when opened, looks broken
- Redesign to match Slack-quality polish (proper snap points, content sizing, visual treatment)
- Ensure safe area handling and smooth open/close animations

## 5.3 — Real Media Playback (Remove Mocks)
Replace mocked attachment views with functional implementations:

### Image — Full-Screen Viewer
- Tap image attachment → opens full-screen image viewer
- Pinch-to-zoom, swipe-to-dismiss
- Consider: `react-native-image-viewing` or custom Reanimated solution

### Video — Video Player
- Tap video attachment → opens video player
- Playback controls, full-screen support
- Consider: `expo-av` or `expo-video`

### Audio — Playable Audio
- Audio attachment plays inline with waveform visualization
- Play/pause, seek, duration display
- Will include a local `.mp3` file for testing
- Consider: `expo-av` for playback

### File/Document — Downloadable
- Tap file attachment → download and open with system viewer
- Will include a local `.pdf` file for testing
- Consider: `expo-file-system` + `expo-sharing` or `Linking.openURL`

## Test Assets (to be provided)
- `.mp3` file for audio playback testing
- `.pdf` file for document download testing
