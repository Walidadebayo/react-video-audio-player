import CodeHighlighter from "@/components/ui/CodeHighlighter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Installation | React Video Audio Player",
  description:
    "Learn how to install and set up React Video Audio Player in your project. Follow our step-by-step guide for easy integration.",
  keywords:
    "React, installation, setup, video player, audio player, React Video Audio Player, guide, integration",
};

export default function InstallationPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-8">Installation Guide</h1>

        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-4">NPM</h2>
            <CodeHighlighter language="haskell" showLineNumbers={false}>
              npm install react-video-audio-player
            </CodeHighlighter>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">Yarn</h2>
            <CodeHighlighter language="haskell" showLineNumbers={false}>
              yarn add react-video-audio-player
            </CodeHighlighter>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">pnpm</h2>
            <CodeHighlighter language="bash" showLineNumbers={false}>
              pnpm add react-video-audio-player
            </CodeHighlighter>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">CDN</h2>
            <p className="mb-4">
              You can also include the package directly via CDN:
            </p>
            <CodeHighlighter language="html" showLineNumbers={false}>
              {`<!-- UMD -->
<script src="https://cdn.jsdelivr.net/npm/react-video-audio-player@1.3.1/dist/index.umd.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/react-video-audio-player@1.3.1/dist/video-audio-player.min.css" />`}
            </CodeHighlighter>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-4">Basic Usage</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-4">Video Player</h3>
              <CodeHighlighter>
                {`import { VideoPlayer } from 'react-video-audio-player';

function App() {
  return (
    <VideoPlayer src="video.mp4" />
  );
}`}
              </CodeHighlighter>
              <h4 className="text-xl font-bold mt-6 mb-4">UMD Version</h4>
              <CodeHighlighter language="html">
                {`<div id="video-player-container"></div>

<!-- UMD -->
<script src="https://cdn.jsdelivr.net/npm/react-video-audio-player@1.3.1/dist/index.umd.min.js"></script>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/react-video-audio-player@1.3.1/dist/video-audio-player.min.css"
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
</script>`}
              </CodeHighlighter>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">Audio Player</h3>
              <CodeHighlighter>
                {`import { AudioPlayer } from 'react-video-audio-player';

function App() {
  return (
    <AudioPlayer src="audio.mp3" />
  );
}`}
              </CodeHighlighter>
              <h4 className="text-xl font-bold mt-6 mb-4">UMD Version</h4>
              <CodeHighlighter language="html">
                {`<div id="audio-player-container"></div>
<!-- UMD -->
<script src="https://cdn.jsdelivr.net/npm/react-video-audio-player@1.3.1/dist/index.umd.min.js"></script>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/react-video-audio-player@1.3.1/dist/video-audio-player.min.css"
/>

<script>
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
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-4">Requirements</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>React 16.8 or higher</li>
            <li>Modern browser with HTML5 video/audio support</li>
            <li>Internet connection for streaming media</li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-4">Browser Support</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Chrome (latest)</li>
            <li>Firefox (latest)</li>
            <li>Safari (latest)</li>
            <li>Edge (latest)</li>
            <li>Opera (latest)</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
