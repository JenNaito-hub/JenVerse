import { NextResponse } from "next/server";

import { generateReply } from "@/lib/ai/leads";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { name, comment } = (await request.json()) as {
      name?: string;
      comment?: string;
    };

    if (!comment?.trim()) {
      return NextResponse.json(
        { error: "comment is required" },
        { status: 400 }
      );
    }

    const reply = await generateReply(name?.trim() || "bạn", comment.trim());
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[api/leads/reply]", error);
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
  }
}
