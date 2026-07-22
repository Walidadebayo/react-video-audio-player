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
import { useInView } from "./lib/useInView";
import { loadAudioPeaks } from "./lib/peaks";
import Select from "./components/Select";
import "./video-audio-player.css";

export type AudioControlOptionsToRemove =
  | "playPause"
  | "mute"
  | "volume"
  | "playbackRate"
  | "current-time"
  | "duration";

export interface AudioPlayerIcons {
  play?: React.ReactNode;
  pause?: React.ReactNode;
  mute?: React.ReactNode;
  unmute?: React.ReactNode;
  volume?: React.ReactNode;
  rewind?: React.ReactNode;
  forward?: React.ReactNode;
  download?: React.ReactNode;
  error?: React.ReactNode;
}

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
  maxAutoPlayDuration?: number;
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
  icons?: AudioPlayerIcons;
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
  maxAutoPlayDuration,
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
  icons = {},
}: AudioPlayerProps) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const mountedRef = useRef(true);
  const lastVolumeRef = useRef<number>(defaultVolume);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState(defaultVolume);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [errorType, setErrorType] = useState<
    "unsupported" | "network" | "decode" | "aborted" | "unknown" | null
  >(null);
  const waveSurfer = useRef<WaveSurfer | null>(null);
  const desiredPlayRef = useRef<boolean | null>(null);
  const desiredMuteRef = useRef<boolean | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const audioContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(audioContainerRef);
  const volumeInputRef = useRef<HTMLInputElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [reload, setReload] = useState(false);
  const [reverseCurrentTime, setReverseCurrentTime] = useState(false);
  const [useWaveform, setUseWaveform] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const getIcon = (
    iconName: keyof AudioPlayerIcons,
    defaultIcon: React.ReactNode,
  ) => {
    return (icons as AudioPlayerIcons | undefined)?.[iconName] ?? defaultIcon;
  };

  useEffect(() => {
    const volumeInput = volumeInputRef.current;
    updateRangeBackground(volumeInput);
    const initialVolume = muted ? 0 : defaultVolume;
    setVolume(initialVolume);
    lastVolumeRef.current = initialVolume || 1;
    setIsMuted(muted);
    // if using fallback audio element, apply initial volume
    if (!useWaveform && audioElRef.current) {
      try {
        audioElRef.current.volume = initialVolume;
        audioElRef.current.muted = muted;
      } catch {
        /* ignore */
      }
    }
  }, [muted, defaultVolume, useWaveform]);

  const defaultPlaybackRateAppliedRef = useRef(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!mountedRef.current) return;
      if (
        typeof defaultPlaybackRate === "number" &&
        !defaultPlaybackRateAppliedRef.current &&
        duration
      ) {
        const newPlaybackRate = Math.min(
          Math.max(Number(defaultPlaybackRate) || 1, 0.0625),
          16,
        );
        setPlaybackRate(newPlaybackRate);
        try {
          if (useWaveform && waveSurfer.current) {
            waveSurfer.current.setPlaybackRate(newPlaybackRate);
          } else if (!useWaveform && audioElRef.current) {
            audioElRef.current.playbackRate = newPlaybackRate;
          }
        } catch (err) {
          console.warn("Failed to set playback rate", err);
        }
        if (onPlaybackRateChange) onPlaybackRateChange(newPlaybackRate);
        defaultPlaybackRateAppliedRef.current = true;
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [defaultPlaybackRate, duration, onPlaybackRateChange, useWaveform]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const volumeInput = volumeInputRef.current;
    updateRangeBackground(volumeInput);
    const newVolume = Math.min(Math.max(volume || 0, 0), 1);
    if (useWaveform && waveSurfer.current) {
      try {
        waveSurfer.current.setVolume(newVolume);
      } catch {
        /* ignore */
      }
    } else if (!useWaveform && audioElRef.current) {
      try {
        audioElRef.current.volume = newVolume;
        audioElRef.current.muted = newVolume === 0;
      } catch {
        /* ignore */
      }
    }
    if (onVolumeChange) onVolumeChange(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
      if (onMuteChange) onMuteChange(true);
    } else {
      setIsMuted(false);
      if (onMuteChange) onMuteChange(false);
    }
    if (newVolume > 0) lastVolumeRef.current = newVolume;
  }, [volume, onVolumeChange, onMuteChange, useWaveform]);

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

  useEffect(() => {
    setUseWaveform(true);
  }, [src]);

  const togglePlay = useCallback(() => {
    setIsPlaying((p) => {
      const next = !p;
      desiredPlayRef.current = next;
      return next;
    });
    if (useWaveform && waveSurfer.current) {
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
          waveSurfer.current?.playPause();
        } catch {
          // ignore
        }
      }
    } else if (audioElRef.current) {
      try {
        if (audioElRef.current.paused) audioElRef.current.play();
        else audioElRef.current.pause();
      } catch {
        // ignore
      }
    }
  }, [useWaveform]);

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

    // apply to WaveSurfer or audio element if ready
    if (useWaveform && waveSurfer.current) {
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
    } else if (!useWaveform && audioElRef.current) {
      try {
        audioElRef.current.muted = nextMuted;
        if (!nextMuted) audioElRef.current.volume = lastVolumeRef.current || 1;
      } catch {
        // ignore
      }
    }
  }, [isMuted, onMuteChange, volume, useWaveform]);

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

      const applySkip = (seconds: number) => {
        if (useWaveform && waveSurfer.current) {
          try {
            waveSurfer.current.setTime(
              waveSurfer.current.getCurrentTime() + seconds,
            );
          } catch {
            /* ignore */
          }
        } else if (audioElRef.current) {
          try {
            audioElRef.current.currentTime = Math.max(
              0,
              (audioElRef.current.currentTime || 0) + seconds,
            );
          } catch {
            /* ignore */
          }
        }
      };

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          applySkip(10);
          break;
        case "ArrowLeft":
          e.preventDefault();
          applySkip(-10);
          break;
        case "ArrowUp":
          e.preventDefault();
          setVolume((prevVolume) => {
            const nv = Math.min(prevVolume + 0.1, 1);
            if (nv === 0) setIsMuted(false);
            return nv;
          });
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume((prevVolume) => {
            const nv = Math.max(prevVolume - 0.1, 0);
            if (nv === 0) setIsMuted(true);
            return nv;
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
        case "s":
        case "S": {
          e.preventDefault();
          const current = playbackRate || 1;
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
          setPlaybackRate(speedRate);
          if (useWaveform && waveSurfer.current) {
            try {
              waveSurfer.current.setPlaybackRate(speedRate);
            } catch {
              /* ignore */
            }
          } else if (audioElRef.current) {
            try {
              audioElRef.current.playbackRate = speedRate;
            } catch {
              /* ignore */
            }
          }
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
  }, [isMuted, volume, playbackRate, disableShortcuts, toggleMute, onPlaybackRateChange, useWaveform, togglePlay]);

  const reloadAudio = () => {
    setAudioError(false);
    setErrorType(null);
    setUseWaveform(true);
    setTimeout(() => {
      setReload(!reload);
      updateRangeBackground(volumeInputRef.current, volume, 1);
    }, 100);
  };

  useEffect(() => {
    const handleError = () => {
      setAudioError(true);
      setErrorType("decode"); // WaveSurfer errors are typically decode errors
      setIsLoading(false);
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
      setIsLoading(false);
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

    const handleProgress = () => {
      const currentTime = waveSurfer.current?.getCurrentTime() || 0;
      setCurrentTime(currentTime);
      if (onProgress) {
        onProgress(currentTime, duration);
      }
    };

    let cancelled = false;
    let fallbackTimer: number | null = null;
    let readyHandlerRef: (() => void) | null = null;

    if (waveSurfer.current) {
      try {
        waveSurfer.current.destroy();
      } catch (err) {
        console.warn("Error destroying previous WaveSurfer instance", err);
      }
      waveSurfer.current = null;
    }

    if (!isInView) {
      return;
    }

    if (!useWaveform) {
      // waveform disabled: skip creating WaveSurfer (fallback audio element will be used)
      return;
    }

    if (waveformRef.current) {
      (async () => {
        const container = waveformRef.current!;
        let durationSeconds = 0;
        try {
          const probe = document.createElement("audio");
          probe.crossOrigin = "anonymous";
          probe.preload = "metadata";
          probe.src = src;
          const probeTimeoutMs = 15000;
          await new Promise<void>((resolve) => {
            let settled = false;
            const settle = () => {
              if (settled) return;
              settled = true;
              cleanup();
              resolve();
            };
            const onLoaded = () => {
              durationSeconds = probe.duration || 0;
              settle();
            };
            const onCanPlay = () => {
              if (durationSeconds) {
                settle();
              }
            };
            const onError = () => {
              settle();
            };
            const timeoutId = window.setTimeout(() => {
              settle();
            }, probeTimeoutMs);
            function cleanup() {
              window.clearTimeout(timeoutId);
              probe.removeEventListener("loadedmetadata", onLoaded);
              probe.removeEventListener("canplay", onCanPlay);
              probe.removeEventListener("error", onError);
              try {
                probe.src = "";
              } catch {
                /* Ignore cleanup errors */
              }
            }
            probe.addEventListener("loadedmetadata", onLoaded);
            probe.addEventListener("canplay", onCanPlay);
            probe.addEventListener("error", onError);
          });
        } catch (err) {
          console.warn("Audio probe failed", err);
        }
        if (cancelled) return;
        const LONG_AUDIO_SECONDS = 30 * 60; // 30 minutes
        const isLong = durationSeconds && durationSeconds > LONG_AUDIO_SECONDS;
        let peaks: number[] | null = null;

        if (isLong) {
          const peakCount = Math.max(
            Math.min(Math.round((container.clientWidth || 0) * 2), 4096),
            1024,
          );
          peaks = await loadAudioPeaks(src, peakCount);
        }

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
        if (peaks?.length) {
          wsOptions.peaks = [Float32Array.from(peaks)];
          wsOptions.duration = durationSeconds;
        }
        if (isLong) {
          wsOptions.backend = "MediaElement";
        }

        setIsLoading(true);
        waveSurfer.current = WaveSurfer.create(wsOptions);
        setCurrentTime(0);

        try {
          // install a ready wrapper so we can fallback if "ready" never fires
          let readyFired = false;
          const markReady = () => {
            if (readyFired) return;
            readyFired = true;
            if (fallbackTimer) {
              clearTimeout(fallbackTimer);
              fallbackTimer = null;
            }
            handleReady();
          };
          readyHandlerRef = markReady;

          waveSurfer.current.on("ready", readyHandlerRef);
          waveSurfer.current.on("finish", handleEnded);
          waveSurfer.current.on("play", handlePlay);
          waveSurfer.current.on("pause", handlePause);
          waveSurfer.current.on("error", handleError);
          waveSurfer.current.on("audioprocess", handleProgress);
          waveSurfer.current.on("timeupdate", handleProgress);
          const media =
            useWaveform && waveSurfer.current.getMediaElement
              ? waveSurfer.current.getMediaElement()
              : audioElRef.current;
          if (media) {
            media.loop = loop;
            media.onvolumechange = handleVolumeChange;
            const shouldAutoplay =
              autoPlay &&
              (!maxAutoPlayDuration || durationSeconds <= maxAutoPlayDuration);
            if (shouldAutoplay) media.autoplay = true;
          }
          waveSurfer.current.on("seeking", handleSeeked);
          if (!controls) {
            waveSurfer.current.on("click", handleClick);
          }

          window.setTimeout(() => {
            try {
              if (!readyFired) {
                const knownDuration = waveSurfer.current?.getDuration?.() || 0;
                if (knownDuration > 0) {
                  markReady();
                }
              }
            } catch {
              /* ignore */
            }
          }, 0);

          // if ready doesn't fire within reasonable time, fallback to plain audio element
          fallbackTimer = window.setTimeout(() => {
            try {
              if (!readyFired) {
                const knownDuration = waveSurfer.current?.getDuration?.() || 0;
                if (knownDuration > 0) {
                  markReady();
                  return;
                }
                try {
                  waveSurfer.current?.destroy();
                } catch {
                  /* ignore */
                }
                waveSurfer.current = null;
                setUseWaveform(false);
                setIsLoading(false);
              }
            } catch {
              /* ignore */
            }
          }, 15000);
        } catch (err) {
          console.warn("Error binding WaveSurfer events", err);
        }

        if (typeof seekTo === "number" && waveSurfer.current) {
          try {
            const wsAny = waveSurfer.current as unknown as {
              setTime?: (t: number) => void;
            };
            if (typeof wsAny.setTime === "function") {
              wsAny.setTime(seekTo);
            } else {
              const dur = waveSurfer.current.getDuration() || 0;
              if (dur > 0)
                waveSurfer.current.seekTo(
                  Math.min(Math.max(0, seekTo / dur), 1),
                );
            }
          } catch {
            /* Ignore seek errors */
          }
        }
      })();
    }

    return () => {
      cancelled = true;
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
      const ws = waveSurfer.current;
      if (ws) {
        try {
          if (readyHandlerRef) ws.un("ready", readyHandlerRef);
          else ws.un("ready", handleReady);
          ws.un("finish", handleEnded);
          ws.un("play", handlePlay);
          ws.un("pause", handlePause);
          ws.un("seeking", handleSeeked);
          ws.un("error", handleError);
          ws.un("audioprocess", handleProgress);
          ws.un("timeupdate", handleProgress);
          if (!controls) {
            ws.un("click", handleClick);
          }
        } catch (err) {
          console.warn("Error unbinding WaveSurfer events", err);
        }

        try {
          const media =
            useWaveform && ws.getMediaElement
              ? ws.getMediaElement()
              : audioElRef.current;
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
        waveSurfer.current = null;
        audioElRef.current = null;
      }
    };
  }, [
    src,
    accentColor,
    loop,
    autoPlay,
    maxAutoPlayDuration,
    onReady,
    onDuration,
    onEnded,
    onError,
    onPlay,
    onPause,
    onSeeked,
    onProgress,
    duration,
    controls,
    seekTo,
    reload,
    onVolumeChange,
    useWaveform,
    isInView,
  ]);

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (useWaveform && waveSurfer.current) {
      try {
        waveSurfer.current.setPlaybackRate(speed);
      } catch {
        /* ignore */
      }
    } else if (audioElRef.current) {
      try {
        audioElRef.current.playbackRate = speed;
      } catch {
        /* ignore */
      }
    }
    if (onPlaybackRateChange) onPlaybackRateChange(speed);
  };

  useEffect(() => {
    if (getWaveSurferRef && waveSurfer.current) {
      getWaveSurferRef(waveSurfer.current);
    }
  }, [getWaveSurferRef, waveSurfer, useWaveform]);

  useEffect(() => {
    if (getAudioElement) {
      try {
        if (useWaveform && waveSurfer.current) {
          getAudioElement(waveSurfer.current.getMediaElement());
        } else {
          getAudioElement(audioElRef.current);
        }
      } catch {
        getAudioElement(audioElRef.current);
      }
    }
  }, [getAudioElement, waveSurfer, useWaveform]);

  useEffect(() => {
    if (!useWaveform && audioElRef.current) {
      const audio = audioElRef.current;
      setIsLoading(true);

      const audio_onLoadedMetadata = () => {
        const d = audio.duration || 0;
        setDuration(d);
        setIsLoading(false);
        const shouldAutoplay =
          autoPlay && (!maxAutoPlayDuration || d <= maxAutoPlayDuration);
        if (shouldAutoplay && !audio.autoplay) {
          audio.autoplay = true;
          audio.play().catch(() => {
            /* Ignore autoplay failure */
          });
        } else if (!shouldAutoplay) {
          audio.autoplay = false;
        }
        if (onReady) onReady();
        if (onDuration) onDuration(d);
      };

      const audio_onTimeUpdate = () => {
        setCurrentTime(audio.currentTime || 0);
        if (onProgress) onProgress(audio.currentTime || 0, audio.duration || 0);
        if (audio.currentTime === audio.duration) {
          setIsPlaying(false);
          if (onEnded) onEnded();
        }
      };

      const audio_onPlay = () => {
        setIsPlaying(true);
        if (onPlay) onPlay();
      };

      const audio_onPause = () => {
        setIsPlaying(false);
        if (onPause) onPause();
      };

      const audio_onError = () => {
        // Detect error type from audio element error code
        let type: "unsupported" | "network" | "decode" | "aborted" | "unknown" =
          "unknown";
        if (audio?.error) {
          switch (audio.error.code) {
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
        setAudioError(true);
        setErrorType(type);
        setIsLoading(false);
        if (onError) onError();
      };

      const audio_onVolumeChange = () => {
        const newVol = audio.volume || 0;
        setVolume(newVol);
        if (onVolumeChange) onVolumeChange(newVol);
        const mutedState = audio.muted || newVol === 0;
        setIsMuted(mutedState);
        if (onMuteChange) onMuteChange(mutedState);
      };

      const audio_onSeeking = () => {
        if (onSeeked) onSeeked(audio.currentTime || 0);
      };

      audio.addEventListener("loadedmetadata", audio_onLoadedMetadata);
      audio.addEventListener("timeupdate", audio_onTimeUpdate);
      audio.addEventListener("play", audio_onPlay);
      audio.addEventListener("pause", audio_onPause);
      audio.addEventListener("ended", audio_onTimeUpdate);
      audio.addEventListener("error", audio_onError);
      audio.addEventListener("volumechange", audio_onVolumeChange);
      audio.addEventListener("seeking", audio_onSeeking);

      return () => {
        try {
          audio.removeEventListener("loadedmetadata", audio_onLoadedMetadata);
          audio.removeEventListener("timeupdate", audio_onTimeUpdate);
          audio.removeEventListener("play", audio_onPlay);
          audio.removeEventListener("pause", audio_onPause);
          audio.removeEventListener("ended", audio_onTimeUpdate);
          audio.removeEventListener("error", audio_onError);
          audio.removeEventListener("volumechange", audio_onVolumeChange);
          audio.removeEventListener("seeking", audio_onSeeking);
        } catch {
          /* ignore */
        }
      };
    }
    return;
  }, [
    useWaveform,
    src,
    autoPlay,
    maxAutoPlayDuration,
    onProgress,
    onSeeked,
    onPlay,
    onPause,
    onEnded,
    onError,
    onReady,
    onDuration,
    onVolumeChange,
    onMuteChange,
  ]);

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
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      link.href = objectUrl;
      const maybeExt = src ? src.split(".").pop() : null;
      const ext = maybeExt || "mp3";
      link.download = `${Math.random().toString(36).substring(2, 9)}.${ext}`;
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
          {getIcon(
            "error",
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
            </svg>,
          )}
          <span>
            <strong>Error:</strong>{" "}
            {errorType === "unsupported"
              ? "This audio format is not supported by your browser. You can download it and play it on your device."
              : errorType === "network"
                ? "A network error occurred while trying to load the audio. Please check your connection."
                : errorType === "decode"
                  ? "The audio could not be decoded. The format might not be supported."
                  : customErrorMessage}
          </span>
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "8px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button
              onClick={reloadAudio}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
              }}
            >
              Reload
            </button>
            {(errorType === "unsupported" ||
              errorType === "decode" ||
              errorType === "unknown") && (
              <button
                onClick={handleDownloadClick}
                disabled={isDownloading}
                style={{
                  padding: "6px 12px",
                  backgroundColor: accentColor,
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: isDownloading ? "not-allowed" : "pointer",
                  opacity: isDownloading ? 0.6 : 1,
                  fontSize: "12px",
                }}
              >
                {isDownloading ? "Downloading..." : "Download Audio"}
              </button>
            )}
          </div>
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

          {useWaveform ? (
            <div
              ref={waveformRef}
              className="waveform"
              style={{ width: "100%", height: "100%", cursor: "pointer" }}
              aria-label="Audio waveform"
            >
              {isLoading && (
                <div className="loading-overlay">
                  <div className="spinner-container" aria-hidden>
                    <div className="spinner" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              ref={waveformRef}
              className="waveform"
              style={{ width: "100%", height: "100%", cursor: "pointer" }}
              aria-label="Audio waveform"
            >
              {isLoading && (
                <div className="loading-overlay">
                  <div className="spinner-container" aria-hidden>
                    <div className="spinner" />
                  </div>
                </div>
              )}
              <audio
                ref={audioElRef}
                src={src}
                preload={isInView ? "metadata" : "none"}
                autoPlay={autoPlay}
                muted={muted}
                loop={loop}
                style={{ width: "100%", display: "block" }}
              />
            </div>
          )}

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
                        16,
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
                    aria-label="Download audio"
                  >
                    {!isDownloading
                      ? getIcon(
                          "download",
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
                          </svg>,
                        )
                      : (
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
                aria-label="Download audio"
              >
                {!isDownloading
                  ? getIcon(
                      "download",
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
                      </svg>,
                    )
                  : (
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
