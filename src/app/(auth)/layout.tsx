import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { isSupabaseConfigured } from "@/lib/env";
import { Badge } from "@/components/ui/badge";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const configured = isSupabaseConfigured();

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col px-6 py-8 lg:px-16">
        <div className="flex items-center justify-between">
          <Logo />
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Back to app
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} JENVERSE. All rights reserved.
        </p>
      </div>

      {/* Brand side */}
      <div className="relative hidden overflow-hidden bg-foreground lg:block">
        <div className="absolute inset-0 bg-dotted opacity-[0.07]" />
        <div className="relative flex h-full flex-col justify-between p-16">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span className="text-sm font-medium text-background/70">
              {configured ? "Connected to Supabase" : "Demo mode"}
            </span>
          </div>
          <div className="space-y-6">
            <h2 className="text-balance text-4xl font-bold leading-tight text-background">
              The premium AI suite for{" "}
              <span className="text-primary">content</span> and{" "}
              <span className="text-primary">leads</span>.
            </h2>
            <p className="max-w-md text-background/60">
              Sinh bài đăng hàng loạt, tạo ảnh &amp; video, thu lead và chốt
              đơn — tất cả trong một nơi.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">OpenAI</Badge>
              <Badge variant="secondary">Gemini</Badge>
              <Badge variant="secondary">Supabase</Badge>
            </div>
          </div>
          <p className="text-xs text-background/40">
            Trusted by modern creative teams.
          </p>
        </div>
      </div>
    </div>
  );
}
