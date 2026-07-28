import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs === 0) return `${mins}:${String(secs).padStart(2, "0")}`;
  return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(
    2,
    "0",
  )}`;
};

export const navigation = [
  { name: "Home", href: "/" },
  { name: "Docs", href: "/docs" },
  { name: "Demo", href: "/demo" },
  { name: "Installation", href: "/installation" },
];

export const videoProps = [
  {
    prop: "src",
    type: "string",
    default: '""',
    description:
      "The URL of the video to embed. This is optional; you may instead use the <b>sources</b> property to specify one or more <b>source</b> elements for the video.",
  },
  {
    prop: "sources",
    type: "Array<{ src: string; type: string }>",
    default: "[]",
    description:
      "An array of objects containing the URL and type of the video to embed. This is optional; you may instead use the <b>src</b> property to specify the URL of the video.",
  },
  {
    prop: "accentColor",
    type: "string",
    default: '"#60a5fa"',
    description: "The accent color to use for the player controls",
  },
  {
    prop: "mediaSession",
    type: "—",
    default: "auto",
    description:
      "<b>Built-in (no prop needed).</b> The player automatically registers with the browser's Media Session API so OS-level controls work out of the box, keyboard media keys, lock screen controls on iOS/Android, and Bluetooth headset buttons all map to play, pause, seek-backward, seek-forward, and seek-to actions.",
  },
  {
    prop: "bufferedDisplay",
    type: "—",
    default: "auto",
    description:
      "<b>Built-in (no prop needed).</b> A semi-transparent bar overlaid on the progress track shows how much of the video has been buffered, updating in real time as the browser downloads ahead.",
  },
  {
    prop: "tracks",
    type: "Array<{ src: string; kind: string; label: string; srclang: string; default?: boolean }>",
    default: "[]",
    description:
      "An array of objects containing the URL, kind, label, and srclang of the tracks to embed.",
  },
  {
    prop: "poster",
    type: "string",
    default: '""',
    description:
      "A URL for an image to be shown while the video is downloading. If this attribute isn't specified, nothing is displayed until the first frame is available, then the first frame is shown as the poster frame.",
  },
  {
    prop: "generatePosterAt",
    type: "number",
    default: "undefined",
    description:
      "A number representing the time in seconds to generate a poster for the video. If not provided, a poster will be generated at the begining of the video.",
  },
  {
    prop: "preload",
    type: '"auto" | "metadata" | "none" | ""',
    default: '"metadata"',
    description: `This enumerated attribute is intended to provide a hint to the video player about what the author thinks will lead to the best user experience regarding what content is loaded before the video is played. It may have one of the following values:
        <br />
        - <b>none</b>: Indicates that the video should not be preloaded.
        <br />
        - <b>metadata</b>: Indicates that only video metadata (e.g. length) is fetched.
        <br />
        - <b>auto</b>: Indicates that the whole video file can be downloaded, even if the user is not expected to use it.
        <br />
        - <b>empty string</b>: A synonym of the auto value.
        <br />
        The spec advises it to be set to metadata but if the video is streamed, auto is a better choice.`,
  },
  {
    prop: "controls",
    type: "boolean",
    default: "true",
    description:
      "If this attribute is present, the video player will offer controls to allow the user to control video playback, including volume, duration, seeking, pause/resume playback, picture in picture (if supported), playback rate, skip forward, skip backward and fullscreen toggle.",
  },
  {
    prop: "autoPlay",
    type: "boolean",
    default: "false",
    description:
      "A Boolean attribute; if specified, the video automatically begins to play back as soon as it can without stopping to finish loading the data.",
  },
  {
    prop: "loop",
    type: "boolean",
    default: "false",
    description:
      "A Boolean attribute; if specified, the video player will automatically seek back to the start upon reaching the end of the video.",
  },
  {
    prop: "maxAutoPlayDuration",
    type: "number",
    default: "undefined",
    description:
      "Optional guard in seconds. If set, autoplay is blocked for videos longer than this duration.",
  },
  {
    prop: "pauseWhenHidden",
    type: "boolean",
    default: "false",
    description:
      "If <b>true</b>, the video automatically pauses when the player scrolls out of the viewport or the browser tab is hidden, and resumes when it comes back. Only pauses triggered by visibility changes are reversed, manual pauses are preserved.",
  },
  {
    prop: "quality",
    type: "number | string",
    default: '"auto"',
    description:
      "For HLS (.m3u8) streams. Sets or controls the quality level index (e.g. 0 for lowest, or -1 for Auto adaptive quality).",
  },
  {
    prop: "onQualityChange",
    type: "(level: number, label: string) => void",
    default: "undefined",
    description:
      "Callback function fired when the user or stream switches HLS quality level.",
  },
  {
    prop: "muted",
    type: "boolean",
    default: "false",
    description:
      "A Boolean attribute that indicates the default audio mute setting contained in the video. If set, the audio will be initially silenced. Its default value is false, meaning the audio will be played when the video is played.",
  },
  {
    prop: "playsInline",
    type: "boolean",
    default: "true",
    description: `A Boolean attribute indicating that the video is to be played "inline", that is, within the element's playback area. Note that the absence of this attribute does not imply that the video will always be played in fullscreen.`,
  },
  {
    prop: "defaultPlaybackRate",
    type: "number",
    default: "undefined",
    description:
      "A number indicating the default playback speed of the video when loaded. The default value is 1.0, which indicates normal speed. The value must be between 0.0625 and 16.0.",
  },
  {
    prop: "defaultVolume",
    type: "number",
    default: "1",
    description:
      "A number indicating the default volume of the video when loaded. The default value is 1.0, which indicates normal volume. The value must be between 0 and 1.",
  },
  {
    prop: "preview",
    type: "{ mode?: 'clip' | 'random'; duration?: number; start?: number; loop?: boolean }",
    default: "undefined",
    description: `Configures clip or random preview playback. When enabled, the player can start at a chosen second or a random segment and stop after the configured duration.
      <br/> 
      - <b>mode</b>: "clip" to preview a specific segment, or "random" to preview a random segment on each load.
      <br/>
      - <b>duration</b>: Duration of the preview in seconds.
      <br/>
      - <b>start</b>: Start time of the preview in seconds. Only used in "clip" mode. Ignored in "random" mode where the start time is randomized on each load.
      <br/>
      - <b>loop</b>: Whether to loop the preview.
      `,
  },
  {
    prop: "playlist",
    type: `{ items: Array<{ src: string; duration: string; start?: number; end?: number }>;  loop?: boolean }`,
    default: "undefined",
    description: `Configure a playlist to play multiple videos in sequence. 
                <br />
                - <b>items</b>: Array of video items with src URL, duration, and optional start time, and end time.
                 <br />
                - <b>loop</b>: Loop back to first item when reaching the end (default: false).
                <br />
                Use start/end times for same-source clips to create gapless playback of segments from the same video file.
                `,
  },
  {
    prop: "seekTo",
    type: "number",
    default: "0",
    description:
      "A number representing the time in seconds to seek to in the video when it has loaded",
  },
  {
    prop: "chapters",
    type: "Chapter[]",
    default: "undefined",
    description:
      "Array of chapter markers (e.g. <code>[{ time: 0, label: 'Intro' }, { time: 120, label: 'Main Topic' }]</code>) rendered visually on the progress bar and displayed in hover tooltips.",
  },
  {
    prop: "controlsToExclude",
    type: "Array<typeof VideoControlOptionsToRemove>",
    default: "[]",
    description: `An array of controls to remove from the video player. The following controls can be removed:
        <br />
        - <b>center-playPause-button</b>: Center play/pause button
        <br />
        - <b>bottom-playPause-button</b>: Bottom play/pause button
        <br />
        - <b>skip-forward-backward</b>: Skip forward and backward buttons
        <br />
        - <b>progress</b>: Progress bar
        <br />
        - <b>current-time</b>: Current time display
        <br />
        - <b>duration</b>: Duration display
        <br />
        - <b>volume</b>: Volume control
        <br />
        - <b>mute</b>: Mute button
        <br />
        - <b>fullscreen</b>: Fullscreen button
        <br />
        - <b>playbackRate</b>: Playback rate control
        <br />
        - <b>pip</b>: Picture-in-picture button
        `,
  },
  {
    prop: "width",
    type: "string | number",
    default: '"100%"',
    description:
      "A string or number representing the width of the video player.",
  },
  {
    prop: "height",
    type: "string | number",
    default: '"100%"',
    description:
      "A string or number representing the height of the video player. minHeight: 180px",
  },
  {
    prop: "className",
    type: "string",
    default: '""',
    description: "Additional class names for the video player",
  },
  {
    prop: "style",
    type: "CSSProperties",
    default: "{}",
    description: "Additional styles for the video player",
  },
  {
    prop: "customErrorMessage",
    type: "string",
    default: '"An error occurred while trying to play the video."',
    description: "Custom error message to display when video fails to load",
  },
  {
    prop: "ambientMode",
    type: "boolean",
    default: "false",
    description: "If true, projects a YouTube-style dynamic, color-matched ambient glow behind the video player container",
  },
  {
    prop: "disableDoubleClick",
    type: "boolean",
    default: "false",
    description:
      "If true, disables double-click functionality for play/pause or fullscreen.",
  },
  {
    prop: "doubleClickToFullscreen",
    type: "boolean",
    default: "false",
    description: "If true, double-clicking the video toggles fullscreen mode.",
  },
  {
    prop: "showDownloadButton",
    type: "boolean",
    default: "false",
    description: "If true, shows a download button for the video.",
  },
  {
    prop: "disableShortcuts",
    type: "boolean",
    default: "false",
    description: "If true, disables keyboard shortcuts for video controls.",
  },
  {
    prop: "onProgress",
    type: "(currentTime: number, duration: number) => void",
    default: "undefined",
    description: "Callback during video playback progress",
  },
  {
    prop: "onSeeking",
    type: "(time: number) => void",
    default: "undefined",
    description: "Callback when the video when the user starts seeking",
  },
  {
    prop: "onSeeked",
    type: "(time: number) => void",
    default: "undefined",
    description: "Callback when the video after the user finishes seeking",
  },
  {
    prop: "onPlay",
    type: "() => void",
    default: "undefined",
    description: "Callback when the video starts playing",
  },
  {
    prop: "onPause",
    type: "() => void",
    default: "undefined",
    description: "Callback when the video is paused",
  },
  {
    prop: "onEnded",
    type: "() => void",
    default: "undefined",
    description: "Callback when the video ends",
  },
  {
    prop: "onVolumeChange",
    type: "(volume: number) => void",
    default: "undefined",
    description: "Callback when the volume is changed",
  },
  {
    prop: "onPlaybackRateChange",
    type: "(rate: number) => void",
    default: "undefined",
    description: "Callback when the playback rate is changed",
  },
  {
    prop: "onMuteChange",
    type: "(isMuted: boolean) => void",
    default: "undefined",
    description: "Callback when the mute state is changed",
  },
  {
    prop: "onFullscreenChange",
    type: "(isFullscreen: boolean) => void",
    default: "undefined",
    description: "Callback when the fullscreen state is changed",
  },
  {
    prop: "onPictureInPictureChange",
    type: "(isPictureInPicture: boolean) => void",
    default: "undefined",
    description: "Callback when the picture-in-picture state is changed",
  },
  {
    prop: "onDownloadStart",
    type: "() => void",
    default: "undefined",
    description: "Callback when video download starts",
  },
  {
    prop: "onDownloadEnd",
    type: "(success: boolean) => void",
    default: "undefined",
    description: "Callback when video download ends, with success status",
  },
  {
    prop: "onError",
    type: "() => void",
    default: "undefined",
    description: "Callback when there is an error",
  },
  {
    prop: "onReady",
    type: "() => void",
    default: "undefined",
    description: "Callback when the video is ready",
  },
  {
    prop: "onDuration",
    type: "(duration: number) => void",
    default: "undefined",
    description: "Callback with video duration",
  },
  {
    prop: "getVideoRef",
    type: "(ref: HTMLVideoElement | null) => void",
    default: "undefined",
    description: `Get video element reference to access video properties and methods. 
    Learn more about the <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement" class="underline" target="_blank" rel="noopener noreferrer">HTMLMediaElement</a> interface.
`,
  },
  {
    prop: "onVisibilityChange",
    type: "(isVisible: boolean) => void",
    default: "undefined",
    description: "Callback fired when player enters/leaves viewport or tab visibility changes",
  },
  {
    prop: "onBuffering",
    type: "(isBuffering: boolean) => void",
    default: "undefined",
    description: "Callback fired when media enters or exits buffering state",
  },
  {
    prop: "icons",
    type: "VideoPlayerIcons",
    default: "undefined",
    description: "Custom icons to override the default icons. Available keys: <b>play, pause, mute, unmute, volume, fullscreen, exitFullscreen, pictureInPicture, exitPictureInPicture, rewind, forward, download, error, captions, settings, nextTrack, prevTrack</b>.",
  },
];

