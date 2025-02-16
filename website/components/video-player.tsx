"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  CSSProperties,
  FC,
  ChangeEvent,
} from "react";
import { formatTime } from "@/lib/utils";
import Select from "./Select";
import Dropdown from "./Dropdown";

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
  | "skip-forward-backward";

export type VideoMimeType =
  | "video/mp4"
  | "video/webm"
  | "video/ogg"
  | "video/quicktime";

export type sources = {
  src: string;
  type: VideoMimeType;
}[];

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
  onProgress?: (currentTime: number, duration: number) => void;
  onSeeked?: (time: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: () => void;
  onReady?: () => void;
  onDuration?: (duration: number) => void;
  getVideoRef?: (ref: HTMLVideoElement | null) => void;
}

export const updateRangeBackground = (e: ChangeEvent<HTMLInputElement>) => {
  const value = (parseFloat(e.target.value) / parseFloat(e.target.max)) * 100;
  e.target.style.setProperty("--value", `${value}%`);
};

export const updateRangeBackgroundRef = (ref: HTMLInputElement | null) => {
  if (ref) {
    const value = (parseFloat(ref.value) / parseFloat(ref.max)) * 100;
    ref.style.setProperty("--value", `${value}%`);
  }
};

const VideoPlayer: FC<VideoPlayerProps> = ({
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
  preload = "metadata",
  seekTo,
  sources,
  controlsToExclude = [],
  disableDoubleClick = false,
  doubleClickToFullscreen = false,
  showDownloadButton = false,
  disableShortcuts = false,
  onProgress,
  onSeeked,
  onPlay,
  onPause,
  onEnded,
  onError,
  onReady,
  onDuration,
  getVideoRef,
}) => {
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
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const timelineInputRef = useRef<HTMLInputElement>(null);
  const volumeInputRef = useRef<HTMLInputElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (seekTo && videoRef.current) {
      videoRef.current.currentTime = seekTo;
    }
  }, [seekTo, videoRef]);

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
    const videoElement = videoRef.current;
    const handleTimeUpdate = () => {
      if (videoElement) {
        setCurrentTime(videoElement.currentTime);
        const timelineInput = timelineInputRef.current;
        if (videoElement.currentTime !== 0) {
          updateRangeBackgroundRef(timelineInput);
        }
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

    if (videoElement) {
      videoElement.addEventListener("play", handlePlay);
      videoElement.addEventListener("pause", handlePause);
      videoElement.addEventListener("ended", handleEnded);
      videoElement.addEventListener("error", handleError);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("play", handlePlay);
        videoElement.removeEventListener("pause", handlePause);
        videoElement.removeEventListener("ended", handleEnded);
        videoElement.removeEventListener("error", handleError);
      }
    };
  }, [onPlay, onPause, onEnded, onError]);

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
      updateRangeBackgroundRef(volumeInputRef.current);
      if (videoElement.error) {
        setVideoError(true);
      } else {
        setVideoError(false);
      }
    }
  }, [src]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (newVolume === 0) {
      console.log(newVolume);
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
    setVolume(newVolume);
    resetControlTimeout();
  };

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = parseFloat(e.target.value);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      if (onSeeked) {
        onSeeked(newTime);
      }
    }
    resetControlTimeout();
  };

  const handleSpeedChange = useCallback(
    (rate: number) => {
      setPlaybackRate(rate);
      if (videoRef.current) {
        videoRef.current.playbackRate = rate;
      }
      resetControlTimeout();
    },
    [resetControlTimeout]
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
      videoRef.current.volume = volume === 0 ? 1 : volume;
      setVolume(volume === 0 ? 1 : volume);
      resetControlTimeout();
    }
  }, [isMuted, resetControlTimeout, volume]);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      if (videoContainerRef.current) {
        if (videoContainerRef.current.requestFullscreen) {
          videoContainerRef.current.requestFullscreen();
        } else {
          console.warn("Fullscreen is not supported by this browser.");
        }
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else {
        console.warn("Exiting fullscreen is not supported by this browser.");
      }
    }
    resetControlTimeout();
  }, [isFullscreen, resetControlTimeout]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        if (videoContainerRef.current && videoRef.current) {
          videoContainerRef.current.classList.add("fullscreen-container");
          videoRef.current.classList.add("fullscreen-video");
        }
        setIsFullscreen(true);
      } else {
        setIsFullscreen(false);
        if (videoContainerRef.current && videoRef.current) {
          videoContainerRef.current.classList.remove("fullscreen-container");
          videoRef.current.classList.remove("fullscreen-video");
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const skipTime = useCallback(
    (seconds: number) => {
      if (videoRef.current) {
        if (videoRef.current.currentTime + seconds < 0) {
          setCurrentTime(0);
          updateRangeBackgroundRef(timelineInputRef.current);
          videoRef.current.currentTime = 0;
          videoRef.current.play();
          setIsPlaying(true);
        } else if (
          videoRef.current.currentTime + seconds >
          videoRef.current.duration
        ) {
          setCurrentTime(0);
          updateRangeBackgroundRef(timelineInputRef.current);
          videoRef.current.currentTime = 0;
          videoRef.current.play();
          setIsPlaying(true);
        } else {
          setCurrentTime(videoRef.current.currentTime + seconds);
          updateRangeBackgroundRef(timelineInputRef.current);
          videoRef.current.currentTime += seconds;
        }
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

  useEffect(() => {
    if (disableShortcuts) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          updateRangeBackgroundRef(timelineInputRef.current);
          skipTime(10);
          break;
        case "ArrowLeft":
          skipTime(-10);
          updateRangeBackgroundRef(timelineInputRef.current);
          break;
        case "ArrowUp":
          e.preventDefault();
          setVolume((prevVolume) => Math.min(prevVolume + 0.1, 1));
          updateRangeBackgroundRef(volumeInputRef.current);
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume((prevVolume) => Math.max(prevVolume - 0.1, 0));
          updateRangeBackgroundRef(volumeInputRef.current);
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
        case "s":
          handleSpeedChange(
            playbackRate === 1
              ? 1.5
              : playbackRate === 1.5
              ? 2
              : playbackRate === 2
              ? 0.5
              : 1
          );
          break;
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative">
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
          {showTooltip && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black text-white text-xs rounded">
              Double click to{" "}
              {doubleClickToFullscreen ? "fullscreen" : "play/pause"}
            </div>
          )}

          {videoError || (!src && !sources?.length) ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 overflow-hidden">
              <div className="text-red-500 flex flex-col gap-4 justify-center items-center">
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
                <span className="text-sm text-center">
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
                    className="text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Reload
                  </button>
                )}
              </div>
            </div>
          ) : controls ? (
            <div
              className={`absolute inset-0 flex items-center justify-center ${
                showControls ? "opacity-100" : "opacity-0"
              } transition-opacity duration-300`}
              onClick={handleVideoClick}
              onDoubleClick={
                disableDoubleClick ? undefined : handleVideoDoubleClick
              }
            >
              <div>
                <div
                  className={`
                    ${containerWidth < 400 ? "hidden" : "block"}`}
                >
                  {!controlsToExclude.includes("center-playPause-button") && (
                    <button
                      onClick={togglePlay}
                      className="hover:bg-black/90 w-16 h-16 text-white grid place-items-center rounded-full outline-none accent-color"
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
                </div>
                <div
                  className={`
                    ${containerWidth < 400 ? "block" : "hidden"}`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {!controlsToExclude.includes("skip-forward-backward") && (
                      <button
                        onClick={() => skipTime(-10)}
                        className="text-white p-1 rounded-lg bg-black/90 accent-color-hover"
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
                        className="text-white p-1 rounded-lg accent-color"
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
                        className="text-white p-1 rounded-lg bg-black/90 accent-color-hover"
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
              <div
                className={`w-full bottom-0 absolute px-2 py-1 bg-black/70 ${
                  showControls ? "opacity-100" : "opacity-0"
                } transition-opacity duration-300`}
              >
                {!controlsToExclude.includes("progress") && (
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    step="any"
                    value={currentTime}
                    onChange={(e) => {
                      handleTimelineChange(e);
                      updateRangeBackground(e);
                    }}
                    ref={timelineInputRef}
                    disabled={videoError}
                    className="accent-color-input w-full"
                    aria-label="Seek control"
                  />
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`${
                        containerWidth < 400 ? "hidden" : "inline-flex gap-1"
                      }`}
                    >
                      {!controlsToExclude.includes("skip-forward-backward") && (
                        <button
                          onClick={() => skipTime(-10)}
                          disabled={videoError}
                          className={`text-lg text-white p-1 rounded accent-color-hover`}
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
                          className={`text-lg text-white p-1 rounded accent-color-hover`}
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
                          className={`text-lg text-white p-1 rounded accent-color-hover`}
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
                    <div className="text-white text-xs ">
                      {!controlsToExclude.includes("current-time") &&
                        formatTime(currentTime) + " "}
                      {!controlsToExclude.includes("duration") && (
                        <span
                          className={`inline-block
                      ${containerWidth < 160 ? "hidden" : "block"}`}
                        >
                          {!controlsToExclude.includes("current-time") && (
                            <span>/ </span>
                          )}
                          {formatTime(duration)}
                        </span>
                      )}
                    </div>
                    {!controlsToExclude.includes("mute") && (
                      <button
                        onClick={toggleMute}
                        disabled={videoError}
                        className={`text-lg text-white p-1 rounded accent-color-hover`}
                        aria-label={isMuted ? "Unmute" : "Mute"}
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
                        onChange={(e) => {
                          handleVolumeChange(e);
                          updateRangeBackground(e);
                        }}
                        disabled={videoError}
                        ref={volumeInputRef}
                        className={`sm:w-20 w-14 accent-color-input ${
                          containerWidth < 310 ? "hidden" : "block"
                        }`}
                        aria-label="Volume control"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!controlsToExclude.includes("playbackRate") && (
                      <div
                        className={`relative ${
                          containerWidth < 180 ? "hidden" : "inline-flex"
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
                        />
                      </div>
                    )}
                    {!ios && !controlsToExclude.includes("pip") && (
                      <button
                        onClick={togglePictureInPicture}
                        disabled={videoError}
                        className={`text-lg text-white p-1 rounded accent-color-hover ${
                          containerWidth < 220 ? "hidden" : ""
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
                    {!controlsToExclude.includes("fullscreen") && (
                      <button
                        onClick={toggleFullscreen}
                        disabled={videoError}
                        className="text-lg text-white p-1 rounded accent-color-hover"
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
                <div className="absolute top-2 left-2">
                  {src ? (
                    <button
                      onClick={handleDownloadClick}
                      className="p-0.5 rounded accent-color hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-gray-100"
                      aria-label="Download video"
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
                          className="animate-spin"
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
                                type.split("/")[1]
                              ),
                          })) || []
                        }
                        ariaLabel="Download video"
                        buttonClassName="p-0.5 rounded accent-color hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-gray-100"
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
                              className="animate-spin"
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
              <div className="absolute bottom-2 right-2">
                {src ? (
                  <button
                    onClick={handleDownloadClick}
                    className="p-0.5 rounded accent-color hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-gray-100"
                    aria-label="Download video"
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
                        className="animate-spin"
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
                      buttonClassName="p-0.5 rounded accent-color hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-gray-100"
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
                            className="animate-spin"
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
