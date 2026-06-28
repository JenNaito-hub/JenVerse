import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";
import { forgotPassword } from "@/lib/auth/actions";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <AuthForm
      mode="forgot"
      action={forgotPassword}
      demoMode={!isSupabaseConfigured()}
    />
  );
}
