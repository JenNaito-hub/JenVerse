import type { LeadSource } from "@/types";

export interface RawComment {
  name: string;
  comment: string;
  commentedAt: string;
}

const avatar = (seed: string) =>
  `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(seed)}`;

export { avatar as leadAvatar };

/**
 * Mock comment pool used by the scraper in V1. A real implementation would
 * replace this with results from an authorized scraping provider.
 */
export const mockComments: RawComment[] = [
  { name: "Ngọc Anh", comment: "Sản phẩm này giá bao nhiêu vậy shop? Inbox mình với 🥰", commentedAt: "2026-06-26T08:40:00Z" },
  { name: "Minh Trí", comment: "Còn hàng không shop, mình muốn đặt 2 cái ship về Đà Nẵng", commentedAt: "2026-06-26T08:12:00Z" },
  { name: "Thu Hà", comment: "Nhìn xinh quá, để mình tìm hiểu thêm đã", commentedAt: "2026-06-26T07:55:00Z" },
  { name: "Quốc Bảo", comment: "Cho xin giá sỉ với ạ, mình lấy số lượng nhiều", commentedAt: "2026-06-26T07:30:00Z" },
  { name: "Lan Phương", comment: "Đẹp đó nhưng hơi mắc", commentedAt: "2026-06-26T07:02:00Z" },
  { name: "Hoàng Nam", comment: "Mua ở đâu vậy ạ? cho mình địa chỉ shop", commentedAt: "2026-06-25T20:18:00Z" },
  { name: "Diệu Linh", comment: "Chất lượng ok không mọi người, ai dùng rồi review giúp", commentedAt: "2026-06-25T19:44:00Z" },
  { name: "Tuấn Kiệt", comment: "Số điện thoại shop là gì để mình gọi đặt hàng", commentedAt: "2026-06-25T18:05:00Z" },
  { name: "Mỹ Duyên", comment: "Wow màu này hợp gu mình ghê", commentedAt: "2026-06-25T17:20:00Z" },
  { name: "Đức Huy", comment: "Ship COD không shop, bao nhiêu tiền ship", commentedAt: "2026-06-25T16:33:00Z" },
  { name: "Phương Thảo", comment: "Cho mình xin bảng giá với ạ, mình chốt luôn", commentedAt: "2026-06-25T15:10:00Z" },
  { name: "Gia Bảo", comment: "Hóng review", commentedAt: "2026-06-25T14:02:00Z" },
  { name: "Khánh Vy", comment: "Đặt hàng kiểu gì vậy shop ơi, mình muốn mua gấp", commentedAt: "2026-06-25T12:48:00Z" },
  { name: "Trọng Nghĩa", comment: "Để lại stk mình chuyển cọc nha shop", commentedAt: "2026-06-25T11:20:00Z" },
];

export const sourceLabels: Record<LeadSource, string> = {
  facebook_post: "Facebook Post",
  facebook_group: "Facebook Group",
  tiktok_video: "TikTok Video",
};

export const sourcePlaceholders: Record<LeadSource, string> = {
  facebook_post: "https://www.facebook.com/.../posts/...",
  facebook_group: "https://www.facebook.com/groups/.../posts/...",
  tiktok_video: "https://www.tiktok.com/@user/video/...",
};
