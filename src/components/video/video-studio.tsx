"use client";

import { useEffect, useState } from "react";
import {
  Clapperboard,
  Sparkles,
  Loader2,
  Play,
  Info,
  Download,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  videoStyles,
  videoDurations,
  videoVoices,
  videoRatios,
} from "@/data/videos";
import { toast } from "@/components/ui/toast";
import type { VideoClip } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/empty-state";

export function VideoStudio({ aiConfigured }: { aiConfigured: boolean }) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(videoStyles[0]);
  const [duration, setDuration] = useState(videoDurations[0]);
  const [voice, setVoice] = useState(videoVoices[0]);
  const [ratio, setRatio] = useState(videoRatios[0]);
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState<VideoClip | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("jenverse:videos");
      if (saved) setClips(JSON.parse(saved));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("jenverse:videos", JSON.stringify(clips));
    } catch {
      /* ignore */
    }
  }, [clips, hydrated]);

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style,
          duration,
          voice,
          aspectRatio: ratio,
        }),
      });
      const data = await res.json();
      if (data?.clip) {
        const clip: VideoClip = {
          id: `vid-${Date.now()}`,
          title: prompt.trim().slice(0, 50),
          prompt: prompt.trim(),
          poster: data.clip.poster,
          url: data.clip.url,
          duration: data.clip.duration,
          aspectRatio: data.clip.aspectRatio,
          createdAt: new Date().toISOString(),
        };
        setClips((prev) => [clip, ...prev]);
        toast(data.live ? "Video generated" : "Sample video created (demo)");
      }
    } catch {
      toast("Generation failed — please try again");
    }
    setLoading(false);
  };

  const removeClip = (id: string) =>
    setClips((prev) => prev.filter((c) => c.id !== id));

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
        {/* Composer */}
        <Card className="h-fit p-5 lg:sticky lg:top-24">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-primary">
              <Clapperboard className="h-4 w-4" />
            </span>
            <h2 className="font-semibold">Tạo video</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vprompt">Kịch bản / mô tả</Label>
              <Textarea
                id="vprompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="VD: Video quảng cáo kem chống nắng, ánh nắng vàng, slow-motion giọt nước…"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Phong cách</Label>
              <Picker value={style} onChange={setStyle} options={videoStyles} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Thời lượng</Label>
                <Picker
                  value={duration}
                  onChange={setDuration}
                  options={videoDurations}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Tỉ lệ</Label>
                <Picker value={ratio} onChange={setRatio} options={videoRatios} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Giọng lồng tiếng</Label>
              <Picker value={voice} onChange={setVoice} options={videoVoices} />
            </div>

            <Button
              variant="primary"
              className="w-full"
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading ? "Đang dựng video…" : "Tạo video"}
            </Button>

            {!aiConfigured && (
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <p>
                  Demo — kết quả là video mẫu. Tạo video AI thật cần API bên
                  thứ ba (Runway / Pika / Luma) qua VIDEO_API_KEY.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Gallery */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Video của bạn</h2>
            <Badge variant="muted">{clips.length} video</Badge>
          </div>

          {clips.length === 0 && !loading ? (
            <EmptyState
              icon={Clapperboard}
              title="Chưa có video nào"
              description="Nhập kịch bản, chọn phong cách & giọng đọc, rồi bấm Tạo video."
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {loading && (
                <div className="aspect-[9/16] animate-pulse rounded-2xl bg-muted shimmer" />
              )}
              {clips.map((clip) => (
                <div
                  key={clip.id}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-secondary"
                >
                  <button
                    onClick={() => setPlaying(clip)}
                    className="relative block aspect-[9/16] w-full"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={clip.poster}
                      alt={clip.title}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-foreground/20 transition-colors group-hover:bg-foreground/30">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-background/90 text-foreground">
                        <Play className="ml-0.5 h-5 w-5 fill-current" />
                      </span>
                    </span>
                    <span className="absolute right-2 top-2 rounded-md bg-foreground/80 px-1.5 py-0.5 text-[10px] font-semibold text-background">
                      {clip.duration}
                    </span>
                  </button>
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-foreground/85 to-transparent p-2.5">
                    <p className="line-clamp-1 text-xs text-background">
                      {clip.title}
                    </p>
                    <button
                      onClick={() => removeClip(clip.id)}
                      className="shrink-0 rounded-full bg-background/90 p-1 text-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!playing} onOpenChange={(o) => !o && setPlaying(null)}>
        <DialogContent className="max-w-md p-2">
          <DialogTitle className="sr-only">
            {playing?.title ?? "Video"}
          </DialogTitle>
          {playing && (
            <div className="space-y-2">
              <video
                key={playing.id}
                src={playing.url}
                poster={playing.poster}
                controls
                autoPlay
                className={cn(
                  "w-full rounded-xl bg-black",
                  playing.aspectRatio === "9:16"
                    ? "aspect-[9/16]"
                    : playing.aspectRatio === "1:1"
                      ? "aspect-square"
                      : "aspect-video"
                )}
              />
              <div className="flex items-center justify-between px-2 pb-1">
                <p className="line-clamp-1 text-sm font-medium">
                  {playing.title}
                </p>
                <Button variant="ghost" size="sm" asChild>
                  <a href={playing.url} download target="_blank" rel="noopener">
                    <Download className="h-4 w-4" />
                    Tải về
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Picker({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
