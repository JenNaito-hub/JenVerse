"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export interface AuthState {
  error?: string;
  message?: string;
}

export async function login(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = createClient();
  // Demo mode — no Supabase configured. Let the user straight in.
  if (!supabase) redirect("/dashboard");

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = createClient();
  if (!supabase) redirect("/dashboard");

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) return { error: error.message };

  return {
    message:
      "Check your inbox to confirm your email, then sign in to continue.",
  };
}

export async function forgotPassword(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = createClient();
  if (!supabase)
    return { message: "Demo mode — password reset is disabled." };

  const email = String(formData.get("email") ?? "");
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) return { error: error.message };

  return { message: "If that email exists, a reset link is on its way." };
}

export async function signOut(): Promise<void> {
  const supabase = createClient();
  if (supabase) {
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
  }
  redirect("/login");
}
