import { NextResponse } from "next/server";

import { classifyLeads } from "@/lib/ai/leads";
import { mockComments, leadAvatar } from "@/data/leads";
import type { Lead, LeadSource } from "@/types";

export const runtime = "nodejs";

const VALID_SOURCES: LeadSource[] = [
  "facebook_post",
  "facebook_group",
  "tiktok_video",
];

export async function POST(request: Request) {
  try {
    const { url, source } = (await request.json()) as {
      url?: string;
      source?: LeadSource;
    };

    if (!url?.trim()) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }
    const src: LeadSource = VALID_SOURCES.includes(source as LeadSource)
      ? (source as LeadSource)
      : "facebook_post";

    // V1: comments come from the mock pool. A production build would call an
    // authorized scraping provider here (e.g. Apify / Bright Data) with `url`.
    // We vary the slice so different URLs feel like different result sets.
    const seed = url.length % 4;
    const raw = [...mockComments.slice(seed), ...mockComments.slice(0, seed)];

    // The valuable part — keyword extraction + hot/cold — runs for real via AI.
    const classifications = await classifyLeads(raw.map((c) => c.comment));

    const leads: Lead[] = raw.map((c, i) => ({
      id: `lead-${i}`,
      name: c.name,
      avatar: leadAvatar(c.name),
      comment: c.comment,
      keywords: classifications[i]?.keywords ?? [],
      temperature: classifications[i]?.temperature ?? "cold",
      source: src,
      commentedAt: c.commentedAt,
    }));

    return NextResponse.json({ leads });
  } catch (error) {
    console.error("[api/leads/scrape]", error);
    return NextResponse.json({ error: "Failed to scrape" }, { status: 500 });
  }
}
