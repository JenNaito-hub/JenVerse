import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectDetail } from "@/components/projects/project-detail";
import { getProjectById, getHistoryItems } from "@/lib/db";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const project = await getProjectById(params.id);
  return { title: project ? project.name : "Project" };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProjectById(params.id);
  if (!project) notFound();

  const history = await getHistoryItems();
  const generations = history.filter((h) => h.project === project.name);

  return <ProjectDetail project={project} generations={generations} />;
}
