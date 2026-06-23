import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { TemplatesView } from "@/components/templates/templates-view";

export const metadata: Metadata = { title: "Templates" };

export default function TemplatesPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Templates"
        description="Curated prompt templates to kickstart your knowledge and image generations."
      />
      <TemplatesView />
    </div>
  );
}
