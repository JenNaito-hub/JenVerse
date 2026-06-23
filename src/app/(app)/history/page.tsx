import type { Metadata } from "next";
import { Download } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { HistoryView } from "@/components/history/history-view";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "History" };

export default function HistoryPage() {
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
      <HistoryView />
    </div>
  );
}
