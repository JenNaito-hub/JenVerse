"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  Loader2,
  Wand2,
  Copy,
  Trash2,
  CalendarClock,
  Plus,
  Info,
  MoreHorizontal,
  CheckCircle2,
  Bot,
} from "lucide-react";

import { cn, formatRelativeTime } from "@/lib/utils";
import {
  contentStyles,
  contentTones,
  contentTypes,
  ctaOptions,
  postCounts,
  contentTagColors,
} from "@/data/content";
import { toast } from "@/components/ui/toast";
import type { ContentPost, ContentStatus } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/shared/empty-state";

type Filter = "all" | ContentStatus;

export function ContentStudio({
  aiConfigured,
  initialTopic = "",
  initialStyle = "",
}: {
  aiConfigured: boolean;
  initialTopic?: string;
  initialStyle?: string;
}) {
  const [topic, setTopic] = useState(initialTopic);
  const [style, setStyle] = useState(
    contentStyles.includes(initialStyle) ? initialStyle : contentStyles[0]
  );
  const [tone, setTone] = useState(contentTones[0]);
  const [contentType, setContentType] = useState(contentTypes[0]);
  const [cta, setCta] = useState(ctaOptions[0]);
  const [count, setCount] = useState(10);

  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("jenverse:content");
      if (saved) setPosts(JSON.parse(saved));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("jenverse:content", JSON.stringify(posts));
    } catch {
      /* ignore */
    }
  }, [posts, hydrated]);

  const generate = async (append = false) => {
    if (!topic.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          style,
          tone,
          contentType,
          cta,
          count,
        }),
      });
      const data = await res.json();
      if (Array.isArray(data?.posts)) {
        const now = Date.now();
        const fresh: ContentPost[] = data.posts.map(
          (p: { title: string; content: string; tags: string[] }, i: number) => ({
            id: `post-${now}-${i}`,
            title: p.title,
            content: p.content,
            tags: p.tags,
            status: "ready" as ContentStatus,
            createdAt: new Date().toISOString(),
          })
        );
        setPosts((prev) => (append ? [...fresh, ...prev] : fresh));
        toast(
          `Created ${fresh.length} posts${data.live ? " (AI)" : " (demo)"}`
        );
      }
    } catch {
      toast("Generation failed — please try again");
    }
    setLoading(false);
  };

  const updatePost = (id: string, patch: Partial<ContentPost>) =>
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const removePost = (id: string) =>
    setPosts((prev) => prev.filter((p) => p.id !== id));

  const stats = {
    total: posts.length,
    ready: posts.filter((p) => p.status === "ready").length,
    scheduled: posts.filter((p) => p.status === "scheduled").length,
  };

  const filtered = posts.filter(
    (p) => filter === "all" || p.status === filter
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
      {/* Campaign form */}
      <Card className="h-fit p-5 lg:sticky lg:top-24">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-primary">
            <Wand2 className="h-4 w-4" />
          </span>
          <h2 className="font-semibold">Tạo chiến dịch</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Chủ đề</Label>
            <Textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="VD: Kem chống nắng cho da dầu mụn, dành cho dân văn phòng…"
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Phong cách">
              <Picker value={style} onChange={setStyle} options={contentStyles} />
            </Field>
            <Field label="Tone cảm xúc">
              <Picker value={tone} onChange={setTone} options={contentTones} />
            </Field>
            <Field label="Loại nội dung">
              <Picker
                value={contentType}
                onChange={setContentType}
                options={contentTypes}
              />
            </Field>
            <Field label="CTA">
              <Picker value={cta} onChange={setCta} options={ctaOptions} />
            </Field>
          </div>

          <Field label="Số bài cần tạo">
            <Select
              value={String(count)}
              onValueChange={(v) => setCount(Number(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {postCounts.map((c) => (
                  <SelectItem key={c} value={String(c)}>
                    {c} bài
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Button
            variant="primary"
            className="w-full"
            onClick={() => generate(false)}
            disabled={!topic.trim() || loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {loading ? "Đang tạo…" : "Khởi tạo chiến dịch"}
          </Button>

          {!aiConfigured && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <p>
                Demo — nội dung là mẫu. Thêm GEMINI_API_KEY / OPENAI_API_KEY để
                AI viết bài thật theo chủ đề.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Đăng tự động</span>
            </div>
            <button
              onClick={() =>
                toast("Cần nối Facebook Page để bật đăng tự động")
              }
              className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              Cần nối FB Page
            </button>
          </div>
        </div>
      </Card>

      {/* Results */}
      <div className="space-y-5">
        {posts.length === 0 ? (
          <EmptyState
            icon={Wand2}
            title="Chưa có bài viết nào"
            description="Nhập chủ đề, chọn phong cách & tone, rồi bấm Khởi tạo chiến dịch để AI viết hàng loạt bài đăng."
          />
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Tổng bài", value: stats.total },
                { label: "Sẵn sàng", value: stats.ready },
                { label: "Đã lên lịch", value: stats.scheduled },
              ].map((s) => (
                <Card key={s.label} className="p-4">
                  <p className="text-2xl font-bold tracking-tight">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </Card>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Tabs
                value={filter}
                onValueChange={(v) => setFilter(v as Filter)}
              >
                <TabsList>
                  <TabsTrigger value="all">Tất cả</TabsTrigger>
                  <TabsTrigger value="ready">Sẵn sàng</TabsTrigger>
                  <TabsTrigger value="scheduled">Đã lên lịch</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button
                variant="outline"
                onClick={() => generate(true)}
                disabled={!topic.trim() || loading}
              >
                <Plus className="h-4 w-4" />
                Tạo thêm {count} bài
              </Button>
            </div>

            <div className="space-y-3">
              {filtered.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onCopy={() => {
                    navigator.clipboard?.writeText(post.content);
                    toast("Đã copy bài viết");
                  }}
                  onSchedule={() => {
                    updatePost(post.id, {
                      status: "scheduled",
                      scheduledAt: new Date(
                        Date.now() + 3600_000
                      ).toISOString(),
                    });
                    toast("Đã lên lịch đăng");
                  }}
                  onDelete={() => removePost(post.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

function Picker({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function PostCard({
  post,
  onCopy,
  onSchedule,
  onDelete,
}: {
  post: ContentPost;
  onCopy: () => void;
  onSchedule: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold">{post.title}</h3>
            {post.status === "scheduled" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                <CheckCircle2 className="h-3 w-3" />
                Đã lên lịch
              </span>
            )}
          </div>
          <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">
            {post.content}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {post.tags.map((t) => (
              <span
                key={t}
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                  contentTagColors[t] ?? "bg-secondary text-muted-foreground"
                )}
              >
                {t}
              </span>
            ))}
            <span className="text-[11px] text-muted-foreground">
              · {formatRelativeTime(post.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onCopy}
            aria-label="Copy"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onSchedule}>
                <CalendarClock className="h-4 w-4" />
                Lên lịch đăng
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onCopy}>
                <Copy className="h-4 w-4" />
                Copy nội dung
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
