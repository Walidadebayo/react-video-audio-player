"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  CSSProperties,
} from "react";
import { formatTime, playbackRateOptions } from "./lib/utils";
import Select from "./components/Select";
import Dropdown from "./components/Dropdown";
import { useInView } from "./lib/useInView";
import "./video-audio-player.css";
import { updateRangeBackground } from "./lib/utils";

export type preload = "auto" | "metadata" | "none" | "";
export type VideoControlOptionsToRemove =
  | "center-playPause-button"
  | "bottom-playPause-button"
  | "pip"
  | "progress"
  | "current-time"
  | "fullscreen"
  | "duration"
  | "mute"
  | "volume"
  | "playbackRate"
  | "skip-forward-backward"
  | "captions";

export type VideoMimeType =
  | "video/mp4"
  | "video/webm"
  | "video/ogg"
  | "video/quicktime";

export type TrackKind =
  | "subtitles"
  | "captions"
  | "descriptions"
  | "chapters"
  | "metadata";

export type sources = {
  src: string;
  type: VideoMimeType;
}[];

export interface Track {
  src: string;
  kind: TrackKind;
  label: string;
  srclang: string;
  default?: boolean;
}

export interface VideoPreviewOptions {
  mode?: "clip" | "random";
  duration?: number;
  start?: number; // only used in "clip" mode
  loop?: boolean;
}

export interface PlaylistItem {
  src: string;
  duration: number; // duration of this playlist item in seconds
  start?: number; // optional start time for same-source clips (seconds)
  end?: number; // optional end time for same-source clips (seconds)
}

export interface PlaylistConfig {
  items: PlaylistItem[];
  loop?: boolean; // loop entire playlist when reaching the end (default: false)
}

export interface VideoPlayerIcons {
  play?: React.ReactNode;
  pause?: React.ReactNode;
  mute?: React.ReactNode;
  unmute?: React.ReactNode;
  volume?: React.ReactNode;
  fullscreen?: React.ReactNode;
  exitFullscreen?: React.ReactNode;
  pictureInPicture?: React.ReactNode;
  exitPictureInPicture?: React.ReactNode;
  rewind?: React.ReactNode;
  forward?: React.ReactNode;
  download?: React.ReactNode;
  error?: React.ReactNode;
  captions?: React.ReactNode;
  settings?: React.ReactNode;
}

export interface VideoPlayerProps {
  src?: string;
  accentColor?: string;
  customErrorMessage?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  poster?: string;
  preload?: preload;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: CSSProperties;
  seekTo?: number;
  defaultPlaybackRate?: number;
  defaultVolume?: number;
  sources?: sources;
  controlsToExclude?: VideoControlOptionsToRemove[];
  disableDoubleClick?: boolean;
  doubleClickToFullscreen?: boolean;
  showDownloadButton?: boolean;
  disableShortcuts?: boolean;
  tracks?: Track[];
  onProgress?: (currentTime: number, duration: number) => void;
  onSeeked?: (time: number) => void;
  onSeeking?: (time: number) => void;
  onVolumeChange?: (volume: number) => void;
  onPlaybackRateChange?: (rate: number) => void;
  onMuteChange?: (isMuted: boolean) => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  onPictureInPictureChange?: (isPictureInPicture: boolean) => void;
  onDownloadStart?: () => void;
  onDownloadEnd?: (success: boolean) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: () => void;
  onReady?: () => void;
  onDuration?: (duration: number) => void;
  getVideoRef?: (ref: HTMLVideoElement | null) => void;
  onTrackChange?: (track: TextTrack | null) => void;
  generatePosterAt?: number;
  preview?: VideoPreviewOptions;
  playlist?: PlaylistConfig;
  maxAutoPlayDuration?: number;
  icons?: VideoPlayerIcons;
}

