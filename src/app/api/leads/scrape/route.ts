import { NextResponse } from "next/server";

import { classifyLeads } from "@/lib/ai/leads";
import { scrapeComments, extractPhone } from "@/lib/leads/scrape";
import { leadAvatar } from "@/data/leads";
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

    // Comments come from Apify when configured, otherwise the mock pool.
    const { comments, live } = await scrapeComments(url.trim(), src);

    // Keyword extraction + hot/cold runs for real via AI (Gemini/OpenAI).
    const classifications = await classifyLeads(comments.map((c) => c.comment));

    const leads: Lead[] = comments.map((c, i) => ({
      id: `lead-${i}`,
      name: c.name,
      avatar: leadAvatar(c.name),
      comment: c.comment,
      phone: extractPhone(c.comment),
      keywords: classifications[i]?.keywords ?? [],
      temperature: classifications[i]?.temperature ?? "cold",
      source: src,
      commentedAt: c.commentedAt,
    }));

    return NextResponse.json({ leads, live });
  } catch (error) {
    console.error("[api/leads/scrape]", error);
    return NextResponse.json({ error: "Failed to scrape" }, { status: 500 });
  }
}