export const audioProps = [
  {
    prop: "src",
    type: "string",
    default: '""',
    description: "The source URL of the audio",
  },
  {
    prop: "accentColor",
    type: "string",
    default: '"#60a5fa"',
    description: "The accent color to use for the player controls",
  },
  {
    prop: "mediaSession",
    type: "—",
    default: "auto",
    description:
      "<b>Built-in (no prop needed).</b> The player automatically registers with the browser's Media Session API so OS-level controls work out of the box — keyboard media keys, lock screen controls on iOS/Android, and Bluetooth headset buttons all map to play, pause, seek-backward, seek-forward, and seek-to actions.",
  },
  {
    prop: "customErrorMessage",
    type: "string",
    default: '"An error occurred while trying to play the audio."',
    description: "Custom error message to display when audio fails to load",
  },
  {
    prop: "controls",
    type: "boolean",
    default: "true",
    description:
      "If this attribute is present, the audio player will offer controls to allow the user to control audio playback, including volume, duration, pause/resume playback, playback rate.",
  },
  {
    prop: "autoPlay",
    type: "boolean",
    default: "false",
    description:
      "A Boolean attribute; if specified, the audio automatically begins to play back as soon as it can without stopping to finish loading the data.",
  },
  {
    prop: "loop",
    type: "boolean",
    default: "false",
    description:
      "A Boolean attribute; if specified, the audio player will automatically seek back to the start upon reaching the end of the audio.",
  },

  {
    prop: "maxAutoPlayDuration",
    type: "number",
    default: "undefined",
    description:
      "Optional guard in seconds. If set, autoplay is blocked for audio longer than this duration.",
  },
  {
    prop: "pauseWhenHidden",
    type: "boolean",
    default: "false",
    description:
      "If <b>true</b>, the audio automatically pauses when the player scrolls out of the viewport or the browser tab is hidden, and resumes when it comes back. Only pauses triggered by visibility changes are reversed, manual pauses are preserved.",
  },
  {
    prop: "quality",
    type: "number | string",
    default: '"auto"',
    description:
      "For HLS audio streams (.m3u8). Controls the audio bitrate quality level.",
  },
  {
    prop: "playlist",
    type: "PlaylistConfig",
    default: "undefined",
    description:
      "Configures an audio playlist with multiple track items, auto-advance, and previous/next track controls.",
  },
  {
    prop: "chapters",
    type: "Chapter[]",
    default: "undefined",
    description:
      "Array of chapter markers (e.g. <code>[{ time: 0, label: 'Intro' }]</code>) rendered visually on the progress bar and displayed in hover tooltips.",
  },
  {
    prop: "onQualityChange",
    type: "(level: number, label: string) => void",
    default: "undefined",
    description:
      "Callback function fired when the user or audio stream switches quality/bitrate level.",
  },
  {
    prop: "muted",
    type: "boolean",
    default: "false",
    description:
      "A Boolean attribute that indicates the default audio mute setting contained in the audio. If set, the audio will be initially silenced. Its default value is false, meaning the audio will be played when the audio is played.",
  },
  {
    prop: "defaultPlaybackRate",
    type: "number",
    default: "undefined",
    description:
      "A number indicating the default playback speed of the audio when loaded. The default value is 1.0, which indicates normal speed. The value must be between 0.0625 and 16.0.",
  },
  {
    prop: "seekTo",
    type: "number",
    default: "0",
    description:
      "A number representing the time in seconds to seek to in the audio when it has loaded",
  },
  {
    prop: "controlsToExclude",
    type: "Array<typeof VideoControlOptionsToRemove>",
    default: "[]",
    description: `An array of controls to remove from the audio player. The following controls can be removed:
        <br />
        - <b>playPause</b>: Center play/pause button
        <br />
        - <b>volume</b>: Volume control
        <br />
        - <b>mute</b>: Mute button
        <br />
        - <b>current-time</b>: Current time display
        <br />
        - <b>duration</b>: Duration display
        <br />
        - <b>playbackRate</b>: Playback rate control
        `,
  },
  {
    prop: "width",
    type: "string | number",
    default: '"100%"',
    description:
      "A string or number representing the width of the audio player. minWidth: 90px",
  },
  {
    prop: "className",
    type: "string",
    default: '""',
    description: "Additional class names for the audio player",
  },
  {
    prop: "style",
    type: "CSSProperties",
    default: "{}",
    description: "Additional styles for the audio player",
  },
  {
    prop: "disableShortcuts",
    type: "boolean",
    default: "false",
    description: "If true, disables keyboard shortcuts for audio controls.",
  },
  {
    prop: "showDownloadButton",
    type: "boolean",
    default: "false",
    description: "If true, shows a download button for the audio.",
  },
  {
    prop: "onProgress",
    type: "(currentTime: number, duration: number) => void",
    default: "undefined",
    description: "Callback during audio playback progress",
  },
  {
    prop: "onSeeked",
    type: "(time: number) => void",
    default: "undefined",
    description: "Callback when the audio is seeked",
  },
  {
    prop: "onPlay",
    type: "() => void",
    default: "undefined",
    description: "Callback when the audio starts playing",
  },
  {
    prop: "onPause",
    type: "() => void",
    default: "undefined",
    description: "Callback when the audio is paused",
  },
  {
    prop: "onEnded",
    type: "() => void",
    default: "undefined",
    description: "Callback when the audio ends",
  },
  {
    prop: "onVolumeChange",
    type: "(volume: number) => void",
    default: "undefined",
    description: "Callback when the volume is changed",
  },
  {
    prop: "onPlaybackRateChange",
    type: "(rate: number) => void",
    default: "undefined",
    description: "Callback when the playback rate is changed",
  },
  {
    prop: "onMuteChange",
    type: "(isMuted: boolean) => void",
    default: "undefined",
    description: "Callback when the mute state is changed",
  },
  {
    prop: "onDownloadStart",
    type: "() => void",
    default: "undefined",
    description: "Callback when audio download starts",
  },
  {
    prop: "onDownloadEnd",
    type: "(success: boolean) => void",
    default: "undefined",
    description: "Callback when audio download ends, with success status",
  },
  {
    prop: "onError",
    type: "() => void",
    default: "undefined",
    description: "Callback when there is an error",
  },
  {
    prop: "onReady",
    type: "() => void",
    default: "undefined",
    description: "Callback when the audio is ready",
  },
  {
    prop: "onDuration",
    type: "(duration: number) => void",
    default: "undefined",
    description: "Callback with audio duration",
  },
  {
    prop: "getAudioElement",
    type: "(ref: HTMLAudioElement | null) => void",
    default: "undefined",
    description: `Get audio element reference to access audio properties and methods. 
    Learn more about the <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement" class="underline" target="_blank" rel="noopener noreferrer">HTMLMediaElement</a> interface.`,
  },
  {
    prop: "getWaveSurferRef",
    type: "(ref: WaveSurfer | null) => void",
    default: "undefined",
    description: `Get WaveSurfer instance reference to access WaveSurfer properties and methods. Learn more about the
     <a href='https://wavesurfer.xyz/docs/classes/wavesurfer.default' class="underline" target='_blank' rel='noopener noreferrer'>WaveSurfer Methods</a>.`,
  },
  {
    prop: "onVisibilityChange",
    type: "(isVisible: boolean) => void",
    default: "undefined",
    description: "Callback fired when player enters/leaves viewport or tab visibility changes",
  },
  {
    prop: "onBuffering",
    type: "(isBuffering: boolean) => void",
    default: "undefined",
    description: "Callback fired when media enters or exits buffering state",
  },
  {
    prop: "waveColor",
    type: "string",
    default: '"#94a3b8"',
    description: "Custom unplayed waveform color for WaveSurfer visualization",
  },
  {
    prop: "progressColor",
    type: "string",
    default: "accentColor",
    description: "Custom played waveform progress color",
  },
  {
    prop: "barWidth",
    type: "number",
    default: "2",
    description: "Width of individual waveform bars in pixels",
  },
  {
    prop: "barGap",
    type: "number",
    default: "1",
    description: "Spacing gap between waveform bars in pixels",
  },
  {
    prop: "barRadius",
    type: "number",
    default: "0",
    description: "Border radius for waveform bars in pixels",
  },
  {
    prop: "icons",
    type: "AudioPlayerIcons",
    default: "undefined",
    description: "Custom icons to override the default icons. Available keys: <b>play, pause, mute, unmute, volume, rewind, forward, download, error, nextTrack, prevTrack</b>.",
  },
];
