import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";
import { signup } from "@/lib/auth/actions";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <AuthForm
      mode="signup"
      action={signup}
      demoMode={!isSupabaseConfigured()}
    />
  );
}
