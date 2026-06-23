import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Layers,
  BrainCircuit,
  ImageIcon,
  Sparkles,
  Settings2,
} from "lucide-react";

import { formatRelativeTime, getInitials } from "@/lib/utils";
import type { Project, HistoryItem } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { statusVariant } from "./project-card";

export function ProjectDetail({
  project,
  generations,
}: {
  project: Project;
  generations: HistoryItem[];
}) {
  const stats = [
    { label: "Assets", value: String(project.assets) },
    { label: "Generations", value: String(generations.length) },
    { label: "Members", value: String(project.members.length) },
    { label: "Progress", value: `${project.progress}%` },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${project.color}22` }}
          >
            <Layers className="h-7 w-7" style={{ color: project.color }} />
          </span>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {project.name}
              </h1>
              <Badge variant={statusVariant[project.status]} className="capitalize">
                {project.status}
              </Badge>
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              {project.description}
            </p>
            <p className="text-xs text-muted-foreground">
              Updated {formatRelativeTime(project.updatedAt)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline">
            <Settings2 className="h-4 w-4" />
            Settings
          </Button>
          <Button variant="primary" asChild>
            <Link href="/image">
              <Sparkles className="h-4 w-4" />
              New generation
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-2xl font-bold tracking-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        {/* Recent generations */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Recent generations</h2>
            <Progress value={project.progress} className="h-1.5 w-32" />
          </div>
          {generations.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No generations in this project yet.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {generations.map((g) => {
                const isImage = g.type === "image";
                return (
                  <li key={g.id} className="flex items-center gap-3 py-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-secondary">
                      {isImage && g.thumbnail ? (
                        <Image
                          src={g.thumbnail}
                          alt={g.title}
                          fill
                          sizes="44px"
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center">
                          {isImage ? (
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
                          )}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{g.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {g.model} · {formatRelativeTime(g.createdAt)}
                      </p>
                    </div>
                    <Badge variant={isImage ? "primary" : "secondary"}>
                      {isImage ? "Image" : "Knowledge"}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {/* Members */}
        <Card className="h-fit p-5">
          <h2 className="mb-4 font-semibold">Team members</h2>
          <ul className="space-y-3">
            {project.members.map((m) => (
              <li key={m.id} className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarImage src={m.avatar} alt={m.name} />
                  <AvatarFallback>{getInitials(m.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
