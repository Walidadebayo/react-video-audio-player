import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  PackageOpen,
  Rocket,
  SquarePlay,
} from "lucide-react";

import CodeHighlighter from "@/components/ui/CodeHighlighter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Installation | React Video Audio Player",
  description:
    "Learn how to install and set up React Video Audio Player in your project. Follow our step-by-step guide for easy integration.",
  keywords:
    "React, installation, setup, video player, audio player, React Video Audio Player, guide, integration",
};

const installOptions = [
  {
    title: "NPM",
    icon: PackageOpen,
    description: "Best for most React projects.",
    code: "npm install react-video-audio-player",
    language: "bash",
  },
  {
    title: "Yarn",
    icon: CheckCircle2,
    description: "Use if your app already standardizes on Yarn.",
    code: "yarn add react-video-audio-player",
    language: "bash",
  },
  {
    title: "pnpm",
    icon: CheckCircle2,
    description: "Great for fast installs and strict dependency graphs.",
    code: "pnpm add react-video-audio-player",
    language: "bash",
  },
  {
    title: "CDN",
    icon: ArrowRight,
    description: "Useful for quick prototypes and script-tag integration.",
    code: `<!-- UMD -->
<script src="https://cdn.jsdelivr.net/npm/react-video-audio-player/dist/index.umd.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/react-video-audio-player/dist/video-audio-player.min.css" />`,
    language: "html",
  },
];

export default function InstallationPage() {
  return (
    <div className="relative overflow-x-clip">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.14),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_28%)]" />
      <div className="mx-auto flex w-full max-w-[100rem] flex-col gap-16 px-4 py-12 md:px-6 lg:px-8">
        <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur">
              <PackageOpen className="h-4 w-4 text-cyan-500" />
              Fast setup for the full video and audio package
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Install in one command, then ship a better media experience.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                React Video Audio Player works with modern React apps, CDN
                embeds, and custom player layouts. Pick the install path you
                need and move straight into the player features that matter.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link href="/docs">
                  <SquarePlay className="h-4 w-4" />
                  Read the docs
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-6"
              >
                <Link href="/demo">
                  <Rocket className="h-4 w-4" />
                  Open the demo
                </Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                "Video and audio components",
                "CDN and npm support",
                "Playlist, preview, and waveform features",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-sm text-muted-foreground shadow-sm backdrop-blur"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <Card className="border-border/60 bg-card/80 shadow-xl shadow-cyan-950/10 backdrop-blur">
            <CardHeader className="space-y-3 border-b border-border/60 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10">
              <CardTitle className="text-2xl">Quick start</CardTitle>
              <CardDescription className="text-base">
                The fastest route is usually npm, pnpm, or yarn. CDN is there
                for demos and legacy integration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-6">
              {[
                "Install the package",
                "Import VideoPlayer or AudioPlayer",
                "Pass your source and configure controls",
                "Enable previews, tracks, or waveform audio as needed",
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/80 p-4"
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-xs font-bold text-cyan-700 dark:text-cyan-300">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {step}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          {installOptions.map(
            ({ title, icon: Icon, code, description, language }) => (
              <Card
                key={title}
                className="border-border/60 bg-card/80 shadow-sm backdrop-blur"
              >
                <CardHeader className="space-y-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{title}</CardTitle>
                    <CardDescription className="mt-2 text-sm leading-6">
                      {description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <CodeHighlighter language={language} showLineNumbers={false}>
                    {code}
                  </CodeHighlighter>
                </CardContent>
              </Card>
            ),
          )}
        </section>

        <section className="grid gap-8">
          <div className="space-y-5 grid md:grid-cols-2 gap-8">
            <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm leading-7 text-muted-foreground">
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                    React 16.8 or higher
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                    Modern browser with HTML5 video/audio support
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                    Internet connection for streaming media
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl">Browser Support</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm leading-7 text-muted-foreground">
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                    Chrome (latest)
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                    Firefox (latest)
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                    Safari (latest)
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                    Edge (latest)
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                    Opera (latest)
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <Card className="border-border/60 bg-card/80 shadow-lg backdrop-blur">
            <CardHeader className="border-b border-border/60 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10">
              <CardTitle className="text-3xl">Basic usage</CardTitle>
              <CardDescription className="text-base">
                Start with the component that fits your media type, then add the
                optional props your product needs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-6">
              <div>
                <h2 className="mb-4 text-2xl font-bold">Video Player</h2>
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
              </div>

              <div>
                <h3 className="mb-4 text-xl font-bold">UMD Version</h3>
                <CodeHighlighter language="html">
                  {`<div id="video-player-container"></div>

<!-- UMD -->
<script src="https://cdn.jsdelivr.net/npm/react-video-audio-player/dist/index.umd.min.js"></script>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/react-video-audio-player/dist/video-audio-player.min.css"
/>

<script>
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
</script>`}
                </CodeHighlighter>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold">Audio Player</h2>
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
              </div>

              <div>
                <h3 className="mb-4 text-xl font-bold">UMD Version</h3>
                <CodeHighlighter language="html">
                  {`<div id="audio-player-container"></div>
<script src="https://cdn.jsdelivr.net/npm/react-video-audio-player/dist/index.umd.min.js"></script>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/react-video-audio-player/dist/video-audio-player.min.css"
/>

<script>
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
            </CardContent>
          </Card>
        </section>

        <section className="rounded-3xl border border-border/60 bg-gradient-to-r from-cyan-500/10 via-background to-emerald-500/10 p-8 shadow-lg md:p-10">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-400">
                Next step
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Move from install to implementation.
              </h2>
              <p className="text-lg text-muted-foreground">
                Open the docs for prop details, or jump straight into the demo
                to test the controls before wiring it into your app.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link href="/docs">
                  View docs
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-6"
              >
                <Link href="/demo">Open demo</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
