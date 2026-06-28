import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { WorkflowDetail } from "@/components/workflows/workflow-detail";
import { getWorkflowById } from "@/lib/db";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const workflow = await getWorkflowById(params.id);
  return { title: workflow ? workflow.name : "Workflow" };
}

export default async function WorkflowDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const workflow = await getWorkflowById(params.id);
  if (!workflow) notFound();

  return <WorkflowDetail workflow={workflow} />;
}
