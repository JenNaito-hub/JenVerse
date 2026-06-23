import type { Workflow, WorkflowCategory } from "@/types";

export const workflowCategories: WorkflowCategory[] = [
  "Generation",
  "Editing",
  "Consistency",
  "Commercial",
];

export const workflows: Workflow[] = [
  {
    id: "wf-txt2img",
    name: "Text to Image",
    description:
      "The classic pipeline — turn a written prompt into a polished, high-resolution image.",
    category: "Generation",
    color: "#D7F205",
    tags: ["base", "prompt", "diffusion"],
    currentVersion: "1.3.0",
    runs: 4821,
    updatedAt: "2026-06-23T08:00:00Z",
    favorite: true,
    versions: [
      {
        version: "1.3.0",
        createdAt: "2026-06-23T08:00:00Z",
        note: "Added refiner pass and 2x upscale.",
        steps: [
          { id: "s1", type: "input", label: "Prompt", config: { field: "text" } },
          { id: "s2", type: "model", label: "Base model", config: { model: "DALL·E 3", steps: 30, cfg: 7 } },
          { id: "s3", type: "processor", label: "Refiner pass", config: { strength: 0.3 } },
          { id: "s4", type: "processor", label: "Upscale 2x", config: { factor: 2 } },
          { id: "s5", type: "output", label: "Image", config: { format: "png" } },
        ],
      },
      {
        version: "1.2.0",
        createdAt: "2026-06-10T10:00:00Z",
        note: "Bumped default steps 20 → 30.",
        steps: [
          { id: "s1", type: "input", label: "Prompt", config: { field: "text" } },
          { id: "s2", type: "model", label: "Base model", config: { model: "DALL·E 3", steps: 30, cfg: 7 } },
          { id: "s5", type: "output", label: "Image", config: { format: "png" } },
        ],
      },
      {
        version: "1.0.0",
        createdAt: "2026-05-28T09:00:00Z",
        note: "Initial release.",
        steps: [
          { id: "s1", type: "input", label: "Prompt", config: { field: "text" } },
          { id: "s2", type: "model", label: "Base model", config: { model: "DALL·E 3", steps: 20 } },
          { id: "s5", type: "output", label: "Image" },
        ],
      },
    ],
  },
  {
    id: "wf-img2img",
    name: "Image to Image",
    description:
      "Transform an existing image while preserving its composition — restyle, refine or reimagine.",
    category: "Editing",
    color: "#7C9EFF",
    tags: ["img2img", "restyle", "denoise"],
    currentVersion: "2.1.0",
    runs: 2934,
    updatedAt: "2026-06-22T14:30:00Z",
    versions: [
      {
        version: "2.1.0",
        createdAt: "2026-06-22T14:30:00Z",
        note: "Exposed denoise strength as a slider.",
        steps: [
          { id: "s1", type: "input", label: "Source image", config: { field: "image" } },
          { id: "s2", type: "input", label: "Prompt", config: { field: "text" } },
          { id: "s3", type: "model", label: "Diffusion model", config: { denoise: 0.65, steps: 28 } },
          { id: "s4", type: "output", label: "Image" },
        ],
      },
      {
        version: "2.0.0",
        createdAt: "2026-06-01T11:00:00Z",
        note: "Switched to a higher-fidelity base model.",
        steps: [
          { id: "s1", type: "input", label: "Source image", config: { field: "image" } },
          { id: "s2", type: "input", label: "Prompt", config: { field: "text" } },
          { id: "s3", type: "model", label: "Diffusion model", config: { denoise: 0.7 } },
          { id: "s4", type: "output", label: "Image" },
        ],
      },
    ],
  },
  {
    id: "wf-facelock",
    name: "Face Lock",
    description:
      "Keep a subject's face consistent across every generation using a reference identity.",
    category: "Consistency",
    color: "#C77CFF",
    tags: ["identity", "ip-adapter", "consistency"],
    currentVersion: "1.4.2",
    runs: 1768,
    updatedAt: "2026-06-21T16:10:00Z",
    favorite: true,
    versions: [
      {
        version: "1.4.2",
        createdAt: "2026-06-21T16:10:00Z",
        note: "Improved identity weighting for side profiles.",
        steps: [
          { id: "s1", type: "input", label: "Reference face", config: { field: "image" } },
          { id: "s2", type: "control", label: "Identity encoder", config: { adapter: "InstantID", weight: 0.85 } },
          { id: "s3", type: "input", label: "Scene prompt", config: { field: "text" } },
          { id: "s4", type: "model", label: "Diffusion model", config: { steps: 32 } },
          { id: "s5", type: "output", label: "Image" },
        ],
      },
      {
        version: "1.3.0",
        createdAt: "2026-06-05T13:00:00Z",
        note: "Added face restore post-step.",
        steps: [
          { id: "s1", type: "input", label: "Reference face", config: { field: "image" } },
          { id: "s2", type: "control", label: "Identity encoder", config: { adapter: "IP-Adapter", weight: 0.8 } },
          { id: "s3", type: "input", label: "Scene prompt", config: { field: "text" } },
          { id: "s4", type: "model", label: "Diffusion model" },
          { id: "s5", type: "processor", label: "Face restore" },
          { id: "s6", type: "output", label: "Image" },
        ],
      },
    ],
  },
  {
    id: "wf-charsheet",
    name: "Character Sheet",
    description:
      "Generate a consistent character across multiple poses and expressions in one grid.",
    category: "Consistency",
    color: "#7CFFD4",
    tags: ["character", "multi-pose", "grid"],
    currentVersion: "1.1.0",
    runs: 1204,
    updatedAt: "2026-06-20T09:45:00Z",
    versions: [
      {
        version: "1.1.0",
        createdAt: "2026-06-20T09:45:00Z",
        note: "Added expression row (neutral / smile / angry).",
        steps: [
          { id: "s1", type: "input", label: "Character description", config: { field: "text" } },
          { id: "s2", type: "control", label: "Locked seed", config: { seed: 77123 } },
          { id: "s3", type: "processor", label: "Pose grid", config: { poses: 6 } },
          { id: "s4", type: "processor", label: "Expression row", config: { expressions: 3 } },
          { id: "s5", type: "output", label: "Sheet (grid)", config: { layout: "3x3" } },
        ],
      },
      {
        version: "1.0.0",
        createdAt: "2026-06-08T10:00:00Z",
        note: "Initial release.",
        steps: [
          { id: "s1", type: "input", label: "Character description", config: { field: "text" } },
          { id: "s2", type: "control", label: "Locked seed", config: { seed: 77123 } },
          { id: "s3", type: "processor", label: "Pose grid", config: { poses: 4 } },
          { id: "s5", type: "output", label: "Sheet (grid)", config: { layout: "2x2" } },
        ],
      },
    ],
  },
  {
    id: "wf-comcard",
    name: "Comcard Generator",
    description:
      "Build a print-ready model comp card with headshots, stats and agency branding.",
    category: "Commercial",
    color: "#FF9F7C",
    tags: ["comp-card", "model", "print"],
    currentVersion: "1.2.1",
    runs: 642,
    updatedAt: "2026-06-19T12:00:00Z",
    versions: [
      {
        version: "1.2.1",
        createdAt: "2026-06-19T12:00:00Z",
        note: "Fixed bleed margins for A5 print.",
        steps: [
          { id: "s1", type: "input", label: "Model photos", config: { field: "images", count: 5 } },
          { id: "s2", type: "input", label: "Stats (height, sizes)", config: { field: "form" } },
          { id: "s3", type: "processor", label: "Comp card layout", config: { template: "agency-classic" } },
          { id: "s4", type: "control", label: "Brand overlay", config: { logo: true } },
          { id: "s5", type: "output", label: "Print-ready PDF", config: { format: "pdf", size: "A5" } },
        ],
      },
      {
        version: "1.0.0",
        createdAt: "2026-06-02T09:00:00Z",
        note: "Initial release.",
        steps: [
          { id: "s1", type: "input", label: "Model photos", config: { field: "images", count: 4 } },
          { id: "s2", type: "input", label: "Stats", config: { field: "form" } },
          { id: "s3", type: "processor", label: "Comp card layout", config: { template: "minimal" } },
          { id: "s5", type: "output", label: "PDF", config: { format: "pdf" } },
        ],
      },
    ],
  },
  {
    id: "wf-productkv",
    name: "Product KV",
    description:
      "Composite a product into a branded key visual scene ready for campaigns and ads.",
    category: "Commercial",
    color: "#FF7CA8",
    tags: ["key-visual", "product", "campaign"],
    currentVersion: "2.0.0",
    runs: 988,
    updatedAt: "2026-06-23T07:30:00Z",
    favorite: true,
    versions: [
      {
        version: "2.0.0",
        createdAt: "2026-06-23T07:30:00Z",
        note: "Added auto background removal + relight.",
        steps: [
          { id: "s1", type: "input", label: "Product image", config: { field: "image" } },
          { id: "s2", type: "processor", label: "Background removal" },
          { id: "s3", type: "input", label: "Scene prompt", config: { field: "text" } },
          { id: "s4", type: "model", label: "Scene generation" },
          { id: "s5", type: "processor", label: "Relight & composite" },
          { id: "s6", type: "control", label: "Brand overlay", config: { logo: true, headline: true } },
          { id: "s7", type: "output", label: "Key visual", config: { ratio: "16:9" } },
        ],
      },
      {
        version: "1.0.0",
        createdAt: "2026-06-04T08:00:00Z",
        note: "Initial release.",
        steps: [
          { id: "s1", type: "input", label: "Product image", config: { field: "image" } },
          { id: "s3", type: "input", label: "Scene prompt", config: { field: "text" } },
          { id: "s4", type: "model", label: "Scene generation" },
          { id: "s7", type: "output", label: "Key visual" },
        ],
      },
    ],
  },
];
