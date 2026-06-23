"use client";

import { useState } from "react";
import {
  BrainCircuit,
  ImageIcon,
  ArrowRight,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";

import { formatCompact } from "@/lib/utils";
import type { Template } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function TemplateCard({ template }: { template: Template }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const isImage = template.type === "image";
  const TypeIcon = isImage ? ImageIcon : BrainCircuit;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(template.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard may be unavailable; no-op in V1 mock.
    }
  };

  return (
    <>
      <Card className="group flex h-full flex-col p-5 transition-shadow hover:shadow-card">
        <div className="flex items-start justify-between">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${template.color}22` }}
          >
            <TypeIcon className="h-5 w-5" style={{ color: template.color }} />
          </span>
          <Badge variant={isImage ? "primary" : "secondary"}>
            {isImage ? "Image" : "Knowledge"}
          </Badge>
        </div>

        <div className="mt-4 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold tracking-tight">{template.title}</h3>
            {template.featured && (
              <Sparkles className="h-3.5 w-3.5 text-foreground" />
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {template.description}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {template.category} · {formatCompact(template.uses)} uses
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(true)}
            className="opacity-80 group-hover:opacity-100"
          >
            Use
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="mb-1 flex items-center gap-2">
              <Badge variant={isImage ? "primary" : "secondary"}>
                {isImage ? "Image AI" : "Knowledge AI"}
              </Badge>
              <Badge variant="outline">{template.category}</Badge>
            </div>
            <DialogTitle>{template.title}</DialogTitle>
            <DialogDescription>{template.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Prompt template
            </p>
            <div className="rounded-xl border border-border bg-secondary/50 p-4 text-sm leading-relaxed">
              {template.prompt}
            </div>
            <p className="text-xs text-muted-foreground">
              Replace the{" "}
              <span className="font-mono text-foreground">[PLACEHOLDERS]</span>{" "}
              with your own details.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied" : "Copy prompt"}
            </Button>
            <Button variant="primary">
              <Sparkles className="h-4 w-4" />
              Use in {isImage ? "Image AI" : "Knowledge AI"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
