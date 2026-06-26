import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { LeadScraper } from "@/components/leads/lead-scraper";
import { getProviderStatus } from "@/lib/env";

export const metadata: Metadata = { title: "Lead Scraper" };

export default function LeadsPage() {
  const status = getProviderStatus();
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Social Lead Scraper"
        description="Collect commenters from Facebook & TikTok, extract interest keywords and score hot/cold leads."
      />
      <LeadScraper aiConfigured={status.gemini || status.openai} />
    </div>
  );
}
