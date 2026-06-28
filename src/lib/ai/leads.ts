import "server-only";

import { env, isGeminiConfigured, isOpenAIConfigured } from "@/lib/env";
import type { LeadTemperature } from "@/types";

export interface LeadClassification {
  keywords: string[];
  temperature: LeadTemperature;
}

// Vietnamese buying-intent signals for the heuristic fallback.
const HOT_SIGNALS = [
  "giá", "bao nhiêu", "mua", "inbox", "ib", "order", "đặt", "ship",
  "còn hàng", "sỉ", "lấy", "cọc", "chốt", "sđt", "số điện thoại",
  "liên hệ", "mua ở đâu", "stk", "địa chỉ", "cod", "gấp",
];
const WARM_SIGNALS = [
  "đẹp", "thích", "quan tâm", "tư vấn", "ngon", "muốn", "tìm hiểu",
  "ưng", "xinh", "chất lượng", "review", "hợp", "hóng",
];

function heuristic(comment: string): LeadClassification {
  const c = comment.toLowerCase();
  const keywords = new Set<string>();
  let temperature: LeadTemperature = "cold";

  for (const k of HOT_SIGNALS) {
    if (c.includes(k)) {
      keywords.add(k);
      temperature = "hot";
    }
  }
  if (temperature !== "hot") {
    for (const k of WARM_SIGNALS) {
      if (c.includes(k)) {
        keywords.add(k);
        temperature = "warm";
      }
    }
  }
  return { keywords: Array.from(keywords).slice(0, 3), temperature };
}

function normalize(value: unknown): LeadClassification {
  const obj = (value ?? {}) as Record<string, unknown>;
  const temp = String(obj.temperature ?? "cold").toLowerCase();
  const temperature: LeadTemperature =
    temp === "hot" || temp === "warm" ? (temp as LeadTemperature) : "cold";
  const keywords = Array.isArray(obj.keywords)
    ? obj.keywords.map(String).slice(0, 3)
    : [];
  return { keywords, temperature };
}

/**
 * Classify a batch of comments into interest keywords + buying temperature.
 * Uses Gemini (or OpenAI) when configured; otherwise a keyword heuristic.
 */
export async function classifyLeads(
  comments: string[]
): Promise<LeadClassification[]> {
  if (comments.length === 0) return [];

  const numbered = comments.map((c, i) => `${i + 1}. ${c}`).join("\n");
  const instruction = `You are a sales lead analyst for Vietnamese social media. For each comment, extract up to 3 short interest keywords (in Vietnamese) and classify buying intent as "hot" (ready to buy — asks price, contact, wants to order/ship), "warm" (interested — likes, wants info, asks about quality), or "cold" (no buying intent). Return ONLY a JSON array with one object per comment IN ORDER, like: [{"keywords":["giá","ship"],"temperature":"hot"}].\n\nComments:\n${numbered}`;

  try {
    if (isGeminiConfigured()) {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(env.geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(instruction);
      const parsed = extractJsonArray(result.response.text());
      if (parsed && parsed.length === comments.length) {
        return parsed.map(normalize);
      }
    } else if (isOpenAIConfigured()) {
      const { default: OpenAI } = await import("openai");
      const client = new OpenAI({ apiKey: env.openaiKey });
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: instruction }],
      });
      const parsed = extractJsonArray(
        completion.choices[0]?.message?.content ?? ""
      );
      if (parsed && parsed.length === comments.length) {
        return parsed.map(normalize);
      }
    }
  } catch (error) {
    console.error("[leads] classification error, using heuristic:", error);
  }

  return comments.map(heuristic);
}

/** Generate a friendly Vietnamese sales reply to a lead's comment. */
export async function generateReply(
  name: string,
  comment: string
): Promise<string> {
  const prompt = `Bạn là nhân viên bán hàng thân thiện. Khách tên "${name}" vừa bình luận: "${comment}".
Viết MỘT câu trả lời ngắn gọn (2-3 câu), thân thiện, đúng trọng tâm, mời khách nhắn tin hoặc để lại SĐT để được tư vấn/báo giá. Tiếng Việt, kèm 1 emoji phù hợp. Chỉ trả về nội dung câu trả lời, không giải thích.`;

  try {
    if (isGeminiConfigured()) {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(env.geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      if (text) return text;
    } else if (isOpenAIConfigured()) {
      const { default: OpenAI } = await import("openai");
      const client = new OpenAI({ apiKey: env.openaiKey });
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });
      const text = completion.choices[0]?.message?.content?.trim();
      if (text) return text;
    }
  } catch (error) {
    console.error("[leads] reply error, using template:", error);
  }

  return `Chào ${name} 👋 Cảm ơn bạn đã quan tâm! Bạn nhắn tin hoặc để lại SĐT giúp shop tư vấn chi tiết và báo giá tốt nhất nhé ạ 💛`;
}

function extractJsonArray(text: string): unknown[] | null {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    const parsed = JSON.parse(text.slice(start, end + 1));
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
