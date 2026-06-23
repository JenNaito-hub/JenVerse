"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BrainCircuit,
  ImageIcon,
  History as HistoryIcon,
  Search,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Trash2,
} from "lucide-react";

import { formatRelativeTime, formatNumber } from "@/lib/utils";
import { historyItems } from "@/data/history";
import type { GenerationType, HistoryItem } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Filter = "all" | GenerationType;

export function HistoryView() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const filtered = historyItems.filter((item) => {
    const matchesFilter = filter === "all" || item.type === filter;
    const matchesQuery =
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.prompt.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
            <TabsTrigger value="image">Images</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search history…"
            className="pl-10"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title="No history yet"
          description="Your knowledge and image generations will appear here."
        />
      ) : (
        <Card className="divide-y divide-border overflow-hidden p-0">
          {filtered.map((item) => (
            <HistoryRow key={item.id} item={item} />
          ))}
        </Card>
      )}
    </div>
  );
}

function HistoryRow({ item }: { item: HistoryItem }) {
  const isImage = item.type === "image";
  return (
    <div className="flex items-center gap-4 p-4 transition-colors hover:bg-secondary/40">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-secondary">
        {isImage && item.thumbnail ? (
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            sizes="48px"
            className="object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center">
            {isImage ? (
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            ) : (
              <BrainCircuit className="h-5 w-5 text-muted-foreground" />
            )}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium">{item.title}</p>
          <Badge
            variant={isImage ? "primary" : "secondary"}
            className="hidden shrink-0 sm:inline-flex"
          >
            {isImage ? "Image" : "Knowledge"}
          </Badge>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {item.prompt}
        </p>
      </div>

      <div className="hidden shrink-0 text-right md:block">
        <p className="text-xs font-medium">{item.model}</p>
        {item.project && (
          <p className="text-xs text-muted-foreground">{item.project}</p>
        )}
      </div>

      <div className="hidden w-24 shrink-0 text-right text-xs text-muted-foreground lg:block">
        {item.tokens ? `${formatNumber(item.tokens)} tokens` : "—"}
      </div>

      <div className="w-20 shrink-0 text-right text-xs text-muted-foreground">
        {formatRelativeTime(item.createdAt)}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <ExternalLink className="h-4 w-4" />
            Open
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Copy className="h-4 w-4" />
            Copy prompt
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
