import type { Metadata } from "next";
import { Download } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { HistoryView } from "@/components/history/history-view";
import { Button } from "@/components/ui/button";
import { getHistoryItems } from "@/lib/db";

export const metadata: Metadata = { title: "History" };

export default async function HistoryPage() {
  const items = await getHistoryItems();

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="History"
        description="A complete log of every generation across your workspace."
      >
        <Button variant="outline">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </PageHeader>
      <HistoryView items={items} />
    </div>
  );
}
