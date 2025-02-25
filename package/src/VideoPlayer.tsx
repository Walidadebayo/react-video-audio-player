"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  CSSProperties,
} from "react";
import { formatTime } from "./utils";
import Select from "./components/Select";
import Dropdown from "./components/Dropdown";
import "./video-audio-player.css";
import { updateRangeBackground } from "./utils";

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
  poster = "",
  width = "100%",
  height = "100%",
  className = "",
  style = {},
  preload = "auto",
  seekTo,
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
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const controlTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [duration, setDuration] = useState(0);
  const [ios, setIos] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const timelineInputRef = useRef<HTMLInputElement>(null);
  const volumeInputRef = useRef<HTMLInputElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [tooltipWidth, setTooltipWidth] = useState<number>(0);
  const [reverseCurrentTime, setReverseCurrentTime] = useState(false);
  const [availableTracks, setAvailableTracks] = useState<TextTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<TextTrack | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
        setIos(true);
      }
    }
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      setIsMuted(muted);
      setVolume(muted ? 0 : 1);
    }
  }, [muted]);

  useEffect(() => {
    if (seekTo && videoRef.current) {
      videoRef.current.currentTime = seekTo;
      updateRangeBackground(
        timelineInputRef.current,
        seekTo,
        videoRef.current.duration
      );
    }
  }, [seekTo]);

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
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume, videoRef]);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleLoadedMetadata = () => {
      const duration = videoElement?.duration || 0;
      setDuration(duration);
      if (onReady) {
        onReady();
      }
      if (onDuration) {
        onDuration(duration);
      }
    };

    if (videoElement) {
      videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
      }
    };
  }, [onReady, onDuration]);

  useEffect(() => {
    const timelineInput = timelineInputRef.current;
    if (currentTime !== 0) {
      updateRangeBackground(timelineInput);
    }
  }, [currentTime, seekTo, timelineInputRef]);

  useEffect(() => {
    const volumeInput = volumeInputRef.current;
    updateRangeBackground(volumeInput);
  }, [volume]);

  useEffect(() => {
    const videoElement = videoRef.current;
    const handleTimeUpdate = () => {
      if (videoElement) {
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
      setVideoError(true);
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
  }, [onProgress, onEnded]);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handlePlay = () => {
      if (onPlay) {
        onPlay();
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (onPause) {
        onPause();
      }
    };

    const handleEnded = () => {
      if (onEnded) {
        onEnded();
      }
    };

    const handleError = () => {
      setVideoError(true);
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
      if (onFullscreenChange) {
        onFullscreenChange(!!document.fullscreenElement);
        setIsFullscreen(!!document.fullscreenElement);
      }
    };

    const handlePictureInPictureChange = () => {
      if (onPictureInPictureChange) {
        onPictureInPictureChange(!!document.pictureInPictureElement);
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
      document.addEventListener("fullscreenchange", handleFullscreenChange);
      videoElement.addEventListener(
        "enterpictureinpicture",
        handlePictureInPictureChange
      );
      videoElement.addEventListener(
        "leavepictureinpicture",
        handlePictureInPictureChange
      );
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
        document.removeEventListener(
          "fullscreenchange",
          handleFullscreenChange
        );
        videoElement.removeEventListener(
          "enterpictureinpicture",
          handlePictureInPictureChange
        );
        videoElement.removeEventListener(
          "leavepictureinpicture",
          handlePictureInPictureChange
        );
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
  ]);

  useEffect(() => {
    if (getVideoRef) {
      getVideoRef(videoRef.current);
    }
  }, [getVideoRef, videoRef]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && src) {
      videoElement.src = src;
      videoElement.load();
      // if (currentTime) {
      //   updateRangeBackground(
      //     timelineInputRef.current,
      //     0,
      //     videoElement.duration
      //   );
      // }
      if (videoElement.error) {
        setVideoError(true);
      } else {
        setVideoError(false);
      }
    }
  }, [src]);

  const fetchSubtitleBlobUrl = async (url: string): Promise<string> => {
    const response = await fetch(url);
    let blob = await response.blob();

    if (url.endsWith(".srt")) {
      const srtText = await blob.text();
      const vttText =
        "WEBVTT\n\n" +
        srtText
          .replace(
            /(\d+)\n(\d{2}:\d{2}:\d{2}),(\d{3}) --> (\d{2}:\d{2}:\d{2}),(\d{3})/g,
            "$1\n$2.$3 --> $4.$5"
          )
          .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2");
      blob = new Blob([vttText], { type: "text/vtt" });
    }

    return URL.createObjectURL(blob);
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && tracks?.length && src) {
      // Remove existing tracks
      while (videoElement.firstChild) {
        videoElement.removeChild(videoElement.firstChild);
      }

      const blobUrls: string[] = [];

      // Add new tracks
      tracks.forEach(async (track) => {
        const trackBlobUrl = await fetchSubtitleBlobUrl(track.src);
        const trackElement = document.createElement("track");
        blobUrls.push(trackBlobUrl);
        trackElement.src = trackBlobUrl;
        trackElement.kind = track.kind;
        trackElement.label = track.label;
        trackElement.srclang = track.srclang;
        if (track.default) trackElement.default = true;
        const existingTrack = Array.from(videoElement.textTracks).find(
          (t) => t.label === track.label
        );
        if (!existingTrack) {
          videoElement.appendChild(trackElement);
        }
      });

      // Get all tracks after they're loaded
      const handleTracksLoaded = () => {
        setTimeout(() => {
          const trackList = Array.from(videoElement.textTracks);

          setAvailableTracks(trackList);

          // Set default track if specified
          const defaultTrack = trackList.find((t) => t.mode === "showing");
          if (defaultTrack) {
            setCurrentTrack(defaultTrack);
            if (onTrackChange) onTrackChange(defaultTrack);
          }
        }, 1000);
      };

      videoElement.addEventListener("loadedmetadata", handleTracksLoaded);
      return () => {
        videoElement.removeEventListener("loadedmetadata", handleTracksLoaded);
        blobUrls.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [tracks, onTrackChange, src, videoRef]);

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
    if (newVolume === 0) {
      setIsMuted(true);
      if (onMuteChange) onMuteChange(true);
    } else {
      setIsMuted(false);
      if (onMuteChange) onMuteChange(false);
    }
    setVolume(newVolume);
    resetControlTimeout();
  };

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = parseFloat(e.target.value);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
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
    [resetControlTimeout, onPlaybackRateChange]
  );

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      resetControlTimeout();
    }
  }, [resetControlTimeout, isPlaying]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      updateRangeBackground(volumeInputRef.current, !isMuted ? 0 : volume, 1);
      if (onMuteChange) onMuteChange(!isMuted);
      resetControlTimeout();
    }
  }, [isMuted, resetControlTimeout, volume, onMuteChange]);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      if (videoContainerRef.current) {
        if (videoContainerRef.current.requestFullscreen) {
          videoContainerRef.current.requestFullscreen();
          setIsFullscreen(true);
        } else {
          console.warn("Fullscreen is not supported by this browser.");
        }
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      } else {
        console.warn("Exiting fullscreen is not supported by this browser.");
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
    [resetControlTimeout]
  );

  const togglePictureInPicture = useCallback(async () => {
    if (videoRef.current) {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (videoRef.current.requestPictureInPicture) {
        await videoRef.current.requestPictureInPicture();
      } else {
        console.warn("Picture-in-Picture is not supported by this browser.");
      }
      resetControlTimeout();
    }
  }, [resetControlTimeout]);

  const handleVideoClick = (
    e: React.MouseEvent<HTMLDivElement | HTMLVideoElement>
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
    e: React.MouseEvent<HTMLDivElement | HTMLVideoElement>
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

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleTimelineMouseMove = (e: React.MouseEvent<HTMLInputElement>) => {
    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const position = e.clientX - rect.left;
    const percentage = position / rect.width;
    const time = (videoRef.current?.duration || 0) * percentage;
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
    if (disableShortcuts) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          skipTime(10);
          break;
        case "ArrowLeft":
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
          toggleMute();
          break;
        case "F11":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "p":
        case "P":
          togglePictureInPicture();
          break;
        case "s": {
          const speedRate =
            playbackRate === 1
              ? 1.25
              : playbackRate === 1.25
              ? 1.5
              : playbackRate === 1.5
              ? 1.75
              : playbackRate === 1.75
              ? 2
              : playbackRate === 2
              ? 0.25
              : playbackRate === 0.25
              ? 0.5
              : playbackRate === 0.5
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
    isPlaying,
    volume,
    playbackRate,
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
      const link = document.createElement("a");
      const response = await fetch(url);
      const blob = await response.blob();
      link.href = URL.createObjectURL(blob);
      link.download =
        Math.random().toString(36).substring(2, 9) + "." + type || "mp4";
      link.click();
      link.remove();
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
    <div>
      <div
        ref={videoContainerRef}
        style={
          {
            "--accent-color": accentColor,
            width,
            height,
            boxSizing: "border-box",
            minHeight: "180px",
          } as CSSProperties
        }
        className={`video-player-wrapper ${
          isFullscreen ? "fullscreen-container" : ""
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`control-relative ${
            isFullscreen ? "fullscreen-video" : ""
          }`}
        >
          <video
            src={src}
            ref={videoRef}
            {...(className && { className })}
            onClick={handleVideoClick}
            onDoubleClick={
              disableDoubleClick ? undefined : handleVideoDoubleClick
            }
            id="video"
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            playsInline={playsInline}
            poster={poster}
            preload={preload}
            style={{
              ...style,
              objectFit: "cover",
              cursor: controls ? "pointer" : "default",
              minHeight: "180px",
              width,
              height,
            }}
            role="video"
          >
            {sources &&
              sources.map(({ src, type }) => (
                <source key={src} src={src} type={type} />
              ))}
          </video>
          {showTooltip && !disableDoubleClick && (
            <div className="show-tooltip">
              Double click to{" "}
              {doubleClickToFullscreen ? "fullscreen" : "play/pause"}
            </div>
          )}

          {videoError || (!src && !sources?.length) ? (
            <div className="error-overlay">
              <div className="error-message">
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
                <span>
                  <strong>Error:</strong>{" "}
                  {!src && !sources?.length
                    ? "Please provide a video source URL or sources array."
                    : customErrorMessage}
                </span>
                {(src || sources?.length) && (
                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.load();
                        setVideoError(false);
                      }
                    }}
                    className="error-reload-button"
                  >
                    Reload
                  </button>
                )}
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
                      {!isPlaying ? (
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
                        </svg>
                      ) : (
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
                        </svg>
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          fill="currentColor"
                        >
                          <path d="M12 2C17.5228 2 22 6.47715 22 12 22 17.5228 17.5228 22 12 22 6.47715 22 2 17.5228 2 12H4C4 16.4183 7.58172 20 12 20 16.4183 20 20 16.4183 20 12 20 7.58172 16.4183 4 12 4 9.25022 4 6.82447 5.38734 5.38451 7.50024L8 7.5V9.5H2V3.5H4L3.99989 5.99918C5.82434 3.57075 8.72873 2 12 2ZM15.5 13.25C15.5 13.8023 15.0523 14.25 14.5 14.25 13.9477 14.25 13.5 13.8023 13.5 13.25V10.75C13.5 10.1977 13.9477 9.75 14.5 9.75 15.0523 9.75 15.5 10.1977 15.5 10.75V13.25ZM14.5 8.25C13.1193 8.25 12 9.36929 12 10.75V13.25C12 14.6307 13.1193 15.75 14.5 15.75 15.8807 15.75 17 14.6307 17 13.25V10.75C17 9.36929 15.8807 8.25 14.5 8.25ZM8.5 15.5V8.5H10V15.5H8.5Z"></path>
                        </svg>
                      </button>
                    )}
                    {!controlsToExclude.includes("center-playPause-button") && (
                      <button
                        onClick={togglePlay}
                        className="playPause accent-color"
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
                        aria-label="Forward 10 seconds"
                        className="skip-forward-backward accent-color-hover"
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
                    onChange={(e) => handleTimelineChange(e)}
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
                      {!controlsToExclude.includes(
                        "bottom-playPause-button"
                      ) && (
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
                      onClick={() => {
                        if (videoRef.current) {
                          if (!reverseCurrentTime) {
                            setReverseCurrentTime(true);
                          } else {
                            setReverseCurrentTime(false);
                          }
                        }
                      }}
                    >
                      {!controlsToExclude.includes("current-time") && (
                        <span className="show-control-inline-flex">
                          {reverseCurrentTime
                            ? formatTime(currentTime - duration)
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
                        {isMuted ? (
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
                            <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
                            <path d="M16 9a5 5 0 0 1 0 6" />
                            <path d="M19.364 18.364a9 9 0 0 0 0-12.728" />
                          </svg>
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
                        onChange={(e) => handleVolumeChange(e)}
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
                            { label: "0.25x", value: 0.25 },
                            { label: "0.5x", value: 0.5 },
                            { label: "0.75x", value: 0.75 },
                            { label: "1x", value: 1 },
                            { label: "1.25x", value: 1.25 },
                            { label: "1.5x", value: 1.5 },
                            { label: "1.75x", value: 1.75 },
                            { label: "2x", value: 2 },
                          ]}
                          value={playbackRate}
                          ariaLabel="Playback speed"
                          defaultLabel={`${playbackRate}x`}
                          onClick={(value) =>
                            handleSpeedChange(value as number)
                          }
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
                              width="24"
                              height="24"
                              className="accent-color-hover-cc"
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
                        {!isFullscreen ? (
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
                            <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                            <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                            <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                            <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                          </svg>
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
                              handleSourceDownloadClick(
                                src,
                                type.split("/")[1]
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
                              type.split("/")[1] || "mp4"
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
    </div>
  );
};

export default VideoPlayer;
