import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { ContentStudio } from "@/components/content/content-studio";
import { getProviderStatus } from "@/lib/env";

export const metadata: Metadata = { title: "Content Studio" };

export default function ContentPage() {
  const status = getProviderStatus();
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Content Studio"
        description="Sản xuất bài đăng Facebook hàng loạt bằng AI — theo phong cách, tone và CTA bạn chọn."
      />
      <ContentStudio aiConfigured={status.gemini || status.openai} />
    </div>
  );
}
