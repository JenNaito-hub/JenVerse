import type { GeneratedImage } from "@/types";

export const generatedImages: GeneratedImage[] = [
  {
    id: "img-1",
    prompt:
      "A premium product hero shot on a sunset gradient backdrop, soft studio lighting, editorial.",
    url: "https://images.unsplash.com/photo-1614849963640-9cc74b2a826f?w=600&q=80",
    model: "DALL·E 3",
    aspectRatio: "1:1",
    createdAt: "2026-06-23T08:40:00Z",
    liked: true,
  },
  {
    id: "img-2",
    prompt:
      "Coastal interior moodboard, muted blues and sand tones, natural linen textures, minimalist.",
    url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80",
    model: "Imagen 3",
    aspectRatio: "1:1",
    createdAt: "2026-06-22T13:05:00Z",
    liked: false,
  },
  {
    id: "img-3",
    prompt:
      "Minimalist skincare bottle on a marble surface, soft shadows, botanical sprig, premium.",
    url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
    model: "Imagen 3",
    aspectRatio: "1:1",
    createdAt: "2026-06-20T10:44:00Z",
    liked: true,
  },
  {
    id: "img-4",
    prompt:
      "Dynamic fitness scene with dramatic light leaks, motion blur, bold lime accents.",
    url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
    model: "DALL·E 3",
    aspectRatio: "1:1",
    createdAt: "2026-06-21T09:30:00Z",
    liked: false,
  },
  {
    id: "img-5",
    prompt:
      "Abstract iridescent gradient texture, smooth, suitable for ad backgrounds.",
    url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&q=80",
    model: "DALL·E 3",
    aspectRatio: "1:1",
    createdAt: "2026-06-19T12:10:00Z",
    liked: true,
  },
  {
    id: "img-6",
    prompt:
      "Soft botanical still life, neutral palette, natural window light, slow-living aesthetic.",
    url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80",
    model: "Imagen 3",
    aspectRatio: "1:1",
    createdAt: "2026-06-18T16:22:00Z",
    liked: false,
  },
  {
    id: "img-7",
    prompt:
      "Modern architecture detail, concrete and glass, dramatic shadows, fine-art photography.",
    url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=80",
    model: "DALL·E 3",
    aspectRatio: "1:1",
    createdAt: "2026-06-18T11:08:00Z",
    liked: false,
  },
  {
    id: "img-8",
    prompt:
      "Lush tropical leaves with morning dew, deep greens, high detail macro.",
    url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80",
    model: "Imagen 3",
    aspectRatio: "1:1",
    createdAt: "2026-06-17T09:51:00Z",
    liked: true,
  },
];

export const imageStyles = [
  "Photorealistic",
  "Editorial",
  "Minimalist",
  "Cinematic",
  "3D Render",
  "Watercolor",
  "Vaporwave",
  "Product Studio",
];

export const aspectRatios = ["1:1", "4:5", "16:9", "9:16", "3:2"];
