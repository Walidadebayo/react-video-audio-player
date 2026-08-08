# Changelog

All notable changes to `react-video-audio-player` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.4] - 2026-08-08

### 🚀 Performance & Bundle Optimization
- **Dynamic Lazy-Loading for Heavy Drivers**: Converted top-of-file static imports of `hls.js` and `wavesurfer.js` to dynamic runtime `await import(...)` calls. Plain `.mp4` video and `.mp3` audio consumers now enjoy a ~850KB lighter initial bundle footprint.
- **Tree-Shaking & Subpath Package Exports**: Configured `"sideEffects": false` and modern `"exports"` map in `package.json` for subpath component imports (`react-video-audio-player/video`, `react-video-audio-player/audio`, `react-video-audio-player/css`).
- **Safari Hardware HLS Priority**: Prioritized native OS hardware-accelerated HLS (`canPlayType("application/vnd.apple.mpegurl")`) before dynamically loading `hls.js`.

### 🐛 Fixed
- **Background Audio Leak on Poster Generation**: Fixed audio leak caused by `videoRef.current.cloneNode()` inheriting autoplay attributes by replacing clone logic with an isolated, unrendered HTML5 video element configured with `muted = true`, `autoplay = false`, and explicit source/DOM cleanup.
- **`autoPlay` Failure & Muted Autoplay Fallback**: Resolved autoplay failure caused by lazy loading delay (`shouldLoadMedia`) and added `attemptAutoplay` fallback to retry playback in muted mode if browser security policies reject unmuted autoplay with `NotAllowedError`.
- **Muted State Sync on `getVideoRef`**: Imperatively synchronized `videoRef.current.muted` and `videoRef.current.volume` on mount, prop updates, and ref callbacks, ensuring videos do not start muted when `getVideoRef` is used.
- **Android WebView & TWA Crash Prevention**: Guarded `new MediaMetadata()` with feature detection (`typeof window.MediaMetadata !== "undefined"`) to prevent fatal `ReferenceError` crashes in Android WebViews and TWAs.
- **Promise Rejection Safety**: Added `.catch(() => {})` handlers to all `.play()` invocations in `<AudioPlayer>` to eliminate `Uncaught (in promise)` browser console errors.
- **Peer Dependencies Optimization**: Moved `react` & `react-dom` strictly to `peerDependencies` (`^18.0.0 || ^19.0.0`) and updated `hls.js` (`>=1.0.0`) & `wavesurfer.js` (`>=7.0.0`) to open-ended peer ranges to prevent `npm ERESOLVE` version conflict errors.
- **Picture-in-Picture Feature Guard**: Added `document.pictureInPictureEnabled` feature check before requesting PiP in `<VideoPlayer>`.

## [1.6.3] - 2026-07-29

### 🐛 Fixed
- **Isolated & Scoped CSS**: 100% namespace-scoped all CSS selectors under `.video-player-wrapper` and `.audio-player-wrapper` to prevent top-level class collision (`.dropdown`, `.container`, etc.) with consumer applications.

## [1.6.1] - 2026-07-29

### 🐛 Fixed
- **hls.js Bundler Resolution**: Added `hls.js` as a direct compulsory dependency to prevent bundler `Module not found: Can't resolve 'hls.js'` errors for consumers.

## [1.6.0] - 2026-07-28

### 🚀 Added
- **HLS (`.m3u8`) Streaming & Quality Selector**:
  - Full adaptive bitrate streaming for `<VideoPlayer>` (`1080p`, `720p`, `480p`, `360p`, `Auto`) and `<AudioPlayer>` (`320k`, `256k`, `128k`, `Auto`).
  - Optional `hls.js` support (loaded safely if available, without breaking apps that omit `hls.js`).
- **Audio Playlist Support**:
  - Parity with `VideoPlayer` playlist support (`playlist={{ items: [...] }}`).
  - Multi-track auto-advance, playlist looping, and custom track navigation icons (`nextTrack`, `prevTrack`).
- **Timeline Chapter Markers**:
  - Interactive chapter tick marks on progress bar for `<VideoPlayer>` and `<AudioPlayer>` (`chapters={[{ time: 0, label: 'Intro' }]}`).
  - Active chapter labels in hover tooltip (`"Intro • 0:15"`).
- **Ambient Glow Mode**:
  - YouTube-style dynamic canvas lighting (`<VideoPlayer ambientMode />`) projecting a soft, color-matched aura behind the video player.
- **Waveform Customisation**:
  - New props for `<AudioPlayer>`: `waveColor`, `progressColor`, `barWidth`, `barGap`, `barRadius`.
- **Playback Speed Overlay Toast**:
  - YouTube-style floating speed indicator (`1.5x`) popping up on speed change.
- **Analytics & Viewport Callbacks**:
  - `onVisibilityChange={(isVisible: boolean) => void}` to track viewport & tab visibility.
  - `onBuffering={(isBuffering: boolean) => void}` to track media buffering state.
- **Accessibility & ARIA Audit**:
  - Screen reader live region announcements (`aria-live="polite"`).
  - ARIA slider roles (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`).
  - Container region role (`role="region"`).

### 🐛 Fixed
- **HLS Loading Spinner Stall Fix**: Resolved issue where browser `stalled` events froze loading state on HLS quality and speed switches. Added `Hls.Events.FRAG_BUFFERED` & `LEVEL_SWITCHED` handlers and `readyState >= 3` buffer guards.
- **Audio Player Height Normalization**: Fixed WaveSurfer canvas stretching by enforcing explicit `height: 48` on WaveSurfer options.
- **Ambient Glow Stacking Context**: Added `isolation: isolate` and `z-index: -1` on canvas aura so glow never covers card headers or text outside the video player.
- **TypeScript Types**: Updated `VideoMimeType` and `AudioMimeType` to allow custom streaming MIME types (e.g. `application/x-mpegURL`).
