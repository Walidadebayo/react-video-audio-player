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
import CodeHighlighter from "@/components/ui/CodeHighlighter";
import Link from "next/link";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Documentation | React Video Audio Player",
  description:
    "Explore the documentation for React Video Audio Player, a powerful and customisable media player for React applications.",
  keywords:
    "React, documentation, video player, audio player, React Video Audio Player, guide, features, API, react video audio player documentation",
};

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
                <CodeHighlighter>
                  {`import { VideoPlayerProps, preload, VideoControlOptionsToRemove, VideoMimeType, sources } from "react-video-audio-player";`}
                </CodeHighlighter>
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
                            <code className="bg-muted p-1 rounded-md dark:text-[#c678dd] text-[#0000ff]">
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
                <CodeHighlighter>
                  {`import { VideoPlayer } from 'react-video-audio-player';

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
}`}
                </CodeHighlighter>
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
                <CodeHighlighter>
                  {`import { AudioPlayerProps, AudioControlOptionsToRemove } from "react-video-audio-player";
import WaveSurfer from "wavesurfer.js";`}
                </CodeHighlighter>
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
                            <code className="bg-muted p-1 rounded-md dark:text-[#c678dd] text-[#0000ff]">
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
                <CodeHighlighter>
                  {`import { AudioPlayer } from 'react-video-audio-player';

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
}`}
                </CodeHighlighter>
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
                  visualisation. For more information about WaveSurfer and its
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
                  <CodeHighlighter>
                    {`import { formatTime } from 'react-video-audio-player';

// Format seconds to HH:MM:SS or MM:SS
const time = formatTime(125); // "2:05"
const longTime = formatTime(3661); // "1:01:01"`}
                  </CodeHighlighter>
                </div>

                <div>
                  <h3 className="text-2xl font-bold my-4">CDN Usage</h3>
                  <CodeHighlighter language="html">
                    {`
<div id="video-player-container"></div>
<div id="audio-player-container"></div>

<!-- UMD -->
<script src="https://cdn.jsdelivr.net/npm/react-video-audio-player@1.3.0/dist/index.umd.min.js"></script>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/react-video-audio-player@1.3.0/dist/video-audio-player.min.css"
/>

<script>
  // Initialise the VideoPlayer
  const videoPlayerContainer = document.getElementById('video-player-container');
  const videoPlayer = VideoPlayer({
    src: 'video.mp4',
    controls: true,
    autoPlay: false,
    muted: false,
    loop: false,
    poster: 'poster.jpg',
    onReady: () => {
      console.log('Video is ready to play');
    },
  });
  videoPlayerContainer.appendChild(videoPlayer);

  // Initialise the AudioPlayer
  const audioPlayerContainer = document.getElementById('audio-player-container');
  const audioPlayer = AudioPlayer({
    src: 'audio.mp3',
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
                  </CodeHighlighter>
                </div>

                <h2 className="text-3xl font-bold my-4">Callback Examples</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">
                      Progress Tracking
                    </h3>
                    <CodeHighlighter>
                      {`import { VideoPlayer } from 'react-video-audio-player';

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
                    </CodeHighlighter>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4">
                      Player State Management
                    </h3>
                    <CodeHighlighter>
                      {`import { useState } from 'react';
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
                    </CodeHighlighter>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4">Error Handling</h3>
                    <CodeHighlighter>
                      {`import { VideoPlayer } from 'react-video-audio-player';

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
                    </CodeHighlighter>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4">
                      Player References
                    </h3>
                    <CodeHighlighter>
                      {`import { useRef } from 'react';
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
                    </CodeHighlighter>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4">Seeked Callback</h3>
                    <CodeHighlighter>
                      {`import { VideoPlayer } from 'react-video-audio-player';

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
                    </CodeHighlighter>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4">Ready Callback</h3>
                    <CodeHighlighter>
                      {`import { VideoPlayer } from 'react-video-audio-player';

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
                    </CodeHighlighter>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4">
                      Duration Callback
                    </h3>
                    <CodeHighlighter>
                      {`import { VideoPlayer } from 'react-video-audio-player';

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
                    </CodeHighlighter>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4">Play Callback</h3>
                    <CodeHighlighter>
                      {`import { VideoPlayer } from 'react-video-audio-player';

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
                    </CodeHighlighter>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4">Pause Callback</h3>
                    <CodeHighlighter>
                      {`import { VideoPlayer } from 'react-video-audio-player';

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
                    </CodeHighlighter>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4">Ended Callback</h3>
                    <CodeHighlighter>
                      {`import { VideoPlayer } from 'react-video-audio-player';

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
                    </CodeHighlighter>
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
