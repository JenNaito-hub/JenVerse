import "server-only";

import { env, isGeminiConfigured, isOpenAIConfigured } from "@/lib/env";
import { contractTemplates } from "@/data/contracts";

export interface ExtractResult {
  templateId: string;
  values: Record<string, string>;
  live: boolean;
}

const templateIds = contractTemplates.map((t) => t.id);
const validKeys = (id: string) =>
  new Set((contractTemplates.find((t) => t.id === id)?.fields ?? []).map((f) => f.key));

/** Compact schema of every template + its fields, for the extraction prompt. */
function schemaText(): string {
  return contractTemplates
    .map((t) => {
      const fields = t.fields
        .map((f) => {
          const kind =
            f.type === "date"
              ? ", định dạng YYYY-MM-DD"
              : f.type === "number"
                ? ", số nguyên VNĐ không dấu phân cách"
                : "";
          return `${f.key} (${f.label}${kind})`;
        })
        .join("; ");
      return `- id="${t.id}" — ${t.title} (${t.short}): ${t.description}\n  Trường: ${fields}`;
    })
    .join("\n");
}

function buildPrompt(brief: string, currentId: string): string {
  return `Bạn là trợ lý pháp lý cho công ty Babyface. Từ mô tả của người dùng, hãy CHỌN đúng loại văn bản và TRÍCH XUẤT giá trị các trường.

Các loại văn bản và trường có thể điền:
${schemaText()}

Mô tả của người dùng:
"""
${brief}
"""

Quy tắc:
- Chọn templateId phù hợp nhất với ý định người dùng. Nếu không rõ, dùng "${currentId}".
- Chỉ điền trường có thông tin trong mô tả. Trường không có thì BỎ QUA (đừng bịa).
- Bên A mặc định là "CÔNG TY TNHH BABYFACE" nếu người dùng không nói khác.
- Ngày ở định dạng YYYY-MM-DD. Tiền quy ra số nguyên VNĐ (ví dụ "50 triệu" → "50000000", "1 tỷ" → "1000000000").
- Với trường danh sách (mô tả công việc, thanh toán, mục đích, hạng mục...): mỗi mục một dòng, nối bằng ký tự xuống dòng.
- Trả về DUY NHẤT một object JSON, không giải thích: {"templateId":"<id>","values":{"<key>":"<value>"}}.`;
}

function extractJsonObject(text: string): Record<string, unknown> | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    const parsed = JSON.parse(text.slice(start, end + 1));
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function sanitize(raw: Record<string, unknown>, currentId: string): ExtractResult {
  let templateId = typeof raw.templateId === "string" ? raw.templateId : currentId;
  if (!templateIds.includes(templateId)) templateId = currentId;
  const keys = validKeys(templateId);
  const values: Record<string, string> = {};
  const src = (raw.values ?? {}) as Record<string, unknown>;
  for (const k of Object.keys(src)) {
    if (keys.has(k) && src[k] != null && src[k] !== "") values[k] = String(src[k]);
  }
  return { templateId, values, live: true };
}

/* ------------------------------------------------------------------ *
 * Demo-mode heuristic (no AI key) — fills the obvious fields locally.
 * ------------------------------------------------------------------ */

/** Lowercase + strip Vietnamese diacritics, so matching works with or without accents. */
function noAccent(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase();
}

function detectTemplate(text: string, currentId: string): string {
  const s = noAccent(text);
  if (/(bao mat|nda|non.?disclosure|bi mat)/.test(s)) return "nda";
  if (/(thanh ly|cham dut|tat toan)/.test(s)) return "liquidation";
  if (/(nghiem thu|ban giao|bbnt)/.test(s)) return "bbnt";
  if (/(gia han|phu luc|keo dai thoi han)/.test(s)) return "extension";
  if (/(dai su|doc quyen|ambassador)/.test(s)) return "ambassador";
  if (/(release|su dung hinh anh|quyen hinh anh|chan dung)/.test(s)) return "release";
  if (/(hop dong|hop tac|dich vu|thue|booking)/.test(s)) return "collab";
  return currentId;
}

function parseMoney(text: string): string | null {
  const s = noAccent(text);
  let m = s.match(/([\d.,]+)\s*(ty|ti)\b/);
  if (m) return String(Math.round(parseFloat(m[1].replace(/[.,]/g, ".")) * 1e9));
  m = s.match(/([\d.,]+)\s*(trieu|tr\b|cu\b)/);
  if (m) return String(Math.round(parseFloat(m[1].replace(/[.,]/g, ".")) * 1e6));
  m = s.match(/([\d][\d.,]{5,})\s*(d|vnd|dong)\b/);
  if (m) return m[1].replace(/[.,]/g, "");
  return null;
}

function parseName(text: string): string | null {
  // Find a role keyword (accent-insensitive), then take the capitalized words after it.
  const singleKw = new Set(["talent", "voi", "kol", "ban", "ca", "nghesi", "casi"]);
  const toks = text.split(/\s+/);
  for (let i = 0; i < toks.length - 1; i++) {
    const w = noAccent(toks[i]).replace(/[^a-z]/g, "");
    if (!singleKw.has(w)) continue;
    const name: string[] = [];
    for (let j = i + 1; j < toks.length && name.length < 4; j++) {
      const t = toks[j].replace(/[.,;:]+$/, "");
      const bare = noAccent(t).replace(/[^a-z]/g, "");
      if (singleKw.has(bare) && name.length === 0) continue; // skip a chained role word
      if (/^[A-ZĐÀ-Ỹ][\p{L}]+$/u.test(t)) name.push(t);
      else break;
    }
    if (name.length >= 1) return name.join(" ");
  }
  return null;
}

function parseProject(text: string): string | null {
  const m = text.match(
    /(?:dự án|du an|chiến dịch|chien dich|campaign|project|buổi|buoi|shoot)\s+([^,.;\n]{4,60})/i
  );
  return m ? m[1].trim() : null;
}

function heuristic(brief: string, currentId: string): ExtractResult {
  const templateId = detectTemplate(brief, currentId);
  const keys = validKeys(templateId);
  const values: Record<string, string> = {};
  const put = (k: string, v: string | null) => {
    if (v && keys.has(k)) values[k] = v;
  };
  put("partyB_name", parseName(brief));
  const money = parseMoney(brief);
  put("value", money);
  put("fee", money);
  put("penalty", money);
  const project = parseProject(brief);
  put("project", project);
  put("scope_project", project);
  put("brand", /babyface/i.test(brief) ? "Babyface" : null);
  // Drop the whole brief into the main free-text field so nothing is lost.
  for (const k of ["scope", "usage", "deliverables", "confidential", "result", "quality"]) {
    if (keys.has(k) && !values[k]) {
      values[k] = brief.trim();
      break;
    }
  }
  return { templateId, values, live: false };
}

/* ------------------------------------------------------------------ */

export async function extractContract(
  brief: string,
  currentId: string
): Promise<ExtractResult> {
  const prompt = buildPrompt(brief, currentId);
  try {
    if (isGeminiConfigured()) {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(env.geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      const parsed = extractJsonObject(result.response.text());
      if (parsed) return sanitize(parsed, currentId);
    } else if (isOpenAIConfigured()) {
      const { default: OpenAI } = await import("openai");
      const client = new OpenAI({ apiKey: env.openaiKey });
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });
      const parsed = extractJsonObject(completion.choices[0]?.message?.content ?? "");
      if (parsed) return sanitize(parsed, currentId);
    }
  } catch (error) {
    console.error("[contracts] extraction error, using heuristic:", error);
  }
  return heuristic(brief, currentId);
}
