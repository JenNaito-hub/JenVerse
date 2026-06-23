import type { Metadata } from "next";

import { KnowledgeChat } from "@/components/knowledge/knowledge-chat";

export const metadata: Metadata = { title: "Knowledge AI" };

export default function KnowledgePage({
  searchParams,
}: {
  searchParams: { prompt?: string };
}) {
  return (
    <div className="space-y-4 animate-fade-in">
      <KnowledgeChat initialPrompt={searchParams.prompt ?? ""} />
    </div>
  );
}
