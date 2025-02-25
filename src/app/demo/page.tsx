"use client";

import { useEffect, useState } from "react";

import {
  VideoPlayer,
  AudioPlayer,
  VideoControlOptionsToRemove,
  VideoPlayerProps,
  AudioControlOptionsToRemove,
  AudioPlayerProps,
} from "@/package/src";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import CustomColorPicker from "@/components/ui/CustomColorPicker";
import { useColor } from "react-color-palette";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DemoPage() {
  const [videoControlsToExclude, setVideoControlsToExclude] = useState<
    VideoControlOptionsToRemove[]
  >([]);
  const [audioControlsToExclude, setAudioControlsToExclude] = useState<
    AudioControlOptionsToRemove[]
  >([]);

  const videoControlsList: VideoControlOptionsToRemove[] = [
    "pip",
    "fullscreen",
    "center-playPause-button",
    "bottom-playPause-button",
    "progress",
    "current-time",
    "duration",
    "mute",
    "volume",
    "playbackRate",
    "skip-forward-backward",
    "captions",
  ];

  const audioControlsList: AudioControlOptionsToRemove[] = [
    "playPause",
    "current-time",
    "duration",
    "mute",
    "volume",
    "playbackRate",
  ];

  const [videoConfig, setVideoConfig] = useState<VideoPlayerProps>({
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    poster: "https://i.ibb.co/W45zMcvj/Sintel-krafy-resized-Viz-Xpress.jpg",
    controls: true,
    autoPlay: false,
    loop: false,
    muted: false,
    accentColor: "#60a5fa",
    preload: "auto",
    controlsToExclude: [],
    disableDoubleClick: false,
    doubleClickToFullscreen: false,
    showDownloadButton: false,
    disableShortcuts: false,
    tracks: [
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
    ],
  });

  useEffect(() => {
    setVideoConfig({
      ...videoConfig,
      controlsToExclude: videoControlsToExclude,
    });
  }, [videoControlsToExclude]);

  const [audioConfig, setAudioConfig] = useState<AudioPlayerProps>({
    src: "https://cdn.pixabay.com/audio/2024/11/11/audio_889cf15c3c.mp3",
    controls: true,
    autoPlay: false,
    loop: false,
    muted: false,
    accentColor: "#60a5fa",
    controlsToExclude: [],
    disableShortcuts: false,
    showDownloadButton: false,
  });

  useEffect(() => {
    setAudioConfig({
      ...audioConfig,
      controlsToExclude: audioControlsToExclude,
    });
  }, [audioControlsToExclude]);

  const [audioColor, setAudioColor] = useColor(
    audioConfig.accentColor || "#60a5fa"
  );
  const [videoColor, setVideoColor] = useColor(
    videoConfig.accentColor || "#60a5fa"
  );

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-12">Interactive Demo</h1>

      <div className="grid gap-12">
        {/* Video Player Demo */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Video Player</h2>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <VideoPlayer {...videoConfig} className="rounded-lg" />
            </div>
            <div className="space-y-6">
              <div>
                <Label htmlFor="videoSrc">Video Source URL</Label>
                <Input
                  id="videoSrc"
                  value={videoConfig.src}
                  onChange={(e) =>
                    setVideoConfig({ ...videoConfig, src: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="videoPoster">Video Poster URL</Label>
                <Input
                  id="videoPoster"
                  value={videoConfig.poster}
                  onChange={(e) =>
                    setVideoConfig({ ...videoConfig, poster: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 max-xs:grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="videoAccentColor">Accent Color</Label>
                  <span className="flex gap-2 mt-1">
                    <CustomColorPicker
                      color={videoColor}
                      onChange={(color) =>
                        setVideoConfig({
                          ...videoConfig,
                          accentColor: color.hex,
                        })
                      }
                      onChangeComplete={(color) => setVideoColor(color)}
                    />
                  </span>
                </div>
                <div>
                  <Label>Controls</Label>
                  <div className="flex gap-2 mt-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">Controls to Exclude</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>
                          Video Controls to Exclude
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {videoControlsList.map((control) => (
                          <DropdownMenuCheckboxItem
                            key={control}
                            checked={videoControlsToExclude.includes(control)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setVideoControlsToExclude([
                                  ...videoControlsToExclude,
                                  control,
                                ]);
                              } else {
                                setVideoControlsToExclude(
                                  videoControlsToExclude.filter(
                                    (item) => item !== control
                                  )
                                );
                              }
                            }}
                          >
                            {control}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 max-xs:grid-cols-1 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="videoControls"
                    checked={videoConfig.controls}
                    onCheckedChange={(checked) =>
                      setVideoConfig({ ...videoConfig, controls: checked })
                    }
                  />
                  <Label htmlFor="videoControls">Show Controls</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="videoAutoPlay"
                    checked={videoConfig.autoPlay}
                    onCheckedChange={(checked) =>
                      setVideoConfig({ ...videoConfig, autoPlay: checked })
                    }
                  />
                  <Label htmlFor="videoAutoPlay">Auto Play</Label>
                </div>
              </div>
              <div className="grid grid-cols-2 max-xs:grid-cols-1 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="videoLoop"
                    checked={videoConfig.loop}
                    onCheckedChange={(checked) =>
                      setVideoConfig({ ...videoConfig, loop: checked })
                    }
                  />
                  <Label htmlFor="videoLoop">Loop</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="videoMuted"
                    checked={videoConfig.muted}
                    onCheckedChange={(checked) =>
                      setVideoConfig({ ...videoConfig, muted: checked })
                    }
                  />
                  <Label htmlFor="videoMuted">Muted</Label>
                </div>
              </div>
              <div className="grid grid-cols-2 max-xs:grid-cols-1 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="videoDoubleClickFullscreen"
                    checked={videoConfig.doubleClickToFullscreen}
                    onCheckedChange={(checked) =>
                      setVideoConfig({
                        ...videoConfig,
                        doubleClickToFullscreen: checked,
                      })
                    }
                  />
                  <Label htmlFor="videoDoubleClickFullscreen">
                    Double Click to Fullscreen
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="videoDisableDoubleClick"
                    checked={videoConfig.disableDoubleClick}
                    onCheckedChange={(checked) =>
                      setVideoConfig({
                        ...videoConfig,
                        disableDoubleClick: checked,
                      })
                    }
                  />
                  <Label htmlFor="videoDisableDoubleClick">
                    Disable Double Click
                  </Label>
                </div>
              </div>
              <div className="grid grid-cols-2 max-xs:grid-cols-1 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="videoShowDownloadButton"
                    checked={videoConfig.showDownloadButton}
                    onCheckedChange={(checked) =>
                      setVideoConfig({
                        ...videoConfig,
                        showDownloadButton: checked,
                      })
                    }
                  />
                  <Label htmlFor="videoShowDownloadButton">
                    Show Download Button
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="videoDisableShortcuts"
                    checked={videoConfig.disableShortcuts}
                    onCheckedChange={(checked) =>
                      setVideoConfig({
                        ...videoConfig,
                        disableShortcuts: checked,
                      })
                    }
                  />
                  <Label htmlFor="videoDisableShortcuts">
                    Disable Keyboard Shortcuts
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Audio Player Demo */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Audio Player</h2>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <AudioPlayer
                {...audioConfig}
                width="100%"
                onVolumeChange={(time) => console.log(time)}
              />
            </div>
            <div className="space-y-6">
              <div>
                <Label htmlFor="audioSrc">Audio Source URL</Label>
                <Input
                  id="audioSrc"
                  value={audioConfig.src}
                  onChange={(e) =>
                    setAudioConfig({ ...audioConfig, src: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2  max-xs:grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="audioAccentColor">Accent Color</Label>
                  <div className="flex gap-2 mt-1">
                    <CustomColorPicker
                      color={audioColor}
                      onChange={(color) =>
                        setAudioConfig({
                          ...audioConfig,
                          accentColor: color.hex,
                        })
                      }
                      onChangeComplete={(color) => setAudioColor(color)}
                    />
                  </div>
                </div>
                <div>
                  <Label>Controls</Label>
                  <div className="flex gap-2 mt-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">Controls to Exclude</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>
                          Audio Controls to Exclude
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {audioControlsList.map((control) => (
                          <DropdownMenuCheckboxItem
                            key={control}
                            checked={audioControlsToExclude.includes(control)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setAudioControlsToExclude([
                                  ...audioControlsToExclude,
                                  control,
                                ]);
                              } else {
                                setAudioControlsToExclude(
                                  audioControlsToExclude.filter(
                                    (item) => item !== control
                                  )
                                );
                              }
                            }}
                          >
                            {control}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2  max-xs:grid-cols-1 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="audioControls"
                    checked={audioConfig.controls}
                    onCheckedChange={(checked) =>
                      setAudioConfig({ ...audioConfig, controls: checked })
                    }
                  />
                  <Label htmlFor="audioControls">Show Controls</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="audioAutoPlay"
                    checked={audioConfig.autoPlay}
                    onCheckedChange={(checked) =>
                      setAudioConfig({ ...audioConfig, autoPlay: checked })
                    }
                  />
                  <Label htmlFor="audioAutoPlay">Auto Play</Label>
                </div>
              </div>
              <div className="grid grid-cols-2  max-xs:grid-cols-1 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="audioLoop"
                    checked={audioConfig.loop}
                    onCheckedChange={(checked) =>
                      setAudioConfig({ ...audioConfig, loop: checked })
                    }
                  />
                  <Label htmlFor="audioLoop">Loop</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="audioMuted"
                    checked={audioConfig.muted}
                    onCheckedChange={(checked) =>
                      setAudioConfig({ ...audioConfig, muted: checked })
                    }
                  />
                  <Label htmlFor="audioMuted">Muted</Label>
                </div>
              </div>
              <div className="grid grid-cols-2  max-xs:grid-cols-1 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="audioShowDownloadButton"
                    checked={audioConfig.showDownloadButton}
                    onCheckedChange={(checked) =>
                      setAudioConfig({
                        ...audioConfig,
                        showDownloadButton: checked,
                      })
                    }
                  />
                  <Label htmlFor="audioShowDownloadButton">
                    Show Download Button
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="audioDisableShortcuts"
                    checked={audioConfig.disableShortcuts}
                    onCheckedChange={(checked) =>
                      setAudioConfig({
                        ...audioConfig,
                        disableShortcuts: checked,
                      })
                    }
                  />
                  <Label htmlFor="audioDisableShortcuts">
                    Disable Keyboard Shortcuts
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
