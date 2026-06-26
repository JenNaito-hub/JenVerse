/**
 * Centralized environment detection.
 *
 * JENVERSE is designed to run with OR without backend credentials. Every
 * integration checks these flags and gracefully falls back to mock data when
 * a provider isn't configured — so the app always runs, even with an empty
 * `.env.local`.
 */

export const env = {
  openaiKey: process.env.OPENAI_API_KEY ?? "",
  geminiKey: process.env.GEMINI_API_KEY ?? "",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  // Scraping provider (Apify) — optional.
  apifyToken: process.env.APIFY_TOKEN ?? "",
  apifyFacebookActor:
    process.env.APIFY_FACEBOOK_ACTOR ?? "apify~facebook-comments-scraper",
  apifyTiktokActor:
    process.env.APIFY_TIKTOK_ACTOR ?? "clockworks~tiktok-comments-scraper",
} as const;

export const isOpenAIConfigured = () => env.openaiKey.length > 0;
export const isGeminiConfigured = () => env.geminiKey.length > 0;
export const isApifyConfigured = () => env.apifyToken.length > 0;

/** True when the public Supabase env vars are present (safe on the client). */
export const isSupabaseConfigured = () =>
  Boolean(env.supabaseUrl) && Boolean(env.supabaseAnonKey);

/** Which providers are live — surfaced in the UI as status badges. */
export function getProviderStatus() {
  return {
    openai: isOpenAIConfigured(),
    gemini: isGeminiConfigured(),
    supabase: isSupabaseConfigured(),
  };
}
