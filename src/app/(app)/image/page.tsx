import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { ImageStudio } from "@/components/image/image-studio";
import { getWorkflowById } from "@/lib/db";
import { AI_MODELS } from "@/lib/constants";

export const metadata: Metadata = { title: "Image AI" };

export default async function ImagePage({
  searchParams,
}: {
  searchParams: { workflow?: string };
}) {
  const workflow = searchParams.workflow
    ? await getWorkflowById(searchParams.workflow)
    : null;

  let activeWorkflow:
    | { id: string; name: string; modelId?: string; mode?: "text" | "image" }
    | undefined;

  if (workflow) {
    const current =
      workflow.versions.find((v) => v.version === workflow.currentVersion) ??
      workflow.versions[0];
    const modelStep = current?.steps.find((s) => s.type === "model");
    const modelLabel = modelStep?.config?.model;
    const matched = AI_MODELS.image.find((m) => m.label === modelLabel);
    // Workflows that take an image input start in image-to-image mode.
    const hasImageInput = current?.steps.some(
      (s) => s.type === "input" && s.config?.field === "image"
    );
    activeWorkflow = {
      id: workflow.id,
      name: workflow.name,
      modelId: matched?.id,
      mode: hasImageInput ? "image" : "text",
    };
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Image AI"
        description="Generate premium, on-brand visuals from a single prompt."
      />
      <ImageStudio activeWorkflow={activeWorkflow} />
    </div>
  );
}
