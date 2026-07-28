import React from "react";
import { act, render } from "@testing-library/react";
import { screen, fireEvent } from "@testing-library/dom";
import AudioPlayer from "../AudioPlayer";

const mockWaveSurferCreate = jest.fn((..._args: any[]) => {
  const handlers: Record<string, (...args: unknown[]) => void> = {};
  const mediaElement = document.createElement("audio");
  let playing = false;
  let volume = 1;
  let currentTime = 0;
  const duration = 0;

  const instance: Record<string, unknown> = {};

  Object.assign(instance, {
    on: jest.fn((event: string, handler: (...args: unknown[]) => void) => {
      handlers[event] = handler;
    }),
    un: jest.fn((event: string) => {
      delete handlers[event];
    }),
    destroy: jest.fn(),
    play: jest.fn(() => {
      playing = true;
      handlers.play?.();
      return Promise.resolve();
    }),
    pause: jest.fn(() => {
      playing = false;
      handlers.pause?.();
    }),
    playPause: jest.fn(() => {
      if (playing) {
        (instance.pause as jest.Mock)();
      } else {
        (instance.play as jest.Mock)();
      }
    }),
    setMuted: jest.fn((muted: boolean) => {
      mediaElement.muted = muted;
    }),
    setVolume: jest.fn((newVolume: number) => {
      volume = newVolume;
      mediaElement.volume = newVolume;
      handlers.volumechange?.();
    }),
    getVolume: jest.fn(() => volume),
    setPlaybackRate: jest.fn(),
    getCurrentTime: jest.fn(() => currentTime),
    setTime: jest.fn((newTime: number) => {
      currentTime = newTime;
      handlers.seeking?.();
      handlers.timeupdate?.();
    }),
    seekTo: jest.fn((percent: number) => {
      currentTime = duration * percent;
      handlers.seeking?.();
    }),
    getDuration: jest.fn(() => duration),
    getMediaElement: jest.fn(() => mediaElement),
    stop: jest.fn(() => {
      playing = false;
      currentTime = 0;
      handlers.finish?.();
    }),
    isPlaying: jest.fn(() => playing),
  });

  return instance;
});

jest.mock("wavesurfer.js", () => ({
  __esModule: true,
  default: {
    create: (options: any) => mockWaveSurferCreate(options),
  },
  create: (options: any) => mockWaveSurferCreate(options),
}));

// Mock matchMedia
beforeAll(() => {
  window.matchMedia =
    window.matchMedia ||
    function () {
      return {
        matches: false,
        addListener: function () {},
        removeListener: function () {},
      };
    };
});

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
});

describe("AudioPlayer", () => {
  const defaultProps = {
    src: "https://www.w3schools.com/html/horse.ogg",
    muted: false,
  };

  test("renders AudioPlayer component", () => {
    render(<AudioPlayer {...defaultProps} />);
    expect(screen.getByLabelText("Audio waveform")).toBeInTheDocument();
  });

  test("toggles play/pause when button is clicked", () => {
    render(<AudioPlayer {...defaultProps} />);
    const playButtons = screen.getAllByRole("button", { name: /play/i });
    const playButton = playButtons[0];
    fireEvent.click(playButton);
    expect(playButton).toHaveAttribute("aria-label", "Pause");
    fireEvent.click(playButton);
    expect(playButton).toHaveAttribute("aria-label", "Play");
  });

  test("toggles mute/unmute when button is clicked", () => {
    render(<AudioPlayer {...defaultProps} />);
    const muteButton = screen.getByRole("button", { name: /mute/i });
    fireEvent.click(muteButton);
    expect(muteButton).toHaveAttribute("aria-label", "Unmute");
    fireEvent.click(muteButton);
    expect(muteButton).toHaveAttribute("aria-label", "Mute");
  });

  test("changes playback speed", () => {
    render(<AudioPlayer {...defaultProps} />);
    const speedButton = screen.getByRole("button", { name: /speed/i });
    fireEvent.click(speedButton);
    expect(speedButton).toHaveAttribute("aria-label", "Playback speed");
    const speedOption = screen.getByLabelText("1.5x");
    fireEvent.click(speedOption);
    expect(screen.getAllByText("1.5x").length).toBeGreaterThan(0);
  });

  test("changes volume when slider is adjusted", () => {
    render(<AudioPlayer {...defaultProps} />);
    const volumeSlider = screen.getByLabelText("Volume control");
    fireEvent.change(volumeSlider, { target: { value: "0.5" } });
    expect(volumeSlider).toHaveValue("0.5");
  });

  test("falls back to a plain audio element if waveform setup times out", async () => {
    jest.useFakeTimers();

    const { container } = render(<AudioPlayer {...defaultProps} />);

    await act(async () => {
      jest.advanceTimersByTime(15000);
      await Promise.resolve();
    });

    await act(async () => {
      jest.advanceTimersByTime(15000);
      await Promise.resolve();
    });

    expect(container.querySelector("audio")).toBeInTheDocument();
    expect(mockWaveSurferCreate).toHaveBeenCalled();
  });

  test("renders next and previous track buttons when playlist prop is provided", () => {
    const playlist = {
      items: [
        { src: "audio1.mp3", duration: 60 },
        { src: "audio2.mp3", duration: 90 },
      ],
    };
    render(<AudioPlayer playlist={playlist} />);
    expect(screen.getByRole("button", { name: /next track/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /previous track/i })).toBeInTheDocument();
  });
});
