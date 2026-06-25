import "server-only";

import { env, isOpenAIConfigured, isGeminiConfigured } from "@/lib/env";

export interface KnowledgeRequestMessage {
  role: "user" | "assistant";
  content: string;
}

export interface KnowledgeResult {
  content: string;
  provider: "openai" | "gemini" | "mock";
  model: string;
}

const SYSTEM_PROMPT =
  "You are JENVERSE, a premium AI assistant for knowledge work. Be clear, helpful and concise. Use light markdown when it improves readability.";

const MOCK_REPLY =
  "This is a **preview response** from JENVERSE.\n\nThe UI is fully wired — add an `OPENAI_API_KEY` or `GEMINI_API_KEY` to your `.env.local` and this will stream a real answer from the selected model.\n\nUntil then, every part of the chat (history, model picker, prompt starters) works against mock data.";

/** Pick a provider from the model id, honoring which keys are configured. */
function resolveProvider(model: string): "openai" | "gemini" | "mock" {
  if (model.includes("gemini") && isGeminiConfigured()) return "gemini";
  if (model.startsWith("gpt") && isOpenAIConfigured()) return "openai";
  // Sensible fallbacks if the matching key is missing but another exists.
  if (isOpenAIConfigured()) return "openai";
  if (isGeminiConfigured()) return "gemini";
  return "mock";
}

export async function generateKnowledge(
  messages: KnowledgeRequestMessage[],
  model: string
): Promise<KnowledgeResult> {
  const provider = resolveProvider(model);

  try {
    if (provider === "openai") {
      const { default: OpenAI } = await import("openai");
      const client = new OpenAI({ apiKey: env.openaiKey });
      const openaiModel = model.startsWith("gpt") ? model : "gpt-4o";
      const completion = await client.chat.completions.create({
        model: openaiModel,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
      });
      return {
        content:
          completion.choices[0]?.message?.content?.trim() ?? MOCK_REPLY,
        provider: "openai",
        model: openaiModel,
      };
    }

    if (provider === "gemini") {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(env.geminiKey);
      const geminiModel = model.includes("gemini")
        ? model
        : "gemini-2.0-flash";
      const generativeModel = genAI.getGenerativeModel({
        model: geminiModel,
        systemInstruction: SYSTEM_PROMPT,
      });
      const result = await generativeModel.generateContent(
        messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n")
      );
      return {
        content: result.response.text().trim() || MOCK_REPLY,
        provider: "gemini",
        model: geminiModel,
      };
    }
  } catch (error) {
    console.error("[knowledge] provider error, falling back to mock:", error);
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: `⚠️ The ${provider} request failed:\n\n\`${message}\`\n\nCheck that your API key is valid and the selected model is available to it.`,
      provider: "mock",
      model,
    };
  }

  return { content: MOCK_REPLY, provider: "mock", model };
}

/** Streaming variant — yields text chunks as the model produces them. */
export async function* streamKnowledge(
  messages: KnowledgeRequestMessage[],
  model: string
): AsyncGenerator<string> {
  const provider = resolveProvider(model);

  try {
    if (provider === "openai") {
      const { default: OpenAI } = await import("openai");
      const client = new OpenAI({ apiKey: env.openaiKey });
      const openaiModel = model.startsWith("gpt") ? model : "gpt-4o";
      const stream = await client.chat.completions.create({
        model: openaiModel,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      });
      for await (const part of stream) {
        const delta = part.choices[0]?.delta?.content;
        if (delta) yield delta;
      }
      return;
    }

    if (provider === "gemini") {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(env.geminiKey);
      const geminiModel = model.includes("gemini")
        ? model
        : "gemini-2.0-flash";
      const generativeModel = genAI.getGenerativeModel({
        model: geminiModel,
        systemInstruction: SYSTEM_PROMPT,
      });
      const result = await generativeModel.generateContentStream(
        messages
          .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
          .join("\n\n")
      );
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) yield text;
      }
      return;
    }
  } catch (error) {
    console.error("[knowledge] stream error, falling back to mock:", error);
    const message = error instanceof Error ? error.message : String(error);
    yield `⚠️ The ${provider} request failed:\n\n\`${message}\`\n\nCheck that your API key is valid and the selected model is available to it.`;
    return;
  }

  // Mock: emit the demo reply in word-sized chunks.
  for (const word of MOCK_REPLY.split(" ")) {
    yield word + " ";
  }
}
