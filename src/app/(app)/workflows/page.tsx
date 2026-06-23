import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { WorkflowsView } from "@/components/workflows/workflows-view";

export const metadata: Metadata = { title: "Workflows" };

export default function WorkflowsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Workflow Library"
        description="Reusable generation pipelines — import, export, duplicate and version your workflows."
      />
      <WorkflowsView />
    </div>
  );
}
