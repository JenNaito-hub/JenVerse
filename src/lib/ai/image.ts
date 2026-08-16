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

export interface ImageRequest {
  prompt: string;
  model: string;
  aspectRatio: string;
  style?: string;
  mode?: "text" | "image";
  sourceImage?: string;
  strength?: number;
}

/** Split a `data:<mime>;base64,<data>` URL into its parts. */
function parseDataUrl(
  dataUrl: string
): { mimeType: string; data: string } | null {
  const match = dataUrl.match(/^data:(.+?);base64,([\s\S]*)$/);
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
}

export async function generateImage(req: ImageRequest): Promise<ImageResult> {
  const { prompt, model, aspectRatio, style, mode, sourceImage, strength } = req;
  const provider = resolveProvider(model);
  const styled = style ? `${prompt}. Style: ${style}.` : prompt;
  const isEdit = mode === "image" && !!sourceImage;

  // For edits, fold the strength slider into the instruction so the provider
  // knows how far to deviate from the uploaded image.
  const fullPrompt = isEdit
    ? `${styled} Apply these changes to the provided image. Transformation strength ${strength ?? 65}% — lower keeps the original composition, higher reimagines it more freely.`
    : styled;

  // Image-to-image falls back to echoing the uploaded source so the mock
  // result still relates to it.
  const mockFallback = isEdit ? (sourceImage as string) : mockUrl();

  try {
    if (provider === "openai") {
      const { default: OpenAI, toFile } = await import("openai");
      const client = new OpenAI({ apiKey: env.openaiKey });

      if (isEdit) {
        const parsed = parseDataUrl(sourceImage as string);
        if (parsed) {
          const file = await toFile(
            Buffer.from(parsed.data, "base64"),
            "source.png",
            { type: parsed.mimeType }
          );
          const edit = await client.images.edit({
            model: "gpt-image-1",
            image: file,
            prompt: fullPrompt,
            size: openAISize(aspectRatio),
          });
          const edited = edit.data?.[0];
          const editedUrl = edited?.url
            ? edited.url
            : edited?.b64_json
              ? `data:image/png;base64,${edited.b64_json}`
              : mockFallback;
          return { url: editedUrl, provider: "openai", model: "gpt-image-1" };
        }
      }

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
          : mockFallback;
      return { url, provider: "openai", model: openaiModel };
    }

    if (provider === "gemini") {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(env.geminiKey);
      // Gemini's image-capable model accepts an image + text and returns
      // inline image data — so it handles both text-to-image and edits.
      const generativeModel = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-preview-image-generation",
      });
      const parts: Array<
        string | { inlineData: { mimeType: string; data: string } }
      > = [fullPrompt];
      if (isEdit) {
        const parsed = parseDataUrl(sourceImage as string);
        if (parsed) {
          parts.push({
            inlineData: { mimeType: parsed.mimeType, data: parsed.data },
          });
        }
      }
      const result = await generativeModel.generateContent(parts);
      const responseParts =
        result.response.candidates?.[0]?.content?.parts ?? [];
      const imagePart = responseParts.find(
        (p) => "inlineData" in p && p.inlineData
      );
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

  return { url: mockFallback, provider: "mock", model };
}
