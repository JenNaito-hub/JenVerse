"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Download,
  Star,
  FileInput,
  Box,
  Wand2,
  SlidersHorizontal,
  ImageDown,
  GitBranch,
  Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn, formatCompact, formatDate, formatRelativeTime } from "@/lib/utils";
import type { Workflow, WorkflowStepType } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const stepMeta: Record<
  WorkflowStepType,
  { icon: LucideIcon; color: string; label: string }
> = {
  input: { icon: FileInput, color: "#7C9EFF", label: "Input" },
  model: { icon: Box, color: "#D7F205", label: "Model" },
  processor: { icon: Wand2, color: "#C77CFF", label: "Processor" },
  control: { icon: SlidersHorizontal, color: "#FF9F7C", label: "Control" },
  output: { icon: ImageDown, color: "#7CFFD4", label: "Output" },
};

export function WorkflowDetail({ workflow }: { workflow: Workflow }) {
  const current =
    workflow.versions.find((v) => v.version === workflow.currentVersion) ??
    workflow.versions[0];

  const handleExport = () => {
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
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Link
        href="/workflows"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Workflow Library
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${workflow.color}22` }}
          >
            <Box className="h-7 w-7" style={{ color: workflow.color }} />
          </span>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {workflow.name}
              </h1>
              <Badge variant="secondary">{workflow.category}</Badge>
              <Badge variant="outline">v{workflow.currentVersion}</Badge>
              {workflow.favorite && (
                <Star className="h-4 w-4 fill-primary text-primary" />
              )}
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              {workflow.description}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {workflow.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export JSON
          </Button>
          <Button variant="primary" asChild>
            <Link href={`/image?workflow=${workflow.id}`}>
              <Play className="h-4 w-4" />
              Run workflow
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Steps", value: String(current.steps.length) },
          { label: "Total runs", value: formatCompact(workflow.runs) },
          { label: "Versions", value: String(workflow.versions.length) },
          { label: "Updated", value: formatRelativeTime(workflow.updatedAt) },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-2xl font-bold tracking-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Pipeline steps */}
        <Card className="p-5">
          <h2 className="mb-4 font-semibold">
            Pipeline · v{workflow.currentVersion}
          </h2>
          <ol className="space-y-3">
            {current.steps.map((step, i) => {
              const meta = stepMeta[step.type];
              return (
                <li key={step.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${meta.color}22` }}
                    >
                      <meta.icon
                        className="h-4 w-4"
                        style={{ color: meta.color }}
                      />
                    </span>
                    {i < current.steps.length - 1 && (
                      <span className="my-1 h-6 w-px bg-border" />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{step.label}</span>
                      <Badge variant="muted" className="text-[10px]">
                        {meta.label}
                      </Badge>
                    </div>
                    {step.config && (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {Object.entries(step.config).map(([k, v]) => (
                          <span
                            key={k}
                            className="rounded-md bg-secondary px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                          >
                            {k}: {String(v)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>

        {/* Version history */}
        <Card className="h-fit p-5">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <GitBranch className="h-4 w-4" />
            Version history
          </h2>
          <ol className="space-y-3">
            {workflow.versions.map((v) => {
              const isCurrent = v.version === workflow.currentVersion;
              return (
                <li
                  key={v.version}
                  className={cn(
                    "rounded-xl border p-3",
                    isCurrent ? "border-foreground" : "border-border"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm font-semibold">
                      v{v.version}
                      {isCurrent && (
                        <Check className="h-3.5 w-3.5 text-primary" />
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(v.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{v.note}</p>
                </li>
              );
            })}
          </ol>
        </Card>
      </div>
    </div>
  );
}
