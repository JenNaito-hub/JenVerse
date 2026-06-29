import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { ImageStudio } from "@/components/image/image-studio";
import { getProviderStatus } from "@/lib/env";

export const metadata: Metadata = { title: "Image AI" };

export default function ImagePage({
  searchParams,
}: {
  searchParams: { prompt?: string };
}) {
  const status = getProviderStatus();

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Image AI"
        description="Generate premium, on-brand visuals from a single prompt."
      />
      <ImageStudio
        initialPrompt={searchParams.prompt ?? ""}
        demoMode={!status.openai && !status.gemini}
      />
    </div>
  );
}
