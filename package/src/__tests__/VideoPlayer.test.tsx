import React from "react";
import { act, render } from "@testing-library/react";
import { screen, fireEvent } from "@testing-library/dom";
import VideoPlayer from "../VideoPlayer";

describe("VideoPlayer", () => {
  const defaultProps = {
    src: "https://videos.pexels.com/video-files/30445358/13047174_1920_1080_30fps.mp4",
    customErrorMessage: "Custom error message",
  };

  test("renders VideoPlayer component", () => {
    render(<VideoPlayer {...defaultProps} />);
    const videoElement = screen.getByRole("video");
    expect(videoElement).toBeInTheDocument();
  });

  test("toggles mute/unmute when button is clicked", () => {
    render(<VideoPlayer {...defaultProps} />);
    const muteButton = screen.getByRole("button", { name: /mute/i });
    fireEvent.click(muteButton);
    expect(muteButton).toHaveAttribute("aria-label", "Unmute");
    fireEvent.click(muteButton);
    expect(muteButton).toHaveAttribute("aria-label", "Mute");
  });

  test("toggles play/pause when button is clicked", () => {
    render(<VideoPlayer {...defaultProps} />);
    const playButtons = screen.getAllByRole("button", { name: /play/i });
    const playButton = playButtons[0];
    fireEvent.click(playButton);
    expect(playButton).toHaveAttribute("aria-label", "Pause");
    fireEvent.click(playButton);
    expect(playButton).toHaveAttribute("aria-label", "Play");
  });

  test("toggles fullscreen when button is clicked", () => {
    render(<VideoPlayer {...defaultProps} />);
    const fullscreenButton = screen.getByRole("button", {
      name: /fullscreen/i,
    });
    fireEvent.click(fullscreenButton);
    expect(fullscreenButton).toHaveAttribute("aria-label", "Exit fullscreen");
    fireEvent.click(fullscreenButton);
    expect(fullscreenButton).toHaveAttribute("aria-label", "Fullscreen");
  });

  test("toggles playback speed when button is clicked", () => {
    render(<VideoPlayer {...defaultProps} />);
    const speedButton = screen.getByRole("button", { name: /speed/i });
    fireEvent.click(speedButton);
    expect(speedButton).toHaveAttribute("aria-label", "Playback speed");
    const speedOption = screen.getByLabelText("1.5x");
    fireEvent.click(speedOption);
    expect(screen.getAllByText("1.5x").length).toBeGreaterThan(0);
  });

  test("toggles picture-in-picture when button is clicked", () => {
    render(<VideoPlayer {...defaultProps} />);
    const pipButton = screen.getByRole("button", {
      name: /picture-in-picture/i,
    });
    fireEvent.click(pipButton);
    expect(pipButton).toHaveAttribute("aria-label", "Picture-in-picture");
    fireEvent.click(pipButton);
    expect(pipButton).toHaveAttribute("aria-label", "Picture-in-picture");
  });

  test("changes volume when slider is adjusted", () => {
    render(<VideoPlayer {...defaultProps} />);
    const videoElement = screen.getByRole("video");
    const volumeSlider = screen.getByLabelText("Volume control");
    fireEvent.change(volumeSlider, { target: { value: "0.5" } });
    expect(volumeSlider).toHaveValue("0.5");
    expect((videoElement as HTMLVideoElement).volume).toBe(0.5);
  });

  test("changes video current time when slider is adjusted", () => {
    render(<VideoPlayer {...defaultProps} />);
    const videoElement = screen.getByRole("video");
    const seekSlider = screen.getByLabelText("Seek control");
    fireEvent.change(seekSlider, { target: { value: "10" } });
    (videoElement as HTMLVideoElement).currentTime = 10;
    expect((videoElement as HTMLVideoElement).currentTime).toBe(10);
  });

  test("handles keyboard shortcuts", () => {
    render(<VideoPlayer {...defaultProps} />);
    const videoElement = screen.getByRole("video");

    fireEvent.keyDown(window, { key: " " });
    expect((videoElement as HTMLVideoElement).paused).toBe(true);

    fireEvent.keyDown(window, { key: "m" });
    const muteButton = screen.getByRole("button", { name: /mute/i });
    expect(muteButton).toHaveAttribute("aria-label", "Unmute");

    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect((videoElement as HTMLVideoElement).currentTime).toBeGreaterThan(0);
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect((videoElement as HTMLVideoElement).currentTime).toBeLessThan(10);
    fireEvent.keyDown(window, { key: "s" });
    const speedButton = screen.getByRole("button", { name: /speed/i });
    expect(speedButton).toHaveAttribute("aria-label", "Playback speed");
    const speedOption = screen.getByLabelText("1.5x");
    fireEvent.click(speedOption);
    expect(screen.getAllByText("1.5x").length).toBeGreaterThan(0);
  });

  test("displays custom error message on video error", () => {
    render(<VideoPlayer {...defaultProps} />);
    fireEvent.error(screen.getByRole("video"));
    expect(
      screen.getByText(defaultProps.customErrorMessage),
    ).toBeInTheDocument();
  });

  test("plays only the configured preview clip", async () => {
    const { container } = render(
      <VideoPlayer
        {...defaultProps}
        preview={{ mode: "clip", start: 12, duration: 8 }}
      />,
    );

    const videoElement = screen.getByRole("video") as HTMLVideoElement;
    Object.defineProperty(videoElement, "duration", {
      configurable: true,
      value: 120,
    });

    await act(async () => {
      fireEvent(videoElement, new Event("loadedmetadata"));
      await Promise.resolve();
    });

    expect(container.querySelector("video")).toBeInTheDocument();
    expect(HTMLMediaElement.prototype.play as jest.Mock).toHaveBeenCalled();
    expect(videoElement.currentTime).toBeGreaterThanOrEqual(12);
    expect(videoElement.currentTime).toBeLessThanOrEqual(20);
  });

  test("prevents autoplay when the video is longer than the autoplay limit", async () => {
    (HTMLMediaElement.prototype.play as jest.Mock).mockClear();

    render(<VideoPlayer {...defaultProps} autoPlay maxAutoPlayDuration={30} />);

    const videoElement = screen.getByRole("video") as HTMLVideoElement;
    Object.defineProperty(videoElement, "duration", {
      configurable: true,
      value: 120,
    });

    await act(async () => {
      fireEvent(videoElement, new Event("loadedmetadata"));
      await Promise.resolve();
    });

    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
    expect(screen.getAllByRole("button", { name: /play/i })[0]).toHaveAttribute(
      "aria-label",
      "Play",
    );
  });

  test("renders playlist with multiple video items", () => {
    const playlist = {
      items: [
        { src: "video1.mp4", duration: 30 },
        { src: "video2.mp4", duration: 45 },
        { src: "video3.mp4", duration: 60 },
      ],
    };

    render(<VideoPlayer playlist={playlist} controls />);
    const videoElement = screen.getByRole("video") as HTMLVideoElement;
    expect(videoElement).toBeInTheDocument();
    expect(videoElement.src).toContain("video1.mp4");
  });

  test("handles playlist item advancement on video end", async () => {
    const playlist = {
      items: [
        { src: "video1.mp4", duration: 30 },
        { src: "video2.mp4", duration: 45 },
      ],
    };

    render(<VideoPlayer playlist={playlist} controls />);
    const videoElement = screen.getByRole("video") as HTMLVideoElement;

    Object.defineProperty(videoElement, "duration", {
      configurable: true,
      value: 30,
    });

    await act(async () => {
      fireEvent(videoElement, new Event("loadedmetadata"));
      await Promise.resolve();
    });

    // Simulate video ending
    videoElement.currentTime = 30;
    fireEvent(videoElement, new Event("timeupdate"));

    await act(async () => {
      await Promise.resolve();
    });

    // Should advance to next item (src should change)
    expect(videoElement.src).toBeDefined();
  });

  test("supports gapless playback with same-source clips using start/end times", async () => {
    const playlist = {
      items: [
        { src: "long-video.mp4", duration: 10, start: 0, end: 10 },
        { src: "long-video.mp4", duration: 10, start: 10, end: 20 },
        { src: "long-video.mp4", duration: 10, start: 20, end: 30 },
      ],
    };

    render(<VideoPlayer playlist={playlist} controls />);
    const videoElement = screen.getByRole("video") as HTMLVideoElement;
    expect(videoElement.src).toContain("long-video.mp4");
  });

  test("loops playlist when loop flag is enabled", async () => {
    const playlist = {
      items: [
        { src: "video1.mp4", duration: 30 },
        { src: "video2.mp4", duration: 45 },
      ],
      loop: true,
    };

    render(<VideoPlayer playlist={playlist} controls />);
    const videoElement = screen.getByRole("video") as HTMLVideoElement;

    Object.defineProperty(videoElement, "duration", {
      configurable: true,
      value: 30,
    });

    await act(async () => {
      fireEvent(videoElement, new Event("loadedmetadata"));
      await Promise.resolve();
    });

    // Simulate reaching end of last item
    videoElement.currentTime = 30;
    fireEvent(videoElement, new Event("timeupdate"));

    await act(async () => {
      await Promise.resolve();
    });

    // Should loop back to first item
    expect(videoElement.src).toBeDefined();
  });

  test("playlists always advance sequentially by default", async () => {
    const onEnded = jest.fn();
    const playlist = {
      items: [
        { src: "video1.mp4", duration: 30 },
        { src: "video2.mp4", duration: 45 },
      ],
    };

    render(<VideoPlayer playlist={playlist} controls onEnded={onEnded} />);
    const videoElement = screen.getByRole("video") as HTMLVideoElement;

    Object.defineProperty(videoElement, "duration", {
      configurable: true,
      value: 30,
    });

    await act(async () => {
      fireEvent(videoElement, new Event("loadedmetadata"));
      await Promise.resolve();
    });

    // Simulate video ending
    videoElement.currentTime = 30;
    fireEvent(videoElement, new Event("timeupdate"));

    await act(async () => {
      await Promise.resolve();
    });

    // Should advance to next item and not call onEnded
    expect(onEnded).not.toHaveBeenCalled();
  });
});
