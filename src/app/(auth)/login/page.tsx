import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";
import { login } from "@/lib/auth/actions";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthForm mode="login" action={login} demoMode={!isSupabaseConfigured()} />
  );
}
