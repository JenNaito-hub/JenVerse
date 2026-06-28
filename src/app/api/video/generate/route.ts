import { NextResponse } from "next/server";

import { isVideoConfigured } from "@/lib/env";
import { SAMPLE_VIDEO, videoPosters } from "@/data/videos";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { prompt, duration, aspectRatio } = (await request.json()) as {
      prompt?: string;
      duration?: string;
      aspectRatio?: string;
    };

    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: "prompt is required" },
        { status: 400 }
      );
    }

    // Text-to-video providers (Runway, Pika, Luma) run async jobs. With a
    // VIDEO_API_KEY this is where we'd submit the job and poll for the result.
    // V1 returns a sample clip so the studio is fully usable without a key.
    const poster =
      videoPosters[Math.floor(Math.random() * videoPosters.length)];

    return NextResponse.json({
      clip: {
        poster,
        url: SAMPLE_VIDEO,
        duration: duration ?? "15s",
        aspectRatio: aspectRatio ?? "9:16",
      },
      live: isVideoConfigured(),
    });
  } catch (error) {
    console.error("[api/video/generate]", error);
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
  }
}
