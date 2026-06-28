import { createBrowserClient } from "@supabase/ssr";

import { env } from "@/lib/env";

/**
 * Browser-side Supabase client. Returns `null` when Supabase isn't configured
 * so callers can fall back to demo/mock behaviour without crashing.
 */
export function createClient() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) return null;
  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}
