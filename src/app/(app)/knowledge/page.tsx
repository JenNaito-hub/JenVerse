import type { Metadata } from "next";

import { KnowledgeChat } from "@/components/knowledge/knowledge-chat";
import { getProviderStatus } from "@/lib/env";

export const metadata: Metadata = { title: "Knowledge AI" };

export default function KnowledgePage({
  searchParams,
}: {
  searchParams: { prompt?: string };
}) {
  const status = getProviderStatus();
  return (
    <div className="space-y-4 animate-fade-in">
      <KnowledgeChat
        initialPrompt={searchParams.prompt ?? ""}
        demoMode={!status.openai && !status.gemini}
      />
    </div>
  );
}