const VideoPlayer = ({
  src,
  accentColor = "#60a5fa",
  customErrorMessage = "An error occurred while trying to play the video.",
  controls = true,
  autoPlay = false,
  muted = false,
  loop = false,
  playsInline = true,
  poster = undefined,
  width = "100%",
  height = "100%",
  className = "",
  style = {},
  preload = "metadata",
  seekTo,
  defaultPlaybackRate,
  defaultVolume = 1,
  sources,
  controlsToExclude = [],
  disableDoubleClick = false,
  doubleClickToFullscreen = false,
  showDownloadButton = false,
  disableShortcuts = false,
  onProgress,
  onSeeked,
  onSeeking,
  onVolumeChange,
  onPlaybackRateChange,
  onMuteChange,
  onFullscreenChange,
  onPictureInPictureChange,
  onDownloadStart,
  onDownloadEnd,
  onPlay,
  onPause,
  onEnded,
  onError,
  onReady,
  onDuration,
  getVideoRef,
  tracks,
  onTrackChange,
  generatePosterAt,
  preview,
  playlist,
  maxAutoPlayDuration,
  icons = {},
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(videoContainerRef);
  const mountedRef = useRef(true);
  const lastVolumeRef = useRef<number>(defaultVolume);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(defaultVolume);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const controlTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [errorType, setErrorType] = useState<
    "unsupported" | "network" | "decode" | "aborted" | "unknown" | null
  >(null);
  const [duration, setDuration] = useState(0);
  const [ios, setIos] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const timelineInputRef = useRef<HTMLInputElement>(null);
  const volumeInputRef = useRef<HTMLInputElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [tooltipWidth, setTooltipWidth] = useState<number>(0);
  const [reverseCurrentTime, setReverseCurrentTime] = useState(false);
  const [availableTracks, setAvailableTracks] = useState<TextTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<TextTrack | null>(null);
  const [shouldLoadMedia, setShouldLoadMedia] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const playbackRateRef = useRef(playbackRate);
  const volumeRef = useRef(volume);
  const previewStopRef = useRef<number | null>(null);
  const previewStartRef = useRef<number | null>(null);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [playlistConfig, setPlaylistConfig] = useState<
    PlaylistConfig | undefined
  >(playlist);
  const playlistItemDurationsRef = useRef<number[]>([]);
  const [playlistTotalDuration, setPlaylistTotalDuration] = useState<number>(0);
  const pendingSeekRef = useRef<{ index: number; time: number } | null>(null);
  const pendingPlayAfterSourceChangeRef = useRef(false);

  const previewConfig = typeof preview === "object" ? preview : undefined;
  const isPreviewEnabled = Boolean(previewConfig); //if preview prop is provided and is an object, then preview mode is enabled
  const previewMode = previewConfig?.mode ?? "clip";
  const previewDuration = Math.max(1, previewConfig?.duration ?? 10);
  const previewStart = Math.max(0, previewConfig?.start ?? 0);
  const previewLoop = previewConfig?.loop ?? false;

  // Icon helper function
  const getIcon = (
    iconName: keyof VideoPlayerIcons,
    defaultIcon: React.ReactNode,
  ): React.ReactNode => {
    return icons?.[iconName] ?? defaultIcon;
  };

  useEffect(() => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
        setIos(true);
      }
    }
  }, []);

  useEffect(() => {
    setPlaylistConfig(playlist);
    if (playlist && playlist.items.length > 0) {
      setCurrentPlaylistIndex(0);
      // use provided durations from playlist items
      playlistItemDurationsRef.current = playlist.items.map(
        (it) => it.duration || 0,
      );

      const total = playlistItemDurationsRef.current.reduce((a, b) => a + b, 0);
      setPlaylistTotalDuration(total);
      // set displayed duration to total from the start
      if (total > 0) setDuration(total);
    }
  }, [playlist]);

  useEffect(() => {
    if (isInView) {
      setShouldLoadMedia(true);
    }
  }, [isInView]);

  useEffect(() => {
    if (videoRef.current) {
      setIsMuted(muted);
      setVolume(muted ? 0 : defaultVolume);
    }
  }, [muted, defaultVolume]);

  const defaultPlaybackRateAppliedRef = useRef(false);
  useEffect(() => {
    if (videoRef.current && typeof defaultPlaybackRate === "number" && !defaultPlaybackRateAppliedRef.current) {
      const newPlaybackRate = Math.min(
        Math.max(defaultPlaybackRate || 1, 0.0625),
        16,
      );
      setPlaybackRate(newPlaybackRate);
      videoRef.current.playbackRate = newPlaybackRate;
      if (onPlaybackRateChange) onPlaybackRateChange(newPlaybackRate);
      defaultPlaybackRateAppliedRef.current = true;
    }
  }, [defaultPlaybackRate, onPlaybackRateChange]);

  const lastSeekToRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    const videoElement = videoRef.current;
    if (
      typeof seekTo === "number" &&
      seekTo !== lastSeekToRef.current &&
      videoElement &&
      duration
    ) {
      videoElement.currentTime = seekTo;
      updateRangeBackground(timelineInputRef.current, seekTo, duration);
      lastSeekToRef.current = seekTo;
    }
  }, [seekTo, duration]);

  const resetControlTimeout = useCallback(() => {
    if (controlTimeoutRef.current) {
      clearTimeout(controlTimeoutRef.current);
    }
    if (isPlaying) {
      controlTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    (async () => {
      if (!mountedRef.current) return;
      if (videoRef.current && duration && !poster) {
        try {
          const videoElementClone =
            videoRef.current.cloneNode() as HTMLVideoElement;
          const mediaSrc = src || (sources && sources[0]?.src);
          if (mediaSrc) {
            videoElementClone.src = mediaSrc;
          }
          videoElementClone.crossOrigin = "anonymous";
          await new Promise(
            (resolve) => (videoElementClone.onloadedmetadata = resolve),
          );

          const canvas = document.createElement("canvas");
          canvas.width = videoElementClone.videoWidth || 640;
          canvas.height = videoElementClone.videoHeight || 360;
          const time = generatePosterAt || 0;
          const ctx = canvas.getContext("2d");

          if (ctx) {
            try {
              videoElementClone.currentTime = time;
              await new Promise(
                (resolve) => (videoElementClone.onseeked = resolve),
              );
              ctx.drawImage(
                videoElementClone,
                0,
                0,
                canvas.width,
                canvas.height,
              );
              const dataUrl = canvas.toDataURL();

              if (videoRef.current) videoRef.current.poster = dataUrl;
            } catch (err) {
              console.warn(
                "Could not generate poster (CORS or seek issue)",
                err,
              );
            }
          }
        } catch (err) {
          console.warn("Poster generation skipped", err);
        }
      }
    })();
  }, [duration, poster, generatePosterAt, src, sources]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleLoadedMetadata = () => {
      if (!videoElement) return;
      const mediaDuration = videoElement.duration || 0;

      // If we have a playlist, use the provided durations
      if (playlistConfig && playlistConfig.items.length > 0) {
        const idx = currentPlaylistIndex;
        const currentItem = playlistConfig.items[idx];

        // Use the duration field from the playlist item
        playlistItemDurationsRef.current[idx] = currentItem.duration || 0;
        const total = playlistItemDurationsRef.current.reduce(
          (a, b) => a + b,
          0,
        );
        setPlaylistTotalDuration(total);
        setDuration(total);

        if (onReady) onReady();
        if (onDuration) onDuration(total);

        // Seek handling: if a pending seek was requested for this index, apply it
        if (pendingSeekRef.current && pendingSeekRef.current.index === idx) {
          const within = pendingSeekRef.current.time;
          const target = (currentItem.start || 0) + within;
          try {
            videoElement.currentTime = target;
          } catch {
            // ignore seek errors
          }
          pendingSeekRef.current = null;
        } else if (currentItem.start) {
          try {
            videoElement.currentTime = currentItem.start;
          } catch {
            // ignore seek errors
          }
        }

        if (pendingPlayAfterSourceChangeRef.current) {
          pendingPlayAfterSourceChangeRef.current = false;
          videoElement
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }

        const isAutoplayAllowed =
          autoPlay &&
          !isPreviewEnabled &&
          (!maxAutoPlayDuration || total <= maxAutoPlayDuration);

        if (isAutoplayAllowed && videoElement) {
          videoElement
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }
      } else {
        // non-playlist behavior -- previous behavior
        const durationVal = mediaDuration || 0;
        setDuration(durationVal);
        if (onReady) onReady();
        if (onDuration) onDuration(durationVal);

        const isAutoplayAllowed =
          autoPlay &&
          !isPreviewEnabled &&
          (!maxAutoPlayDuration || durationVal <= maxAutoPlayDuration); // if autoplay is enabled, preview is not enabled, and either there's no max duration limit or the media duration is within that limit

        if (isAutoplayAllowed && videoElement) {
          videoElement
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }
      }
    };

    if (videoElement) {
      videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata,
        );
      }
    };
  }, [
    onReady,
    onDuration,
    autoPlay,
    isPreviewEnabled,
    maxAutoPlayDuration,
    currentPlaylistIndex,
    playlistConfig,
  ]);

  useEffect(() => {
    const timelineInput = timelineInputRef.current;
    if (duration) {
      updateRangeBackground(timelineInput);
    }
  }, [currentTime, duration]);

  useEffect(() => {
    if (videoRef.current) {
      const volumeInput = volumeInputRef.current;
      updateRangeBackground(volumeInput);
      const newVolume = Math.min(Math.max(volume || 0, 0), 1);
      videoRef.current.volume = newVolume;
      if (onVolumeChange) onVolumeChange(newVolume);
      if (newVolume === 0) {
        setIsMuted(true);
        if (onMuteChange) onMuteChange(true);
      } else {
        setIsMuted(false);
        if (onMuteChange) onMuteChange(false);
      }
    }
  }, [volume, onVolumeChange, onMuteChange]);

  useEffect(() => {
    const videoElement = videoRef.current;
    const handleTimeUpdate = () => {
      if (videoElement) {
        // Playlist-aware aggregated time and auto-advance logic
        if (
          playlistConfig &&
          playlistConfig.items.length > 0 &&
          currentPlaylistIndex >= 0 &&
          currentPlaylistIndex < playlistConfig.items.length
        ) {
          const currentItem = playlistConfig.items[currentPlaylistIndex];
          const prevTotal = playlistItemDurationsRef.current
            .slice(0, currentPlaylistIndex)
            .reduce((a, b) => a + b, 0);
          const itemStart = currentItem.start || 0;
          let itemElapsed = videoElement.currentTime - itemStart;
          if (itemElapsed < 0) itemElapsed = 0;
          const aggregatedTime = prevTotal + itemElapsed;
          setCurrentTime(aggregatedTime);
          updateRangeBackground(
            timelineInputRef.current,
            aggregatedTime,
            playlistTotalDuration || videoElement.duration,
          );
          if (onProgress)
            onProgress(
              aggregatedTime,
              playlistTotalDuration || videoElement.duration,
            );

          // If item has explicit end time, advance when reached
          if (
            typeof currentItem.end === "number" &&
            videoElement.currentTime >= currentItem.end
          ) {
            const nextIndex = currentPlaylistIndex + 1;
            if (nextIndex < playlistConfig.items.length) {
              const nextItem = playlistConfig.items[nextIndex];
              pendingPlayAfterSourceChangeRef.current = true;
              setCurrentPlaylistIndex(nextIndex);
              if (
                nextItem.src === currentItem.src &&
                typeof nextItem.start === "number"
              ) {
                pendingPlayAfterSourceChangeRef.current = false;
                videoElement.currentTime = nextItem.start;
                videoElement.play().catch(() => {});
              } else {
                // different source: effect will load next source
              }
            } else if (playlistConfig.loop) {
              pendingPlayAfterSourceChangeRef.current = true;
              setCurrentPlaylistIndex(0);
              const firstItem = playlistConfig.items[0];
              if (firstItem.src === currentItem.src) {
                videoElement.currentTime = firstItem.start || 0;
                videoElement.play().catch(() => {});
              }
            } else {
              setIsPlaying(false);
              if (onEnded) onEnded();
              setShowControls(true);
            }
            return;
          }

          // Natural end of the media
          if (
            videoElement.duration > 0 &&
            videoElement.currentTime >= videoElement.duration
          ) {
            const nextIndex = currentPlaylistIndex + 1;
            if (nextIndex < playlistConfig.items.length) {
              const nextItem = playlistConfig.items[nextIndex];
              pendingPlayAfterSourceChangeRef.current = true;
              setCurrentPlaylistIndex(nextIndex);
              if (
                nextItem.src === currentItem.src &&
                typeof nextItem.start === "number"
              ) {
                pendingPlayAfterSourceChangeRef.current = false;
                videoElement.currentTime = nextItem.start;
                videoElement.play().catch(() => {});
              } else {
                // different source: effect will load next source
              }
              return;
            } else if (playlistConfig.loop) {
              pendingPlayAfterSourceChangeRef.current = true;
              setCurrentPlaylistIndex(0);
              const firstItem = playlistConfig.items[0];
              if (firstItem.src === currentItem.src) {
                pendingPlayAfterSourceChangeRef.current = false;
                videoElement.currentTime = firstItem.start || 0;
              }
              return;
            }
            if (onEnded) onEnded();
            setShowControls(true);
          }
          return;
        }

        // Non-playlist fallback
        setCurrentTime(videoElement.currentTime);
        if (onProgress) {
          onProgress(videoElement.currentTime, videoElement.duration);
        }
        if (videoElement.currentTime === videoElement.duration) {
          setIsPlaying(false);
          if (onEnded) {
            onEnded();
          }
          setShowControls(true);
        }
      }
    };

    const handleError = () => {
      // Detect error type from video element error code
      let type: "unsupported" | "network" | "decode" | "aborted" | "unknown" =
        "unknown";
      if (videoElement?.error) {
        switch (videoElement.error.code) {
          case 1: // MEDIA_ERR_ABORTED
            type = "aborted";
            break;
          case 2: // MEDIA_ERR_NETWORK
            type = "network";
            break;
          case 3: // MEDIA_ERR_DECODE
            type = "decode";
            break;
          case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
            type = "unsupported";
            break;
          default:
            type = "unknown";
        }
      }
      setVideoError(true);
      setErrorType(type);
    };

    if (videoElement) {
      videoElement.addEventListener("timeupdate", handleTimeUpdate);
      videoElement.addEventListener("error", handleError);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
        videoElement.removeEventListener("error", handleError);
      }
    };
  }, [
    onProgress,
    onEnded,
    playlistConfig,
    currentPlaylistIndex,
    playlistTotalDuration,
  ]);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handlePlay = () => {
      if (onPlay) {
        onPlay();
      }
      setIsPlaying(true);
      setIsLoading(false);
      resetControlTimeout();
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleLoadedData = () => {
      setIsLoading(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (onPause) {
        onPause();
      }
      resetControlTimeout();
    };

    const handleEnded = () => {
      if (playlistConfig?.items?.length) {
        return;
      }
      if (onEnded) {
        onEnded();
      }
    };

    const handleError = () => {
      // Detect error type from video element error code
      let type: "unsupported" | "network" | "decode" | "aborted" | "unknown" =
        "unknown";
      if (videoElement?.error) {
        switch (videoElement.error.code) {
          case 1: // MEDIA_ERR_ABORTED
            type = "aborted";
            break;
          case 2: // MEDIA_ERR_NETWORK
            type = "network";
            break;
          case 3: // MEDIA_ERR_DECODE
            type = "decode";
            break;
          case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
            type = "unsupported";
            break;
          default:
            type = "unknown";
        }
      }
      setVideoError(true);
      setErrorType(type);
      setIsLoading(false);
      if (onError) {
        onError();
      }
    };

    const handleSeeked = () => {
      if (onSeeked) {
        onSeeked(videoElement?.currentTime || 0);
      }
    };

    const handleSeeking = () => {
      if (onSeeking) {
        onSeeking(videoElement?.currentTime || 0);
      }
    };

    const handleVolumeChange = () => {
      if (onVolumeChange) {
        onVolumeChange(videoElement?.volume || 1);
      }
    };

    const handleFullscreenChange = () => {
      try {
        const fs = !!document.fullscreenElement;
        if (onFullscreenChange) onFullscreenChange(fs);
        setIsFullscreen(fs);
      } catch (err) {
        console.warn("Error handling fullscreen change", err);
      }
    };

    const handlePictureInPictureChange = () => {
      try {
        const pip = !!document.pictureInPictureElement;
        if (onPictureInPictureChange) onPictureInPictureChange(pip);
      } catch (err) {
        console.warn("Error handling PiP change", err);
      }
    };

    if (videoElement) {
      videoElement.addEventListener("play", handlePlay);
      videoElement.addEventListener("pause", handlePause);
      videoElement.addEventListener("ended", handleEnded);
      videoElement.addEventListener("error", handleError);
      videoElement.addEventListener("seeked", handleSeeked);
      videoElement.addEventListener("seeking", handleSeeking);
      videoElement.addEventListener("volumechange", handleVolumeChange);
      videoElement.addEventListener("loadstart", handleLoadStart);
      videoElement.addEventListener("canplay", handleCanPlay);
      videoElement.addEventListener("loadeddata", handleLoadedData);
      document.addEventListener("fullscreenchange", handleFullscreenChange);
      // attach PiP listeners only if supported
      try {
        if (typeof videoElement.requestPictureInPicture === "function") {
          videoElement.addEventListener(
            "enterpictureinpicture",
            handlePictureInPictureChange,
          );
          videoElement.addEventListener(
            "leavepictureinpicture",
            handlePictureInPictureChange,
          );
        }
      } catch {
        // ignore event listener attach failures
      }
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("play", handlePlay);
        videoElement.removeEventListener("pause", handlePause);
        videoElement.removeEventListener("ended", handleEnded);
        videoElement.removeEventListener("error", handleError);
        videoElement.removeEventListener("seeked", handleSeeked);
        videoElement.removeEventListener("seeking", handleSeeking);
        videoElement.removeEventListener("volumechange", handleVolumeChange);
        videoElement.removeEventListener("loadstart", handleLoadStart);
        videoElement.removeEventListener("canplay", handleCanPlay);
        videoElement.removeEventListener("loadeddata", handleLoadedData);
        document.removeEventListener(
          "fullscreenchange",
          handleFullscreenChange,
        );
        try {
          videoElement.removeEventListener(
            "enterpictureinpicture",
            handlePictureInPictureChange,
          );
          videoElement.removeEventListener(
            "leavepictureinpicture",
            handlePictureInPictureChange,
          );
        } catch {
          // ignore
        }
      }
    };
  }, [
    onPlay,
    onPause,
    onEnded,
    onError,
    onSeeked,
    onSeeking,
    onVolumeChange,
    onFullscreenChange,
    onPictureInPictureChange,
    resetControlTimeout,
    autoPlay,
    muted,
    isPreviewEnabled,
    maxAutoPlayDuration,
    playlistConfig?.items?.length,
  ]);

  useEffect(() => {
    if (getVideoRef) {
      getVideoRef(videoRef.current);
    }
  }, [getVideoRef, videoRef]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && shouldLoadMedia) {
      let srcToLoad = src;
      let sourcesToLoad = sources;
      let startTime = 0;

      // If playlist is active, use current playlist item
      if (
        playlistConfig &&
        playlistConfig.items.length > 0 &&
        currentPlaylistIndex >= 0 &&
        currentPlaylistIndex < playlistConfig.items.length
      ) {
        const currentItem = playlistConfig.items[currentPlaylistIndex];
        srcToLoad = currentItem.src;
        sourcesToLoad = undefined; // single src from playlist
        startTime = currentItem.start || 0;
      }

      if (srcToLoad || sourcesToLoad?.length) {
        if (srcToLoad) {
          videoElement.src = srcToLoad;
        }
        videoElement.load();
        if (startTime > 0) {
          videoElement.currentTime = startTime;
        }
        if (videoElement.error) {
          setVideoError(true);
        } else {
          setVideoError(false);
        }
      }
    }
  }, [src, sources, shouldLoadMedia, playlistConfig, currentPlaylistIndex]);

  useEffect(() => {
    if (!isPreviewEnabled || !videoRef.current || !duration || !previewDuration)
      return;
    const vid = videoRef.current;
    const maxStart = Math.max(0, duration - previewDuration);
    let start = 0;
    if (previewMode === "random") {
      start = Math.random() * maxStart;
    } else {
      const s = typeof previewStart === "number" ? previewStart : 0;
      start = Math.min(Math.max(0, s), maxStart);
    }
    previewStartRef.current = start;
    const stopAt = Math.min(duration, start + previewDuration);
    previewStopRef.current = stopAt;
    try {
      vid.currentTime = start;
    } catch {
      /* ignore seek errors */
    }

    const onTime = () => {
      try {
        if (vid.currentTime >= stopAt) {
          if (previewLoop) {
            if (previewMode === "random") {
              const nextStart =
                Math.random() * Math.max(0, duration - previewDuration);
              previewStartRef.current = nextStart;
              previewStopRef.current = nextStart + previewDuration;
              vid.currentTime = nextStart;
              vid.play().catch(() => {});
            } else {
              vid.currentTime = start;
              vid.play().catch(() => {});
            }
          } else {
            vid.pause();
          }
        }
      } catch {
        /* ignore */
      }
    };

    vid.addEventListener("timeupdate", onTime);
    vid.play().catch(() => {});

    return () => {
      try {
        vid.removeEventListener("timeupdate", onTime);
      } catch {
        /* ignore */
      }
    };
  }, [
    isPreviewEnabled,
    previewMode,
    previewDuration,
    previewStart,
    previewLoop,
    duration,
    src,
  ]);

  const fetchSubtitleBlobUrl = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      let blob = await response.blob();

      if (url.endsWith(".srt")) {
        const srtText = await blob.text();
        const vttText =
          "WEBVTT\n\n" +
          srtText
            .replace(
              /(\d+)\n(\d{2}:\d{2}:\d{2}),(\d{3}) --> (\d{2}:\d{2}:\d{2}),(\d{3})/g,
              "$1\n$2.$3 --> $4.$5",
            )
            .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2");
        blob = new Blob([vttText], { type: "text/vtt" });
      }
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error fetching subtitle:", error);
      return "";
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && tracks?.length && src) {
      Array.from(videoElement.querySelectorAll("track")).forEach((t) =>
        t.remove(),
      );

      const blobUrls: string[] = [];
      let cancelled = false;

      (async () => {
        try {
          for (const track of tracks) {
            if (cancelled) break;
            const trackBlobUrl = await fetchSubtitleBlobUrl(track.src);
            if (!trackBlobUrl) continue;
            if (cancelled) {
              try {
                URL.revokeObjectURL(trackBlobUrl);
              } catch {
                /* ignore */
              }
              break;
            }
            blobUrls.push(trackBlobUrl);
            const trackElement = document.createElement("track");
            trackElement.src = trackBlobUrl;
            trackElement.kind = track.kind;
            trackElement.label = track.label;
            trackElement.srclang = track.srclang;
            videoElement.appendChild(trackElement);
            // small pause to allow browser to register track
            await new Promise((r) => setTimeout(r, 50));
          }

          // Wait a few short attempts for textTracks to populate
          const maxAttempts = 5;
          let attempts = 0;
          while (
            !cancelled &&
            attempts < maxAttempts &&
            videoElement.textTracks.length === 0
          ) {
            await new Promise((r) => setTimeout(r, 100));
            attempts += 1;
          }

          const trackList = Array.from(videoElement.textTracks);
          setAvailableTracks(trackList);

          trackList.forEach((t) => (t.mode = "disabled"));
          trackList.forEach((t) => {
            const config = tracks.find((tr) => tr.label === t.label);
            if (config?.default) {
              t.mode = "showing";
              setCurrentTrack(t);
              if (onTrackChange) onTrackChange(t);
            }
          });
        } catch (err) {
          console.warn("Error attaching tracks", err);
        }
      })();

      const handleTracksLoaded = () => {
        const trackList = Array.from(videoElement.textTracks);
        setAvailableTracks(trackList);
      };

      videoElement.addEventListener("loadedmetadata", handleTracksLoaded);
      return () => {
        cancelled = true;
        videoElement.removeEventListener("loadedmetadata", handleTracksLoaded);
        blobUrls.forEach((url) => {
          try {
            URL.revokeObjectURL(url);
          } catch {
            // ignore
          }
        });
      };
    }
  }, [tracks, onTrackChange, src]);

  const handleTrackChange = (track: TextTrack | null) => {
    // Disable all tracks first
    availableTracks.forEach((t) => {
      t.mode = "disabled";
    });

    // Enable selected track
    if (track) {
      track.mode = "showing";
      setCurrentTrack(track);
      if (onTrackChange) onTrackChange(track);
    } else {
      setCurrentTrack(null);
      if (onTrackChange) onTrackChange(null);
    }
    resetControlTimeout();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    resetControlTimeout();
  };

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (playlistConfig && playlistConfig.items.length > 0) {
      // Map aggregated time to playlist item
      const durations = playlistItemDurationsRef.current;
      let cumulative = 0;
      for (let i = 0; i < playlistConfig.items.length; i++) {
        const d = durations[i] || 0;
        if (
          newTime <= cumulative + d ||
          i === playlistConfig.items.length - 1
        ) {
          const within = Math.max(0, newTime - cumulative);
          const item = playlistConfig.items[i];
          const seekTo = (item.start || 0) + within;
          if (i === currentPlaylistIndex) {
            if (videoRef.current) videoRef.current.currentTime = seekTo;
          } else {
            pendingSeekRef.current = { index: i, time: within };
            pendingPlayAfterSourceChangeRef.current = isPlaying;
            setCurrentPlaylistIndex(i);
          }
          setCurrentTime(newTime);
          updateRangeBackground(
            timelineInputRef.current,
            newTime,
            playlistTotalDuration || 0,
          );
          if (onProgress) onProgress(newTime, playlistTotalDuration || 0);
          break;
        }
        cumulative += d;
      }
    } else {
      if (videoRef.current) {
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      }
    }
    resetControlTimeout();
  };

  const handleSpeedChange = useCallback(
    (rate: number) => {
      setPlaybackRate(rate);
      if (videoRef.current) {
        videoRef.current.playbackRate = rate;
        if (onPlaybackRateChange) onPlaybackRateChange(rate);
      }
      resetControlTimeout();
    },
    [resetControlTimeout, onPlaybackRateChange],
  );

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        // Check if playlist has ended and needs to restart from the beginning
        if (
          playlistConfig &&
          playlistConfig.items.length > 0 &&
          currentPlaylistIndex === playlistConfig.items.length - 1 &&
          videoRef.current.ended
        ) {
          // Reset to first item and play
          setCurrentPlaylistIndex(0);
          videoRef.current.currentTime = 0;
        }
        const playResult = videoRef.current.play();
        setIsPlaying(true);
        if (playResult && typeof playResult.catch === "function") {
          playResult.catch(() => setIsPlaying(false));
        } else {
          // no-op for browsers that do not return a play promise
        }
      }
      resetControlTimeout();
    }
  }, [resetControlTimeout, isPlaying, playlistConfig, currentPlaylistIndex]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    const currentlyMuted = isMuted;
    if (!currentlyMuted) {
      lastVolumeRef.current = volume || lastVolumeRef.current || 1;
      videoRef.current.muted = true;
      setIsMuted(true);
      setVolume(0);
      updateRangeBackground(volumeInputRef.current, 0, 1);
      if (onMuteChange) onMuteChange(true);
    } else {
      const restore = lastVolumeRef.current || 1;
      videoRef.current.muted = false;
      setIsMuted(false);
      setVolume(restore);
      updateRangeBackground(volumeInputRef.current, restore, 1);
      if (onMuteChange) onMuteChange(false);
    }
    resetControlTimeout();
  }, [isMuted, resetControlTimeout, volume, onMuteChange]);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      if (videoContainerRef.current) {
        try {
          if (videoContainerRef.current.requestFullscreen) {
            // prefer requestFullscreen; guard with promise catch
            const p = videoContainerRef.current.requestFullscreen();
            if (p && typeof (p as Promise<unknown>).catch === "function") {
              (p as Promise<unknown>).catch((err: unknown) => {
                console.warn("requestFullscreen failed", err);
              });
            }
            setIsFullscreen(true);
          } else {
            console.warn("Fullscreen is not supported by this browser.");
          }
        } catch (err) {
          console.warn("Error requesting fullscreen", err);
        }
      }
    } else {
      try {
        if (document.exitFullscreen) {
          const p = document.exitFullscreen();
          if (p && typeof (p as Promise<unknown>).catch === "function") {
            (p as Promise<unknown>).catch((err: unknown) => {
              console.warn("exitFullscreen failed", err);
            });
          }
          setIsFullscreen(false);
        } else {
          console.warn("Exiting fullscreen is not supported by this browser.");
        }
      } catch (err) {
        console.warn("Error exiting fullscreen", err);
      }
    }
    resetControlTimeout();
  }, [isFullscreen, resetControlTimeout]);

  const skipTime = useCallback(
    (seconds: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime += seconds;
        setCurrentTime(videoRef.current.currentTime);
        resetControlTimeout();
      }
    },
    [resetControlTimeout],
  );

  const togglePictureInPicture = useCallback(async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        const p = document.exitPictureInPicture();
        if (p && typeof (p as Promise<unknown>).catch === "function") {
          (p as Promise<unknown>).catch((err: unknown) => {
            console.warn("exitPictureInPicture failed", err);
          });
        }
      } else {
        const maybePip = videoRef.current as HTMLVideoElement & {
          requestPictureInPicture?: () => Promise<unknown>;
        };
        if (typeof maybePip.requestPictureInPicture === "function") {
          const p = maybePip.requestPictureInPicture();
          if (p && typeof p.catch === "function")
            p.catch((err: unknown) =>
              console.warn("requestPictureInPicture failed", err),
            );
        } else {
          console.warn("Picture-in-Picture is not supported by this browser.");
        }
      }
    } catch (err) {
      console.warn("Error toggling Picture-in-Picture", err);
    } finally {
      resetControlTimeout();
    }
  }, [resetControlTimeout]);

  const handleVideoClick = (
    e: React.MouseEvent<HTMLDivElement | HTMLVideoElement>,
  ) => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === "BUTTON" ||
      target.tagName === "INPUT" ||
      target.closest("button") ||
      target.closest("input")
    ) {
      return;
    }
    setShowControls((prev) => !prev);
  };

  const handleVideoDoubleClick = (
    e: React.MouseEvent<HTMLDivElement | HTMLVideoElement>,
  ) => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === "BUTTON" ||
      target.tagName === "INPUT" ||
      target.closest("button") ||
      target.closest("input")
    ) {
      return;
    }
    if (doubleClickToFullscreen) return toggleFullscreen();
    togglePlay();
  };

  const handleTimelineMouseMove = async (
    e: React.MouseEvent<HTMLInputElement>,
  ) => {
    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const position = e.clientX - rect.left;
    const percentage = position / rect.width;
    const effectiveDuration = duration || 0;
    const time = effectiveDuration * percentage;
    setHoverTime(time);
    setHoverPosition(position);
  };

  const handleTimelineMouseLeave = () => {
    setHoverTime(null);
    setHoverPosition(null);
  };

  useEffect(() => {
    if (hoverTime !== null && hoverPosition !== null) {
      const tooltip = document.querySelector(".timeline-tooltip");
      if (tooltip) {
        setTooltipWidth(tooltip.clientWidth);
      }
    }
  }, [hoverTime, hoverPosition]);

  useEffect(() => {
    playbackRateRef.current = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    if (disableShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.tagName === "BUTTON" ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          skipTime(10);
          break;
        case "ArrowLeft":
          e.preventDefault();
          skipTime(-10);
          break;
        case "ArrowUp":
          e.preventDefault();
          setVolume((prevVolume) => {
            if (prevVolume === 0) {
              setIsMuted(false);
            }
            return Math.min(prevVolume + 0.1, 1);
          });
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume((prevVolume) => {
            const newVolume = Math.max(prevVolume - 0.1, 0);
            if (newVolume === 0) {
              setIsMuted(true);
            }
            return newVolume;
          });
          break;
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "m":
        case "M":
          e.preventDefault();
          toggleMute();
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "p":
        case "P":
          e.preventDefault();
          togglePictureInPicture();
          break;
        case "s":
        case "S": {
          e.preventDefault();
          const current = playbackRateRef.current || 1;
          const speedRate =
            current === 1
              ? 1.25
              : current === 1.25
                ? 1.5
                : current === 1.5
                  ? 1.75
                  : current === 1.75
                    ? 2
                    : current === 2
                      ? 0.25
                      : current === 0.25
                        ? 0.5
                        : current === 0.5
                          ? 0.75
                          : 1;
          handleSpeedChange(speedRate);
          if (onPlaybackRateChange) onPlaybackRateChange(speedRate);
          break;
        }
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    disableShortcuts,
    handleSpeedChange,
    skipTime,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    togglePictureInPicture,
    onPlaybackRateChange,
  ]);

  useEffect(() => {
    if (isPlaying) {
      controlTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    } else {
      setShowControls(true);
    }
    return () => {
      if (controlTimeoutRef.current) {
        clearTimeout(controlTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    const videoContainer = videoContainerRef.current;
    const handleResize = () => {
      if (videoContainer) {
        setContainerWidth(videoContainer.offsetWidth);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (videoContainer) {
      resizeObserver.observe(videoContainer);
    }

    handleResize();

    return () => {
      if (videoContainer) {
        resizeObserver.unobserve(videoContainer);
      }
    };
  }, []);

  const downloadVideo = async (url: string, type = "mp4") => {
    if (isDownloading) return;
    if (onDownloadStart) onDownloadStart();
    try {
      setIsDownloading(true);
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const ext = type || url.split(".").pop() || "mp4";
      const filename = `${Math.random().toString(36).substring(2, 9)}.${ext}`;
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => {
        try {
          URL.revokeObjectURL(objectUrl);
        } catch {
          /* ignore */
        }
      }, 1000);
      setIsDownloading(false);
      if (onDownloadEnd) onDownloadEnd(true);
    } catch (error) {
      console.error(error);
      setIsDownloading(false);
      if (onDownloadEnd) onDownloadEnd(false);
      alert("An error occurred while trying to download the video.");
    }
  };

  const handleDownloadClick = () => {
    if (src) {
      downloadVideo(src);
    }
  };

  const handleSourceDownloadClick = (sourceUrl: string, type: string) => {
    downloadVideo(sourceUrl, type == "quicktime" ? "mov" : type);
  };

  return (
    <div
      ref={videoContainerRef}
      style={
        {
          "--accent-color": accentColor,
          width,
          height,
          boxSizing: "border-box",
          minHeight: "180px",
          ...style,
        } as CSSProperties
      }
      className={`video-player-wrapper ${className || ""} ${
        isFullscreen ? "fullscreen-container" : ""
      }`}
    >
      <div
        className={`control-relative ${isFullscreen ? "fullscreen-video" : ""}`}
      >
        <video
          src={
            shouldLoadMedia && !sources?.length
              ? (playlistConfig?.items.length
                  ? playlistConfig.items[currentPlaylistIndex]?.src
                  : src)
              : undefined
          }
          ref={videoRef}
          {...(className && { className })}
          onClick={handleVideoClick}
          onDoubleClick={
            disableDoubleClick ? undefined : handleVideoDoubleClick
          }
          id="video"
          autoPlay={autoPlay && !isPreviewEnabled && !maxAutoPlayDuration}
          muted={isMuted}
          loop={Boolean(
            loop && !(playlistConfig && playlistConfig.items.length > 0),
          )}
          playsInline={playsInline}
          poster={poster}
          preload={shouldLoadMedia ? preload : "none"}
          style={{
            objectFit: "contain",
            cursor: controls ? "pointer" : "default",
            minHeight: "180px",
            maxHeight: "100dvh",
            width,
            height,
            ...style,
          }}
          role="video"
        >
          {shouldLoadMedia &&
            sources &&
            sources.map(({ src, type }) => (
              <source key={src} src={src} type={type} />
            ))}
        </video>

        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          </div>
        )}

        {videoError ||
        (!src && !sources?.length && !playlistConfig?.items.length) ? (
          <div className="error-overlay">
            <div className="error-message">
              {icons.error ?? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                </svg>
              )}
              <span>
                <strong>Error:</strong>{" "}
                {!src && !sources?.length && !playlistConfig?.items.length
                  ? "Please provide a video source URL, sources array, or playlist."
                  : errorType === "unsupported"
                    ? "This video format is not supported by your browser. You can download it and play it on your device."
                    : errorType === "network"
                      ? "A network error occurred while trying to load the video. Please check your connection."
                      : errorType === "decode"
                        ? "The video could not be decoded. The format might not be supported."
                        : customErrorMessage}
              </span>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "10px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {(src || sources?.length || playlistConfig?.items.length) && (
                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.load();
                        setVideoError(false);
                        setErrorType(null);
                      }
                    }}
                    className="error-reload-button"
                  >
                    Reload
                  </button>
                )}
                {(errorType === "unsupported" ||
                  errorType === "decode" ||
                  errorType === "unknown") &&
                  (src || sources?.length) && (
                    <button
                      onClick={handleDownloadClick}
                      disabled={isDownloading}
                      className="error-download-button"
                      style={{
                        padding: "8px 16px",
                        backgroundColor: accentColor,
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: isDownloading ? "not-allowed" : "pointer",
                        opacity: isDownloading ? 0.6 : 1,
                      }}
                    >
                      {isDownloading ? "Downloading..." : "Download Video"}
                    </button>
                  )}
              </div>
            </div>
          </div>
        ) : controls ? (
          <div
            className={`controls ${
              showControls ? "show-controls" : "hide-controls"
            }`}
            onClick={handleVideoClick}
            onDoubleClick={
              disableDoubleClick ? undefined : handleVideoDoubleClick
            }
          >
            <div>
              <div
                className={`
                    ${containerWidth < 400 ? "hide-control" : "show-control"}`}
              >
                {!controlsToExclude.includes("center-playPause-button") && (
                  <button
                    onClick={togglePlay}
                    className="center-playPause-button accent-color"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {!isPlaying
                      ? getIcon(
                          "play",
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="6 3 20 12 6 21 6 3" />
                          </svg>,
                        )
                      : getIcon(
                          "pause",
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                          </svg>,
                        )}
                  </button>
                )}
              </div>
              <div
                className={`
                    ${containerWidth < 400 ? "show-control" : "hide-control"}`}
              >
                <span className="mobile-controls-wrapper">
                  {!controlsToExclude.includes("skip-forward-backward") && (
                    <button
                      onClick={() => skipTime(-10)}
                      className="skip-forward-backward accent-color-hover"
                      aria-label="Rewind 10 seconds"
                    >
                      {getIcon(
                        "rewind",
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          fill="currentColor"
                        >
                          <path d="M12 2C17.5228 2 22 6.47715 22 12 22 17.5228 17.5228 22 12 22 6.47715 22 2 17.5228 2 12H4C4 16.4183 7.58172 20 12 20 16.4183 20 20 16.4183 20 12 20 7.58172 16.4183 4 12 4 9.25022 4 6.82447 5.38734 5.38451 7.50024L8 7.5V9.5H2V3.5H4L3.99989 5.99918C5.82434 3.57075 8.72873 2 12 2ZM15.5 13.25C15.5 13.8023 15.0523 14.25 14.5 14.25 13.9477 14.25 13.5 13.8023 13.5 13.25V10.75C13.5 10.1977 13.9477 9.75 14.5 9.75 15.0523 9.75 15.5 10.1977 15.5 10.75V13.25ZM14.5 8.25C13.1193 8.25 12 9.36929 12 10.75V13.25C12 14.6307 13.1193 15.75 14.5 15.75 15.8807 15.75 17 14.6307 17 13.25V10.75C17 9.36929 15.8807 8.25 14.5 8.25ZM8.5 15.5V8.5H10V15.5H8.5Z"></path>
                        </svg>,
                      )}
                    </button>
                  )}
                  {!controlsToExclude.includes("center-playPause-button") && (
                    <button
                      onClick={togglePlay}
                      className="playPause accent-color"
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {!isPlaying
                        ? getIcon(
                            "play",
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polygon points="6 3 20 12 6 21 6 3" />
                            </svg>,
                          )
                        : getIcon(
                            "pause",
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="14" y="4" width="4" height="16" rx="1" />
                              <rect x="6" y="4" width="4" height="16" rx="1" />
                            </svg>,
                          )}
                    </button>
                  )}
                  {!controlsToExclude.includes("skip-forward-backward") && (
                    <button
                      onClick={() => skipTime(10)}
                      aria-label="Forward 10 seconds"
                      className="skip-forward-backward accent-color-hover"
                    >
                      {getIcon(
                        "forward",
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          height="24"
                          width="24"
                          fill="currentColor"
                        >
                          <path d="M12 2C6.47715 2 2 6.47715 2 12 2 17.5228 6.47715 22 12 22 17.5228 22 22 17.5228 22 12H20C20 16.4183 16.4183 20 12 20 7.58172 20 4 16.4183 4 12 4 7.58172 7.58172 4 12 4 14.7498 4 17.1755 5.38734 18.6155 7.50024L16 7.5V8.74982C15.5822 8.43597 15.0628 8.25 14.5 8.25 13.1193 8.25 12 9.36929 12 10.75V13.25C12 14.6307 13.1193 15.75 14.5 15.75 15.8807 15.75 17 14.6307 17 13.25V10.75C17 10.2946 16.8783 9.86772 16.6655 9.5H22V3.5H20L20.0001 5.99918C18.1757 3.57075 15.2713 2 12 2ZM15.5 10.75V13.25C15.5 13.8023 15.0523 14.25 14.5 14.25 13.9477 14.25 13.5 13.8023 13.5 13.25V10.75C13.5 10.1977 13.9477 9.75 14.5 9.75 15.0523 9.75 15.5 10.1977 15.5 10.75ZM10 8.5H8.5V15.5H10V8.5Z"></path>
                        </svg>,
                      )}
                    </button>
                  )}
                </span>
              </div>
            </div>
            <div className="all-controls">
              {!controlsToExclude.includes("progress") && (
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  step="any"
                  value={currentTime}
                  onChange={handleTimelineChange}
                  onMouseMove={handleTimelineMouseMove}
                  onMouseLeave={handleTimelineMouseLeave}
                  ref={timelineInputRef}
                  disabled={videoError}
                  className="accent-color-input timeline"
                  aria-label="Seek control"
                />
              )}
              {hoverTime !== null && hoverPosition !== null && (
                <div
                  className="timeline-tooltip accent-color"
                  style={{ left: hoverPosition - tooltipWidth / -4.7 }}
                >
                  {formatTime(hoverTime)}
                </div>
              )}
              <div className="all-controls-bottom">
                <div className="left-controls child-controls">
                  <span
                    className={`${
                      containerWidth < 400
                        ? "hide-control"
                        : "show-control-inline-flex"
                    }`}
                  >
                    {!controlsToExclude.includes("skip-forward-backward") && (
                      <button
                        onClick={() => skipTime(-10)}
                        disabled={videoError}
                        className={`buttons accent-color-hover`}
                        aria-label="Rewind 10 seconds"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          height="24"
                          width="24"
                          fill="currentColor"
                        >
                          <path d="M12 2C17.5228 2 22 6.47715 22 12 22 17.5228 17.5228 22 12 22 6.47715 22 2 17.5228 2 12H4C4 16.4183 7.58172 20 12 20 16.4183 20 20 16.4183 20 12 20 7.58172 16.4183 4 12 4 9.25022 4 6.82447 5.38734 5.38451 7.50024L8 7.5V9.5H2V3.5H4L3.99989 5.99918C5.82434 3.57075 8.72873 2 12 2ZM15.5 13.25C15.5 13.8023 15.0523 14.25 14.5 14.25 13.9477 14.25 13.5 13.8023 13.5 13.25V10.75C13.5 10.1977 13.9477 9.75 14.5 9.75 15.0523 9.75 15.5 10.1977 15.5 10.75V13.25ZM14.5 8.25C13.1193 8.25 12 9.36929 12 10.75V13.25C12 14.6307 13.1193 15.75 14.5 15.75 15.8807 15.75 17 14.6307 17 13.25V10.75C17 9.36929 15.8807 8.25 14.5 8.25ZM8.5 15.5V8.5H10V15.5H8.5Z"></path>
                        </svg>
                      </button>
                    )}
                    {!controlsToExclude.includes("bottom-playPause-button") && (
                      <button
                        onClick={togglePlay}
                        disabled={videoError}
                        className={`buttons accent-color-hover`}
                        aria-label={isPlaying ? "Pause" : "Play"}
                      >
                        {!isPlaying ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="6 3 20 12 6 21 6 3" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                          </svg>
                        )}
                      </button>
                    )}
                    {!controlsToExclude.includes("skip-forward-backward") && (
                      <button
                        onClick={() => skipTime(10)}
                        disabled={videoError}
                        className={`buttons accent-color-hover`}
                        aria-label="Forward 10 seconds"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          height="24"
                          width="24"
                          fill="currentColor"
                        >
                          <path d="M12 2C6.47715 2 2 6.47715 2 12 2 17.5228 6.47715 22 12 22 17.5228 22 22 17.5228 22 12H20C20 16.4183 16.4183 20 12 20 7.58172 20 4 16.4183 4 12 4 7.58172 7.58172 4 12 4 14.7498 4 17.1755 5.38734 18.6155 7.50024L16 7.5V8.74982C15.5822 8.43597 15.0628 8.25 14.5 8.25 13.1193 8.25 12 9.36929 12 10.75V13.25C12 14.6307 13.1193 15.75 14.5 15.75 15.8807 15.75 17 14.6307 17 13.25V10.75C17 10.2946 16.8783 9.86772 16.6655 9.5H22V3.5H20L20.0001 5.99918C18.1757 3.57075 15.2713 2 12 2ZM15.5 10.75V13.25C15.5 13.8023 15.0523 14.25 14.5 14.25 13.9477 14.25 13.5 13.8023 13.5 13.25V10.75C13.5 10.1977 13.9477 9.75 14.5 9.75 15.0523 9.75 15.5 10.1977 15.5 10.75ZM10 8.5H8.5V15.5H10V8.5Z"></path>
                        </svg>
                      </button>
                    )}
                  </span>
                  <button
                    className="current-time-duration accent-color-hover"
                    onClick={() => setReverseCurrentTime(!reverseCurrentTime)}
                  >
                    {!controlsToExclude.includes("current-time") && (
                      <span className="show-control-inline-flex">
                        {reverseCurrentTime
                          ? formatTime(Math.max(duration - currentTime, 0))
                          : formatTime(currentTime)}
                      </span>
                    )}
                    {!controlsToExclude.includes("duration") &&
                      !controlsToExclude.includes("current-time") && (
                        <span
                          className={`${
                            containerWidth < 160
                              ? "hide-control"
                              : "show-control-inline-flex"
                          }`}
                        >
                          /
                        </span>
                      )}
                    {!controlsToExclude.includes("duration") && (
                      <span
                        className={`${
                          containerWidth < 160
                            ? "hide-control"
                            : "show-control-inline-flex"
                        }`}
                      >
                        {formatTime(duration)}
                      </span>
                    )}
                  </button>
                  {!controlsToExclude.includes("mute") && (
                    <button
                      onClick={toggleMute}
                      disabled={videoError}
                      className={`buttons accent-color-hover`}
                      aria-label={isMuted || muted ? "Unmute" : "Mute"}
                    >
                      {isMuted
                        ? getIcon(
                            "mute",
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
                              <line x1="22" x2="16" y1="9" y2="15" />
                              <line x1="16" x2="22" y1="9" y2="15" />
                            </svg>,
                          )
                        : getIcon(
                            "unmute",
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
                              <path d="M16 9a5 5 0 0 1 0 6" />
                              <path d="M19.364 18.364a9 9 0 0 0 0-12.728" />
                            </svg>,
                          )}
                    </button>
                  )}
                  {!controlsToExclude.includes("volume") && (
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="any"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      disabled={videoError}
                      ref={volumeInputRef}
                      className={`volume-slider accent-color-input ${
                        containerWidth < 300 ? "hide-control" : "show-control"
                      }`}
                      aria-label="Volume control"
                    />
                  )}
                </div>
                <div className="child-controls right-controls">
                  {!controlsToExclude.includes("playbackRate") && (
                    <div
                      className={`control-relative color-white ${
                        containerWidth < 180
                          ? "hide-control"
                          : "show-control-inline-flex"
                      }`}
                    >
                      <Select
                        items={[
                          ...playbackRateOptions.map((rate) => ({
                            value: rate,
                            label: `${rate}x`,
                          })),
                          ...(defaultPlaybackRate &&
                          !playbackRateOptions.includes(defaultPlaybackRate)
                            ? [
                                {
                                  value: defaultPlaybackRate,
                                  label: `${defaultPlaybackRate}x`,
                                },
                              ]
                            : []),
                        ].sort(
                          (a, b) => parseFloat(a.label) - parseFloat(b.label),
                        )}
                        value={playbackRate}
                        ariaLabel="Playback speed"
                        defaultLabel={`${playbackRate}x`}
                        onClick={(value) => {
                          const newPlaybackRate = Math.min(
                            Math.max(Number(value) || 1, 0.0625),
                            16,
                          );
                          handleSpeedChange(newPlaybackRate);
                        }}
                        key={playbackRate}
                      />
                    </div>
                  )}
                  {!ios && !controlsToExclude.includes("pip") && (
                    <button
                      onClick={togglePictureInPicture}
                      disabled={videoError}
                      className={`buttons accent-color-hover ${
                        containerWidth < 228 ? "hide-control" : ""
                      }`}
                      aria-label="Picture-in-picture"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 10h6V4" />
                        <path d="m2 4 6 6" />
                        <path d="M21 10V7a2 2 0 0 0-2-2h-7" />
                        <path d="M3 14v2a2 2 0 0 0 2 2h3" />
                        <rect x="12" y="14" width="10" height="7" rx="1" />
                      </svg>
                    </button>
                  )}
                  {!controlsToExclude.includes("captions") && tracks && (
                    <div
                      className={`control-relative color-white ${
                        containerWidth < 439 &&
                        (containerWidth > 400 || containerWidth < 340)
                          ? "hide-control"
                          : "show-control-inline-flex"
                      }`}
                    >
                      <Dropdown
                        items={[
                          {
                            label: "Off",
                            onClick: () => handleTrackChange(null),
                          },
                          ...availableTracks.map((track) => ({
                            label: track.label,
                            onClick: () => handleTrackChange(track),
                          })),
                        ]}
                        tickSelected
                        ariaLabel="Captions"
                        buttonLabel={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill={currentTrack ? accentColor : "currentColor"}
                            width="30"
                            height="30"
                            className="accent-color-hover-cc buttons accent-color-hover"
                          >
                            <path d="M21 3C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H21ZM20 5H4V19H20V5ZM9 8C10.1045 8 11.1049 8.44841 11.829 9.173L10.4153 10.5866C10.0534 10.2241 9.55299 10 9 10C7.895 10 7 10.895 7 12C7 13.105 7.895 14 9 14C9.5525 14 10.0525 13.7762 10.4144 13.4144L11.828 14.828C11.104 15.552 10.104 16 9 16C6.792 16 5 14.208 5 12C5 9.792 6.792 8 9 8ZM16 8C17.1045 8 18.1049 8.44841 18.829 9.173L17.4153 10.5866C17.0534 10.2241 16.553 10 16 10C14.895 10 14 10.895 14 12C14 13.105 14.895 14 16 14C16.5525 14 17.0525 13.7762 17.4144 13.4144L18.828 14.828C18.104 15.552 17.104 16 16 16C13.792 16 12 14.208 12 12C12 9.792 13.792 8 16 8Z"></path>
                          </svg>
                        }
                        defaultSelectedLabel={currentTrack?.label || "Off"}
                      />
                    </div>
                  )}
                  {!controlsToExclude.includes("fullscreen") && (
                    <button
                      onClick={toggleFullscreen}
                      disabled={videoError}
                      className={`buttons accent-color-hover ${
                        containerWidth < 120 ? "hide-control" : ""
                      }`}
                      aria-label={
                        isFullscreen ? "Exit fullscreen" : "Fullscreen"
                      }
                    >
                      {!isFullscreen
                        ? getIcon(
                            "fullscreen",
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                              <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                              <rect width="10" height="8" x="7" y="8" rx="1" />
                            </svg>,
                          )
                        : getIcon(
                            "exitFullscreen",
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                              <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                              <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                              <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                            </svg>,
                          )}
                    </button>
                  )}
                </div>
              </div>
            </div>
            {showDownloadButton && (
              <div className="download-button-wrapper">
                {src && !sources ? (
                  <button
                    onClick={handleDownloadClick}
                    className="download-button accent-color"
                    aria-label="Download video"
                    disabled={isDownloading}
                  >
                    {!isDownloading ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" x2="12" y1="15" y2="3" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="downloading"
                      >
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                        <path d="M21 3v5h-5" />
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                        <path d="M8 16H3v5" />
                      </svg>
                    )}
                  </button>
                ) : (
                  sources && (
                    <Dropdown
                      items={
                        sources?.map(({ src, type }) => ({
                          label: type.split("/")[1].toUpperCase(),
                          onClick: () =>
                            handleSourceDownloadClick(src, type.split("/")[1]),
                        })) || []
                      }
                      ariaLabel="Download video"
                      buttonClassName="download-button accent-color"
                      disabled={isDownloading}
                      buttonLabel={
                        !isDownloading ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" x2="12" y1="15" y2="3" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="downloading"
                          >
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                            <path d="M21 3v5h-5" />
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                            <path d="M8 16H3v5" />
                          </svg>
                        )
                      }
                    />
                  )
                )}
              </div>
            )}
          </div>
        ) : (
          showDownloadButton && (
            <div className="download-button-wrapper-bottom">
              {src && !sources ? (
                <button
                  onClick={handleDownloadClick}
                  className="download-button accent-color"
                  aria-label="Download video"
                  disabled={isDownloading}
                >
                  {!isDownloading ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" x2="12" y1="15" y2="3" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="downloading"
                    >
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                      <path d="M21 3v5h-5" />
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                      <path d="M8 16H3v5" />
                    </svg>
                  )}
                </button>
              ) : (
                sources && (
                  <Dropdown
                    items={
                      sources.map(({ src, type }) => ({
                        label: type.split("/")[1].toUpperCase(),
                        onClick: () =>
                          handleSourceDownloadClick(
                            src,
                            type.split("/")[1] || "mp4",
                          ),
                      })) || []
                    }
                    ariaLabel="Download video"
                    buttonClassName="download-button accent-color"
                    disabled={isDownloading}
                    buttonLabel={
                      !isDownloading ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" x2="12" y1="15" y2="3" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="downloading"
                        >
                          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                          <path d="M21 3v5h-5" />
                          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                          <path d="M8 16H3v5" />
                        </svg>
                      )
                    }
                  />
                )
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
