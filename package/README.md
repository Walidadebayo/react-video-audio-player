<div align="center">
  <a href="https://react-video-audio-player.vercel.app">
    <picture>
      <img alt="React Video Audio Player logo" src="https://i.ibb.co/nsrdWgxg/Logo.png" height="128">
    </picture>
  </a>
<h1>React Video Audio Player 🎬🎵</h1>
</div>

![npm version](https://img.shields.io/npm/v/react-video-audio-player)
[![Live Demo](https://img.shields.io/badge/demo-live-blue)](https://react-video-audio-player.vercel.app/demo)
[![Documentation](https://img.shields.io/badge/docs-read-blue)](https://react-video-audio-player.vercel.app/docs)
![license](https://img.shields.io/npm/l/react-video-audio-player)
![build status](https://img.shields.io/github/actions/workflow/status/Walidadebayo/react-video-audio-player/ci.yml)
![downloads](https://img.shields.io/npm/dt/react-video-audio-player)
![size](https://img.shields.io/bundlephobia/min/react-video-audio-player)

## Getting Started

React Video Audio Player is a lightweight, customisable **React video player** and **React audio player** that supports video, audio, and streaming playback. Perfect for building modern media applications.

- [Getting Started](#getting-started)
- [Features](#features)
  - [Video Player](#video-player)
  - [Audio Player](#audio-player)
- [Installation](#installation)
  - [NPM](#npm)
  - [CDN](#cdn)
- [🚀 Quick Start](#-quick-start)
  - [React and Next.js Usage](#react-and-nextjs-usage)
  - [CDN Usage](#cdn-usage)
- [📖 Full Documentation](#-full-documentation)
- [License](#license)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)
- [Code of Conduct](#code-of-conduct)
- [References](#references)
- [Author](#author)

## Features

✅ Full support for **video and audio**  
✅ Custom controls and styling  
✅ **Chapter Markers**: Visual ticks on timeline progress bar with active chapter titles in hover tooltips  
✅ **Audio Playlist**: Multi-track audio support with auto-advance and next/prev controls  
✅ **HLS Streaming (`.m3u8`)**: Adaptive bitrate streaming & live streams for video and audio  
✅ **Quality Selector**: Switch between Auto, 1080p, 720p, 480p, 360p, or audio bitrates  
✅ Audio Player uses **WaveSurfer** for audio visualisation  
✅ Audio Player works with **MP3, WAV, M4A, MP4, AAC, WMA, FLAC, OGG, OPUS, WEBM, and HLS streams**  
✅ Video Player works with **MP4, WEBM, OGV/OGG, MKV, and HLS streams**  
✅ Responsive and **easy to integrate in React apps**  
✅ **Keyboard shortcuts** for easy navigation  
✅ **Customizable UI icons**  
✅ **Ambient Glow Mode (`ambientMode`)**: YouTube-style dynamic, color-matched canvas aura behind video player  
✅ **Waveform Customisation**: Custom `waveColor`, `progressColor`, `barWidth`, `barGap`, `barRadius` props  
✅ **Accessibility & ARIA Audit**: Live screen reader announcements (`aria-live="polite"`), slider roles, and ARIA labels  
✅ **Visibility & Analytics Callback**: `onVisibilityChange={(isVisible) => ...}` exposes player viewport and tab visibility state  
✅ **Buffering Callback**: `onBuffering={(isBuffering) => ...}` exposes buffering state for custom loading indicators  
✅ **Media Session API**: lock screen, headset, and keyboard media key controls built in  
✅ **Buffered range display**: shows how much of the video has loaded on the timeline  
✅ **Pause on scroll / tab switch**: optionally pause and auto-resume based on viewport and tab visibility

### Video Player

- **Chapter Markers**: Define timeline chapters (`chapters={[{ time: 0, label: 'Intro' }]}`) with visual markers and hover tooltips.
- **HLS Streaming & Quality Selector**: Stream `.m3u8` playlists and live streams with adaptive quality controls (Auto, 1080p, 720p, 480p, 360p).
- **Play/Pause**: Toggle video playback.
- **Mute/Unmute**: Toggle video sound.
- **Fullscreen**: Toggle fullscreen mode.
- **Picture-in-Picture**: Toggle picture-in-picture mode (not supported on iOS).
- **Volume Control**: Adjust the volume.
- **Playback Speed**: Change the playback speed (0.25x, 0.5x, 0.75x, 1x, 1.25x, 1.5x, 1.75x, 2x).
- **Seek Control**: Seek to different parts of the video.
- **Buffered Range**: Native slider background track shows how much of the video has been buffered.
- **Media Session API**: Automatically registers with the browser so keyboard media keys, OS lock screen controls, and Bluetooth headset buttons control the player.
- **Pause on scroll**: Use `pauseWhenHidden` to pause when the player leaves the viewport or browser tab and auto-resume when visible.
- **Keyboard Shortcuts**: Built-in keyboard shortcuts for better accessibility and user experience.
- **Custom Icons**: Replace default UI icons with your own custom React components or SVGs.
- **Poster Auto Generation**: Automatically generate a poster image from the video.

### Audio Player

- **Audio Playlist**: Multi-track playlists with automatic track advancement and next/prev controls.
- **Chapter Markers**: Define timeline chapters with visual markers and hover tooltips for podcasts and long audio.
- **HLS Audio Streaming & Bitrate Selector**: Stream audio `.m3u8` feeds with adaptive quality controls (Auto, 320k, 256k, 128k).
- **Play/Pause**: Toggle audio playback.
- **Mute/Unmute**: Toggle audio sound.
- **Volume Control**: Adjust the volume.
- **Playback Speed**: Change the playback speed (0.25x, 0.5x, 0.75x, 1x, 1.25x, 1.5x, 1.75x, 2x).
- **Seek Control**: Seek to different parts of the audio.
- **Media Session API**: Automatically registers with the browser so keyboard media keys, OS lock screen controls, and Bluetooth headset buttons control the player.
- **Pause on scroll**: Use `pauseWhenHidden` to pause when the player leaves the viewport or browser tab and auto-resume when visible.
- **Keyboard Shortcuts**: Built-in keyboard shortcuts for better accessibility and user experience.
- **Custom Icons**: Replace default UI icons with your own custom React components or SVGs.

## Installation

### NPM

To install the package, use npm:

```bash
npm install react-video-audio-player
```

### CDN

You can also include the package directly via CDN:

```html
<!-- UMD -->
<script src="https://cdn.jsdelivr.net/npm/react-video-audio-player/dist/index.umd.min.js"></script>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/react-video-audio-player/dist/video-audio-player.min.css"
/>
```

## 🚀 Quick Start

### React and Next.js Usage

```tsx
import { VideoPlayer, AudioPlayer } from "react-video-audio-player";

<VideoPlayer src="video.mp4" controls autoPlay />;
<AudioPlayer src="audio.mp3" controls />;
```

### CDN Usage

[JSFiddle Demo](https://jsfiddle.net/cp7jzgwe/3/)

```html
<div id="video-player-container"></div>
<div id="audio-player-container"></div>

<!-- UMD -->
<script src="https://cdn.jsdelivr.net/npm/react-video-audio-player/dist/index.umd.min.js"></script>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/react-video-audio-player/dist/video-audio-player.min.css"
/>

<script>
  // Initialise the VideoPlayer
  const videoPlayerContainer = document.getElementById(
    "video-player-container",
  );
  const videoPlayer = VideoPlayer({
    src: "video.mp4",
    controls: true,
    autoPlay: false,
    muted: false,
    loop: false,
    poster: "poster.jpg",
    onReady: () => {
      console.log("Video is ready to play");
    },
  });
  videoPlayerContainer.appendChild(videoPlayer);

  // Initialise the AudioPlayer
  const audioPlayerContainer = document.getElementById(
    "audio-player-container",
  );
  const audioPlayer = AudioPlayer({
    src: "audio.mp3",
    controls: true,
    autoPlay: false,
    muted: false,
    loop: false,
    onReady: () => {
      console.log("Audio is ready to play");
    },
  });
  audioPlayerContainer.appendChild(audioPlayer);
</script>
```

## 📖 Full Documentation

For detailed guides, API reference, and demos, visit:  
➡️ **[react-video-audio-player.vercel.app](https://react-video-audio-player.vercel.app/docs)**

## License

This project is licensed under the MIT License.

## Contributing

We welcome contributions! Please see the [CONTRIBUTING.md](https://github.com/Walidadebayo/react-video-audio-player/blob/main/CONTRIBUTING.md) file for guidelines on how to contribute to this project.

## Acknowledgements

This project uses the following libraries:

- [WaveSurfer](https://wavesurfer.xyz/) for the audio visualisation
- [Lucide React](https://lucide.dev/) for the svg icons
- [Remix Icon](https://remixicon.com/) for the svg icons
- [Tailwind CSS](https://tailwindcss.com/) for the styling

## Code of Conduct

By participating in this project, you agree to abide by the [Code of Conduct](https://github.com/Walidadebayo/react-video-audio-player/blob/main/CODE_OF_CONDUCT.md). Please be respectful and considerate of others in the community.

## References

- [React Video Audio Player Demo](https://react-video-audio-player.vercel.app/demo)
- [JSFiddle Demo](https://jsfiddle.net/cp7jzgwe/3/)
- [React Video and Audio Player Documentation](https://react-video-audio-player.vercel.app/docs)
- [React Video and Audio Player Git](https://github.com/Walidadebayo/react-video-audio-player.git)
- [React Video and Audio Player License](https://github.com/Walidadebayo/react-video-audio-player/blob/main/LICENSE)

## Author

- [Walid Adebayo](https://walidadebayo.netlify.app/)

<a href="https://www.buymeacoffee.com/walidadebayo"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=walidadebayo&button_colour=FFDD00&font_colour=000000&font_family=Comic&outline_colour=000000&coffee_colour=ffffff" /></a>
