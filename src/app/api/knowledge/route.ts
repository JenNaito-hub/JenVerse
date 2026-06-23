import { NextResponse } from "next/server";

import { generateKnowledge } from "@/lib/ai/knowledge";
import { addHistoryItem } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, model } = body as {
      messages: { role: "user" | "assistant"; content: string }[];
      model: string;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages is required" },
        { status: 400 }
      );
    }

    const result = await generateKnowledge(messages, model ?? "gpt-4o");

    // Best-effort persistence of the generation to history.
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) {
      await addHistoryItem({
        type: "knowledge",
        title: lastUser.content.slice(0, 60),
        prompt: lastUser.content,
        model: result.model,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/knowledge]", error);
    return NextResponse.json(
      { error: "Failed to generate" },
      { status: 500 }
    );
  }
}
