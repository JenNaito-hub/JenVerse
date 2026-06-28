import type { Template, TemplateCategory } from "@/types";

export const templateCategories: TemplateCategory[] = [
  "Marketing",
  "Content",
  "Social",
  "Design",
  "Research",
  "Support",
  "Product",
];

export const templates: Template[] = [
  {
    id: "t-launch-email",
    title: "Product launch email",
    description:
      "A persuasive launch announcement that builds excitement and drives clicks.",
    category: "Marketing",
    type: "knowledge",
    prompt:
      "Write a product launch email for [PRODUCT]. Audience: [AUDIENCE]. Tone: warm and premium. Include a compelling subject line, a short hook, 3 key benefits, social proof, and a single clear call to action.",
    color: "#D7F205",
    uses: 1284,
    featured: true,
  },
  {
    id: "t-blog-outline",
    title: "SEO blog outline",
    description:
      "A structured, search-optimized outline ready to expand into a full article.",
    category: "Content",
    type: "knowledge",
    prompt:
      "Create a detailed SEO blog outline for the topic [TOPIC]. Include an H1, 6-8 H2 sections with bullet sub-points, a suggested meta description, and 5 target keywords.",
    color: "#7C9EFF",
    uses: 962,
    featured: true,
  },
  {
    id: "t-social-pack",
    title: "Social caption pack",
    description:
      "Ten on-brand captions with hooks and hashtags for a single campaign.",
    category: "Social",
    type: "knowledge",
    prompt:
      "Generate 10 social media captions for [CAMPAIGN] on [PLATFORM]. Each caption should have a scroll-stopping hook, a value line, an emoji, and 3 relevant hashtags. Keep the brand voice playful but premium.",
    color: "#FF7CA8",
    uses: 845,
  },
  {
    id: "t-support-reply",
    title: "Friendly support reply",
    description:
      "Warm, concise customer support responses that resolve and reassure.",
    category: "Support",
    type: "knowledge",
    prompt:
      "Write a friendly, concise customer support reply for this situation: [ISSUE]. Acknowledge the problem, give a clear next step, and end on a reassuring note. Keep it under 90 words.",
    color: "#FFC97C",
    uses: 612,
  },
  {
    id: "t-research-brief",
    title: "Executive research brief",
    description:
      "Summarize messy notes or sources into a crisp, decision-ready brief.",
    category: "Research",
    type: "knowledge",
    prompt:
      "Summarize the following notes into an executive brief with: a one-line takeaway, 5 key findings as bullets, and 3 recommended next actions. Notes: [PASTE NOTES].",
    color: "#C77CFF",
    uses: 538,
  },
  {
    id: "t-feature-spec",
    title: "Feature spec draft",
    description:
      "Turn a rough idea into a structured product feature specification.",
    category: "Product",
    type: "knowledge",
    prompt:
      "Draft a feature spec for [FEATURE]. Include: problem statement, target user, goals & non-goals, proposed solution, key user stories, and success metrics.",
    color: "#7CFFD4",
    uses: 421,
  },
  {
    id: "t-hero-shot",
    title: "Premium product hero",
    description:
      "Editorial product hero shot with studio lighting and a clean backdrop.",
    category: "Design",
    type: "image",
    prompt:
      "A premium product hero shot of [PRODUCT] on a [COLOR] gradient backdrop, soft studio lighting, subtle reflections, 8k, editorial photography, ultra-detailed.",
    color: "#D7F205",
    uses: 1893,
    featured: true,
  },
  {
    id: "t-moodboard",
    title: "Interior moodboard tile",
    description:
      "Cohesive interior moodboard imagery in a defined palette and mood.",
    category: "Design",
    type: "image",
    prompt:
      "An interior moodboard tile in the style of [STYLE], palette of [COLORS], natural textures like linen and oak, soft daylight, minimalist composition, high detail.",
    color: "#7CFFD4",
    uses: 734,
  },
  {
    id: "t-ad-background",
    title: "Abstract ad background",
    description:
      "Smooth, iridescent gradient textures perfect for ad and banner backdrops.",
    category: "Marketing",
    type: "image",
    prompt:
      "An abstract iridescent gradient texture in [COLORS], smooth and glossy, soft volumetric light, suitable as an advertising background, 16:9, high resolution.",
    color: "#FF9F7C",
    uses: 689,
  },
  {
    id: "t-social-visual",
    title: "Bold social visual",
    description:
      "High-energy social graphic with dramatic light leaks and brand accents.",
    category: "Social",
    type: "image",
    prompt:
      "A dynamic social media visual for [BRAND], dramatic light leaks, motion blur, bold [ACCENT] accents, cinematic contrast, vertical 9:16 composition.",
    color: "#FF7CA8",
    uses: 503,
  },
  {
    id: "t-packaging",
    title: "Minimalist packaging",
    description:
      "Clean packaging concept on a natural surface with soft shadows.",
    category: "Product",
    type: "image",
    prompt:
      "A minimalist [PRODUCT] package on a marble surface, soft directional shadows, a single botanical sprig, neutral palette, premium studio photography.",
    color: "#C77CFF",
    uses: 458,
  },
  {
    id: "t-lifestyle",
    title: "Lifestyle still life",
    description:
      "Slow-living lifestyle scene with natural light and a calm palette.",
    category: "Content",
    type: "image",
    prompt:
      "A soft lifestyle still life featuring [SUBJECT], neutral palette, natural window light, slow-living aesthetic, shallow depth of field, editorial mood.",
    color: "#7C9EFF",
    uses: 397,
  },
];
