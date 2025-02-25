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

          <div>
            <h2 className="text-3xl font-bold mb-4">CDN</h2>
            <p className="mb-4">
              You can also include the package directly via CDN:
            </p>
            <h3 className="text-xl font-bold mb-2">
              UMD Version (Requires React)
            </h3>
            <Clipboard
              text={`<script src="https://unpkg.com/react-video-audio-player@latest/dist/index.umd.js"></script>
<link rel="stylesheet" href="https://unpkg.com/react-video-audio-player@1.0.11/dist/video-audio-player.css">`}
            />

            <h3 className="text-xl font-bold mb-2 mt-4">Standalone Version</h3>
            <Clipboard
              text={`<script src="https://unpkg.com/react-video-audio-player@latest/dist/index.standalone.js"></script>
<link rel="stylesheet" href="https://unpkg.com/react-video-audio-player@1.0.11/dist/video-audio-player.css">`}
            />
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

// UDM Version
const { VideoPlayer } = ReactVideoAudioPlayer;
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

// Standalone Version

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
}`}
                </code>
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
    }
    
// UDM Version
const { AudioPlayer } = ReactVideoAudioPlayer;
const audioProps = {
src: "audio.mp3",
controls: true,
autoPlay: false,
muted: false,
loop: false,
onReady: () => {
console.log("Audio is ready to play");
}
};
const AudioComponent = () => React.createElement(AudioPlayer, audioProps);
ReactDOM.render(
React.createElement(AudioComponent),
document.getElementById("audio-player-container")
);

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
`}</code>
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
