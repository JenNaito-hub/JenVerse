"use client";

import { useMemo, useState } from "react";
import {
  FileSignature,
  Camera,
  CalendarPlus,
  ClipboardCheck,
  Copy,
  Check,
  Printer,
  Download,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ContractBlock, ContractField } from "@/types";
import {
  contractTemplates,
  initialValues,
  blocksToText,
} from "@/data/contracts";

const icons: Record<string, LucideIcon> = {
  collab: FileSignature,
  release: Camera,
  extension: CalendarPlus,
  bbnt: ClipboardCheck,
};

/* ------------------------------------------------------------------ *
 * Document preview
 * ------------------------------------------------------------------ */

function DocumentPreview({ blocks }: { blocks: ContractBlock[] }) {
  return (
    <div className="mx-auto w-full max-w-[720px] space-y-2.5 font-serif text-[13.5px] leading-relaxed text-[#111]">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "center":
            return (
              <p
                key={i}
                className={cn(
                  "text-center",
                  b.strong && "font-bold",
                  b.italic && "italic",
                  b.size === "lg" && "text-lg",
                  b.size === "sm" && "text-xs"
                )}
              >
                {b.text}
              </p>
            );
          case "heading":
            return (
              <p key={i} className="pt-2 font-bold uppercase">
                {b.text}
              </p>
            );
          case "para":
            return (
              <p
                key={i}
                className={cn(
                  "text-justify",
                  b.strong && "font-semibold",
                  b.indent && "pl-6"
                )}
              >
                {b.text}
              </p>
            );
          case "kv":
            return (
              <p key={i} className="text-justify">
                <span className="font-semibold">{b.label}:</span> {b.value}
              </p>
            );
          case "list":
            return b.ordered ? (
              <ol key={i} className="list-decimal space-y-1 pl-9 text-justify">
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ol>
            ) : (
              <ul key={i} className="list-disc space-y-1 pl-9 text-justify">
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            );
          case "divider":
            return <hr key={i} className="my-3 border-[#ccc]" />;
          case "spacer":
            return <div key={i} className="h-2" />;
          case "signatures":
            return (
              <div key={i} className="grid grid-cols-2 gap-4 pt-4 text-center">
                <div>
                  <p className="font-bold uppercase">{b.left}</p>
                  <p className="text-xs italic">(Ký, ghi rõ họ tên)</p>
                  <div className="h-16" />
                </div>
                <div>
                  <p className="font-bold uppercase">{b.right}</p>
                  <p className="text-xs italic">(Ký, ghi rõ họ tên)</p>
                  <div className="h-16" />
                </div>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Field input
 * ------------------------------------------------------------------ */

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: ContractField;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className={cn("space-y-1.5", field.span === "full" && "sm:col-span-2")}>
      <Label htmlFor={field.key} className="text-xs text-muted-foreground">
        {field.label}
        {field.required && <span className="text-primary"> *</span>}
      </Label>
      {field.type === "textarea" ? (
        <Textarea
          id={field.key}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
        />
      ) : (
        <Input
          id={field.key}
          type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
        />
      )}
      {field.hint && <p className="text-[11px] text-muted-foreground">{field.hint}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Main view
 * ------------------------------------------------------------------ */

export function ContractsView() {
  const [templateId, setTemplateId] = useState(contractTemplates[0].id);
  const [store, setStore] = useState<Record<string, Record<string, string>>>(() => {
    const init: Record<string, Record<string, string>> = {};
    for (const t of contractTemplates) init[t.id] = initialValues(t);
    return init;
  });
  const [copied, setCopied] = useState(false);

  const template = contractTemplates.find((t) => t.id === templateId)!;
  const values = store[templateId];

  const blocks = useMemo(() => template.build(values), [template, values]);
  const plainText = useMemo(() => blocksToText(blocks), [blocks]);

  const setValue = (key: string, v: string) =>
    setStore((prev) => ({ ...prev, [templateId]: { ...prev[templateId], [key]: v } }));

  const resetTemplate = () => {
    setStore((prev) => ({ ...prev, [templateId]: initialValues(template) }));
    toast("Đã đặt lại biểu mẫu");
  };

  const copy = () => {
    navigator.clipboard?.writeText(plainText);
    setCopied(true);
    toast("Đã copy nội dung văn bản");
    setTimeout(() => setCopied(false), 1600);
  };

  const download = () => {
    const blob = new Blob([plainText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.short}-${values.sign_date || "draft"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Đã tải file .txt");
  };

  const print = () => {
    const win = window.open("", "_blank", "width=800,height=1000");
    if (!win) {
      toast("Trình duyệt chặn cửa sổ in — hãy cho phép pop-up");
      return;
    }
    const escapeHtml = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const body = blocks
      .map((b) => {
        switch (b.type) {
          case "center":
            return `<p class="c${b.strong ? " b" : ""}${b.italic ? " i" : ""}${b.size === "lg" ? " lg" : b.size === "sm" ? " sm" : ""}">${escapeHtml(b.text)}</p>`;
          case "heading":
            return `<p class="h">${escapeHtml(b.text)}</p>`;
          case "para":
            return `<p class="${b.indent ? "ind " : ""}${b.strong ? "b" : ""}">${escapeHtml(b.text)}</p>`;
          case "kv":
            return `<p><b>${escapeHtml(b.label)}:</b> ${escapeHtml(b.value)}</p>`;
          case "list": {
            const items = b.items.map((it) => `<li>${escapeHtml(it)}</li>`).join("");
            return b.ordered ? `<ol>${items}</ol>` : `<ul>${items}</ul>`;
          }
          case "divider":
            return `<hr/>`;
          case "spacer":
            return `<div class="sp"></div>`;
          case "signatures":
            return `<div class="sig"><div><p class="b">${escapeHtml(b.left)}</p><p class="i sm">(Ký, ghi rõ họ tên)</p></div><div><p class="b">${escapeHtml(b.right)}</p><p class="i sm">(Ký, ghi rõ họ tên)</p></div></div>`;
          default:
            return "";
        }
      })
      .join("");
    win.document.write(`<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${escapeHtml(template.title)}</title>
<style>
  @page { size: A4; margin: 20mm; }
  * { box-sizing: border-box; }
  body { font-family: "Times New Roman", Times, serif; font-size: 13.5px; line-height: 1.55; color: #000; }
  p { margin: 0 0 7px; text-align: justify; }
  .c { text-align: center; } .b { font-weight: bold; } .i { font-style: italic; }
  .lg { font-size: 20px; } .sm { font-size: 11px; }
  .h { font-weight: bold; text-transform: uppercase; margin-top: 10px; }
  .ind { padding-left: 24px; }
  ol, ul { padding-left: 34px; margin: 0 0 7px; } li { margin-bottom: 4px; text-align: justify; }
  .sp { height: 8px; } hr { border: none; border-top: 1px solid #ccc; margin: 12px 0; }
  .sig { display: flex; justify-content: space-around; text-align: center; margin-top: 20px; }
  .sig > div { width: 45%; } .sig .b { margin-bottom: 2px; }
</style></head><body>${body}
<script>window.onload=function(){window.print();}<\/script>
</body></html>`);
    win.document.close();
  };

  // Group fields for the form layout.
  const grouped = template.groups.map((g) => ({
    group: g,
    fields: template.fields.filter((f) => f.group === g),
  }));

  return (
    <div className="space-y-6">
      {/* Template picker */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {contractTemplates.map((t) => {
          const Icon = icons[t.id] ?? FileSignature;
          const active = t.id === templateId;
          return (
            <button
              key={t.id}
              onClick={() => setTemplateId(t.id)}
              className={cn(
                "group flex flex-col items-start rounded-2xl border p-4 text-left transition-all",
                active
                  ? "border-transparent ring-2 ring-foreground"
                  : "border-border hover:border-foreground/30 hover:shadow-card"
              )}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${t.color}33` }}
              >
                <Icon className="h-5 w-5" style={{ color: t.color }} />
              </span>
              <span className="mt-3 text-sm font-semibold tracking-tight">{t.title}</span>
              <span className="mt-1 line-clamp-2 text-[11.5px] leading-snug text-muted-foreground">
                {t.description}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* Form */}
        <Card className="flex flex-col p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold tracking-tight">{template.title}</h2>
              <p className="text-xs text-muted-foreground">Điền thông tin — văn bản cập nhật tức thì.</p>
            </div>
            <Button variant="ghost" size="sm" onClick={resetTemplate}>
              <RotateCcw className="h-4 w-4" />
              Đặt lại
            </Button>
          </div>

          <div className="space-y-6">
            {grouped.map(({ group, fields }) => (
              <fieldset key={group} className="space-y-3">
                <legend className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: template.color }} />
                  {group}
                </legend>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {fields.map((f) => (
                    <FieldInput
                      key={f.key}
                      field={f}
                      value={values[f.key] ?? ""}
                      onChange={(v) => setValue(f.key, v)}
                    />
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        </Card>

        {/* Preview */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant="secondary" className="gap-1.5">
              <FileSignature className="h-3.5 w-3.5" />
              Xem trước — khổ A4
            </Badge>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={copy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Đã copy" : "Copy"}
              </Button>
              <Button variant="outline" size="sm" onClick={download}>
                <Download className="h-4 w-4" />
                .txt
              </Button>
              <Button variant="primary" size="sm" onClick={print}>
                <Printer className="h-4 w-4" />
                In / PDF
              </Button>
            </div>
          </div>

          <div className="max-h-[76vh] overflow-auto rounded-2xl border border-border bg-secondary/40 p-4 sm:p-6">
            <div className="mx-auto rounded-sm bg-white p-6 shadow-card sm:p-10">
              <DocumentPreview blocks={blocks} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
