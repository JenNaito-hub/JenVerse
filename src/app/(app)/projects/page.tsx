import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import {
  ProjectsView,
  NewProjectDialog,
} from "@/components/projects/projects-view";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Projects"
        description="Organize generations, assets and collaborators by workspace."
      >
        <NewProjectDialog />
      </PageHeader>
      <ProjectsView />
    </div>
  );
}
