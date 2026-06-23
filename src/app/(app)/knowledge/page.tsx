import type { Metadata } from "next";

import { KnowledgeChat } from "@/components/knowledge/knowledge-chat";

export const metadata: Metadata = { title: "Knowledge AI" };

export default function KnowledgePage() {
  return (
    <div className="space-y-4 animate-fade-in">
      <KnowledgeChat />
    </div>
  );
}
