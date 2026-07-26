import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { ContractsView } from "@/components/contracts/contracts-view";

export const metadata: Metadata = { title: "Hợp đồng" };

export default function ContractsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Hợp đồng"
        description="Soạn hợp đồng, Talent Release, phụ lục gia hạn và biên bản nghiệm thu cho Babyface — điền form, xem trước, in ra PDF."
      />
      <ContractsView />
    </div>
  );
}
