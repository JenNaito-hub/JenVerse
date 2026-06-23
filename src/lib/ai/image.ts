import "server-only";

import { env, isOpenAIConfigured, isGeminiConfigured } from "@/lib/env";
import { generatedImages } from "@/data/images";

export interface ImageResult {
  url: string;
  provider: "openai" | "gemini" | "mock";
  model: string;
}

/** Map our UI aspect ratios to OpenAI image sizes. */
function openAISize(ratio: string): "1024x1024" | "1792x1024" | "1024x1792" {
  if (ratio === "16:9" || ratio === "3:2") return "1792x1024";
  if (ratio === "9:16" || ratio === "4:5") return "1024x1792";
  return "1024x1024";
}

function mockUrl(): string {
  const pool = generatedImages;
  return pool[Math.floor(Math.random() * pool.length)].url;
}

function resolveProvider(model: string): "openai" | "gemini" | "mock" {
  const isGoogle = model.includes("imagen") || model.includes("banana");
  if (isGoogle && isGeminiConfigured()) return "gemini";
  if (!isGoogle && isOpenAIConfigured()) return "openai";
  if (isOpenAIConfigured()) return "openai";
  if (isGeminiConfigured()) return "gemini";
  return "mock";
}

export async function generateImage(
  prompt: string,
  model: string,
  aspectRatio: string,
  style?: string
): Promise<ImageResult> {
  const provider = resolveProvider(model);
  const fullPrompt = style ? `${prompt}. Style: ${style}.` : prompt;

  try {
    if (provider === "openai") {
      const { default: OpenAI } = await import("openai");
      const client = new OpenAI({ apiKey: env.openaiKey });
      const openaiModel = model.includes("gpt-image")
        ? "gpt-image-1"
        : "dall-e-3";
      const result = await client.images.generate({
        model: openaiModel,
        prompt: fullPrompt,
        size: openAISize(aspectRatio),
        n: 1,
      });
      const item = result.data?.[0];
      const url = item?.url
        ? item.url
        : item?.b64_json
          ? `data:image/png;base64,${item.b64_json}`
          : mockUrl();
      return { url, provider: "openai", model: openaiModel };
    }

    if (provider === "gemini") {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(env.geminiKey);
      // Gemini's image-capable model returns inline image data.
      const generativeModel = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
      });
      const result = await generativeModel.generateContent(fullPrompt);
      const parts = result.response.candidates?.[0]?.content?.parts ?? [];
      const imagePart = parts.find((p) => "inlineData" in p && p.inlineData);
      if (imagePart && "inlineData" in imagePart && imagePart.inlineData) {
        return {
          url: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
          provider: "gemini",
          model: "gemini-2.0-flash-exp",
        };
      }
    }
  } catch (error) {
    console.error("[image] provider error, falling back to mock:", error);
  }

  return { url: mockUrl(), provider: "mock", model };
}
