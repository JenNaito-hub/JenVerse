"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Heart,
  Download,
  Wand2,
  Loader2,
  Workflow,
  X,
  ImageUp,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { AI_MODELS } from "@/lib/constants";
import { generatedImages, imageStyles, aspectRatios } from "@/data/images";
import type { GeneratedImage } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type GenMode = "text" | "image";

interface ActiveWorkflow {
  id: string;
  name: string;
  modelId?: string;
  mode?: GenMode;
}

export function ImageStudio({
  activeWorkflow,
  initialPrompt = "",
}: {
  activeWorkflow?: ActiveWorkflow;
  initialPrompt?: string;
}) {
  const [images, setImages] = useState<GeneratedImage[]>(generatedImages);
  const [mode, setMode] = useState<GenMode>(activeWorkflow?.mode ?? "text");
  const [prompt, setPrompt] = useState(initialPrompt);
  const [model, setModel] = useState<string>(
    activeWorkflow?.modelId ?? AI_MODELS.image[0].id
  );
  const [style, setStyle] = useState(imageStyles[0]);
  const [ratio, setRatio] = useState(aspectRatios[0]);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [strength, setStrength] = useState(65);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSourceFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setSourceImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const canGenerate =
    prompt.trim().length > 0 &&
    !loading &&
    (mode === "text" || sourceImage !== null);

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setLoading(true);

    const label =
      AI_MODELS.image.find((m) => m.id === model)?.label ?? "DALL·E 3";
    // In image-to-image, echo the source as the mock fallback so the result
    // visibly relates to the upload.
    let url =
      mode === "image" && sourceImage
        ? sourceImage
        : generatedImages[Math.floor(Math.random() * generatedImages.length)]
            .url;

    try {
      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          model,
          aspectRatio: ratio,
          style,
          mode,
          sourceImage: mode === "image" ? sourceImage : undefined,
          strength,
        }),
      });
      const data = await res.json();
      if (data?.url) url = data.url;
    } catch {
      // Network error — keep the mock fallback image.
    }

    const newImage: GeneratedImage = {
      id: `img-${Date.now()}`,
      prompt: prompt.trim(),
      url,
      model: label,
      aspectRatio: ratio,
      createdAt: new Date().toISOString(),
      liked: false,
    };
    setImages((prev) => [newImage, ...prev]);
    setLoading(false);
  };

  const toggleLike = (id: string) =>
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, liked: !img.liked } : img
      )
    );

  return (
    <div className="space-y-4">
      {activeWorkflow && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-foreground bg-foreground px-4 py-3 text-background">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-foreground">
              <Workflow className="h-4 w-4" />
            </span>
            <div className="text-sm">
              <span className="text-background/60">Running workflow</span>{" "}
              <span className="font-semibold">{activeWorkflow.name}</span>
              <span className="ml-2 text-background/60">
                — model & settings pre-applied
              </span>
            </div>
          </div>
          <Link
            href="/image"
            className="flex h-7 w-7 items-center justify-center rounded-full text-background/70 transition-colors hover:bg-background/10 hover:text-background"
            aria-label="Clear workflow"
          >
            <X className="h-4 w-4" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
        {/* Composer */}
        <Card className="h-fit p-5 lg:sticky lg:top-24">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-primary">
            <Wand2 className="h-4 w-4" />
          </span>
          <h2 className="font-semibold">Create an image</h2>
        </div>

        <div className="space-y-4">
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as GenMode)}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">Text to Image</TabsTrigger>
              <TabsTrigger value="image">Image to Image</TabsTrigger>
            </TabsList>
          </Tabs>

          {mode === "image" && (
            <div className="space-y-2">
              <Label>Source image</Label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleSourceFile(file);
                }}
              />
              {sourceImage ? (
                <div className="relative overflow-hidden rounded-xl border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sourceImage}
                    alt="Source"
                    className="h-40 w-full object-cover"
                  />
                  <button
                    onClick={() => setSourceImage(null)}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-foreground transition-colors hover:bg-background"
                    aria-label="Remove image"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/40 py-8 text-sm text-muted-foreground transition-colors hover:bg-secondary"
                >
                  <ImageUp className="h-6 w-6" />
                  Upload a reference image
                </button>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="prompt">
              {mode === "image" ? "Describe the changes" : "Prompt"}
            </Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                mode === "image"
                  ? "Restyle as a cozy autumn scene, warm tones, soft light…"
                  : "A serene Scandinavian living room bathed in golden hour light, editorial photography…"
              }
              className="min-h-[110px]"
            />
          </div>

          {mode === "image" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="strength">Transformation strength</Label>
                <span className="text-xs font-medium text-muted-foreground">
                  {strength}%
                </span>
              </div>
              <input
                id="strength"
                type="range"
                min={10}
                max={95}
                value={strength}
                onChange={(e) => setStrength(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
              />
              <p className="text-xs text-muted-foreground">
                Lower keeps the original; higher reimagines it more freely.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS.image.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Style</Label>
            <div className="flex flex-wrap gap-2">
              {imageStyles.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    style === s
                      ? "border-transparent bg-foreground text-background"
                      : "border-border text-muted-foreground hover:bg-secondary"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Aspect ratio</Label>
            <div className="flex flex-wrap gap-2">
              {aspectRatios.map((r) => (
                <button
                  key={r}
                  onClick={() => setRatio(r)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                    ratio === r
                      ? "border-transparent bg-foreground text-background"
                      : "border-border text-muted-foreground hover:bg-secondary"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full"
            onClick={handleGenerate}
            disabled={!canGenerate}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {loading ? "Generating…" : "Generate"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Uses ~2 credits per image
          </p>
        </div>
      </Card>

      {/* Gallery */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your creations</h2>
          <Badge variant="muted">{images.length} images</Badge>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {loading && (
            <div className="aspect-square animate-pulse rounded-2xl bg-muted shimmer" />
          )}
          {images.map((img) => (
            <GalleryTile key={img.id} image={img} onLike={toggleLike} />
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}

function GalleryTile({
  image,
  onLike,
}: {
  image: GeneratedImage;
  onLike: (id: string) => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-secondary">
      <div className="relative aspect-square">
        <Image
          src={image.url}
          alt={image.prompt}
          fill
          sizes="(max-width: 640px) 50vw, 33vw"
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-foreground/80 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
        <p className="line-clamp-2 text-xs text-background">{image.prompt}</p>
        <div className="mt-2 flex items-center justify-between">
          <Badge variant="secondary" className="text-[10px]">
            {image.model}
          </Badge>
          <div className="flex gap-1">
            <button
              onClick={() => onLike(image.id)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-foreground transition-colors hover:bg-background"
              aria-label="Like"
            >
              <Heart
                className={cn(
                  "h-3.5 w-3.5",
                  image.liked && "fill-red-500 text-red-500"
                )}
              />
            </button>
            <button
              className="flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-foreground transition-colors hover:bg-background"
              aria-label="Download"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
      {image.liked && (
        <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 opacity-100 transition-opacity group-hover:opacity-0">
          <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
        </span>
      )}
    </div>
  );
}
