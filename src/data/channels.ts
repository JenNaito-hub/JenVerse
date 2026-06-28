import type { Channel, ScheduledPost } from "@/types";

const avatar = (seed: string) =>
  `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(seed)}`;

export const channels: Channel[] = [
  { id: "ch-1", name: "Nguyễn Quyết Thắng", avatar: avatar("Thang"), type: "Profile", pending: 5, frequency: "2 bài/ngày", active: true },
  { id: "ch-2", name: "Sống cùng AI", avatar: avatar("SongAI"), type: "Fanpage", pending: 12, frequency: "4 bài/ngày", active: true },
  { id: "ch-3", name: "Ông Bố Marketing", avatar: avatar("OngBo"), type: "Fanpage", pending: 8, frequency: "3 bài/ngày", active: true },
  { id: "ch-4", name: "Kinh doanh Online 24h", avatar: avatar("KD24h"), type: "Group", pending: 6, frequency: "2 bài/ngày", active: true },
  { id: "ch-5", name: "Content Viral Việt", avatar: avatar("Viral"), type: "Fanpage", pending: 7, frequency: "3 bài/ngày", active: false },
  { id: "ch-6", name: "Mẹo Facebook Ads", avatar: avatar("Ads"), type: "Group", pending: 4, frequency: "2 bài/ngày", active: true },
];

export const scheduledPosts: ScheduledPost[] = [
  { id: "sp-1", time: "09:00", channelId: "ch-2", title: "Bài 1: Hook gây tò mò" },
  { id: "sp-2", time: "11:30", channelId: "ch-3", title: "Bài 2: Chia sẻ câu chuyện" },
  { id: "sp-3", time: "14:00", channelId: "ch-5", title: "Bài 3: Review ngắn" },
  { id: "sp-4", time: "16:30", channelId: "ch-4", title: "Bài 4: Tips thực chiến" },
  { id: "sp-5", time: "20:00", channelId: "ch-1", title: "Bài 5: Kêu gọi nhắn tin" },
];
