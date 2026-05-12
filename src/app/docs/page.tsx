import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Layers3,
  MicVocal,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  SquarePlay,
} from "lucide-react";
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
};

const docsHighlights = [
  {
    icon: PlayCircle,
    title: "Video player",
    description:
      "Multiple sources, playlist timelines, captions, previews, fullscreen, PiP, and custom control visibility.",
  },
  {
    icon: MicVocal,
    title: "Audio player",
    description:
      "Waveform playback, peaks loading, keyboard shortcuts, volume, speed, and graceful fallback rendering.",
  },
  {
    icon: Layers3,
    title: "Playlist support",
    description:
      "Treat multiple clips like one continuous experience with total duration and seek mapping.",
  },
  {
    icon: Sparkles,
    title: "Preview mode",
    description:
      "Expose clip-only or random previews for sampling, teasers, and gated playback flows.",
  },
  {
    icon: SquarePlay,
    title: "Poster generation",
    description:
      "Generate posters from any chosen timestamp to make embeds, demos, and listings feel finished.",
  },
  {
    icon: ShieldCheck,
    title: "Safer defaults",
    description:
      "Lazy load when visible and cap autoplay for oversized media so behaviour stays predictable.",
  },
];

export default function DocsPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.12),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_28%)]" />
      <div className="mx-auto flex w-full max-w-[100rem] flex-col gap-16 px-4 py-12 md:px-6 lg:px-8">
        <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-cyan-500" />
              Everything you need to ship a polished media player
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Documentation that focuses on what the package actually does.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                This package is more than a wrapper around a media element. It
                gives you playlist-aware video, preview clips, subtitle tracks,
                poster generation, waveform audio, downloads, shortcuts, and
                sensible loading behaviour.
              </p>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card/80 p-4 shadow-lg backdrop-blur">
              <p className="mb-3 text-sm font-medium text-muted-foreground">
                Quick install
              </p>
              <CodeHighlighter language="bash" showLineNumbers={false}>
                npm install react-video-audio-player
              </CodeHighlighter>
            </div>
          </div>

          <Card className="border-border/60 bg-card/80 shadow-xl shadow-cyan-950/10 backdrop-blur">
            <CardHeader className="space-y-3 border-b border-border/60 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10">
              <CardTitle className="text-2xl">At a glance</CardTitle>
              <CardDescription className="text-base">
                The docs are centered around the behaviors that help the player
                stand out in real applications.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 p-6 sm:grid-cols-2">
              {docsHighlights.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h2 className="text-base font-semibold">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <Tabs defaultValue="video" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-3 rounded-2xl bg-muted p-1">
            <TabsTrigger value="video">Video Player</TabsTrigger>
            <TabsTrigger value="audio">Audio Player</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="video">
            <div className="space-y-8">
              <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-3xl">Video Player Props</CardTitle>
                  <CardDescription className="text-base">
                    Core configuration for video playback, source handling, and
                    media-specific interactions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                <CodeHighlighter>
                  {`import { VideoPlayerProps, VideoPreviewOptions, PlaylistItem, PlaylistConfig, preload, VideoControlOptionsToRemove, VideoMimeType, sources } from "react-video-audio-player";`}
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
                                __html: prop.description || "",
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-3xl">Example Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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
      maxAutoPlayDuration={60}
      preview={{ mode: 'clip', start: 15, duration: 12, loop: false }}
    />
  );
}`}
                </CodeHighlighter>
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    Multiple Videos Playlist
                  </h3>
                  <CodeHighlighter>
                    {`import { VideoPlayer } from 'react-video-audio-player';

function App() {
  const playlist = {
    items: [
      { src: 'video1.mp4', duration: 45},
      { src: 'video2.mp4', duration: 120 },
      { src: 'video3.mp4', duration: 90 },
    ],
    loop: false,
  };

  return <VideoPlayer playlist={playlist} controls />;
}`}
                  </CodeHighlighter>
                </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-3xl">Keyboard Shortcuts</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audio">
            <div className="space-y-8">
              <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-3xl">Audio Player Props</CardTitle>
                  <CardDescription className="text-base">
                    The audio player leans on WaveSurfer.js for waveform-rich
                    playback and falls back cleanly when needed.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                <CodeHighlighter>
                  {`import { AudioPlayerProps, AudioControlOptionsToRemove } from "react-video-audio-player"; `}
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
                                __html: prop.description || "",
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-3xl">Example Usage</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-3xl">Keyboard Shortcuts</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-3xl">WaveSurfer Integration</CardTitle>
                </CardHeader>
                <CardContent>
                <p>
                  The audio player uses WaveSurfer.js for waveform
                  visualisation. For more information about WaveSurfer and its
                  features, visit the{" "}
                  <Link
                    href="https://wavesurfer.xyz/docs/classes/wavesurfer.default"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    WaveSurfer Documentation
                  </Link>
                  .
                </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="examples">
            <div className="space-y-8">
              <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-3xl">Utility Functions</CardTitle>
                  <CardDescription className="text-base">
                    The package exports helpers alongside the player components
                    so consumers can reuse the same formatting logic.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <CodeHighlighter>
                    {`import { formatTime } from 'react-video-audio-player';

// Format seconds to HH:MM:SS or MM:SS
const time = formatTime(125); // "2:05"
const longTime = formatTime(3661); // "1:01:01"`}
                  </CodeHighlighter>
                  <div>
                    <h3 className="text-2xl font-bold my-4">CDN Usage</h3>
                  <CodeHighlighter language="html">
                    {`
<div id="video-player-container"></div>
<div id="audio-player-container"></div>

<!-- UMD -->
<script src="https://cdn.jsdelivr.net/npm/react-video-audio-player@1.3.7/dist/index.umd.min.js"></script>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/react-video-audio-player@1.3.7/dist/video-audio-player.min.css"
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
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
