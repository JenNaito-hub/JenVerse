import { NextResponse } from "next/server";

import { generatePosts } from "@/lib/ai/content";
import type { ContentCampaignConfig } from "@/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ContentCampaignConfig>;

    if (!body.topic?.trim()) {
      return NextResponse.json({ error: "topic is required" }, { status: 400 });
    }

    const cfg: ContentCampaignConfig = {
      topic: body.topic.trim(),
      style: body.style ?? "Bán hàng",
      tone: body.tone ?? "Thân thiện",
      contentType: body.contentType ?? "Bài đăng Facebook",
      cta: body.cta ?? "Kêu gọi nhắn tin",
      count: Math.min(Math.max(Number(body.count) || 10, 1), 20),
    };

    const { posts, live } = await generatePosts(cfg);
    return NextResponse.json({ posts, live });
  } catch (error) {
    console.error("[api/content/generate]", error);
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
  }
}
