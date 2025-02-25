import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

export const videoProps = [
  {
    prop: "src",
    type: "string",
    default: '""',
    description: "The URL of the video to embed. This is optional; you may instead use the <b>sources</b> property to specify one or more <b>source</b> elements for the video.",
  },
  {
    prop: "sources",
    type: "Array<{ src: string; type: string }>",
    default: "[]",
    description: "An array of objects containing the URL and type of the video to embed. This is optional; you may instead use the <b>src</b> property to specify the URL of the video.",
  },
  {
    prop: "tracks",
    type: "Array<{ src: string; kind: string; label: string; srclang: string; default?: boolean }>",
    default: "[]",
    description: "An array of objects containing the URL, kind, label, and srclang of the tracks to embed.",
  },
  {
    prop: "poster",
    type: "string",
    default: '""',
    description: "A URL for an image to be shown while the video is downloading. If this attribute isn't specified, nothing is displayed until the first frame is available, then the first frame is shown as the poster frame.",
  },
  {
    prop: "accentColor",
    type: "string",
    default: '"#60a5fa"',
    description: "The accent color to use for the player controls",
  },
  {
    prop: "preload",
    type: '"auto" | "metadata" | "none" | ""',
    default: '"auto"',
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
        The spec advises it to be set to metadata.`,
  },
  {
    prop: "controls",
    type: "boolean",
    default: "true",
    description: "If this attribute is present, the video player will offer controls to allow the user to control video playback, including volume, duration, seeking, pause/resume playback, picture in picture (if supported), playback rate, skip forward, skip backward and fullscreen toggle.",
  },
  {
    prop: "autoPlay",
    type: "boolean",
    default: "false",
    description: "A Boolean attribute; if specified, the video automatically begins to play back as soon as it can without stopping to finish loading the data.",
  },
  {
    prop: "muted",
    type: "boolean",
    default: "false",
    description: "A Boolean attribute that indicates the default audio mute setting contained in the video. If set, the audio will be initially silenced. Its default value is false, meaning the audio will be played when the video is played.",
  },
  {
    prop: "loop",
    type: "boolean",
    default: "false",
    description: "A Boolean attribute; if specified, the video player will automatically seek back to the start upon reaching the end of the video.",
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
    description: "A number indicating the default playback speed of the video when loaded. The default value is 1.0, which indicates normal speed. The value must be between 0.0625 and 16.0.",
  },
  {
    prop: "seekTo",
    type: "number",
    default: "0",
    description: "A number representing the time in seconds to seek to in the video when it has loaded",
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
    description: "A string or number representing the width of the video player.",
  },
  {
    prop: "height",
    type: "string | number",
    default: '"100%"',
    description: "A string or number representing the height of the video player. minHeight: 180px",
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
  }, {
    prop: "customErrorMessage",
    type: "string",
    default: '"An error occurred while trying to play the video."',
    description: "Custom error message to display when video fails to load",
  },
  {
    prop: "disableDoubleClick",
    type: "boolean",
    default: "false",
    description: "If true, disables double-click functionality for play/pause or fullscreen.",
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
    prop: "customErrorMessage",
    type: "string",
    default: '"An error occurred while trying to play the audio."',
    description: "Custom error message to display when audio fails to load",
  },
  {
    prop: "controls",
    type: "boolean",
    default: "true",
    description: "If this attribute is present, the audio player will offer controls to allow the user to control audio playback, including volume, duration, pause/resume playback, playback rate.",
  },
  {
    prop: "autoPlay",
    type: "boolean",
    default: "false",
    description: "A Boolean attribute; if specified, the audio automatically begins to play back as soon as it can without stopping to finish loading the data.",
  },
  {
    prop: "muted",
    type: "boolean",
    default: "false",
    description: "A Boolean attribute that indicates the default audio mute setting contained in the audio. If set, the audio will be initially silenced. Its default value is false, meaning the audio will be played when the audio is played.",
  },
  {
    prop: "loop",
    type: "boolean",
    default: "false",
    description: "A Boolean attribute; if specified, the audio player will automatically seek back to the start upon reaching the end of the audio.",
  },
  {
    prop: "seekTo",
    type: "number",
    default: "0",
    description: "A number representing the time in seconds to seek to in the audio when it has loaded",
  },
  {
    prop: "controlsToExclude",
    type: "Array<typeof VideoControlOptionsToRemove>",
    default: "[]",
    description: `An array of controls to remove from the video player. The following controls can be removed:
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
    description: "A string or number representing the width of the audio player. minWidth: 90px",
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
    Learn more about the <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement" class="underline" target="_blank" rel="noopener noreferrer">HTMLMediaElement</a> interface.`
  },
  {
    prop: "getWaveSurferRef",
    type: "(ref: WaveSurfer | null) => void",
    default: "undefined",
    description: `Get WaveSurfer instance reference to access WaveSurfer properties and methods. Learn more about the
     <a href='https://wavesurfer.xyz/docs/classes/wavesurfer.default' class="underline" target='_blank' rel='noopener noreferrer'>WaveSurfer Methods</a>.`
  },
]
