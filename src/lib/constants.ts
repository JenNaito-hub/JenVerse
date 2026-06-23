export const APP_NAME = "JENVERSE";
export const APP_DESCRIPTION =
  "A premium AI workspace for knowledge generation and image creation.";

/** Brand palette — mirrors the design tokens defined in tailwind.config.ts. */
export const BRAND = {
  lime: "#D7F205",
  dark: "#1F1F1F",
  canvas: "#F5F6F2",
} as const;

/** AI model catalog surfaced across the product (mock metadata). */
export const AI_MODELS = {
  knowledge: [
    { id: "gpt-4o", label: "GPT-4o", provider: "OpenAI" },
    { id: "gpt-4o-mini", label: "GPT-4o mini", provider: "OpenAI" },
    { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro", provider: "Google" },
  ],
  image: [
    { id: "dall-e-3", label: "DALL·E 3", provider: "OpenAI" },
    { id: "gpt-image-5-5", label: "ChatGPT Image 5.5", provider: "OpenAI" },
    { id: "imagen-3", label: "Imagen 3", provider: "Google" },
    { id: "nano-banana-2", label: "Banana 2.0", provider: "Google" },
  ],
} as const;
