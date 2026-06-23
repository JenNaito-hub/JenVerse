import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

export function Logo({ collapsed = false, className }: LogoProps) {
  return (
    <Link
      href="/dashboard"
      className={cn("flex items-center gap-2.5 font-semibold", className)}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-foreground text-primary">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            d="M5 4h14l-7 8 7 8H5l7-8-7-8Z"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
      </span>
      {!collapsed && (
        <span className="text-lg font-bold tracking-tight">
          JEN<span className="text-foreground/40">VERSE</span>
        </span>
      )}
    </Link>
  );
}
