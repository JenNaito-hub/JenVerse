import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { ImageStudio } from "@/components/image/image-studio";

export const metadata: Metadata = { title: "Image AI" };

export default function ImagePage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Image AI"
        description="Generate premium, on-brand visuals from a single prompt."
      />
      <ImageStudio />
    </div>
  );
}
