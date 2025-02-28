import React from 'react';
import { createRoot } from 'react-dom/client';
import AudioPlayer, { AudioPlayerProps } from './AudioPlayer';
import VideoPlayer, { VideoPlayerProps } from './VideoPlayer';

declare global {
    interface Window {
        AudioPlayer: (props: AudioPlayerProps) => HTMLDivElement;
        VideoPlayer: (props: VideoPlayerProps) => HTMLDivElement;
    }
}

// Export the components as global variables
(window as Window & typeof globalThis).AudioPlayer = (props: AudioPlayerProps) => {
    const container = document.createElement('div');
    const root = createRoot(container);
    root.render(React.createElement(AudioPlayer, props));
    return container;
};

(window as Window & typeof globalThis).VideoPlayer = (props: VideoPlayerProps) => {
    const container = document.createElement('div');
    const root = createRoot(container);
    root.render(React.createElement(VideoPlayer, props));
    return container;
};
