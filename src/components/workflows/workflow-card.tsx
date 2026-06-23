"use client";

import Link from "next/link";
import {
  FileInput,
  Box,
  Wand2,
  SlidersHorizontal,
  ImageDown,
  ChevronRight,
  MoreHorizontal,
  Copy,
  Download,
  History as HistoryIcon,
  Play,
  Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn, formatCompact, formatRelativeTime } from "@/lib/utils";
import type { Workflow, WorkflowStepType } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const stepMeta: Record<WorkflowStepType, { icon: LucideIcon; color: string }> = {
  input: { icon: FileInput, color: "#7C9EFF" },
  model: { icon: Box, color: "#D7F205" },
  processor: { icon: Wand2, color: "#C77CFF" },
  control: { icon: SlidersHorizontal, color: "#FF9F7C" },
  output: { icon: ImageDown, color: "#7CFFD4" },
};

interface WorkflowCardProps {
  workflow: Workflow;
  onDuplicate: (id: string) => void;
  onExport: (id: string) => void;
  onVersions: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export function WorkflowCard({
  workflow,
  onDuplicate,
  onExport,
  onVersions,
  onToggleFavorite,
}: WorkflowCardProps) {
  const current =
    workflow.versions.find((v) => v.version === workflow.currentVersion) ??
    workflow.versions[0];

  return (
    <Card className="group flex h-full flex-col p-5 transition-shadow hover:shadow-card">
      <div className="flex items-start justify-between">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${workflow.color}22` }}
        >
          <Box className="h-5 w-5" style={{ color: workflow.color }} />
        </span>
        <div className="flex items-center gap-1.5">
          <Badge variant="outline">v{workflow.currentVersion}</Badge>
          <button
            onClick={() => onToggleFavorite(workflow.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Favorite"
          >
            <Star
              className={cn(
                "h-4 w-4",
                workflow.favorite && "fill-primary text-primary"
              )}
            />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onVersions(workflow.id)}>
                <HistoryIcon className="h-4 w-4" />
                Version history
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(workflow.id)}>
                <Copy className="h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport(workflow.id)}>
                <Download className="h-4 w-4" />
                Export JSON
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2">
          <Link
            href={`/workflows/${workflow.id}`}
            className="font-semibold tracking-tight hover:underline"
          >
            {workflow.name}
          </Link>
          <Badge variant="secondary">{workflow.category}</Badge>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {workflow.description}
        </p>
      </div>

      {/* Pipeline preview */}
      <div className="mt-4 flex flex-1 flex-wrap items-center gap-1.5">
        {current.steps.map((step, i) => {
          const meta = stepMeta[step.type];
          return (
            <div key={step.id} className="flex items-center gap-1.5">
              <span
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2 py-1 text-[11px] font-medium"
                title={step.label}
              >
                <meta.icon className="h-3 w-3" style={{ color: meta.color }} />
                {step.label}
              </span>
              {i < current.steps.length - 1 && (
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="text-xs text-muted-foreground">
          {current.steps.length} steps · {formatCompact(workflow.runs)} runs ·{" "}
          {formatRelativeTime(workflow.updatedAt)}
        </span>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/image?workflow=${workflow.id}`}>
            <Play className="h-4 w-4" />
            Run
          </Link>
        </Button>
      </div>
    </Card>
  );
}
