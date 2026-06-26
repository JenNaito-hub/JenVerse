import "server-only";

import { env, isGeminiConfigured, isOpenAIConfigured } from "@/lib/env";
import type { ContentCampaignConfig } from "@/types";

export interface GeneratedPost {
  title: string;
  content: string;
  tags: string[];
}

const TAG_POOL = [
  "Hook", "Sale", "Story", "Emotional", "Review", "Trust", "Tips", "Value", "CTA",
];

function buildPrompt(cfg: ContentCampaignConfig): string {
  return `Bạn là chuyên gia content marketing tiếng Việt. Hãy viết ${cfg.count} bài "${cfg.contentType}" KHÁC NHAU về chủ đề "${cfg.topic}".
Phong cách: ${cfg.style}. Tone cảm xúc: ${cfg.tone}. CTA: ${cfg.cta}.
Mỗi bài phải có câu hook mạnh ở đầu, dùng emoji hợp lý, xuống dòng rõ ràng, sẵn sàng đăng Facebook.
Trả về DUY NHẤT một mảng JSON, mỗi phần tử: {"title":"tiêu đề ngắn","content":"nội dung bài đầy đủ","tags":["Hook","Sale"]}.
tags chọn 1-3 từ trong: ${TAG_POOL.join(", ")}.`;
}

function mockPosts(cfg: ContentCampaignConfig): GeneratedPost[] {
  const tagSets = [
    ["Hook", "Sale", "CTA"],
    ["Story", "Emotional", "CTA"],
    ["Review", "Trust", "CTA"],
    ["Tips", "Value", "CTA"],
  ];
  return Array.from({ length: cfg.count }, (_, i) => ({
    title: `Bài ${i + 1}: ${cfg.topic} — góc nhìn ${i + 1}`,
    content: `✨ ${cfg.topic}\n\nĐây là bài mẫu #${i + 1} theo phong cách "${cfg.style}", tone "${cfg.tone}".\n\nThêm OPENAI_API_KEY hoặc GEMINI_API_KEY vào .env.local để AI viết nội dung thật theo chủ đề của bạn.\n\n👉 ${cfg.cta}`,
    tags: tagSets[i % tagSets.length],
  }));
}

function normalize(value: unknown, fallbackTitle: string): GeneratedPost {
  const obj = (value ?? {}) as Record<string, unknown>;
  return {
    title: typeof obj.title === "string" ? obj.title : fallbackTitle,
    content: typeof obj.content === "string" ? obj.content : "",
    tags: Array.isArray(obj.tags)
      ? obj.tags.map(String).filter((t) => TAG_POOL.includes(t)).slice(0, 3)
      : [],
  };
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

export async function generatePosts(
  cfg: ContentCampaignConfig
): Promise<{ posts: GeneratedPost[]; live: boolean }> {
  const prompt = buildPrompt(cfg);

  try {
    if (isGeminiConfigured()) {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(env.geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      const parsed = extractJsonArray(result.response.text());
      if (parsed && parsed.length > 0) {
        return {
          posts: parsed
            .slice(0, cfg.count)
            .map((p, i) => normalize(p, `Bài ${i + 1}`)),
          live: true,
        };
      }
    } else if (isOpenAIConfigured()) {
      const { default: OpenAI } = await import("openai");
      const client = new OpenAI({ apiKey: env.openaiKey });
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });
      const parsed = extractJsonArray(
        completion.choices[0]?.message?.content ?? ""
      );
      if (parsed && parsed.length > 0) {
        return {
          posts: parsed
            .slice(0, cfg.count)
            .map((p, i) => normalize(p, `Bài ${i + 1}`)),
          live: true,
        };
      }
    }
  } catch (error) {
    console.error("[content] generation error, using mock:", error);
  }

  return { posts: mockPosts(cfg), live: false };
}
