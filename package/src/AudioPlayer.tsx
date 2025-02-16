"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  CSSProperties,
  FC,
} from "react";
import WaveSurfer from "wavesurfer.js";
import { formatTime } from "./lib/utils";
import { updateRangeBackground, updateRangeBackgroundRef } from "./VideoPlayer";
import Select from "./components/Select";
import "./video-audio-player.css";

export type AudioControlOptionsToRemove =
  | "playPause"
  | "mute"
  | "volume"
  | "playbackRate"
  | "current-time"
  | "duration";

export interface AudioPlayerProps {
  src: string;
  accentColor?: string;
  customErrorMessage?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  width?: string | number;
  className?: string;
  style?: CSSProperties;
  controls?: boolean;
  seekTo?: number;
  controlsToExclude?: AudioControlOptionsToRemove[];
  disableShortcuts?: boolean;
  showDownloadButton?: boolean;
  onProgress?: (currentTime: number, duration: number) => void;
  onSeeked?: (time: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: () => void;
  onReady?: () => void;
  onDuration?: (duration: number) => void;
  getWaveSurferRef?: (ref: WaveSurfer | null) => void;
  getAudioElement?: (ref: HTMLAudioElement | null) => void;
}

const AudioPlayer: FC<AudioPlayerProps> = ({
  src,
  accentColor = "#60a5fa",
  customErrorMessage = "An error occurred while trying to play the audio.",
  autoPlay = false,
  muted = false,
  loop = false,
  className = "",
  style = {},
  controls = true,
  width = "100%",
  seekTo,
  controlsToExclude = [],
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
  getWaveSurferRef,
  getAudioElement,
}) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const waveSurfer = useRef<WaveSurfer | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const audioContainerRef = useRef<HTMLDivElement>(null);
  const volumeInputRef = useRef<HTMLInputElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    setIsMuted(muted);
    if (waveSurfer.current) {
      waveSurfer.current.setMuted(muted);
      waveSurfer.current.setVolume(muted ? 0 : volume);
    }
  }, [muted]);

  useEffect(() => {
    const audioContainer = audioContainerRef.current;
    const handleResize = () => {
      if (audioContainer) {
        setContainerWidth(audioContainer.offsetWidth);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (audioContainer) {
      resizeObserver.observe(audioContainer);
    }

    handleResize();

    return () => {
      if (audioContainer) {
        resizeObserver.unobserve(audioContainer);
      }
    };
  }, []);

  const togglePlay = useCallback(() => {
    if (waveSurfer.current) {
      waveSurfer.current.playPause();
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (waveSurfer.current) {
      waveSurfer.current.setMuted(!isMuted);
      setIsMuted(!isMuted);
      waveSurfer.current.setVolume(volume === 0 ? 1 : volume);
      setVolume(volume === 0 ? 1 : volume);
    }
  }, [isMuted, volume]);

  useEffect(() => {
    if (disableShortcuts) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (waveSurfer.current) {
        switch (e.key) {
          case "ArrowRight":
            waveSurfer.current.setTime(
              waveSurfer.current.getCurrentTime() + 10
            );
            break;
          case "ArrowLeft":
            waveSurfer.current.setTime(
              waveSurfer.current.getCurrentTime() - 10
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            waveSurfer.current.setVolume(Math.min(volume + 0.1, 1));
            setVolume((prevVolume) => Math.min(prevVolume + 0.1, 1));
            updateRangeBackgroundRef(volumeInputRef.current);
            break;
          case "ArrowDown":
            e.preventDefault();
            waveSurfer.current.setVolume(Math.max(volume - 0.1, 0));
            setVolume((prevVolume) => Math.max(prevVolume - 0.1, 0));
            updateRangeBackgroundRef(volumeInputRef.current);
            break;
          case " ":
            e.preventDefault();
            waveSurfer.current.playPause();
            break;
          case "m":
            e.preventDefault();
            waveSurfer.current.setMuted(!isMuted);
            setIsMuted(!isMuted);
            break;
          case "s":
            waveSurfer.current.setPlaybackRate(
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
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMuted, volume, playbackRate, disableShortcuts]);

  useEffect(() => {
    const handleError = () => {
      setAudioError(true);
      if (onError) {
        onError();
      }
    };
    if (waveformRef.current) {
      waveSurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#9ca3af",
        progressColor: accentColor,
        cursorColor: "#000000",
        height: 50,
        url: src,
        autoplay: autoPlay,
        dragToSeek: true,
        cursorWidth: 2,
        normalize: true,
        barWidth: 2,
        barGap: 1,
      });

      waveSurfer.current.on("ready", () => {
        const duration = waveSurfer.current?.getDuration() || 0;
        setDuration(duration);
        if (onReady) {
          onReady();
        }
        if (onDuration) {
          onDuration(duration);
        }
      });

      waveSurfer.current.on("finish", () => {
        setIsPlaying(false);
        setCurrentTime(0);
        waveSurfer.current?.stop();
        if (onEnded) {
          onEnded();
        }
      });

      if (!controls) {
        waveSurfer.current.on("click", () => {
          waveSurfer.current?.playPause();
        });
      }

      waveSurfer.current
        .getMediaElement()
        .addEventListener("error", handleError);

      waveSurfer.current.on("play", () => {
        setIsPlaying(true);
        if (onPlay) {
          onPlay();
        }
      });

      if (seekTo) {
        waveSurfer.current.seekTo(seekTo);
      }

      waveSurfer.current.on("pause", () => {
        setIsPlaying(false);
        if (onPause) {
          onPause();
        }
      });

      waveSurfer.current.getMediaElement().addEventListener("seeked", () => {
        const currentTime = waveSurfer.current?.getCurrentTime() || 0;
        setCurrentTime(currentTime);
        if (onSeeked) {
          onSeeked(currentTime);
        }
      });

      waveSurfer.current.getMediaElement().loop = loop;
    }

    return () => {
      if (waveSurfer.current) {
        waveSurfer.current.destroy();
        waveSurfer.current
          .getMediaElement()
          .removeEventListener("error", handleError);
      }
    };
  }, [
    src,
    accentColor,
    autoPlay,
    loop,
    onReady,
    onDuration,
    onEnded,
    onError,
    onPlay,
    onPause,
    onSeeked,
    duration,
    controls,
    seekTo,
  ]);

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (waveSurfer.current) {
      waveSurfer.current.setPlaybackRate(speed);
    }
  };

  useEffect(() => {
    if (waveSurfer.current) {
      waveSurfer.current.on("audioprocess", () => {
        const currentTime = waveSurfer.current?.getCurrentTime() || 0;
        setCurrentTime(currentTime);
        if (onProgress) {
          onProgress(currentTime, duration);
        }
      });
    }
  }, [onProgress, duration]);

  useEffect(() => {
    if (getWaveSurferRef && waveSurfer.current) {
      getWaveSurferRef(waveSurfer.current);
    }
  }, [getWaveSurferRef, waveSurfer]);

  useEffect(() => {
    if (getAudioElement && waveSurfer.current) {
      getAudioElement(waveSurfer.current.getMediaElement());
    }
  }, [getAudioElement, waveSurfer]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
    setVolume(newVolume);
    if (waveSurfer.current) {
      waveSurfer.current.setVolume(newVolume);
    }
  };

  const handleDownloadClick = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    const link = document.createElement("a");
    const response = await fetch(src);
    const blob = await response.blob();
    link.href = URL.createObjectURL(blob);
    link.download =
      Math.random().toString(36).substring(2, 9) + "." + src.split(".").pop() ||
      ".mp3";
    link.click();
    link.remove();
    setIsDownloading(false);
  };

  return (
    <div
      className={`relative ${className} border-2 border-gray-400 rounded-xl p-4 bg-slate-100 dark:bg-gray-800 dark:border-gray-600`}
      ref={audioContainerRef}
      style={
        {
          ...style,
          "--accent-color": accentColor,
          width,
          minWidth: "90px",
        } as CSSProperties
      }
    >
      {audioError ? (
        <div className="error-message">
          <strong>Error:</strong> {customErrorMessage}
        </div>
      ) : (
        <div className="flex items-center gap-1">
          {controls && (
            <>
              {!controlsToExclude.includes("playPause") && (
                <button
                  onClick={togglePlay}
                  className="flex items-center justify-center dark:text-gray-100 text-gray-700 p-1 hover:text-gray-300 rounded accent-color-hover"
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
              <div className="whitespace-nowrap flex items-center gap-1 dark:text-white">
                {!controlsToExclude.includes("current-time") && (
                  <span
                    className={`${containerWidth < 140 ? "hidden" : "block"}`}
                  >
                    {formatTime(currentTime)}
                  </span>
                )}
                {!controlsToExclude.includes("duration") && (
                  <span
                    className={`${
                      containerWidth < 400 ? "hidden" : "inline-flex"
                    }`}
                  >
                    {!controlsToExclude.includes("current-time") && (
                      <span> / </span>
                    )}
                    {formatTime(duration)}
                  </span>
                )}
              </div>
            </>
          )}

          <div
            ref={waveformRef}
            className="waveform"
            style={{ width: "100%", height: "100%" }}
            aria-label="Audio waveform"
          />

          {controls && (
            <>
              {!controlsToExclude.includes("playbackRate") && (
                <div
                  className={`relative ${
                    containerWidth < 210 ? "hidden" : "inline-flex"
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
                    onClick={(value) => handleSpeedChange(value as number)}
                  />
                </div>
              )}
              {!controlsToExclude.includes("mute") && (
                <button
                  onClick={toggleMute}
                  className={`dark:text-gray-100 text-gray-700 hover:text-gray-300 p-1 rounded accent-color-hover ${
                    containerWidth < 170 ? "hidden" : "block"
                  }`}
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
                  ref={volumeInputRef}
                  className={`sm:w-20 w-14 accent-color-input ${
                    containerWidth < 400 ? "hidden" : "block"
                  }`}
                  aria-label="Volume control"
                />
              )}
              {showDownloadButton && (
                <div className="absolute right-2 bottom-0.5">
                  <button
                    onClick={handleDownloadClick}
                    className="p-0.5 rounded accent-color hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-gray-100"
                    aria-label="Download video"
                  >
                    {!isDownloading ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
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
                        width="18"
                        height="18"
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
                </div>
              )}
            </>
          )}
          {!controls && showDownloadButton && (
            <div className="absolute right-2 bottom-0.5">
              <button
                disabled={isDownloading}
                onClick={handleDownloadClick}
                className="p-0.5 rounded accent-color hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-gray-100"
                aria-label="Download video"
              >
                {!isDownloading ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
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
                    width="18"
                    height="18"
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
