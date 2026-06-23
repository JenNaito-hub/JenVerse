import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { ProjectsView } from "@/components/projects/projects-view";
import { getProjects } from "@/lib/db";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Projects"
        description="Organize generations, assets and collaborators by workspace."
      />
      <ProjectsView projects={projects} />
    </div>
  );
}
