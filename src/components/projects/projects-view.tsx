"use client";

import { useState } from "react";
import { FolderKanban, Plus, Search } from "lucide-react";

import type { Project, ProjectStatus } from "@/types";
import { teamMembers } from "@/data/team";
import { toast } from "@/components/ui/toast";
import { ProjectCard } from "./project-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Filter = "all" | ProjectStatus;

const NEW_PROJECT_COLORS = [
  "#D7F205",
  "#7C9EFF",
  "#FF9F7C",
  "#C77CFF",
  "#7CFFD4",
  "#FF7CA8",
];

export function ProjectsView({ projects: initial }: { projects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initial);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const handleCreate = (name: string, description: string) => {
    const newProject: Project = {
      id: `p-${Date.now()}`,
      name,
      description: description || "No description yet.",
      status: "draft",
      color:
        NEW_PROJECT_COLORS[
          Math.floor(Math.random() * NEW_PROJECT_COLORS.length)
        ],
      assets: 0,
      members: teamMembers.slice(0, 2),
      updatedAt: new Date().toISOString(),
      progress: 0,
    };
    setProjects((prev) => [newProject, ...prev]);
    toast(`Project “${name}” created`);
  };

  const filtered = projects.filter((p) => {
    const matchesFilter = filter === "all" || p.status === filter;
    const matchesQuery =
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects…"
              className="pl-10"
            />
          </div>
          <div className="hidden sm:block">
            <NewProjectDialog onCreate={handleCreate} />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description="Try a different filter or search term, or create a new project to get started."
        >
          <NewProjectDialog onCreate={handleCreate} />
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

export function NewProjectDialog({
  onCreate,
}: {
  onCreate?: (name: string, description: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate?.(name.trim(), description.trim());
    setName("");
    setDescription("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary">
          <Plus className="h-4 w-4" />
          New project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new project</DialogTitle>
          <DialogDescription>
            Organize your knowledge and image generations into a shared
            workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project name</Label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Spring Campaign"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-desc">Description</Label>
            <Textarea
              id="project-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project about?"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreate}
            disabled={!name.trim()}
          >
            Create project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
