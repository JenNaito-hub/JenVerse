"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

import type { AuthState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "login" | "signup" | "forgot";

interface AuthFormProps {
  mode: Mode;
  action: (prev: AuthState, formData: FormData) => Promise<AuthState>;
  demoMode: boolean;
}

const copy = {
  login: {
    title: "Welcome back",
    subtitle: "Sign in to your JENVERSE workspace.",
    submit: "Sign in",
  },
  signup: {
    title: "Create your account",
    subtitle: "Start generating in minutes.",
    submit: "Create account",
  },
  forgot: {
    title: "Reset your password",
    subtitle: "We'll email you a reset link.",
    submit: "Send reset link",
  },
} as const;

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="primary"
      className="w-full"
      disabled={pending}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {label}
    </Button>
  );
}

export function AuthForm({ mode, action, demoMode }: AuthFormProps) {
  const [state, formAction] = useFormState(action, {});
  const c = copy[mode];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{c.title}</h1>
        <p className="text-sm text-muted-foreground">{c.subtitle}</p>
      </div>

      {demoMode && (
        <div className="flex items-start gap-2 rounded-xl border border-border bg-secondary/60 p-3 text-xs">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Demo mode.</span>{" "}
            Supabase isn&apos;t configured, so {c.submit.toLowerCase()} will take
            you straight into the app. Add Supabase keys to enable real auth.
          </p>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        {mode === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" name="fullName" placeholder="Jen Aescentic" />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        {mode !== "forgot" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {mode === "login" && (
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Forgot?
                </Link>
              )}
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
            />
          </div>
        )}

        {state.error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
            <AlertCircle className="h-4 w-4" />
            {state.error}
          </div>
        )}
        {state.message && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            {state.message}
          </div>
        )}

        <SubmitButton label={c.submit} />
      </form>

      <div className="text-center text-sm text-muted-foreground">
        {mode === "login" && (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-foreground hover:underline">
              Sign up
            </Link>
          </>
        )}
        {mode === "signup" && (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-foreground hover:underline">
              Sign in
            </Link>
          </>
        )}
        {mode === "forgot" && (
          <Link href="/login" className="font-medium text-foreground hover:underline">
            Back to sign in
          </Link>
        )}
      </div>
    </div>
  );
}
