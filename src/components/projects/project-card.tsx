import Link from "next/link";
import { MoreHorizontal, Layers } from "lucide-react";

import { formatRelativeTime, getInitials } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Project } from "@/types";

const statusVariant = {
  active: "success",
  draft: "warning",
  archived: "muted",
} as const;

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="group flex flex-col p-5 transition-shadow hover:shadow-card">
      <div className="flex items-start justify-between">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${project.color}22` }}
        >
          <Layers className="h-5 w-5" style={{ color: project.color }} />
        </span>
        <div className="flex items-center gap-2">
          <Badge variant={statusVariant[project.status]} className="capitalize">
            {project.status}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Open project</DropdownMenuItem>
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Link href={`/projects/${project.id}`} className="mt-4 flex-1">
        <h3 className="font-semibold tracking-tight transition-colors group-hover:text-foreground">
          {project.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {project.description}
        </p>
      </Link>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span className="font-medium text-foreground">
            {project.progress}%
          </span>
        </div>
        <Progress value={project.progress} className="h-1.5" />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.members.slice(0, 4).map((m) => (
            <Avatar
              key={m.id}
              className="h-7 w-7 border-2 border-card"
            >
              <AvatarImage src={m.avatar} alt={m.name} />
              <AvatarFallback className="text-[10px]">
                {getInitials(m.name)}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {project.assets} assets · {formatRelativeTime(project.updatedAt)}
        </span>
      </div>
    </Card>
  );
}

export { statusVariant };
