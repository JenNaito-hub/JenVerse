"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ScrollText, Copy, Check, ArrowRight, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { scriptTemplates, scriptCategories } from "@/data/scripts";
import { toast } from "@/components/ui/toast";
import type { ScriptTemplate } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/empty-state";

export function ScriptsView() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<ScriptTemplate | null>(null);
  const [copied, setCopied] = useState(false);

  const filtered = scriptTemplates.filter((s) => {
    const matchesCategory = category === "All" || s.category === category;
    const matchesQuery =
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.description.toLowerCase().includes(query.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const copyFramework = (s: ScriptTemplate) => {
    const text = `${s.title}\n\n${s.framework.join("\n")}\n\nVí dụ:\n${s.example}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    toast("Đã copy kịch bản");
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {["All", ...scriptCategories].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                category === cat
                  ? "border-transparent bg-foreground text-background"
                  : "border-border text-muted-foreground hover:bg-secondary"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kịch bản…"
            className="pl-10"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ScrollText}
          title="Không tìm thấy kịch bản"
          description="Thử danh mục hoặc từ khóa khác."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((s) => (
            <Card
              key={s.id}
              className="group flex h-full flex-col p-5 transition-shadow hover:shadow-card"
            >
              <div className="flex items-start justify-between">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${s.color}22` }}
                >
                  <ScrollText className="h-5 w-5" style={{ color: s.color }} />
                </span>
                <Badge variant="secondary">{s.category}</Badge>
              </div>
              <h3 className="mt-4 font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">
                {s.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
                <Button variant="ghost" size="sm" onClick={() => setActive(s)}>
                  Xem
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-lg">
          {active && (
            <>
              <DialogHeader>
                <div className="mb-1 flex items-center gap-2">
                  <Badge variant="secondary">{active.category}</Badge>
                  {active.tags.map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
                <DialogTitle>{active.title}</DialogTitle>
                <DialogDescription>{active.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
                    Khung kịch bản
                  </p>
                  <ol className="space-y-1.5">
                    {active.framework.map((step, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
                    Ví dụ
                  </p>
                  <div className="whitespace-pre-wrap rounded-xl border border-border bg-secondary/50 p-3 text-sm leading-relaxed">
                    {active.example}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => copyFramework(active)}>
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? "Đã copy" : "Copy kịch bản"}
                </Button>
                <Button variant="primary" asChild>
                  <Link
                    href={`/content?style=${encodeURIComponent(active.style)}&topic=${encodeURIComponent(active.title)}`}
                  >
                    <Sparkles className="h-4 w-4" />
                    Dùng trong Content Studio
                  </Link>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
