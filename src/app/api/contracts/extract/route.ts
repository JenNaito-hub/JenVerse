import { NextResponse } from "next/server";

import { extractContract } from "@/lib/ai/contracts";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { brief?: string; currentId?: string };
    const brief = body.brief?.trim();
    if (!brief) {
      return NextResponse.json({ error: "brief is required" }, { status: 400 });
    }
    const result = await extractContract(brief.slice(0, 4000), body.currentId ?? "collab");
    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/contracts/extract]", error);
    return NextResponse.json({ error: "Failed to extract" }, { status: 500 });
  }
}
