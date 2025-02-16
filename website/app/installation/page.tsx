import Clipboard from "@/components/ui/clipboard";

export default function InstallationPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-8">Installation Guide</h1>

        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-4">NPM</h2>
            <Clipboard text="npm install react-video-audio-player" />
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">Yarn</h2>
            <Clipboard text="yarn add react-video-audio-player" />
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">pnpm</h2>
            <Clipboard text="pnpm add react-video-audio-player" />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-4">Basic Usage</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-4">Video Player</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>
                  {`import { VideoPlayer } from 'react-video-audio-player';

function App() {
  return (
    <VideoPlayer src="video.mp4" />
  );
}`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">Audio Player</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`import { AudioPlayer } from 'react-video-audio-player';

function App() {
  return (
    <AudioPlayer src="audio.mp3"  />
  );
}`}</code>
              </pre>
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