"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Download,
  Loader2,
  Sparkles,
  Facebook,
  Music2,
  Users,
  Info,
  Flame,
  Snowflake,
  CloudSun,
  Phone,
  Copy,
  MessageSquare,
  Check,
} from "lucide-react";

import { cn, formatRelativeTime, getInitials } from "@/lib/utils";
import { sourceLabels, sourcePlaceholders } from "@/data/leads";
import { toast } from "@/components/ui/toast";
import type { Lead, LeadSource, LeadTemperature } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/empty-state";

const sources: { id: LeadSource; icon: typeof Facebook }[] = [
  { id: "facebook_post", icon: Facebook },
  { id: "facebook_group", icon: Users },
  { id: "tiktok_video", icon: Music2 },
];

const tempMeta: Record<
  LeadTemperature,
  { label: string; icon: typeof Flame; className: string }
> = {
  hot: { label: "Nóng", icon: Flame, className: "bg-red-100 text-red-700" },
  warm: {
    label: "Ấm",
    icon: CloudSun,
    className: "bg-amber-100 text-amber-700",
  },
  cold: {
    label: "Lạnh",
    icon: Snowflake,
    className: "bg-sky-100 text-sky-700",
  },
};

type Filter = "all" | LeadTemperature;

export function LeadScraper({ aiConfigured }: { aiConfigured: boolean }) {
  const [source, setSource] = useState<LeadSource>("facebook_post");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const [replyLead, setReplyLead] = useState<Lead | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyCopied, setReplyCopied] = useState(false);

  const generateReply = async (lead: Lead) => {
    setReplyLead(lead);
    setReplyText("");
    setReplyCopied(false);
    setReplyLoading(true);
    try {
      const res = await fetch("/api/leads/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: lead.name, comment: lead.comment }),
      });
      const data = await res.json();
      setReplyText(data.reply ?? "");
    } catch {
      setReplyText("Không tạo được câu trả lời — vui lòng thử lại.");
    }
    setReplyLoading(false);
  };

  // Restore the last scrape from the browser.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("jenverse:leads");
      if (saved) {
        const parsed = JSON.parse(saved) as Lead[];
        if (Array.isArray(parsed)) setLeads(parsed);
      }
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("jenverse:leads", JSON.stringify(leads));
    } catch {
      // ignore
    }
  }, [leads, hydrated]);

  const handleScrape = async () => {
    if (!url.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/leads/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), source }),
      });
      const data = await res.json();
      if (Array.isArray(data?.leads)) {
        setLeads(data.leads);
        toast(
          `Found ${data.leads.length} leads${data.live ? " (live)" : " (demo)"}`
        );
      }
    } catch {
      toast("Scrape failed — please try again");
    }
    setLoading(false);
  };

  const stats = useMemo(() => {
    return {
      total: leads.length,
      hot: leads.filter((l) => l.temperature === "hot").length,
      warm: leads.filter((l) => l.temperature === "warm").length,
      cold: leads.filter((l) => l.temperature === "cold").length,
    };
  }, [leads]);

  const filtered = leads.filter((l) => {
    const matchesFilter = filter === "all" || l.temperature === filter;
    const matchesQuery =
      l.name.toLowerCase().includes(query.toLowerCase()) ||
      l.comment.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const handleExport = () => {
    const headers = [
      "Tên",
      "Số điện thoại",
      "Nội dung comment",
      "Từ khóa",
      "Phân loại",
      "Nguồn",
      "Thời gian",
    ];
    const rows = leads.map((l) => [
      l.name,
      l.phone ?? "",
      l.comment,
      l.keywords.join("; "),
      tempMeta[l.temperature].label,
      sourceLabels[l.source],
      new Date(l.commentedAt).toLocaleString("vi-VN"),
    ]);
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csv =
      "﻿" +
      [headers, ...rows].map((r) => r.map(escape).join(",")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "jenverse-leads.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast("Exported to CSV");
  };

  return (
    <div className="space-y-6">
      {/* Scrape form */}
      <Card className="p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {sources.map((s) => (
            <button
              key={s.id}
              onClick={() => setSource(s.id)}
              className={cn(
                "flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                source === s.id
                  ? "border-foreground ring-1 ring-foreground"
                  : "border-border hover:bg-secondary"
              )}
            >
              <s.icon className="h-4 w-4" />
              {sourceLabels[s.id]}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleScrape()}
            placeholder={sourcePlaceholders[source]}
            className="flex-1"
          />
          <Button
            variant="primary"
            onClick={handleScrape}
            disabled={!url.trim() || loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {loading ? "Scraping…" : "Scrape leads"}
          </Button>
        </div>

        {!aiConfigured && (
          <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p>
              Demo mode — comments are sample data and hot/cold uses a keyword
              heuristic. Add a Gemini or OpenAI key for AI classification, and
              connect a scraping provider for live comments.
            </p>
          </div>
        )}
      </Card>

      {leads.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No leads yet"
          description="Paste a Facebook post/group or TikTok video URL and scrape to collect commenters, interest keywords and hot/cold scoring."
        />
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Total leads", value: stats.total, tone: "" },
              { label: "🔥 Nóng", value: stats.hot, tone: "text-red-600" },
              { label: "🌤 Ấm", value: stats.warm, tone: "text-amber-600" },
              { label: "❄️ Lạnh", value: stats.cold, tone: "text-sky-600" },
            ].map((s) => (
              <Card key={s.label} className="p-4">
                <p className={cn("text-2xl font-bold tracking-tight", s.tone)}>
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </Card>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="hot">Nóng</TabsTrigger>
                <TabsTrigger value="warm">Ấm</TabsTrigger>
                <TabsTrigger value="cold">Lạnh</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search leads…"
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export Excel</span>
              </Button>
            </div>
          </div>

          {/* Table */}
          <Card className="divide-y divide-border overflow-hidden p-0">
            {filtered.map((lead) => {
              const meta = tempMeta[lead.temperature];
              return (
                <div
                  key={lead.id}
                  className="flex items-start gap-3 p-4 transition-colors hover:bg-secondary/40"
                >
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={lead.avatar} alt={lead.name} />
                    <AvatarFallback>{getInitials(lead.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{lead.name}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(lead.commentedAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {lead.comment}
                    </p>
                    {lead.phone && (
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(lead.phone!);
                          toast("Phone copied");
                        }}
                        className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-foreground transition-colors hover:bg-primary/25"
                      >
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                        <Copy className="h-3 w-3 opacity-60" />
                      </button>
                    )}
                    {lead.keywords.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {lead.keywords.map((k) => (
                          <span
                            key={k}
                            className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground"
                          >
                            #{k}
                          </span>
                        ))}
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-7 px-2 text-xs"
                      onClick={() => generateReply(lead)}
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      Gợi ý trả lời
                    </Button>
                  </div>
                  <span
                    className={cn(
                      "flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                      meta.className
                    )}
                  >
                    <meta.icon className="h-3 w-3" />
                    {meta.label}
                  </span>
                </div>
              );
            })}
          </Card>
        </>
      )}

      <Dialog open={!!replyLead} onOpenChange={(o) => !o && setReplyLead(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Gợi ý trả lời {replyLead?.name}
            </DialogTitle>
            <DialogDescription className="line-clamp-2">
              “{replyLead?.comment}”
            </DialogDescription>
          </DialogHeader>

          {replyLoading ? (
            <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              AI đang soạn câu trả lời…
            </div>
          ) : (
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="min-h-[120px]"
            />
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => replyLead && generateReply(replyLead)}
              disabled={replyLoading}
            >
              <Sparkles className="h-4 w-4" />
              Tạo lại
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                navigator.clipboard?.writeText(replyText);
                setReplyCopied(true);
                toast("Đã copy câu trả lời");
                setTimeout(() => setReplyCopied(false), 1600);
              }}
              disabled={replyLoading || !replyText}
            >
              {replyCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {replyCopied ? "Đã copy" : "Copy câu trả lời"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
