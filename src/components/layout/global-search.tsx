"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Search,
  LayoutTemplate,
  PenLine,
  History as HistoryIcon,
  CornerDownLeft,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { templates } from "@/data/templates";
import { scriptTemplates } from "@/data/scripts";
import { historyItems } from "@/data/history";

interface SearchResult {
  id: string;
  group: string;
  title: string;
  sub: string;
  href: string;
  icon: LucideIcon;
}

function buildIndex(): SearchResult[] {
  return [
    ...scriptTemplates.map((s) => ({
      id: `s-${s.id}`,
      group: "Kịch bản",
      title: s.title,
      sub: s.description,
      href: `/scripts`,
      icon: PenLine,
    })),
    ...templates.map((t) => ({
      id: `t-${t.id}`,
      group: "Templates",
      title: t.title,
      sub: t.description,
      href: `/templates`,
      icon: LayoutTemplate,
    })),
    ...historyItems.map((h) => ({
      id: `h-${h.id}`,
      group: "History",
      title: h.title,
      sub: h.prompt,
      href: `/history`,
      icon: HistoryIcon,
    })),
  ];
}

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const index = useMemo(buildIndex, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index
      .filter(
        (r) =>
          r.title.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query, index]);

  const showPanel = open && query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative w-full md:max-w-md">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setQuery("");
            setOpen(false);
          }
        }}
        placeholder="Search projects, prompts, workflows…"
        className="h-10 rounded-full border-transparent bg-secondary pl-10"
      />

      {showPanel && (
        <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-2xl border border-border bg-popover shadow-card">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              No results for “{query}”
            </p>
          ) : (
            <ul className="max-h-[60vh] overflow-y-auto p-2">
              {results.map((r) => (
                <li key={r.id}>
                  <Link
                    href={r.href}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setQuery("");
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-secondary"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <r.icon className="h-4 w-4 text-muted-foreground" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {r.title}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {r.sub}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                      )}
                    >
                      {r.group}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
            <span>{results.length} results</span>
            <span className="flex items-center gap-1">
              <CornerDownLeft className="h-3 w-3" />
              to open
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
