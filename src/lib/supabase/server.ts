import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { env } from "@/lib/env";

/**
 * Server-side Supabase client (Server Components, Route Handlers, Actions).
 * Returns `null` when Supabase isn't configured.
 */
export function createClient() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) return null;

  const cookieStore = cookies();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — safe to ignore when middleware
          // is refreshing the session.
        }
      },
    },
  });
}
