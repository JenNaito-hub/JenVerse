import type { VideoClip } from "@/types";

export const videoStyles = [
  "Cinematic",
  "Quảng cáo sản phẩm",
  "Hoạt hình",
  "Vlog",
  "Tin tức",
  "Review",
];

export const videoDurations = ["15s", "30s", "60s"];

export const videoVoices = [
  "Nữ miền Bắc",
  "Nam miền Bắc",
  "Nữ miền Nam",
  "Nam miền Nam",
  "Không lồng tiếng",
];

export const videoRatios = ["9:16", "1:1", "16:9"];

/** A reliable public sample used for preview playback in demo mode. */
export const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

export const videoPosters = [
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80",
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
  "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80",
];

export const seedVideos: VideoClip[] = [
  {
    id: "vid-1",
    title: "Quảng cáo kem chống nắng",
    prompt:
      "Cinematic product ad for a sunscreen, golden hour, slow motion water splash.",
    poster: videoPosters[1],
    url: SAMPLE_VIDEO,
    duration: "15s",
    aspectRatio: "9:16",
    createdAt: "2026-06-26T09:00:00Z",
  },
  {
    id: "vid-2",
    title: "Vlog du lịch biển",
    prompt: "Travel vlog intro, beach sunset, upbeat, drone shots.",
    poster: videoPosters[0],
    url: SAMPLE_VIDEO,
    duration: "30s",
    aspectRatio: "16:9",
    createdAt: "2026-06-25T16:30:00Z",
  },
];
