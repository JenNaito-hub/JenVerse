"use client";

import { useEffect, useState } from "react";
import {
  BrainCircuit,
  Plus,
  Send,
  Sparkles,
  Copy,
  ThumbsUp,
  RefreshCw,
  Loader2,
  Info,
} from "lucide-react";

import { cn, formatRelativeTime } from "@/lib/utils";
import { AI_MODELS } from "@/lib/constants";
import {
  knowledgeConversations,
  knowledgePromptStarters,
} from "@/data/knowledge";
import type { ChatMessage, KnowledgeConversation } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { currentUser } from "@/data/team";
import { getInitials } from "@/lib/utils";
import { Markdown } from "@/components/shared/markdown";

const STORAGE_KEY = "jenverse:conversations";

export function KnowledgeChat({
  initialPrompt = "",
  demoMode = false,
}: {
  initialPrompt?: string;
  demoMode?: boolean;
}) {
  const [conversations, setConversations] = useState<KnowledgeConversation[]>(
    knowledgeConversations
  );
  const [activeId, setActiveId] = useState<string | null>(
    knowledgeConversations[0]?.id ?? null
  );
  const [model, setModel] = useState<string>(AI_MODELS.knowledge[0].id);
  const [input, setInput] = useState(initialPrompt);
  const [hydrated, setHydrated] = useState(false);

  // Restore saved conversations from the browser on first load.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as KnowledgeConversation[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setConversations(parsed);
          setActiveId(parsed[0].id);
        }
      }
    } catch {
      // Ignore malformed storage.
    }
    setHydrated(true);
  }, []);

  // Persist whenever conversations change (after the initial hydrate).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch {
      // Storage may be full or unavailable; ignore.
    }
  }, [conversations, hydrated]);
  const [sending, setSending] = useState(false);

  const active = conversations.find((c) => c.id === activeId) ?? null;

  const handleSend = async () => {
    if (!input.trim() || !active || sending) return;
    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      role: "user",
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };
    const history = [...active.messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === active.id ? { ...c, messages: [...c.messages, userMsg] } : c
      )
    );
    setInput("");
    setSending(true);

    let content =
      "Sorry, something went wrong reaching the model. Please try again.";
    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, model }),
      });
      const data = await res.json();
      if (data?.content) content = data.content;
    } catch {
      // Network error — keep the fallback message.
    }

    const assistantMsg: ChatMessage = {
      id: `m-${Date.now() + 1}`,
      role: "assistant",
      content,
      createdAt: new Date().toISOString(),
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? { ...c, messages: [...c.messages, assistantMsg] }
          : c
      )
    );
    setSending(false);
  };

  const startNew = () => {
    const id = `k-${Date.now()}`;
    const fresh: KnowledgeConversation = {
      id,
      title: "New conversation",
      preview: "Start a new knowledge session…",
      model: AI_MODELS.knowledge.find((m) => m.id === model)?.label ?? "GPT-4o",
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    setConversations((prev) => [fresh, ...prev]);
    setActiveId(id);
  };

  return (
    <div className="space-y-3">
      {demoMode && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-border bg-secondary/60 px-4 py-3 text-sm">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Demo mode.</span> No
            AI key is configured, so replies are sample text. Add{" "}
            <code className="font-mono text-foreground">OPENAI_API_KEY</code> or{" "}
            <code className="font-mono text-foreground">GEMINI_API_KEY</code> to{" "}
            <code className="font-mono text-foreground">.env.local</code> to get
            real answers.
          </p>
        </div>
      )}

      <div className="grid h-[calc(100vh-9.5rem)] grid-cols-1 gap-4 lg:grid-cols-[300px_1fr]">
      {/* Conversation list */}
      <Card className="hidden flex-col overflow-hidden lg:flex">
        <div className="border-b border-border p-3">
          <Button
            variant="primary"
            className="w-full"
            onClick={startNew}
          >
            <Plus className="h-4 w-4" />
            New conversation
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={cn(
                  "w-full rounded-xl px-3 py-2.5 text-left transition-colors",
                  c.id === activeId
                    ? "bg-secondary"
                    : "hover:bg-secondary/60"
                )}
              >
                <p className="truncate text-sm font-medium">{c.title}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {c.preview}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {c.model} · {formatRelativeTime(c.updatedAt)}
                </p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat panel */}
      <Card className="flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-primary">
              <BrainCircuit className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">
                {active?.title ?? "Knowledge AI"}
              </p>
              <p className="text-xs text-muted-foreground">
                Text generation workspace
              </p>
            </div>
          </div>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="w-[170px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AI_MODELS.knowledge.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="flex-1">
          <div className="mx-auto max-w-3xl space-y-6 p-5">
            {active && active.messages.length > 0 ? (
              <>
                {active.messages.map((m) => (
                  <MessageBubble key={m.id} message={m} />
                ))}
                {sending && <ThinkingBubble />}
              </>
            ) : (
              <EmptyConversation onPick={(p) => setInput(p)} />
            )}
          </div>
        </ScrollArea>

        {/* Composer */}
        <div className="border-t border-border p-4">
          <div className="mx-auto max-w-3xl">
            <div className="relative rounded-2xl border border-border bg-card p-2 focus-within:ring-2 focus-within:ring-ring">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask anything, or describe what you want to create…"
                className="min-h-[52px] border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
              <div className="flex items-center justify-between px-2 pb-1">
                <p className="text-xs text-muted-foreground">
                  Press Enter to send · Shift + Enter for a new line
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {sending ? "Thinking…" : "Send"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      {isUser ? (
        <Avatar className="h-8 w-8 border border-border">
          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
          <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
        </Avatar>
      ) : (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-primary">
          <Sparkles className="h-4 w-4" />
        </span>
      )}
      <div className={cn("max-w-[80%] space-y-2", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "whitespace-pre-wrap bg-foreground text-background"
              : "bg-secondary text-foreground"
          )}
        >
          {isUser ? message.content : <Markdown content={message.content} />}
        </div>
        {!isUser && (
          <div className="flex items-center gap-1 px-1">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ThumbsUp className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ThinkingBubble() {
  return (
    <div className="flex gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-primary">
        <Sparkles className="h-4 w-4" />
      </span>
      <div className="flex items-center gap-1.5 rounded-2xl bg-secondary px-4 py-3.5">
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
      </div>
    </div>
  );
}

function EmptyConversation({ onPick }: { onPick: (p: string) => void }) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground text-primary">
        <BrainCircuit className="h-7 w-7" />
      </span>
      <h2 className="text-xl font-semibold">How can I help today?</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Pick a starter or type your own prompt to begin.
      </p>
      <div className="mt-6 grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
        {knowledgePromptStarters.map((p) => (
          <button
            key={p}
            onClick={() => onPick(p)}
            className="rounded-xl border border-border bg-card px-4 py-3 text-left text-sm transition-colors hover:bg-secondary"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
