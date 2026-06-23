"use client";

import { useState } from "react";
import { LayoutTemplate, Search, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { templates, templateCategories } from "@/data/templates";
import type { GenerationType } from "@/types";
import { TemplateCard } from "./template-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TypeFilter = "all" | GenerationType;

export function TemplatesView() {
  const [type, setType] = useState<TypeFilter>("all");
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");

  const filtered = templates.filter((t) => {
    const matchesType = type === "all" || t.type === type;
    const matchesCategory = category === "All" || t.category === category;
    const matchesQuery =
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase()) ||
      t.prompt.toLowerCase().includes(query.toLowerCase());
    return matchesType && matchesCategory && matchesQuery;
  });

  const featured = filtered.filter((t) => t.featured);
  const showFeatured =
    featured.length > 0 && category === "All" && query.trim() === "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={type} onValueChange={(v) => setType(v as TypeFilter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates…"
            className="pl-10"
          />
        </div>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {["All", ...templateCategories].map((cat) => (
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

      {showFeatured && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-foreground" />
            <h2 className="text-sm font-semibold">Featured templates</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        </section>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={LayoutTemplate}
          title="No templates found"
          description="Try a different category, type or search term."
        />
      ) : (
        <section className="space-y-3">
          {showFeatured && (
            <h2 className="text-sm font-semibold">All templates</h2>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
