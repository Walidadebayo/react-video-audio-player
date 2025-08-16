"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  CSSProperties,
} from "react";
import WaveSurfer, { WaveSurferOptions } from "wavesurfer.js";
import { formatTime, playbackRateOptions } from "./lib/utils";
import { updateRangeBackground } from "./lib/utils";
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
  defaultPlaybackRate?: number;
  defaultVolume?: number;
  onProgress?: (currentTime: number, duration: number) => void;
  onSeeked?: (time: number) => void;
  onDownloadStart?: () => void;
  onDownloadEnd?: (success: boolean) => void;
  onPlaybackRateChange?: (rate: number) => void;
  onVolumeChange?: (volume: number) => void;
  onMuteChange?: (isMuted: boolean) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: () => void;
  onReady?: () => void;
  onDuration?: (duration: number) => void;
  getWaveSurferRef?: (ref: WaveSurfer | null) => void;
  getAudioElement?: (ref: HTMLAudioElement | null) => void;
}

const AudioPlayer = ({
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
  defaultPlaybackRate,
  defaultVolume = 1,
  onProgress,
  onSeeked,
  onDownloadStart,
  onDownloadEnd,
  onPlaybackRateChange,
  onVolumeChange,
  onMuteChange,
  onPlay,
  onPause,
  onEnded,
  onError,
  onReady,
  onDuration,
  getWaveSurferRef,
  getAudioElement,
}: AudioPlayerProps) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);
  const lastVolumeRef = useRef<number>(defaultVolume);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState(defaultVolume);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const waveSurfer = useRef<WaveSurfer | null>(null);
  const desiredPlayRef = useRef<boolean | null>(null);
  const desiredMuteRef = useRef<boolean | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const audioContainerRef = useRef<HTMLDivElement>(null);
  const volumeInputRef = useRef<HTMLInputElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [reload, setReload] = useState(false);
  const [reverseCurrentTime, setReverseCurrentTime] = useState(false);

  useEffect(() => {
    if (waveSurfer.current) {
      setIsMuted(muted);
      const initialVolume = muted ? 0 : defaultVolume;
      setVolume(initialVolume);
      lastVolumeRef.current = initialVolume || 1;
    }
  }, [muted, defaultVolume]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!mountedRef.current) return;
      if (waveSurfer.current && defaultPlaybackRate && duration) {
        const newPlaybackRate = Math.min(
          Math.max(Number(defaultPlaybackRate) || 1, 0.0625),
          16
        );
        setPlaybackRate(newPlaybackRate);
        try {
          waveSurfer.current.setPlaybackRate(newPlaybackRate);
        } catch (err) {
          console.warn("Failed to set WaveSurfer playback rate", err);
        }
        if (onPlaybackRateChange) onPlaybackRateChange(newPlaybackRate);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [defaultPlaybackRate, duration, onPlaybackRateChange]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (waveSurfer.current) {
      const volumeInput = volumeInputRef.current;
      updateRangeBackground(volumeInput);
      const newVolume = Math.min(Math.max(volume || 0, 0), 1);
      waveSurfer.current.setVolume(newVolume);
      if (onVolumeChange) onVolumeChange(newVolume);
      if (newVolume === 0) {
        setIsMuted(true);
        if (onMuteChange) onMuteChange(true);
      } else {
        setIsMuted(false);
        if (onMuteChange) onMuteChange(false);
      }
      if (newVolume > 0) lastVolumeRef.current = newVolume;
    }
  }, [volume, onVolumeChange, onMuteChange]);

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
    setIsPlaying((p) => {
      const next = !p;
      desiredPlayRef.current = next;
      return next;
    });
    if (waveSurfer.current) {
      try {
        const wsAny = waveSurfer.current as unknown as {
          isPlaying?: () => boolean;
        };
        if (wsAny.isPlaying && typeof wsAny.isPlaying === "function") {
          const currentlyPlaying = wsAny.isPlaying();
          if (currentlyPlaying) waveSurfer.current.pause();
          else waveSurfer.current.play();
        } else {
          waveSurfer.current.playPause();
        }
      } catch {
        try {
          waveSurfer.current.playPause();
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const toggleMute = useCallback(() => {
    const currentlyMuted = isMuted;
    const nextMuted = !currentlyMuted;
    desiredMuteRef.current = nextMuted;
    setIsMuted(nextMuted);
    if (nextMuted) {
      lastVolumeRef.current = volume || lastVolumeRef.current || 1;
      setVolume(0);
      updateRangeBackground(volumeInputRef.current, 0, 1);
      if (onMuteChange) onMuteChange(true);
    } else {
      const restore = lastVolumeRef.current || 1;
      setVolume(restore);
      updateRangeBackground(volumeInputRef.current, restore, 1);
      if (onMuteChange) onMuteChange(false);
    }

    // apply to WaveSurfer if ready
    if (waveSurfer.current) {
      try {
        waveSurfer.current.setMuted(nextMuted);
        if (!nextMuted && waveSurfer.current.setVolume) {
          try {
            waveSurfer.current.setVolume(lastVolumeRef.current || 1);
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.warn("WaveSurfer setMuted failed", err);
      }
    }
  }, [isMuted, onMuteChange, volume]);

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

      if (waveSurfer.current) {
        switch (e.key) {
          case "ArrowRight":
            e.preventDefault();
            waveSurfer.current.setTime(
              waveSurfer.current.getCurrentTime() + 10
            );
            break;
          case "ArrowLeft":
            e.preventDefault();
            waveSurfer.current.setTime(
              waveSurfer.current.getCurrentTime() - 10
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            waveSurfer.current.setVolume(Math.min(volume + 0.1, 1));
            setVolume((prevVolume) => {
              if (prevVolume === 0) {
                setIsMuted(false);
              }
              return Math.min(prevVolume + 0.1, 1);
            });
            break;
          case "ArrowDown":
            e.preventDefault();
            waveSurfer.current.setVolume(Math.max(volume - 0.1, 0));
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
            waveSurfer.current.playPause();
            break;
          case "m":
          case "M":
            e.preventDefault();
            toggleMute();
            break;
          case "s":
          case "S": {
            e.preventDefault();
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
            setPlaybackRate(speedRate);
            waveSurfer.current.setPlaybackRate(speedRate);
            if (onPlaybackRateChange) onPlaybackRateChange(speedRate);
            break;
          }
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isMuted,
    volume,
    playbackRate,
    disableShortcuts,
    toggleMute,
    onPlaybackRateChange,
  ]);

  const reloadAudio = () => {
    setAudioError(false);
    setTimeout(() => {
      setReload(!reload);
      updateRangeBackground(volumeInputRef.current, volume, 1);
    }, 100);
  };

  useEffect(() => {
    const handleError = () => {
      setAudioError(true);
      if (onError) {
        onError();
      }
    };

    const handleSeeked = () => {
      const currentTime = waveSurfer.current?.getCurrentTime() || 0;
      setCurrentTime(currentTime);
      if (onSeeked) {
        onSeeked(currentTime);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
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
      setIsPlaying(false);
      setCurrentTime(0);
      waveSurfer.current?.stop();
      if (onEnded) {
        onEnded();
      }
    };

    const handleReady = () => {
      const duration = waveSurfer.current?.getDuration() || 0;
      setDuration(duration);
      if (onReady) {
        onReady();
      }
      if (onDuration) {
        onDuration(duration);
      }
    };

    const handleClick = () => {
      waveSurfer.current?.playPause();
    };

    const handleVolumeChange = () => {
      const newVolume = waveSurfer.current?.getVolume() || 0;
      setVolume(newVolume);
      if (onVolumeChange) {
        onVolumeChange(newVolume);
      }
    };
    if (waveformRef.current) {
      (async () => {
        const container = waveformRef.current!;

        let durationSeconds = 0;
        try {
          const probe = document.createElement("audio");
          probe.crossOrigin = "anonymous";
          probe.preload = "metadata";
          probe.src = src;
          await new Promise<void>((resolve) => {
            const onLoaded = () => {
              durationSeconds = probe.duration || 0;
              cleanup();
              resolve();
            };
            const onError = () => {
              cleanup();
              resolve();
            };
            function cleanup() {
              probe.removeEventListener("loadedmetadata", onLoaded);
              probe.removeEventListener("error", onError);
              try {
                probe.src = "";
              } catch {
                /* Ignore cleanup errors */
              }
            }
            probe.addEventListener("loadedmetadata", onLoaded);
            probe.addEventListener("error", onError);
          });
        } catch (err) {
          console.warn("Audio probe failed", err);
        }

        const LONG_AUDIO_SECONDS = 30 * 60;
        const isLong = durationSeconds && durationSeconds > LONG_AUDIO_SECONDS;

        const wsOptions: WaveSurferOptions = {
          container: container,
          waveColor: "#9ca3af",
          progressColor: accentColor,
          cursorColor: "#000000",
          height: 50,
          url: src,
          dragToSeek: true,
          cursorWidth: 2,
          normalize: !isLong,
          barWidth: isLong ? 3 : 2,
          barGap: isLong ? 2 : 1,
        };
        if (isLong) {
          wsOptions.backend = "MediaElement";
        }

        waveSurfer.current = WaveSurfer.create(wsOptions);
        setCurrentTime(0);

        try {
          waveSurfer.current.on("ready", handleReady);
          waveSurfer.current.on("finish", handleEnded);
          waveSurfer.current.on("play", handlePlay);
          waveSurfer.current.on("pause", handlePause);
          waveSurfer.current.on("error", handleError);
          const media =
            waveSurfer.current.getMediaElement &&
            waveSurfer.current.getMediaElement();
          if (media) {
            media.loop = loop;
            media.onvolumechange = handleVolumeChange;
            if (autoPlay) media.autoplay = true;
          }
          waveSurfer.current.on("seeking", handleSeeked);
          if (!controls) {
            waveSurfer.current.on("click", handleClick);
          }
        } catch (err) {
          console.warn("Error binding WaveSurfer events", err);
        }

        if (seekTo && waveSurfer.current) {
          try {
            waveSurfer.current.seekTo(seekTo);
          } catch {
            /* Ignore seek errors */
          }
        }
      })();
    }

    return () => {
      const ws = waveSurfer.current;
      if (ws) {
        try {
          ws.un("ready", handleReady);
          ws.un("finish", handleEnded);
          ws.un("play", handlePlay);
          ws.un("pause", handlePause);
          ws.un("seeking", handleSeeked);
          ws.un("error", handleError);
          if (!controls) {
            ws.un("click", handleClick);
          }
        } catch (err) {
          console.warn("Error unbinding WaveSurfer events", err);
        }

        try {
          const media = ws.getMediaElement && ws.getMediaElement();
          if (media) {
            media.onvolumechange = null;
            media.loop = false;
            media.autoplay = false;
          }
        } catch (err) {
          console.warn("Error cleaning WaveSurfer media", err);
        }

        try {
          ws.destroy();
        } catch (err) {
          console.warn("Error destroying WaveSurfer instance", err);
        }
      }
    };
  }, [
    src,
    accentColor,
    loop,
    autoPlay,
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
    reload,
    onVolumeChange,
  ]);

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (waveSurfer.current) {
      waveSurfer.current.setPlaybackRate(speed);
      if (onPlaybackRateChange) onPlaybackRateChange(speed);
    }
  };

  useEffect(() => {
    const handleProgress = () => {
      const currentTime = waveSurfer.current?.getCurrentTime() || 0;
      setCurrentTime(currentTime);
      if (onProgress) {
        onProgress(currentTime, duration);
      }
    };
    waveSurfer.current?.on("audioprocess", handleProgress);
    return () => {
      if (waveSurfer.current) {
        waveSurfer.current.un("audioprocess", handleProgress);
      }
    };
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
    setVolume(newVolume);
  };

  const handleDownloadClick = async () => {
    if (isDownloading) return;
    try {
      if (onDownloadStart) onDownloadStart();
      setIsDownloading(true);
      const link = document.createElement("a");
      const response = await fetch(src);
      const blob = await response.blob();
      link.href = URL.createObjectURL(blob);
      link.download =
        Math.random().toString(36).substring(2, 9) +
          "." +
          src.split(".").pop() || ".mp3";
      link.click();
      link.remove();
      setIsDownloading(false);
      if (onDownloadEnd) onDownloadEnd(true);
    } catch {
      setIsDownloading(false);
      if (onDownloadEnd) onDownloadEnd(false);
    }
  };

  return (
    <div
      className={`audio-player-wrapper  ${className}`}
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
            <strong>Error:</strong> {customErrorMessage}
          </span>
          <button onClick={reloadAudio}>Reload</button>
        </div>
      ) : (
        <div className="controls">
          {controls && (
            <>
              {!controlsToExclude.includes("playPause") && (
                <button
                  onClick={togglePlay}
                  className="accent-color-hover play-pause-button"
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
              <button
                className="current-time-duration accent-color-hover"
                onClick={() => {
                  setReverseCurrentTime(!reverseCurrentTime);
                }}
                aria-label="Current time and duration"
              >
                {!controlsToExclude.includes("current-time") && (
                  <span
                    className={`${
                      containerWidth < 140
                        ? "hide-control"
                        : "show-control-inline-flex"
                    }`}
                  >
                    {reverseCurrentTime
                      ? formatTime(Math.max(duration - currentTime, 0))
                      : formatTime(currentTime)}
                  </span>
                )}
                {!controlsToExclude.includes("duration") &&
                  !controlsToExclude.includes("current-time") && (
                    <span
                      className={`${
                        containerWidth < 400
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
                      containerWidth < 400
                        ? "hide-control"
                        : "show-control-inline-flex"
                    }`}
                  >
                    {formatTime(duration)}
                  </span>
                )}
              </button>
            </>
          )}

          <div
            ref={waveformRef}
            className="waveform"
            style={{ width: "100%", height: "100%", cursor: "pointer" }}
            aria-label="Audio waveform"
          />

          {controls && (
            <>
              {!controlsToExclude.includes("playbackRate") && (
                <div
                  className={`control-relative ${
                    containerWidth < 210
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
                    ].sort((a, b) => parseFloat(a.label) - parseFloat(b.label))}
                    value={playbackRate}
                    ariaLabel="Playback speed"
                    defaultLabel={`${playbackRate}x`}
                    onClick={(value) => {
                      const newPlaybackRate = Math.min(
                        Math.max(Number(value) || 1, 0.0625),
                        16
                      );
                      handleSpeedChange(newPlaybackRate);
                    }}
                    key={playbackRate}
                  />
                </div>
              )}
              {!controlsToExclude.includes("mute") && (
                <button
                  onClick={toggleMute}
                  className={`mute-button accent-color-hover ${
                    containerWidth < 170 ? "hide-control" : "show-control"
                  }`}
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
                  onChange={handleVolumeChange}
                  ref={volumeInputRef}
                  className={`volume-slider accent-color-input ${
                    containerWidth < 400 ? "hide-control" : "show-control"
                  }`}
                  aria-label="Volume control"
                />
              )}
              {showDownloadButton && (
                <div className="download-button-wrapper">
                  <button
                    onClick={handleDownloadClick}
                    className="download-button accent-color"
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
                        className="downloading"
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
            <div className="download-button-wrapper">
              <button
                disabled={isDownloading}
                onClick={handleDownloadClick}
                className="download-button accent-color"
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
                    className="downloading"
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
