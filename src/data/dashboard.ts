import { BrainCircuit, ImageIcon, Radar, Sparkles } from "lucide-react";
import type { StatCard, ActivityItem, UsagePoint } from "@/types";
import { teamMembers } from "./team";

export const statCards: StatCard[] = [
  {
    id: "s-knowledge",
    label: "Knowledge generations",
    value: "1,284",
    change: 12.5,
    trend: "up",
    icon: BrainCircuit,
  },
  {
    id: "s-images",
    label: "Images created",
    value: "3,902",
    change: 8.2,
    trend: "up",
    icon: ImageIcon,
  },
  {
    id: "s-leads",
    label: "Leads collected",
    value: "1,042",
    change: 18.4,
    trend: "up",
    icon: Radar,
  },
  {
    id: "s-credits",
    label: "Credits remaining",
    value: "46.2K",
    change: -4.1,
    trend: "down",
    icon: Sparkles,
  },
];

export const usageData: UsagePoint[] = [
  { label: "Mon", knowledge: 42, image: 88 },
  { label: "Tue", knowledge: 61, image: 72 },
  { label: "Wed", knowledge: 55, image: 96 },
  { label: "Thu", knowledge: 78, image: 64 },
  { label: "Fri", knowledge: 90, image: 110 },
  { label: "Sat", knowledge: 38, image: 52 },
  { label: "Sun", knowledge: 47, image: 70 },
];

export const activityFeed: ActivityItem[] = [
  {
    id: "a-1",
    actor: teamMembers[1],
    action: "tạo 12 bài viết trong",
    target: "Content Studio",
    type: "knowledge",
    createdAt: "2026-06-23T09:05:00Z",
  },
  {
    id: "a-2",
    actor: teamMembers[2],
    action: "thu 48 leads từ một video",
    target: "TikTok",
    type: "system",
    createdAt: "2026-06-23T08:32:00Z",
  },
  {
    id: "a-3",
    actor: teamMembers[0],
    action: "lên lịch 18 bài trên 6",
    target: "kênh Facebook",
    type: "system",
    createdAt: "2026-06-23T07:02:00Z",
  },
  {
    id: "a-4",
    actor: teamMembers[3],
    action: "tạo bộ ảnh 4 góc trong",
    target: "Image AI",
    type: "image",
    createdAt: "2026-06-22T18:20:00Z",
  },
  {
    id: "a-5",
    actor: teamMembers[4],
    action: "export 124 leads ra",
    target: "Excel",
    type: "system",
    createdAt: "2026-06-22T15:47:00Z",
  },
];
