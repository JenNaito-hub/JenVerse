"use client";

import { useState } from "react";
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
  Pencil,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn, formatCompact, formatDate, formatRelativeTime } from "@/lib/utils";
import type {
  Workflow,
  WorkflowStep,
  WorkflowStepType,
  WorkflowVersion,
} from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const stepTypes: WorkflowStepType[] = [
  "input",
  "model",
  "processor",
  "control",
  "output",
];

/** Bump the minor version, e.g. 1.3.0 -> 1.4.0. */
function bumpMinor(version: string): string {
  const [major, minor] = version.split(".").map(Number);
  return `${major ?? 1}.${(minor ?? 0) + 1}.0`;
}

export function WorkflowDetail({ workflow }: { workflow: Workflow }) {
  const [versions, setVersions] = useState<WorkflowVersion[]>(
    workflow.versions
  );
  const [currentVersion, setCurrentVersion] = useState(
    workflow.currentVersion
  );

  const [editing, setEditing] = useState(false);
  const [draftSteps, setDraftSteps] = useState<WorkflowStep[]>([]);
  const [note, setNote] = useState("");

  const current =
    versions.find((v) => v.version === currentVersion) ?? versions[0];

  const startEdit = () => {
    setDraftSteps(current.steps.map((s) => ({ ...s })));
    setNote("");
    setEditing(true);
  };

  const updateStep = (id: string, patch: Partial<WorkflowStep>) =>
    setDraftSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );

  const removeStep = (id: string) =>
    setDraftSteps((prev) => prev.filter((s) => s.id !== id));

  const moveStep = (index: number, dir: -1 | 1) =>
    setDraftSteps((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const addStep = () =>
    setDraftSteps((prev) => [
      ...prev,
      { id: `s-${Date.now()}`, type: "processor", label: "New step" },
    ]);

  const saveVersion = () => {
    if (draftSteps.length === 0) return;
    const newVersion = bumpMinor(currentVersion);
    const version: WorkflowVersion = {
      version: newVersion,
      createdAt: new Date().toISOString(),
      note: note.trim() || "Edited pipeline.",
      steps: draftSteps,
    };
    setVersions((prev) => [version, ...prev]);
    setCurrentVersion(newVersion);
    setEditing(false);
  };

  const handleExport = () => {
    const payload: Workflow = { ...workflow, versions, currentVersion };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
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
              <Badge variant="outline">v{currentVersion}</Badge>
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
          { label: "Versions", value: String(versions.length) },
          { label: "Updated", value: formatRelativeTime(workflow.updatedAt) },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-2xl font-bold tracking-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Pipeline */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">
              Pipeline · v{editing ? bumpMinor(currentVersion) : currentVersion}
              {editing && (
                <Badge variant="warning" className="ml-2">
                  Editing
                </Badge>
              )}
            </h2>
            {!editing ? (
              <Button variant="outline" size="sm" onClick={startEdit}>
                <Pencil className="h-3.5 w-3.5" />
                Edit pipeline
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={addStep}>
                <Plus className="h-3.5 w-3.5" />
                Add step
              </Button>
            )}
          </div>

          {editing ? (
            <div className="space-y-2">
              {draftSteps.map((step, i) => {
                const meta = stepMeta[step.type];
                return (
                  <div
                    key={step.id}
                    className="flex items-center gap-2 rounded-xl border border-border p-2"
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${meta.color}22` }}
                    >
                      <meta.icon
                        className="h-4 w-4"
                        style={{ color: meta.color }}
                      />
                    </span>
                    <Select
                      value={step.type}
                      onValueChange={(v) =>
                        updateStep(step.id, { type: v as WorkflowStepType })
                      }
                    >
                      <SelectTrigger className="h-9 w-32 shrink-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {stepTypes.map((t) => (
                          <SelectItem key={t} value={t}>
                            {stepMeta[t].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={step.label}
                      onChange={(e) =>
                        updateStep(step.id, { label: e.target.value })
                      }
                      className="h-9 flex-1"
                    />
                    <div className="flex shrink-0 items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => moveStep(i, -1)}
                        disabled={i === 0}
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => moveStep(i, 1)}
                        disabled={i === draftSteps.length - 1}
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeStep(step.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}

              <div className="mt-4 space-y-2 border-t border-border pt-4">
                <Input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What changed in this version?"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={saveVersion}
                    disabled={draftSteps.length === 0}
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save as v{bumpMinor(currentVersion)}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
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
                        <span className="text-sm font-medium">
                          {step.label}
                        </span>
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
          )}
        </Card>

        {/* Version history */}
        <Card className="h-fit p-5">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <GitBranch className="h-4 w-4" />
            Version history
          </h2>
          <ol className="space-y-3">
            {versions.map((v) => {
              const isCurrent = v.version === currentVersion;
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
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(v.createdAt)}
                      </span>
                      {!isCurrent && !editing && (
                        <button
                          onClick={() => setCurrentVersion(v.version)}
                          className="text-xs font-medium text-foreground hover:underline"
                        >
                          Restore
                        </button>
                      )}
                    </div>
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
