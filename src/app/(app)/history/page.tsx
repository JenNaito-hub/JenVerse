import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { HistoryView } from "@/components/history/history-view";
import { getHistoryItems } from "@/lib/db";

export const metadata: Metadata = { title: "History" };

export default async function HistoryPage() {
  const items = await getHistoryItems();

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="History"
        description="A complete log of every generation across your workspace."
      />
      <HistoryView items={items} />
    </div>
  );
}
