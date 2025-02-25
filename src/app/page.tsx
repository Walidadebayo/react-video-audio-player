import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VideoPlayer, AudioPlayer } from "@/package/src";
import Clipboard from "@/components/ui/clipboard";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center space-y-20 mt-20">
      {/* Hero Section */}
      <section className="w-full bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                A Powerful & Customizable React Video & Audio Player
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Beautiful, responsive, and feature-rich media player components
                for React applications.
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                <strong>Supported Video Formats:</strong> MP4, WebM, OGG/OGV,
                MOV
                <br />
                <strong>Supported Audio Formats:</strong> MP3, WAV, M4A, MP4,
                AAC, WMA, FLAC, OGG, OPUS, WEBM
                <br />
                For unsupported formats, visit{" "}
                <Link
                  target="_blank"
                  className="underline"
                  href="https://vizxpress.com"
                >
                  VizXpress
                </Link>{" "}
                for conversion.
              </p>
            </div>
            <div className="gap-4 flex max-xs:flex-col items-center flex-row">
              <Button asChild>
                <Link href="/docs">Get Started</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link
                  href="https://github.com/Walidadebayo/react-video-audio-player"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/installation#cdn">Use CDN</Link>
              </Button>
            </div>
            <Clipboard />
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="w-full">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            Interactive Demo
          </h2>
          <div className="grid gap-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Video Player</h3>
              <div className="justify-center flex">
                <VideoPlayer
                  seekTo={10}
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
                  className="rounded-lg sm:!w-[800px] w-auto"
                  preload="auto"
                  poster="https://i.ibb.co/W45zMcvj/Sintel-krafy-resized-Viz-Xpress.jpg"
                  tracks={[
                    {
                      src: "https://durian.blender.org/wp-content/content/subtitles/sintel_en.srt",
                      kind: "subtitles",
                      label: "English",
                      srclang: "en",
                      default: true,
                    },
                    {
                      src: "https://durian.blender.org/wp-content/content/subtitles/sintel_es.srt",
                      kind: "subtitles",
                      label: "Spanish",
                      srclang: "es",
                      default: false,
                    },
                    {
                      src: "https://durian.blender.org/wp-content/content/subtitles/sintel_de.srt",
                      kind: "subtitles",
                      label: "German",
                      srclang: "de",
                      default: false,
                    },
                    {
                      src: "https://durian.blender.org/wp-content/content/subtitles/sintel_fr.srt",
                      kind: "subtitles",
                      label: "French",
                      srclang: "fr",
                      default: false,
                    },
                  ]}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Audio Player</h3>
              <AudioPlayer src="https://cdn.pixabay.com/audio/2024/11/11/audio_889cf15c3c.mp3" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            Key Features
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 p-6 bg-background rounded-lg shadow-sm">
              <h3 className="text-xl font-bold">Customizable Themes</h3>
              <p className="text-center text-muted-foreground">
                Easily change the appearance of the player to match your
                application&#39;s design.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-6 bg-background rounded-lg shadow-sm">
              <h3 className="text-xl font-bold">Multiple Formats</h3>
              <p className="text-center text-muted-foreground">
                Support for various audio and video formats including MP4, WebM,
                OGV, OGG MP3, WAV and more.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-6 bg-background rounded-lg shadow-sm">
              <h3 className="text-xl font-bold">Keyboard Shortcuts</h3>
              <p className="text-center text-muted-foreground">
                Built-in keyboard shortcuts for better accessibility and user
                experience.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-6 bg-background rounded-lg shadow-sm">
              <h3 className="text-xl font-bold">Responsive Design</h3>
              <p className="text-center text-muted-foreground">
                Fully responsive player that works seamlessly on all devices.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-6 bg-background rounded-lg shadow-sm">
              <h3 className="text-xl font-bold">Download Options</h3>
              <p className="text-center text-muted-foreground">
                Allow users to download audio and video files directly from the
                player.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-6 bg-background rounded-lg shadow-sm">
              <h3 className="text-xl font-bold">Subtitle Support</h3>
              <p className="text-center text-muted-foreground">
                Supports various subtitle formats such as SRT and VTT, including
                cross-origin subtitle sources.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
