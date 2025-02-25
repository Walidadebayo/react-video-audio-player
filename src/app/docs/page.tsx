import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { audioProps, videoProps } from "@/lib/utils";
import Clipboard from "@/components/ui/clipboard";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-8">Documentation</h1>

        <Tabs defaultValue="video" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="video">Video Player</TabsTrigger>
            <TabsTrigger value="audio">Audio Player</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="video">
            <div className="space-y-8">
              <section>
                <h2 className="text-3xl font-bold mb-4">Video Player Props</h2>
                <Clipboard
                  text={`import { VideoPlayerProps, preload, VideoControlOptionsToRemove, VideoMimeType, sources } from "react-video-audio-player";`}
                />
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>Video Player Properties</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left p-4">Prop</TableHead>
                        <TableHead className="text-left p-4">Type</TableHead>
                        <TableHead className="text-left p-4">Default</TableHead>
                        <TableHead className="text-left p-4">
                          Description
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {videoProps.map((prop) => (
                        <TableRow key={prop.prop} className="border-b">
                          <TableCell className="p-4">
                            <code className="bg-muted p-1 rounded-md">
                              {prop.prop}
                            </code>
                          </TableCell>
                          <TableCell className="p-4">
                            <code>{prop.type}</code>
                          </TableCell>
                          <TableCell className="p-4">
                            <code>{prop.default}</code>
                          </TableCell>
                          <TableCell className="p-4">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: prop.description,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold mb-4">Example Usage</h2>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{`import { VideoPlayer } from 'react-video-audio-player';

function App() {
  return (
    <VideoPlayer
      src="video.mp4"
      controls
      autoPlay={false}
      loop={false}
      muted={false}
      width="100%"
      height="auto"
      accentColor="#60a5fa"
    />
  );
}`}</code>
                </pre>
              </section>

              <section>
                <h2 className="text-3xl font-bold mb-4">Keyboard Shortcuts</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <code>Space</code> - Play/Pause
                  </li>
                  <li>
                    <code>M</code> - Mute/Unmute
                  </li>
                  <li>
                    <code>F</code> - Toggle Fullscreen
                  </li>
                  <li>
                    <code>P</code> - Picture-in-Picture
                  </li>
                  <li>
                    <code>←</code> - Seek -10s
                  </li>
                  <li>
                    <code>→</code> - Seek +10s
                  </li>
                  <li>
                    <code>↑</code> - Volume Up
                  </li>
                  <li>
                    <code>↓</code> - Volume Down
                  </li>
                  <li>
                    <code>S</code> - Change Speed
                  </li>
                </ul>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="audio">
            <div className="space-y-8">
              <section>
                <h2 className="text-3xl font-bold mb-4">Audio Player Props</h2>
                <Clipboard
                  text={`import { AudioPlayerProps, AudioControlOptionsToRemove } from "react-video-audio-player";
import WaveSurfer from "wavesurfer.js";`}
                />
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>Audio Player Properties</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left p-4">Prop</TableHead>
                        <TableHead className="text-left p-4">Type</TableHead>
                        <TableHead className="text-left p-4">Default</TableHead>
                        <TableHead className="text-left p-4">
                          Description
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {audioProps.map((prop) => (
                        <TableRow key={prop.prop} className="border-b">
                          <TableCell className="p-4">
                            <code className="bg-muted p-1 rounded-md">
                              {prop.prop}
                            </code>
                          </TableCell>
                          <TableCell className="p-4">
                            <code>{prop.type}</code>
                          </TableCell>
                          <TableCell className="p-4">
                            <code>{prop.default}</code>
                          </TableCell>
                          <TableCell className="p-4">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: prop.description,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold mb-4">Example Usage</h2>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{`import { AudioPlayer } from 'react-video-audio-player';

function App() {
  return (
    <AudioPlayer
      src="audio.mp3"
      controls
      autoPlay={false}
      loop={false}
      muted={false}
      width="100%"
      accentColor="#60a5fa"
    />
  );
}`}</code>
                </pre>
              </section>

              <section>
                <h2 className="text-3xl font-bold mb-4">Keyboard Shortcuts</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <code>Space</code> - Play/Pause
                  </li>
                  <li>
                    <code>M</code> - Mute/Unmute
                  </li>
                  <li>
                    <code>←</code> - Seek -10s
                  </li>
                  <li>
                    <code>→</code> - Seek +10s
                  </li>
                  <li>
                    <code>↑</code> - Volume Up
                  </li>
                  <li>
                    <code>↓</code> - Volume Down
                  </li>
                  <li>
                    <code>S</code> - Change Speed
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-bold mb-4">
                  WaveSurfer Integration
                </h2>
                <p>
                  The audio player uses WaveSurfer.js for waveform
                  visualization. For more information about WaveSurfer and its
                  features, visit the{" "}
                  <Link
                    href="https://wavesurfer.xyz/docs/classes/wavesurfer.default"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    WaveSurfer Documentation
                  </Link>
                  .
                </p>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="examples">
            <div className="space-y-8">
              <section>
                <div>
                  <h2 className="text-3xl font-bold mb-4">Utility Functions</h2>
                  <Clipboard
                    text={`import { formatTime } from 'react-video-audio-player';

// Format seconds to HH:MM:SS or MM:SS
const time = formatTime(125); // "2:05"
const longTime = formatTime(3661); // "1:01:01"`}
                  />
                </div>

                <div>
                  <h3 className="text-2xl font-bold my-4">
                    Standalone Version Usage
                  </h3>
                  <Clipboard
                    text={`<!-- Standalone Version (no React required) -->
<div id="video-player"></div>
<div id="audio-player"></div>

<script src="https://unpkg.com/react-video-audio-player@latest/dist/index.standalone.js"></script>
<link rel="stylesheet" href="https://unpkg.com/react-video-audio-player@latest/dist/video-audio-player.css">

<script>
// Initialize the VideoPlayer
const videoPlayerContainer = document.getElementById('video-player-container');
const videoPlayer = VideoPlayer({
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    controls: true,
    autoPlay: false,
    muted: false,
    loop: false,
    poster: 'https://i.ibb.co/W45zMcvj/Sintel-krafy-resized-Viz-Xpress.jpg',
    onReady: () => {
        console.log('Video is ready to play');
    },
});
videoPlayerContainer.appendChild(videoPlayer);

// Initialize the AudioPlayer
const audioPlayerContainer = document.getElementById('audio-player-container');
const audioPlayer = AudioPlayer({
    src: 'https://cdn.pixabay.com/audio/2024/11/11/audio_889cf15c3c.mp3',
    controls: true,
    autoPlay: false,
    muted: false,
    loop: false,
    onReady: () => {
        console.log('Audio is ready to play');
    },
});
audioPlayerContainer.appendChild(audioPlayer);
</script>`}
                  />
                </div>

                <div>
                  <h3 className="text-2xl font-bold my-4">CDN Usage</h3>
                  <Clipboard
                    text={`<!-- UMD Version -->
<div id="video-player-container"></div>
<div id="audio-player-container"></div>

<!-- UMD -->
<script src="https://unpkg.com/react-video-audio-player@latest/dist/index.umd.js"></script>
<link
  rel="stylesheet"
  href="https://unpkg.com/react-video-audio-player@latest/dist/video-audio-player.css"
/>

<!-- React -->
<script src="https://unpkg.com/react@latest/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@latest/umd/react-dom.production.min.js"></script>

<script>
  const { VideoPlayer, AudioPlayer } = ReactVideoAudioPlayer;

  const videoProps = {
    src: "video.mp4",
    controls: true,
    autoPlay: false,
    muted: false,
    loop: false,
    poster: "poster.jpg",
    onReady: () => {
      console.log("Video is ready to play");
    },
  };
  const VideoComponent = () => React.createElement(VideoPlayer, videoProps);
  ReactDOM.render(
    React.createElement(VideoComponent),
    document.getElementById("video-player-container")
  );

  const audioProps = {
    src: "audio.mp3",
    controls: true,
    autoPlay: false,
    muted: false,
    loop: false,
    onReady: () => {
      console.log("Audio is ready to play");
    },
  };
  const AudioComponent = () => React.createElement(AudioPlayer, audioProps);
  ReactDOM.render(
    React.createElement(AudioComponent),
    document.getElementById("audio-player-container")
  );
</script>`}
                  />
                </div>


                <h2 className="text-3xl font-bold my-4">Callback Examples</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">
                      Progress Tracking
                    </h3>
                    <Clipboard
                      text={`import { VideoPlayer } from 'react-video-audio-player';

function App() {
  const handleProgress = (currentTime: number, duration: number) => {
    const progress = (currentTime / duration) * 100;
    console.log(\`Progress: \${progress.toFixed(2)}%\`);
  };

  return (
    <VideoPlayer
      src="video.mp4"
      onProgress={handleProgress}
    />
  );
}`}
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4">
                      Player State Management
                    </h3>
                    <Clipboard
                      text={`import { useState } from 'react';
import { AudioPlayer } from 'react-video-audio-player';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  return (
    <AudioPlayer
      src="audio.mp3"
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onDuration={setDuration}
      onEnded={() => {
        setIsPlaying(false);
        console.log('Audio finished playing');
      }}
    />
  );
}`}
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4">Error Handling</h3>
                    <Clipboard
                      text={`import { VideoPlayer } from 'react-video-audio-player';

function App() {
  const handleError = () => {
    console.error('Failed to load video');
    // Show error message to user
  };

  return (
    <VideoPlayer
      src="video.mp4"
      onError={handleError}
      customErrorMessage="Failed to load video. Please try again."
    />
  );
}`}
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4">
                      Player References
                    </h3>
                    <Clipboard
                      text={`import { useRef } from 'react';
import { VideoPlayer, AudioPlayer } from 'react-video-audio-player';

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  return (
    <div>
      <VideoPlayer
        src="video.mp4"
        getVideoRef={(ref) => {
          videoRef.current = ref;
          // Access video element methods
          if (ref) {
            console.log('Video duration:', ref.duration);
          }
        }}
      />

      <AudioPlayer
        src="audio.mp3"
        getWaveSurferRef={(ref) => {
          waveSurferRef.current = ref;
          // Access WaveSurfer methods
          if (ref) {
            console.log('Audio duration:', ref.getDuration());
          }
        }}
        getAudioElement={(ref) => {
          audioRef.current = ref;
          // Access audio element methods
          if (ref) {
            console.log('Audio volume:', ref.volume);
          }
        }}
      />
    </div>
  );
}`}
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4">Seeked Callback</h3>
                    <Clipboard
                      text={`import { VideoPlayer } from 'react-video-audio-player';

function App() {
  const handleSeeked = (time: number) => {
    console.log(\`Video seeked to: \${time} seconds\`);
  };

  return (
    <VideoPlayer
      src="video.mp4"
      onSeeked={handleSeeked}
    />
  );
}`}
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4">Ready Callback</h3>
                    <Clipboard
                      text={`import { VideoPlayer } from 'react-video-audio-player';

function App() {
  const handleReady = () => {
    console.log('Video is ready to play');
  };

  return (
    <VideoPlayer
      src="video.mp4"
      onReady={handleReady}
    />
  );
}`}
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4">
                      Duration Callback
                    </h3>
                    <Clipboard
                      text={`import { VideoPlayer } from 'react-video-audio-player';

function App() {
  const handleDuration = (duration: number) => {
    console.log(\`Video duration: \${duration} seconds\`);
  };

  return (
    <VideoPlayer
      src="video.mp4"
      onDuration={handleDuration}
    />
  );
}`}
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4">Play Callback</h3>
                    <Clipboard
                      text={`import { VideoPlayer } from 'react-video-audio-player';

function App() {
  const handlePlay = () => {
    console.log('Video started playing');
  };

  return (
    <VideoPlayer
      src="video.mp4"
      onPlay={handlePlay}
    />
  );
}`}
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4">Pause Callback</h3>
                    <Clipboard
                      text={`import { VideoPlayer } from 'react-video-audio-player';

function App() {
  const handlePause = () => {
    console.log('Video paused');
  };

  return (
    <VideoPlayer
      src="video.mp4"
      onPause={handlePause}
    />
  );
}`}
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4">Ended Callback</h3>
                    <Clipboard
                      text={`import { VideoPlayer } from 'react-video-audio-player';

function App() {
  const handleEnded = () => {
    console.log('Video ended');
  };

  return (
    <VideoPlayer
      src="video.mp4"
      onEnded={handleEnded}
    />
  );
}`}
                    />
                  </div>
                </div>
              </section>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
