import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { ScriptsView } from "@/components/scripts/scripts-view";

export const metadata: Metadata = { title: "Mẫu kịch bản" };

export default function ScriptsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Mẫu kịch bản"
        description="Thư viện khung content marketing đã được kiểm chứng — chọn mẫu, viết bài chốt đơn nhanh hơn."
      />
      <ScriptsView />
    </div>
  );
}
