"use client";

import { GitBranch, RotateCcw, Check } from "lucide-react";

import { cn, formatDate } from "@/lib/utils";
import type { Workflow } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VersionHistoryDialogProps {
  workflow: Workflow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestore: (workflowId: string, version: string) => void;
}

export function VersionHistoryDialog({
  workflow,
  open,
  onOpenChange,
  onRestore,
}: VersionHistoryDialogProps) {
  if (!workflow) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Version history
          </DialogTitle>
          <DialogDescription>{workflow.name}</DialogDescription>
        </DialogHeader>

        <ol className="relative space-y-4 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
          {workflow.versions.map((v) => {
            const isCurrent = v.version === workflow.currentVersion;
            return (
              <li key={v.version} className="relative flex gap-3 pl-6">
                <span
                  className={cn(
                    "absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-card",
                    isCurrent ? "bg-primary" : "bg-muted-foreground/40"
                  )}
                />
                <div className="flex-1 rounded-xl border border-border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        v{v.version}
                      </span>
                      {isCurrent && (
                        <Badge variant="primary" className="gap-1">
                          <Check className="h-3 w-3" />
                          Current
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(v.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {v.note}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {v.steps.length} steps
                    </span>
                    {!isCurrent && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRestore(workflow.id, v.version)}
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Restore
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </DialogContent>
    </Dialog>
  );
}
