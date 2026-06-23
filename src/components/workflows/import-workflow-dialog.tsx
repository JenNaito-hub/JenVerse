"use client";

import { useRef, useState } from "react";
import { Upload, FileJson, AlertCircle } from "lucide-react";

import type { Workflow } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ImportWorkflowDialogProps {
  onImport: (workflow: Workflow) => void;
}

/** Minimal runtime validation for an imported workflow JSON payload. */
function parseWorkflow(raw: string): Workflow {
  const data = JSON.parse(raw);
  if (!data || typeof data !== "object") throw new Error("Invalid JSON object.");
  if (!data.name || typeof data.name !== "string")
    throw new Error("Missing required field: name.");
  if (!Array.isArray(data.versions) || data.versions.length === 0)
    throw new Error("A workflow needs at least one version.");

  return {
    id: `wf-${Date.now()}`,
    name: data.name,
    description: data.description ?? "Imported workflow.",
    category: data.category ?? "Generation",
    color: data.color ?? "#D7F205",
    tags: Array.isArray(data.tags) ? data.tags : [],
    currentVersion: data.currentVersion ?? data.versions[0].version ?? "1.0.0",
    versions: data.versions,
    runs: 0,
    updatedAt: new Date().toISOString(),
  };
}

export function ImportWorkflowDialog({ onImport }: ImportWorkflowDialogProps) {
  const [open, setOpen] = useState(false);
  const [raw, setRaw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const text = await file.text();
    setRaw(text);
    setError(null);
  };

  const handleImport = () => {
    try {
      const workflow = parseWorkflow(raw);
      onImport(workflow);
      setRaw("");
      setError(null);
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not parse JSON.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4" />
          Import JSON
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import workflow</DialogTitle>
          <DialogDescription>
            Upload a <code className="font-mono">.json</code> file or paste a
            workflow definition below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/40 py-6 text-sm text-muted-foreground transition-colors hover:bg-secondary"
          >
            <FileJson className="h-6 w-6" />
            Click to choose a .json file
          </button>

          <Textarea
            value={raw}
            onChange={(e) => {
              setRaw(e.target.value);
              setError(null);
            }}
            placeholder='{ "name": "My Workflow", "versions": [ … ] }'
            className="min-h-[140px] font-mono text-xs"
          />

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleImport} disabled={!raw.trim()}>
            Import workflow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
