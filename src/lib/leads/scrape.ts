import "server-only";

import { env, isApifyConfigured } from "@/lib/env";
import { mockComments, type RawComment } from "@/data/leads";
import type { LeadSource } from "@/types";

/** Extract a Vietnamese phone number from free text, if present. */
export function extractPhone(text: string): string | undefined {
  const compact = text.replace(/[.\-()\s]/g, "");
  const match = compact.match(/(?:\+?84|0)\d{9}/);
  if (!match) return undefined;
  return match[0].replace(/^\+?84/, "0");
}

interface ApifyItem {
  name?: string;
  profileName?: string;
  ownerUsername?: string;
  uniqueId?: string;
  text?: string;
  comment?: string;
  commentText?: string;
  message?: string;
  date?: string;
  createdAt?: string;
  timestamp?: string;
}

function actorFor(source: LeadSource): string {
  return source === "tiktok_video"
    ? env.apifyTiktokActor
    : env.apifyFacebookActor;
}

function inputFor(source: LeadSource, url: string) {
  if (source === "tiktok_video") {
    return { postURLs: [url], commentsPerPost: 50 };
  }
  return { startUrls: [{ url }], resultsLimit: 50 };
}

/**
 * Fetch comments for a URL. Uses Apify when `APIFY_TOKEN` is configured;
 * otherwise returns the mock pool. Any failure falls back to mock so the
 * feature never breaks.
 */
export async function scrapeComments(
  url: string,
  source: LeadSource
): Promise<{ comments: RawComment[]; live: boolean }> {
  if (isApifyConfigured()) {
    try {
      const actor = actorFor(source);
      const res = await fetch(
        `https://api.apify.com/v2/acts/${actor}/run-sync-get-dataset-items?token=${env.apifyToken}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inputFor(source, url)),
        }
      );
      if (res.ok) {
        const items = (await res.json()) as ApifyItem[];
        const comments: RawComment[] = items
          .map((it) => ({
            name:
              it.name ??
              it.profileName ??
              it.ownerUsername ??
              it.uniqueId ??
              "Unknown",
            comment:
              it.text ?? it.comment ?? it.commentText ?? it.message ?? "",
            commentedAt:
              it.date ?? it.createdAt ?? it.timestamp ?? new Date().toISOString(),
          }))
          .filter((c) => c.comment.trim().length > 0);
        if (comments.length > 0) return { comments, live: true };
      }
    } catch (error) {
      console.error("[leads] Apify scrape failed, using mock:", error);
    }
  }

  // Mock fallback — vary the slice so different URLs feel distinct.
  const seed = url.length % 4;
  const comments = [
    ...mockComments.slice(seed),
    ...mockComments.slice(0, seed),
  ];
  return { comments, live: false };
}
