"use client";

import { useState } from "react";
import { Workflow as WorkflowIcon, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { workflowCategories } from "@/data/workflows";
import type { Workflow } from "@/types";
import { WorkflowCard } from "./workflow-card";
import { ImportWorkflowDialog } from "./import-workflow-dialog";
import { VersionHistoryDialog } from "./version-history-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

export function WorkflowsView({
  initialWorkflows,
}: {
  initialWorkflows: Workflow[];
}) {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [versionId, setVersionId] = useState<string | null>(null);

  const filtered = workflows.filter((w) => {
    const matchesCategory = category === "All" || w.category === category;
    const matchesQuery =
      w.name.toLowerCase().includes(query.toLowerCase()) ||
      w.description.toLowerCase().includes(query.toLowerCase()) ||
      w.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const handleImport = (workflow: Workflow) => {
    setWorkflows((prev) => [workflow, ...prev]);
    toast(`Imported “${workflow.name}”`);
  };

  const handleDuplicate = (id: string) => {
    const source = workflows.find((w) => w.id === id);
    if (!source) return;
    const copy: Workflow = {
      ...source,
      id: `wf-${Date.now()}`,
      name: `${source.name} (copy)`,
      runs: 0,
      favorite: false,
      updatedAt: new Date().toISOString(),
    };
    setWorkflows((prev) => {
      const index = prev.findIndex((w) => w.id === id);
      const next = [...prev];
      next.splice(index + 1, 0, copy);
      return next;
    });
    toast(`Duplicated “${source.name}”`);
  };

  const handleExport = (id: string) => {
    const workflow = workflows.find((w) => w.id === id);
    if (!workflow) return;
    const blob = new Blob([JSON.stringify(workflow, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${workflow.name.toLowerCase().replace(/\s+/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast(`Exported “${workflow.name}.json”`);
  };

  const handleRestore = (workflowId: string, version: string) => {
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === workflowId
          ? { ...w, currentVersion: version, updatedAt: new Date().toISOString() }
          : w
      )
    );
    setVersionId(null);
  };

  const handleToggleFavorite = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, favorite: !w.favorite } : w))
    );
  };

  const versionWorkflow = workflows.find((w) => w.id === versionId) ?? null;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search workflows…"
            className="pl-10"
          />
        </div>
        <ImportWorkflowDialog onImport={handleImport} />
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {["All", ...workflowCategories].map((cat) => (
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

      {filtered.length === 0 ? (
        <EmptyState
          icon={WorkflowIcon}
          title="No workflows found"
          description="Try a different category or search term, or import a workflow JSON."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((w) => (
            <WorkflowCard
              key={w.id}
              workflow={w}
              onDuplicate={handleDuplicate}
              onExport={handleExport}
              onVersions={setVersionId}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}

      <VersionHistoryDialog
        workflow={versionWorkflow}
        open={versionId !== null}
        onOpenChange={(o) => !o && setVersionId(null)}
        onRestore={handleRestore}
      />
    </div>
  );
}
