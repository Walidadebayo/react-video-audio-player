import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VideoPlayer, AudioPlayer } from "@/package/src";
import {
  ArrowRight,
  Captions,
  Layers3,
  MicVocal,
  NotebookTabs,
  PlayCircle,
  Pointer,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  SquarePlay,
  Waves,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CodeHighlighter from "@/components/ui/CodeHighlighter";

const featureCards = [
  {
    icon: Layers3,
    title: "Playlist-aware playback",
    description:
      "Chain multiple clips into one timeline with aggregated duration, seek mapping, and seamless auto-advance.",
  },
  {
    icon: Sparkles,
    title: "Preview clips",
    description:
      "Show clip-only or random previews with loop support for samples, teasers, and gated playback.",
  },
  {
    icon: Captions,
    title: "Subtitle and track support",
    description:
      "Load subtitles or captions, switch tracks, and keep text tracks in sync with the active media.",
  },
  {
    icon: SquarePlay,
    title: "Poster generation",
    description:
      "Generate a poster frame from any point in the video to make embeds and demos feel polished.",
  },
  {
    icon: Waves,
    title: "Waveform audio with fallback",
    description:
      "Use WaveSurfer.js for a rich waveform, with peak loading and a plain audio fallback for reliability.",
  },
  {
    icon: ShieldCheck,
    title: "Safer autoplay and lazy loading",
    description:
      "Delay loading until visible and block oversized autoplay so media stays predictable in production.",
  },
];

const capabilityCards = [
  {
    icon: PlayCircle,
    title: "Video player built for real apps",
    description:
      "Multiple sources, playback rate, fullscreen, picture-in-picture, download hooks, keyboard shortcuts, and custom control exclusions.",
  },
  {
    icon: MicVocal,
    title: "Audio player with waveform polish",
    description:
      "Volume, mute, speed, seek, downloads, progress callbacks, and a graceful fallback when waveform rendering is unavailable.",
  },
  {
    icon: Pointer,
    title: "Highly configurable controls",
    description:
      "Hide or keep only the controls you want, then tune accent color, sizing, poster timing, and preview behavior.",
  },
  {
    icon: ScanSearch,
    title: "Lazy loading that feels instant",
    description:
      "Media loads when the player enters view, keeping landing pages fast without sacrificing an interactive demo.",
  },
];

export default function Home() {
  return (
    <div className="relative overflow-x-clip">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.16),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(20,184,166,0.12),_transparent_28%),linear-gradient(to_bottom,_rgba(2,6,23,0.02),_transparent)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />

      <main className="mx-auto flex w-full max-w-[100rem] flex-col gap-24 px-4 py-16 md:px-6 lg:px-8">
        <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="space-y-8">
            <div className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-cyan-500" />
              Built for polished video and audio experiences
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-7xl">
                A modern React media player with the details users actually feel.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                Ship a video and audio player that looks premium, loads only
                when needed, and includes playlist timelines, preview snippets,
                captions, waveform audio, poster generation, and safer autoplay
                out of the box.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link href="/docs">
                  <NotebookTabs className="h-4 w-4" />
                  Read the docs
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-6">
                <Link
                  href="https://github.com/Walidadebayo/react-video-audio-player"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="rounded-full px-6">
                <Link href="https://www.jsdelivr.com/package/npm/react-video-audio-player">
                  Use CDN
                </Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                "Video + audio in one package",
                "Lazy-loads when visible",
                "Type-safe props and callbacks",
                "Customizable UI icons",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-sm text-muted-foreground shadow-sm backdrop-blur"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="max-w-xl rounded-3xl border border-border/60 bg-card/80 p-4 shadow-lg backdrop-blur">
              <p className="mb-3 text-sm font-medium text-muted-foreground">
                Install in seconds
              </p>
              <CodeHighlighter language="bash" showLineNumbers={false}>
                npm install react-video-audio-player
              </CodeHighlighter>
            </div>
          </div>

          <Card className="border-border/60 bg-card/80 shadow-2xl shadow-cyan-950/10 backdrop-blur">
            <CardHeader className="space-y-4 border-b border-border/60 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10">
              <div className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Product-ready features
              </div>
              <CardTitle className="text-3xl leading-tight">
                Built to feel complete, not just functional.
              </CardTitle>
              <CardDescription className="text-base">
                The strongest sell here is the product quality: richer media
                workflows, fewer edge cases, and controls that behave the way
                users expect.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Playlist-aware timeline",
                  "Preview snippets",
                  "Captions and track switching",
                  "Waveform audio with fallback",
                  "Poster generation",
                  "Customizable UI icons",
                  "Download hooks and shortcuts",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-sm font-medium shadow-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-border/60 bg-muted/40 p-5">
                <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>Media-first interactions</span>
                  <span>Configured through props</span>
                </div>
                <div className="space-y-3">
                  <div className="h-3 w-[72%] rounded-full bg-foreground/10" />
                  <div className="h-3 w-[90%] rounded-full bg-foreground/10" />
                  <div className="h-3 w-[64%] rounded-full bg-foreground/10" />
                </div>
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    "Controls",
                    "Tracks",
                    "Preview",
                    "Playlist",
                    "PiP",
                    "Download",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-background/80 px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-400">
              Why teams pick it
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Feature depth that makes the page worth landing on.
            </h2>
            <p className="max-w-2xl text-lg text-muted-foreground">
              These are the parts that differentiate the package from a basic
              media wrapper: real playlist handling, preview support, waveform
              audio, lazy loading, and controls you can actually tune.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map(({ icon: Icon, title, description }) => (
              <Card
                key={title}
                className="border-border/60 bg-background/80 shadow-sm backdrop-blur transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader className="space-y-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">{title}</CardTitle>
                  <CardDescription className="text-sm leading-7">
                    {description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          {capabilityCards.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="border-border/60 bg-background/80 shadow-sm backdrop-blur"
            >
              <CardHeader className="space-y-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription className="text-sm leading-7">
                  {description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className="space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-400">
              Live demo
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              The product sells itself once the controls are visible.
            </h2>
            <p className="max-w-2xl text-lg text-muted-foreground">
              The interactive players below show the package in action with the
              same polish your users would see in a real app.
            </p>
          </div>

          <div className="grid gap-8 xl:grid-cols-2 items-start">
            <Card className="border-border/60 bg-card/80 shadow-lg backdrop-blur">
              <CardHeader className="space-y-3 border-b border-border/60 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10">
                <CardTitle className="text-2xl">Video Player</CardTitle>
                <CardDescription className="text-sm leading-7">
                  Playlist timelines, subtitles, poster generation, and control
                  customization in one component.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 flex justify-center items-center md:p-6 ">
                <VideoPlayer
                  src="https://cdn.pixabay.com/video/2026/04/17/347325_large.mp4"
                  className="rounded-2xl w-full sm:!w-[800px] max-w-full"
                  generatePosterAt={600} 
                />
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/80 shadow-lg backdrop-blur">
              <CardHeader className="space-y-3 border-b border-border/60 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10">
                <CardTitle className="text-2xl">Audio Player</CardTitle>
                <CardDescription className="text-sm leading-7">
                  A richer audio experience with waveform visualization, peaks,
                  fallback playback, download support, and keyboard shortcuts.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <AudioPlayer src="https://cdn.pixabay.com/audio/2024/11/11/audio_889cf15c3c.mp3" />
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="rounded-3xl border border-border/60 bg-gradient-to-r from-cyan-500/10 via-background to-emerald-500/10 p-8 shadow-lg md:p-10">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-400">
                Ready to ship
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Give your app a player that feels intentional, not generic.
              </h2>
              <p className="text-lg text-muted-foreground">
                Keep the control surface familiar while adding the capabilities
                that make creators, editors, and end users trust the product.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link href="/docs">
                  <NotebookTabs className="h-4 w-4" />
                  Explore docs
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-6">
                <Link href="https://www.jsdelivr.com/package/npm/react-video-audio-player">
                  CDN setup
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
