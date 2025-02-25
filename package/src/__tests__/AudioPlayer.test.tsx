import React from "react";
import { render } from "@testing-library/react";
import { screen, fireEvent } from "@testing-library/dom";
import AudioPlayer from "../AudioPlayer";

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
});
