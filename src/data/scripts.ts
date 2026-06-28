import type { ScriptTemplate } from "@/types";

export const scriptCategories = [
  "Hook viral",
  "Bán hàng",
  "Storytelling",
  "Review",
  "Giáo dục",
  "Kêu gọi",
];

export const scriptTemplates: ScriptTemplate[] = [
  {
    id: "sc-aida",
    title: "AIDA — Khung bán hàng kinh điển",
    category: "Bán hàng",
    description:
      "Dẫn dắt khách từ chú ý đến hành động qua 4 bước. Hợp mọi sản phẩm.",
    framework: [
      "Attention — Hook gây chú ý ngay câu đầu",
      "Interest — Khơi gợi sự quan tâm (vấn đề/lợi ích)",
      "Desire — Tạo khao khát (kết quả, bằng chứng)",
      "Action — Kêu gọi hành động rõ ràng",
    ],
    example:
      "😱 Da dầu mụn mà vẫn dùng kem chống nắng bí da? Dừng lại đọc cái này!\n\nMình từng bỏ nắng vì sợ bí... đến khi tìm ra loại kiềm dầu suốt 8 tiếng.\n\nKhông bóng nhờn, không vệt trắng, thấm nhanh.\n\n👉 Inbox \"DA DẦU\" để được tư vấn loại hợp da bạn nhé!",
    style: "Bán hàng",
    tags: ["AIDA", "Sale", "CTA"],
    color: "#D7F205",
  },
  {
    id: "sc-pas",
    title: "PAS — Vấn đề · Khoét sâu · Giải pháp",
    category: "Bán hàng",
    description:
      "Đánh vào nỗi đau của khách rồi đưa giải pháp. Chuyển đổi rất tốt.",
    framework: [
      "Problem — Nêu đúng nỗi đau khách đang gặp",
      "Agitate — Khoét sâu hậu quả nếu không giải quyết",
      "Solution — Giới thiệu giải pháp + CTA",
    ],
    example:
      "Bạn đăng bài mỗi ngày mà chẳng ai mua? 😔\n\nCàng đăng nhiều mà không có chiến lược, khách càng lướt qua — phí thời gian, nản lòng, muốn bỏ cuộc.\n\nVấn đề không phải bạn lười, mà là thiếu khung nội dung chuẩn.\n\n👉 Comment \"CONTENT\" mình gửi bộ khung viết bài chốt đơn nhé!",
    style: "Bán hàng",
    tags: ["PAS", "Pain", "CTA"],
    color: "#FF7CA8",
  },
  {
    id: "sc-hook3s",
    title: "Hook 3 giây — Giữ chân người lướt",
    category: "Hook viral",
    description: "Mẫu câu mở đầu khiến người ta phải dừng lại đọc tiếp.",
    framework: [
      "Câu hỏi gây tò mò / con số sốc",
      "Hứa hẹn giá trị cụ thể",
      "Tạo khoảng trống thông tin (curiosity gap)",
    ],
    example:
      "\"Mình tăng 300% đơn chỉ nhờ đổi 1 câu mở bài...\"\n\nNghe vô lý nhưng có thật. Và đây là cách mình làm 👇",
    style: "Storytelling",
    tags: ["Hook", "Viral"],
    color: "#C77CFF",
  },
  {
    id: "sc-story",
    title: "Story bán hàng — Kể chuyện để bán",
    category: "Storytelling",
    description:
      "Bán hàng qua câu chuyện cá nhân, tạo cảm xúc và niềm tin.",
    framework: [
      "Bối cảnh — Tôi từng gặp vấn đề...",
      "Cao trào — Mọi thứ tệ đến mức...",
      "Bước ngoặt — Rồi tôi tìm ra...",
      "Kết quả + Bài học + CTA",
    ],
    example:
      "Năm ngoái mình suýt đóng shop vì ế ẩm...\n\nHàng tồn chất kho, tiền thuê mặt bằng ngốn sạch lãi.\n\nRồi mình thử bán bằng livestream + content kể chuyện. Tháng đó đơn gấp 5.\n\nBài học: người ta mua cảm xúc, không mua sản phẩm.\n\n👉 Bạn đang bán gì? Kể mình nghe nhé!",
    style: "Storytelling",
    tags: ["Story", "Emotional", "Trust"],
    color: "#FF9F7C",
  },
  {
    id: "sc-bab",
    title: "Before — After — Bridge",
    category: "Bán hàng",
    description: "Vẽ ra hiện trạng tệ → tương lai tươi sáng → cầu nối là sản phẩm.",
    framework: [
      "Before — Cuộc sống hiện tại đầy vấn đề",
      "After — Cuộc sống mơ ước sau khi giải quyết",
      "Bridge — Sản phẩm/dịch vụ là cây cầu nối",
    ],
    example:
      "TRƯỚC: Sáng nào cũng cuống cuồng vì da xỉn, lỗ chân lông to. 😣\n\nSAU: Da căng mịn, tự tin ra đường không cần lớp nền dày.\n\nCẦU NỐI: Serum cấp ẩm + thu nhỏ lỗ chân lông dùng 4 tuần.\n\n👉 Để lại SĐT mình gửi lộ trình chi tiết nha!",
    style: "Bán hàng",
    tags: ["BAB", "Sale", "CTA"],
    color: "#7C9EFF",
  },
  {
    id: "sc-review",
    title: "Review chân thật — Tạo niềm tin",
    category: "Review",
    description: "Khung review nghe thật, không quảng cáo lố, dễ tin.",
    framework: [
      "Lý do mình thử sản phẩm",
      "Trải nghiệm thật (cả ưu & nhược nhỏ)",
      "Kết quả sau X ngày",
      "Khuyên ai nên dùng + CTA",
    ],
    example:
      "Review thật sau 2 tuần dùng máy xay cầm tay này 👇\n\nƯu: nhỏ gọn, xay mịn, dễ rửa.\nNhược: hơi ồn 1 chút.\n\nNhưng với 200k thì quá đáng tiền cho mẹ bỉm như mình.\n\nAi hay làm đồ ăn dặm thì nên sắm. 👉 Inbox mình gửi link nhé!",
    style: "Review",
    tags: ["Review", "Trust"],
    color: "#7CFFD4",
  },
  {
    id: "sc-listicle",
    title: "Listicle — \"5 cách / 5 sai lầm\"",
    category: "Giáo dục",
    description: "Nội dung giá trị dạng danh sách, dễ đọc, dễ lưu, dễ share.",
    framework: [
      "Tiêu đề con số + lợi ích (5 cách...)",
      "Liệt kê từng ý ngắn gọn, có emoji",
      "Chốt bằng lời khuyên + CTA mềm",
    ],
    example:
      "5 SAI LẦM khiến bài đăng của bạn không ai xem 👇\n\n1️⃣ Mở bài nhạt\n2️⃣ Viết dài dòng\n3️⃣ Không có CTA\n4️⃣ Đăng sai giờ\n5️⃣ Không tương tác lại\n\nSửa 5 lỗi này là khác ngay.\n\n👉 Lưu lại để dùng dần nhé!",
    style: "Giáo dục",
    tags: ["Tips", "Value"],
    color: "#FFC97C",
  },
  {
    id: "sc-debate",
    title: "Câu hỏi gây tranh luận",
    category: "Hook viral",
    description: "Tạo bài kéo comment khủng bằng một câu hỏi chia phe.",
    framework: [
      "Nêu một quan điểm/chủ đề gây chia rẽ nhẹ",
      "Đưa 2 phía rõ ràng",
      "Mời mọi người chọn phe ở comment",
    ],
    example:
      "Bán hàng online: NÊN hay KHÔNG nên để giá công khai? 🤔\n\nĐể giá: lọc khách, đỡ mất thời gian.\nGiấu giá: kéo inbox, dễ tư vấn.\n\nBạn team nào? Comment cho mình biết nhé! 👇",
    style: "Bán hàng",
    tags: ["Hook", "Engagement"],
    color: "#FF9F7C",
  },
  {
    id: "sc-cta-inbox",
    title: "Kêu gọi inbox / để lại SĐT",
    category: "Kêu gọi",
    description: "Bài ngắn tập trung đẩy khách nhắn tin, hợp chạy quảng cáo.",
    framework: [
      "1 lợi ích nổi bật nhất",
      "Ưu đãi có giới hạn (khan hiếm)",
      "CTA cực rõ: nhắn tin / để lại SĐT",
    ],
    example:
      "🔥 CHỈ 50 SUẤT đầu tiên: tặng kèm túi canvas khi mua combo skincare.\n\nHết suất là dừng nha cả nhà.\n\n👉 Nhắn \"COMBO\" hoặc để lại SĐT, mình giữ suất + tư vấn ngay!",
    style: "Bán hàng",
    tags: ["CTA", "Sale"],
    color: "#D7F205",
  },
  {
    id: "sc-mini-case",
    title: "Mini case study — Bằng chứng kết quả",
    category: "Storytelling",
    description: "Kể một ca khách hàng thật để chứng minh hiệu quả.",
    framework: [
      "Khách là ai + vấn đề ban đầu",
      "Đã làm gì với sản phẩm/dịch vụ",
      "Kết quả cụ thể (con số)",
      "CTA: bạn cũng muốn vậy?",
    ],
    example:
      "Chị Lan (chủ shop mỹ phẩm) từng chỉ 5 đơn/ngày.\n\nSau khi áp dụng bộ content + lịch đăng đều, chị lên 30 đơn/ngày sau 1 tháng. 📈\n\nKhông phải may mắn — là có hệ thống.\n\n👉 Muốn mình gửi bộ khung chị Lan dùng? Comment \"HỆ THỐNG\" nhé!",
    style: "Storytelling",
    tags: ["Story", "Proof", "CTA"],
    color: "#C77CFF",
  },
];
