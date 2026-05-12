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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import CustomColorPicker from "@/components/ui/CustomColorPicker";
import { useColor } from "react-color-palette";
import { SlidersHorizontal, Sparkles, Video, MicVocal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DemoPage() {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "Interactive Demo | React Video Audio Player";
      document
        .querySelector("meta[name='description']")
        ?.setAttribute(
          "content",
          "Interactive demo of React Video Audio Player, showcasing features and configurations.",
        );
      document
        .querySelector("meta[name='keywords']")
        ?.setAttribute(
          "content",
          "React, demo, video player, audio player, interactive demo, React Video Audio Player, features, configurations, React Video Audio Player demo, React media player demo, React AV player demo",
        );
    }
  }, []);

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
    src: "https://cdn.pixabay.com/video/2026/04/17/347325_large.mp4",
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
  });

  useEffect(() => {
    setVideoConfig((prevConfig) => ({
      ...prevConfig,
      controlsToExclude: videoControlsToExclude,
    }));
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
    setAudioConfig((prevConfig) => ({
      ...prevConfig,
      controlsToExclude: audioControlsToExclude,
    }));
  }, [audioControlsToExclude]);

  const [audioColor, setAudioColor] = useColor(
    audioConfig.accentColor || "#60a5fa",
  );
  const [videoColor, setVideoColor] = useColor(
    videoConfig.accentColor || "#60a5fa",
  );

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_28%)]" />
      <div className="mx-auto max-w-[100rem] px-4 py-12 md:px-6 lg:px-8">
        <section className="mb-12 grid gap-8 rounded-[2rem] border border-border/60 bg-card/80 p-6 shadow-xl backdrop-blur lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-cyan-500" />
              Interactive playground for the full component set
            </div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Tune the player live, then drop the exact configuration into your
              app.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              Adjust video and audio settings side-by-side, test the control
              surface, and see how the player responds with poster, download,
              preview, shortcut, and waveform features turned on or off.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {[
                "Live config editing",
                "Video and audio presets",
                "Control exclusion menus",
                "Color customization",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border/60 bg-background/80 px-3 py-2"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <Card className="border-border/60 bg-background/80 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">What to try first</CardTitle>
              <CardDescription>
                Toggle the most visible features first to get a feel for the
                component’s behavior.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "Accent color", value: "Customize the primary color" },
                { label: "Controls", value: "Show or hide specific controls" },
                {
                  label: "Shortcuts",
                  value: "Enable or disable keyboard shortcuts",
                },
                {
                  label: "Download button",
                  value: "Toggle the download option for media",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border/60 bg-muted/40 p-4"
                >
                  <div className="text-sm font-semibold">{item.label}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {item.value}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <div className="grid gap-8">
          <section>
            <Card className=" border-border/60 bg-card/80 shadow-lg backdrop-blur">
              <CardHeader className="border-b border-border/60 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10">
                <CardTitle className="text-3xl">Video Player</CardTitle>
                <CardDescription className="text-base">
                  Resize the visible controls, change sources, toggle poster
                  handling, and see how the player reacts.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-8 p-6 lg:grid-cols-2">
                <div>
                  <VideoPlayer {...videoConfig} className="rounded-2xl" />
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
                  {/* <div>
                    <Label htmlFor="videoPoster">Video Poster URL</Label>
                    <Input
                      id="videoPoster"
                      value={videoConfig.poster}
                      onChange={(e) =>
                        setVideoConfig({ ...videoConfig, poster: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div> */}
                  <div className="grid grid-cols-2 gap-4 max-xs:grid-cols-1">
                    <div>
                      <Label htmlFor="videoAccentColor">Accent Color</Label>
                      <span className="mt-1 flex gap-2">
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
                      <div className="mt-1 flex gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                              Controls to Exclude
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>
                              Video Controls to Exclude
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {videoControlsList.map((control) => (
                              <DropdownMenuCheckboxItem
                                key={control}
                                checked={videoControlsToExclude.includes(
                                  control,
                                )}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setVideoControlsToExclude([
                                      ...videoControlsToExclude,
                                      control,
                                    ]);
                                  } else {
                                    setVideoControlsToExclude(
                                      videoControlsToExclude.filter(
                                        (item) => item !== control,
                                      ),
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
                  <div className="grid grid-cols-2 gap-4 max-xs:grid-cols-1">
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
                  <div className="grid grid-cols-2 gap-4 max-xs:grid-cols-1">
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
                  <div className="grid grid-cols-2 gap-4 max-xs:grid-cols-1">
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
                  <div className="grid grid-cols-2 gap-4 max-xs:grid-cols-1">
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
              </CardContent>
            </Card>
          </section>

          <section>
            <Card className=" border-border/60 bg-card/80 shadow-lg backdrop-blur">
              <CardHeader className="border-b border-border/60 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10">
                <CardTitle className="text-3xl">Audio Player</CardTitle>
                <CardDescription className="text-base">
                  Use this to test the waveform path, fallback audio element,
                  downloads, and keyboard shortcuts.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-8 p-6 lg:grid-cols-2">
                <div>
                  <AudioPlayer {...audioConfig} width="100%" />
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
                  <div className="grid grid-cols-2 gap-4 max-xs:grid-cols-1">
                    <div>
                      <Label htmlFor="audioAccentColor">Accent Color</Label>
                      <div className="mt-1 flex gap-2">
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
                      <div className="mt-1 flex gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                              Controls to Exclude
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>
                              Audio Controls to Exclude
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {audioControlsList.map((control) => (
                              <DropdownMenuCheckboxItem
                                key={control}
                                checked={audioControlsToExclude.includes(
                                  control,
                                )}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setAudioControlsToExclude([
                                      ...audioControlsToExclude,
                                      control,
                                    ]);
                                  } else {
                                    setAudioControlsToExclude(
                                      audioControlsToExclude.filter(
                                        (item) => item !== control,
                                      ),
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
                  <div className="grid grid-cols-2 gap-4 max-xs:grid-cols-1">
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
                  <div className="grid grid-cols-2 gap-4 max-xs:grid-cols-1">
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
                  <div className="grid grid-cols-2 gap-4 max-xs:grid-cols-1">
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
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
