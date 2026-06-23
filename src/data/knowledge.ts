import type { KnowledgeConversation } from "@/types";

export const knowledgeConversations: KnowledgeConversation[] = [
  {
    id: "k-1",
    title: "Aurora launch email sequence",
    preview: "Write a 4-part launch email sequence for Aurora skincare…",
    model: "GPT-4o",
    updatedAt: "2026-06-23T09:12:00Z",
    messages: [
      {
        id: "k-1-m1",
        role: "user",
        content:
          "Write a 4-part launch email sequence for the Aurora skincare line targeting eco-conscious millennials. Keep it warm and premium.",
        createdAt: "2026-06-23T09:10:00Z",
      },
      {
        id: "k-1-m2",
        role: "assistant",
        content:
          "Here's a 4-part sequence designed to build anticipation and convert:\n\n**Email 1 — The Teaser (Day 0)**\nSubject: Something clean is coming ✨\nIntroduce the Aurora philosophy without revealing products. Lead with your sustainability commitment and invite readers to join the early list.\n\n**Email 2 — The Reveal (Day 3)**\nSubject: Meet Aurora — skincare that gives back\nShowcase the hero products, the refillable packaging, and the carbon-neutral supply chain. Include one founder quote for authenticity.\n\n**Email 3 — Social Proof (Day 5)**\nSubject: 2,000 people are already glowing\nShare early reviews, UGC, and dermatologist endorsements. Add a limited launch-week incentive.\n\n**Email 4 — Last Call (Day 7)**\nSubject: Your launch perk expires tonight\nCreate urgency with the closing offer and a clean, single CTA.\n\nWant me to draft the full copy for Email 1?",
        createdAt: "2026-06-23T09:12:00Z",
      },
    ],
  },
  {
    id: "k-2",
    title: "Atlas onboarding FAQ",
    preview: "Generate a 12-question onboarding FAQ for the Atlas dashboard.",
    model: "Gemini 1.5 Pro",
    updatedAt: "2026-06-22T16:40:00Z",
    messages: [
      {
        id: "k-2-m1",
        role: "user",
        content: "Generate a 12-question onboarding FAQ for the Atlas dashboard.",
        createdAt: "2026-06-22T16:38:00Z",
      },
      {
        id: "k-2-m2",
        role: "assistant",
        content:
          "Here are 12 onboarding FAQs covering setup, billing, and collaboration:\n\n1. How do I create my first workspace?\n2. Can I invite teammates during setup?\n3. Where do I connect my data sources?\n4. How is my usage billed?\n5. What's the difference between projects and workspaces?\n…and 7 more. Want the full answers drafted too?",
        createdAt: "2026-06-22T16:40:00Z",
      },
    ],
  },
  {
    id: "k-3",
    title: "Helio weekly digest — solar storage",
    preview: "Summarize the top 5 developments in solar storage this week…",
    model: "GPT-4o",
    updatedAt: "2026-06-21T11:05:00Z",
    messages: [
      {
        id: "k-3-m1",
        role: "user",
        content:
          "Summarize the top 5 developments in solar storage this week into an executive brief.",
        createdAt: "2026-06-21T11:00:00Z",
      },
      {
        id: "k-3-m2",
        role: "assistant",
        content:
          "**Executive Brief — Solar Storage, Week of Jun 21**\n\n1. **Grid-scale flow batteries** hit a new cost-per-kWh low, narrowing the gap with lithium-ion.\n2. **Residential virtual power plants** expanded to three new states.\n3. A major manufacturer announced a sodium-ion pilot for cold climates.\n4. Policy: new federal incentives for long-duration storage cleared committee.\n5. Two utilities signed 10-year storage offtake agreements.\n\nNet read: cost curves and policy are aligning to accelerate long-duration adoption.",
        createdAt: "2026-06-21T11:05:00Z",
      },
    ],
  },
  {
    id: "k-4",
    title: "Ember support macro rewrite",
    preview: "Rewrite our 8 most-used support macros in a warmer tone.",
    model: "GPT-4o mini",
    updatedAt: "2026-06-20T15:18:00Z",
    messages: [
      {
        id: "k-4-m1",
        role: "user",
        content:
          "Rewrite our 8 most-used support macros in a warmer, more concise tone.",
        createdAt: "2026-06-20T15:15:00Z",
      },
      {
        id: "k-4-m2",
        role: "assistant",
        content:
          "Happy to. Here's the first, rewritten:\n\n**Password reset**\nBefore: \"Your request has been received. Please follow the steps to reset your password.\"\nAfter: \"Let's get you back in — I've sent a reset link to your email. It's good for the next 30 minutes. 💛\"\n\nWant me to continue with the remaining 7 in this style?",
        createdAt: "2026-06-20T15:18:00Z",
      },
    ],
  },
];

export const knowledgePromptStarters = [
  "Draft a product launch announcement",
  "Summarize this research into key takeaways",
  "Write a friendly customer support reply",
  "Generate 10 blog post ideas about our product",
  "Turn these notes into a polished brief",
  "Explain this concept like I'm new to the field",
];
