import { NextResponse } from "next/server";

import { streamKnowledge } from "@/lib/ai/knowledge";
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

    const selectedModel = model ?? "gpt-4o";

    // Best-effort persistence of the prompt to history.
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) {
      await addHistoryItem({
        type: "knowledge",
        title: lastUser.content.slice(0, 60),
        prompt: lastUser.content,
        model: selectedModel,
      });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of streamKnowledge(messages, selectedModel)) {
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (error) {
          console.error("[api/knowledge] stream", error);
          controller.enqueue(
            encoder.encode("\n\n⚠️ The response stream was interrupted.")
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    console.error("[api/knowledge]", error);
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
  }
}
