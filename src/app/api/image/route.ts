import { NextResponse } from "next/server";

import { generateImage } from "@/lib/ai/image";
import { addHistoryItem } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, model, aspectRatio, style, mode, sourceImage, strength } =
      body as {
        prompt: string;
        model: string;
        aspectRatio: string;
        style?: string;
        mode?: "text" | "image";
        sourceImage?: string;
        strength?: number;
      };

    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: "prompt is required" },
        { status: 400 }
      );
    }

    const result = await generateImage({
      prompt: prompt.trim(),
      model: model ?? "dall-e-3",
      aspectRatio: aspectRatio ?? "1:1",
      style,
      mode,
      sourceImage,
      strength,
    });

    await addHistoryItem({
      type: "image",
      title: prompt.trim().slice(0, 60),
      prompt: prompt.trim(),
      model: result.model,
      thumbnail: result.url,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/image]", error);
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
  }
}
