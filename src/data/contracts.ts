import type { ContractBlock, ContractField, ContractTemplate } from "@/types";

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

const today = () => {
  // Deterministic default — an empty date is filled in by the user.
  return "";
};

/** Format a YYYY-MM-DD value as "ngày DD tháng MM năm YYYY". */
export function formatVnDate(iso: string): string {
  if (!iso) return "ngày ….. tháng ….. năm ……";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `ngày ${d} tháng ${m} năm ${y}`;
}

/** Format a number string as Vietnamese currency with thousands separators. */
export function formatVnMoney(value: string): string {
  const n = Number(String(value).replace(/[^\d]/g, ""));
  if (!value || Number.isNaN(n) || n === 0) return "…………………";
  return n.toLocaleString("vi-VN") + " đ";
}

const fallback = (v: string, dash = "……………………………") => (v && v.trim() ? v.trim() : dash);

/** The national heading used on every Vietnamese legal document. */
const nationalHeader = (): ContractBlock[] => [
  { type: "center", text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", strong: true },
  { type: "center", text: "Độc lập – Tự do – Hạnh phúc", strong: true },
  { type: "center", text: "———— o0o ————", size: "sm" },
  { type: "spacer" },
];

/** Bên A (Babyface) identity block. */
const partyABlock = (v: Record<string, string>): ContractBlock[] => [
  { type: "para", text: "BÊN A (Bên sử dụng / Bên thuê):", strong: true },
  { type: "kv", label: "Đơn vị", value: fallback(v.partyA_name) },
  { type: "kv", label: "Đại diện", value: fallback(v.partyA_rep) },
  { type: "kv", label: "Chức vụ", value: fallback(v.partyA_role) },
  { type: "kv", label: "Địa chỉ", value: fallback(v.partyA_address) },
  { type: "kv", label: "Mã số thuế", value: fallback(v.partyA_tax) },
  { type: "kv", label: "Điện thoại", value: fallback(v.partyA_phone) },
];

/** Bên B (Talent) identity block. */
const partyBBlock = (v: Record<string, string>): ContractBlock[] => [
  { type: "para", text: "BÊN B (Talent / Người biểu diễn):", strong: true },
  { type: "kv", label: "Họ và tên", value: fallback(v.partyB_name) },
  { type: "kv", label: "Nghệ danh", value: fallback(v.partyB_stage, "…") },
  { type: "kv", label: "Ngày sinh", value: v.partyB_dob ? formatVnDate(v.partyB_dob) : "……/……/………" },
  {
    type: "kv",
    label: "CCCD/CMND",
    value: `${fallback(v.partyB_id, "…………………")} — cấp ${v.partyB_id_date ? formatVnDate(v.partyB_id_date) : "ngày …/…/……"}${v.partyB_id_place ? " tại " + v.partyB_id_place : ""}`,
  },
  { type: "kv", label: "Địa chỉ", value: fallback(v.partyB_address) },
  { type: "kv", label: "Điện thoại", value: fallback(v.partyB_phone) },
];

/* ------------------------------------------------------------------ *
 * Shared party fields
 * ------------------------------------------------------------------ */

const GROUP_A = "Bên A — Babyface";
const GROUP_B = "Bên B — Talent";

const partyAFields: ContractField[] = [
  { key: "partyA_name", label: "Tên đơn vị", type: "text", group: GROUP_A, span: "full", defaultValue: "CÔNG TY TNHH BABYFACE", required: true },
  { key: "partyA_rep", label: "Người đại diện", type: "text", group: GROUP_A, defaultValue: "" },
  { key: "partyA_role", label: "Chức vụ", type: "text", group: GROUP_A, defaultValue: "Giám đốc" },
  { key: "partyA_address", label: "Địa chỉ", type: "text", group: GROUP_A, span: "full" },
  { key: "partyA_tax", label: "Mã số thuế", type: "text", group: GROUP_A },
  { key: "partyA_phone", label: "Điện thoại", type: "text", group: GROUP_A },
];

const partyBFields: ContractField[] = [
  { key: "partyB_name", label: "Họ và tên", type: "text", group: GROUP_B, required: true },
  { key: "partyB_stage", label: "Nghệ danh", type: "text", group: GROUP_B },
  { key: "partyB_dob", label: "Ngày sinh", type: "date", group: GROUP_B },
  { key: "partyB_phone", label: "Điện thoại", type: "text", group: GROUP_B },
  { key: "partyB_id", label: "Số CCCD/CMND", type: "text", group: GROUP_B },
  { key: "partyB_id_date", label: "Ngày cấp", type: "date", group: GROUP_B },
  { key: "partyB_id_place", label: "Nơi cấp", type: "text", group: GROUP_B, span: "full" },
  { key: "partyB_address", label: "Địa chỉ thường trú", type: "text", group: GROUP_B, span: "full" },
];

const signatures: ContractBlock = { type: "signatures", left: "ĐẠI DIỆN BÊN A", right: "BÊN B" };

/* ================================================================== *
 * 1 · HỢP ĐỒNG HỢP TÁC / DỊCH VỤ
 * ================================================================== */

const contractCollab: ContractTemplate = {
  id: "collab",
  title: "Hợp đồng hợp tác",
  short: "Hợp đồng",
  description: "Hợp đồng dịch vụ / hợp tác giữa Babyface và talent cho một dự án, chiến dịch hoặc gói công việc.",
  color: "#D7F205",
  groups: ["Thông tin hợp đồng", GROUP_A, GROUP_B, "Nội dung công việc", "Thanh toán"],
  fields: [
    { key: "contract_no", label: "Số hợp đồng", type: "text", group: "Thông tin hợp đồng", placeholder: "01/2026/HĐHT-BBF" },
    { key: "location", label: "Nơi ký", type: "text", group: "Thông tin hợp đồng", defaultValue: "TP. Hồ Chí Minh" },
    { key: "sign_date", label: "Ngày ký", type: "date", group: "Thông tin hợp đồng", required: true },
    ...partyAFields,
    ...partyBFields,
    { key: "project", label: "Tên dự án / công việc", type: "text", group: "Nội dung công việc", span: "full", required: true, placeholder: "Chiến dịch quảng bá BST Xuân 2026" },
    { key: "scope", label: "Mô tả công việc", type: "textarea", group: "Nội dung công việc", span: "full", hint: "Mỗi dòng là một đầu việc.", placeholder: "Quay 03 video TVC\nChụp 20 ảnh look book\nĐăng 05 bài trên trang cá nhân" },
    { key: "start_date", label: "Bắt đầu", type: "date", group: "Nội dung công việc" },
    { key: "end_date", label: "Kết thúc", type: "date", group: "Nội dung công việc" },
    { key: "value", label: "Giá trị hợp đồng (VNĐ)", type: "number", group: "Thanh toán", placeholder: "50000000" },
    { key: "payment", label: "Điều khoản thanh toán", type: "textarea", group: "Thanh toán", span: "full", hint: "Mỗi dòng là một đợt.", placeholder: "Đợt 1: 50% sau khi ký hợp đồng\nĐợt 2: 50% sau khi nghiệm thu" },
  ],
  build: (v) => {
    const scopeLines = (v.scope || "").split("\n").map((s) => s.trim()).filter(Boolean);
    const payLines = (v.payment || "").split("\n").map((s) => s.trim()).filter(Boolean);
    const blocks: ContractBlock[] = [
      ...nationalHeader(),
      { type: "center", text: "HỢP ĐỒNG HỢP TÁC", strong: true, size: "lg" },
      { type: "center", text: `Số: ${fallback(v.contract_no, "……/……/HĐHT-BBF")}`, size: "sm" },
      { type: "spacer" },
      {
        type: "para",
        text: `Hôm nay, ${formatVnDate(v.sign_date)}, tại ${fallback(v.location, "…………")}, chúng tôi gồm:`,
      },
      { type: "spacer" },
      ...partyABlock(v),
      { type: "spacer" },
      ...partyBBlock(v),
      { type: "spacer" },
      { type: "para", text: "Hai bên cùng thống nhất ký kết hợp đồng với các điều khoản sau:" },
      { type: "heading", text: `ĐIỀU 1. NỘI DUNG CÔNG VIỆC` },
      { type: "para", text: `Bên B thực hiện cho Bên A dự án: ${fallback(v.project, "…………………………")}.`, indent: true },
    ];
    if (scopeLines.length) {
      blocks.push({ type: "para", text: "Phạm vi công việc bao gồm:", indent: true });
      blocks.push({ type: "list", items: scopeLines, ordered: true });
    }
    blocks.push({
      type: "para",
      indent: true,
      text: `Thời gian thực hiện: từ ${v.start_date ? formatVnDate(v.start_date) : "……"} đến ${v.end_date ? formatVnDate(v.end_date) : "……"}.`,
    });
    blocks.push({ type: "heading", text: "ĐIỀU 2. GIÁ TRỊ HỢP ĐỒNG & THANH TOÁN" });
    blocks.push({
      type: "para",
      indent: true,
      text: `Tổng giá trị hợp đồng: ${formatVnMoney(v.value)} (đã bao gồm thuế TNCN theo quy định).`,
    });
    if (payLines.length) {
      blocks.push({ type: "para", text: "Phương thức thanh toán:", indent: true });
      blocks.push({ type: "list", items: payLines, ordered: true });
    }
    blocks.push({ type: "heading", text: "ĐIỀU 3. QUYỀN & NGHĨA VỤ CỦA BÊN A" });
    blocks.push({
      type: "list",
      items: [
        "Cung cấp brief, concept và các điều kiện cần thiết để Bên B thực hiện công việc.",
        "Thanh toán đầy đủ, đúng hạn theo Điều 2.",
        "Được toàn quyền sở hữu, sử dụng, khai thác các sản phẩm hình ảnh/video do Bên B thực hiện trong phạm vi dự án.",
      ],
    });
    blocks.push({ type: "heading", text: "ĐIỀU 4. QUYỀN & NGHĨA VỤ CỦA BÊN B" });
    blocks.push({
      type: "list",
      items: [
        "Thực hiện công việc đúng nội dung, tiến độ và chất lượng đã thống nhất.",
        "Đảm bảo hình ảnh, tác phong chuyên nghiệp; giữ gìn uy tín cho Bên A và nhãn hàng.",
        "Không tiết lộ thông tin bảo mật; không hợp tác với đối thủ cạnh tranh trực tiếp trong thời gian hợp đồng nếu không có sự đồng ý của Bên A.",
      ],
    });
    blocks.push({ type: "heading", text: "ĐIỀU 5. ĐIỀU KHOẢN CHUNG" });
    blocks.push({
      type: "list",
      items: [
        "Hai bên cam kết thực hiện đúng các điều khoản đã ký. Mọi thay đổi phải được lập thành phụ lục và có chữ ký của hai bên.",
        "Tranh chấp phát sinh được giải quyết trên tinh thần thương lượng; nếu không thành sẽ đưa ra Tòa án có thẩm quyền.",
        "Hợp đồng có hiệu lực kể từ ngày ký, được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản.",
      ],
    });
    blocks.push({ type: "spacer" });
    blocks.push(signatures);
    return blocks;
  },
};

/* ================================================================== *
 * 2 · TALENT RELEASE (Giấy đồng ý sử dụng hình ảnh)
 * ================================================================== */

const talentRelease: ContractTemplate = {
  id: "release",
  title: "Talent Release",
  short: "Release",
  description: "Giấy đồng ý cho phép Babyface sử dụng, khai thác hình ảnh, tiếng nói và phần trình diễn của talent.",
  color: "#7C9EFF",
  groups: ["Thông tin", GROUP_A, GROUP_B, "Phạm vi cho phép"],
  fields: [
    { key: "location", label: "Nơi ký", type: "text", group: "Thông tin", defaultValue: "TP. Hồ Chí Minh" },
    { key: "sign_date", label: "Ngày ký", type: "date", group: "Thông tin", required: true },
    ...partyAFields.filter((f) => ["partyA_name", "partyA_rep", "partyA_role", "partyA_address"].includes(f.key)),
    ...partyBFields,
    { key: "project", label: "Dự án / buổi ghi hình", type: "text", group: "Phạm vi cho phép", span: "full", required: true, placeholder: "Photoshoot BST Hè 2026" },
    { key: "usage", label: "Mục đích sử dụng", type: "textarea", group: "Phạm vi cho phép", span: "full", hint: "Mỗi dòng là một mục đích.", placeholder: "Quảng cáo trên mạng xã hội (Facebook, TikTok, Instagram)\nẤn phẩm in ấn, POSM tại điểm bán\nWebsite và sàn thương mại điện tử" },
    { key: "territory", label: "Phạm vi lãnh thổ", type: "text", group: "Phạm vi cho phép", defaultValue: "Toàn cầu" },
    { key: "duration", label: "Thời hạn sử dụng", type: "text", group: "Phạm vi cho phép", defaultValue: "Vĩnh viễn" },
    { key: "compensation", label: "Thù lao (VNĐ)", type: "number", group: "Phạm vi cho phép", placeholder: "0", hint: "Để trống nếu đã bao gồm trong hợp đồng chính." },
  ],
  build: (v) => {
    const usageLines = (v.usage || "").split("\n").map((s) => s.trim()).filter(Boolean);
    const blocks: ContractBlock[] = [
      ...nationalHeader(),
      { type: "center", text: "GIẤY ĐỒNG Ý SỬ DỤNG HÌNH ẢNH", strong: true, size: "lg" },
      { type: "center", text: "(TALENT RELEASE)", italic: true, size: "sm" },
      { type: "spacer" },
      { type: "para", text: `Hôm nay, ${formatVnDate(v.sign_date)}, tại ${fallback(v.location, "……")}, tôi ký tên dưới đây:` },
      { type: "spacer" },
      ...partyBBlock(v),
      { type: "spacer" },
      { type: "para", text: "Đồng ý cho phép:" },
      { type: "kv", label: "Đơn vị", value: fallback(v.partyA_name) },
      { type: "kv", label: "Đại diện", value: `${fallback(v.partyA_rep, "……")}${v.partyA_role ? " — " + v.partyA_role : ""}` },
      { type: "kv", label: "Địa chỉ", value: fallback(v.partyA_address) },
      { type: "para", text: "(sau đây gọi là “Bên sử dụng”) được toàn quyền ghi hình, thu âm và sử dụng hình ảnh của tôi với nội dung sau:" },
      { type: "heading", text: "1. ĐỐI TƯỢNG" },
      {
        type: "para",
        indent: true,
        text: `Toàn bộ hình ảnh, chân dung, tiếng nói và phần trình diễn của tôi được ghi lại trong khuôn khổ: ${fallback(v.project, "…………………")}.`,
      },
      { type: "heading", text: "2. PHẠM VI SỬ DỤNG" },
    ];
    if (usageLines.length) {
      blocks.push({ type: "para", text: "Bên sử dụng được phép dùng cho các mục đích:", indent: true });
      blocks.push({ type: "list", items: usageLines, ordered: false });
    } else {
      blocks.push({ type: "para", indent: true, text: "Quảng cáo, truyền thông, thương mại trên mọi nền tảng của Bên sử dụng." });
    }
    blocks.push({ type: "kv", label: "Phạm vi lãnh thổ", value: fallback(v.territory, "Toàn cầu") });
    blocks.push({ type: "kv", label: "Thời hạn", value: fallback(v.duration, "Vĩnh viễn") });
    blocks.push({
      type: "kv",
      label: "Thù lao",
      value: !v.compensation || Number(v.compensation) === 0 ? "Đã bao gồm trong hợp đồng hợp tác" : formatVnMoney(v.compensation),
    });
    blocks.push({ type: "heading", text: "3. CAM KẾT" });
    blocks.push({
      type: "list",
      items: [
        "Tôi xác nhận đã đủ năng lực hành vi dân sự và tự nguyện ký giấy này.",
        "Tôi không yêu cầu thêm bất kỳ khoản chi phí nào ngoài thù lao đã nêu cho các mục đích sử dụng nói trên.",
        "Tôi từ bỏ quyền kiểm duyệt trước đối với sản phẩm cuối cùng, miễn là việc sử dụng không bôi nhọ danh dự, nhân phẩm của tôi.",
      ],
    });
    blocks.push({ type: "spacer" });
    blocks.push({ type: "signatures", left: "BÊN SỬ DỤNG", right: "NGƯỜI ĐỒNG Ý (Talent)" });
    return blocks;
  },
};

/* ================================================================== *
 * 3 · GIA HẠN HỢP ĐỒNG (Phụ lục)
 * ================================================================== */

const extension: ContractTemplate = {
  id: "extension",
  title: "Gia hạn hợp đồng",
  short: "Gia hạn",
  description: "Phụ lục gia hạn thời hạn của một hợp đồng đã ký giữa Babyface và talent.",
  color: "#FFB86B",
  groups: ["Phụ lục", GROUP_A, GROUP_B, "Nội dung gia hạn"],
  fields: [
    { key: "annex_no", label: "Số phụ lục", type: "text", group: "Phụ lục", placeholder: "01/PLGH" },
    { key: "location", label: "Nơi ký", type: "text", group: "Phụ lục", defaultValue: "TP. Hồ Chí Minh" },
    { key: "sign_date", label: "Ngày ký phụ lục", type: "date", group: "Phụ lục", required: true },
    { key: "orig_no", label: "Thuộc hợp đồng số", type: "text", group: "Phụ lục", required: true, placeholder: "01/2025/HĐHT-BBF" },
    { key: "orig_date", label: "Ngày ký HĐ gốc", type: "date", group: "Phụ lục" },
    ...partyAFields.filter((f) => ["partyA_name", "partyA_rep", "partyA_role"].includes(f.key)),
    ...partyBFields.filter((f) => ["partyB_name", "partyB_stage", "partyB_id", "partyB_phone"].includes(f.key)),
    { key: "old_end", label: "Ngày hết hạn cũ", type: "date", group: "Nội dung gia hạn", required: true },
    { key: "new_end", label: "Gia hạn đến ngày", type: "date", group: "Nội dung gia hạn", required: true },
    { key: "reason", label: "Lý do gia hạn", type: "text", group: "Nội dung gia hạn", span: "full", placeholder: "Tiếp tục hợp tác cho các chiến dịch năm 2026" },
    { key: "changes", label: "Điều chỉnh khác (nếu có)", type: "textarea", group: "Nội dung gia hạn", span: "full", hint: "Mỗi dòng là một thay đổi. Để trống nếu giữ nguyên.", placeholder: "Điều chỉnh thù lao lên 60.000.000đ/chiến dịch" },
  ],
  build: (v) => {
    const changeLines = (v.changes || "").split("\n").map((s) => s.trim()).filter(Boolean);
    const blocks: ContractBlock[] = [
      ...nationalHeader(),
      { type: "center", text: "PHỤ LỤC GIA HẠN HỢP ĐỒNG", strong: true, size: "lg" },
      { type: "center", text: `Số: ${fallback(v.annex_no, "……/PLGH")}`, size: "sm" },
      { type: "spacer" },
      {
        type: "para",
        text: `Căn cứ Hợp đồng số ${fallback(v.orig_no, "……………")} ký ${v.orig_date ? formatVnDate(v.orig_date) : "ngày …/…/……"} giữa hai bên;`,
      },
      {
        type: "para",
        text: `Hôm nay, ${formatVnDate(v.sign_date)}, tại ${fallback(v.location, "……")}, hai bên gồm:`,
      },
      { type: "spacer" },
      { type: "kv", label: "BÊN A", value: `${fallback(v.partyA_name)} — đại diện ${fallback(v.partyA_rep, "……")}${v.partyA_role ? " (" + v.partyA_role + ")" : ""}` },
      { type: "kv", label: "BÊN B", value: `${fallback(v.partyB_name)}${v.partyB_stage ? " (" + v.partyB_stage + ")" : ""} — CCCD ${fallback(v.partyB_id, "……")}` },
      { type: "spacer" },
      { type: "para", text: "Thống nhất ký phụ lục gia hạn với nội dung:" },
      { type: "heading", text: "ĐIỀU 1. GIA HẠN THỜI HẠN" },
      {
        type: "para",
        indent: true,
        text: `Gia hạn thời hạn hợp đồng: từ ${v.old_end ? formatVnDate(v.old_end) : "……"} đến hết ${v.new_end ? formatVnDate(v.new_end) : "……"}.`,
      },
    ];
    if (v.reason) blocks.push({ type: "para", indent: true, text: `Lý do: ${v.reason}.` });
    if (changeLines.length) {
      blocks.push({ type: "heading", text: "ĐIỀU 2. ĐIỀU CHỈNH KHÁC" });
      blocks.push({ type: "list", items: changeLines, ordered: true });
    }
    blocks.push({ type: "heading", text: `ĐIỀU ${changeLines.length ? "3" : "2"}. ĐIỀU KHOẢN THI HÀNH` });
    blocks.push({
      type: "list",
      items: [
        "Các điều khoản khác của Hợp đồng gốc không đề cập trong phụ lục này vẫn giữ nguyên giá trị.",
        "Phụ lục này là bộ phận không tách rời của Hợp đồng gốc và có hiệu lực kể từ ngày ký.",
        "Phụ lục được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản.",
      ],
    });
    blocks.push({ type: "spacer" });
    blocks.push(signatures);
    return blocks;
  },
};

/* ================================================================== *
 * 4 · BIÊN BẢN NGHIỆM THU (BBNT)
 * ================================================================== */

const acceptance: ContractTemplate = {
  id: "bbnt",
  title: "Biên bản nghiệm thu",
  short: "BBNT",
  description: "Biên bản nghiệm thu & bàn giao sản phẩm giữa Babyface và talent sau khi hoàn thành công việc.",
  color: "#5CD6A6",
  groups: ["Biên bản", GROUP_A, GROUP_B, "Nghiệm thu"],
  fields: [
    { key: "bbnt_no", label: "Số biên bản", type: "text", group: "Biên bản", placeholder: "01/BBNT-BBF" },
    { key: "location", label: "Nơi lập", type: "text", group: "Biên bản", defaultValue: "TP. Hồ Chí Minh" },
    { key: "sign_date", label: "Ngày lập", type: "date", group: "Biên bản", required: true },
    { key: "contract_ref", label: "Thuộc hợp đồng số", type: "text", group: "Biên bản", required: true, placeholder: "01/2026/HĐHT-BBF" },
    { key: "project", label: "Dự án", type: "text", group: "Biên bản", span: "full", placeholder: "Chiến dịch quảng bá BST Xuân 2026" },
    ...partyAFields.filter((f) => ["partyA_name", "partyA_rep", "partyA_role"].includes(f.key)),
    ...partyBFields.filter((f) => ["partyB_name", "partyB_stage", "partyB_phone"].includes(f.key)),
    { key: "deliverables", label: "Hạng mục bàn giao", type: "textarea", group: "Nghiệm thu", span: "full", required: true, hint: "Mỗi dòng là một hạng mục.", placeholder: "03 video TVC (định dạng MP4, 4K)\n20 ảnh look book đã retouch\n05 bài đăng trên trang cá nhân" },
    { key: "quality", label: "Đánh giá chất lượng", type: "textarea", group: "Nghiệm thu", span: "full", placeholder: "Sản phẩm đạt yêu cầu về nội dung, chất lượng hình ảnh và tiến độ." },
    { key: "result", label: "Kết luận", type: "text", group: "Nghiệm thu", defaultValue: "ĐẠT — đồng ý nghiệm thu và thanh toán", hint: "VD: ĐẠT / CHƯA ĐẠT — cần chỉnh sửa" },
    { key: "remaining", label: "Số tiền còn thanh toán (VNĐ)", type: "number", group: "Nghiệm thu", placeholder: "25000000" },
  ],
  build: (v) => {
    const items = (v.deliverables || "").split("\n").map((s) => s.trim()).filter(Boolean);
    const blocks: ContractBlock[] = [
      ...nationalHeader(),
      { type: "center", text: "BIÊN BẢN NGHIỆM THU & BÀN GIAO", strong: true, size: "lg" },
      { type: "center", text: `Số: ${fallback(v.bbnt_no, "……/BBNT-BBF")}`, size: "sm" },
      { type: "spacer" },
      {
        type: "para",
        text: `Căn cứ Hợp đồng số ${fallback(v.contract_ref, "……………")}${v.project ? ` — dự án “${v.project}”` : ""};`,
      },
      {
        type: "para",
        text: `Hôm nay, ${formatVnDate(v.sign_date)}, tại ${fallback(v.location, "……")}, hai bên tiến hành nghiệm thu, gồm:`,
      },
      { type: "spacer" },
      { type: "kv", label: "BÊN A (nghiệm thu)", value: `${fallback(v.partyA_name)} — đại diện ${fallback(v.partyA_rep, "……")}${v.partyA_role ? " (" + v.partyA_role + ")" : ""}` },
      { type: "kv", label: "BÊN B (bàn giao)", value: `${fallback(v.partyB_name)}${v.partyB_stage ? " (" + v.partyB_stage + ")" : ""}` },
      { type: "spacer" },
      { type: "heading", text: "1. HẠNG MỤC BÀN GIAO" },
    ];
    if (items.length) blocks.push({ type: "list", items, ordered: true });
    else blocks.push({ type: "para", indent: true, text: "…………………………………………………………………" });
    blocks.push({ type: "heading", text: "2. KẾT QUẢ NGHIỆM THU" });
    blocks.push({ type: "para", indent: true, text: fallback(v.quality, "Sản phẩm đạt yêu cầu về nội dung, chất lượng và tiến độ.") });
    blocks.push({ type: "para", indent: true, strong: true, text: `Kết luận: ${fallback(v.result, "ĐẠT — đồng ý nghiệm thu")}.` });
    blocks.push({ type: "heading", text: "3. THANH TOÁN" });
    blocks.push({
      type: "para",
      indent: true,
      text:
        !v.remaining || Number(v.remaining) === 0
          ? "Bên A hoàn tất thanh toán theo điều khoản của hợp đồng."
          : `Bên A thanh toán cho Bên B số tiền còn lại: ${formatVnMoney(v.remaining)}.`,
    });
    blocks.push({
      type: "para",
      text: "Biên bản được lập thành 02 bản có giá trị như nhau, mỗi bên giữ 01 bản. Hai bên đã đọc, hiểu và đồng ý ký tên.",
    });
    blocks.push({ type: "spacer" });
    blocks.push({ type: "signatures", left: "ĐẠI DIỆN BÊN A", right: "ĐẠI DIỆN BÊN B" });
    return blocks;
  },
};

/* ================================================================== *
 * 5 · HỢP ĐỒNG ĐẠI SỨ THƯƠNG HIỆU (Độc quyền)
 * ================================================================== */

const ambassador: ContractTemplate = {
  id: "ambassador",
  title: "Đại sứ độc quyền",
  short: "Đại sứ",
  description: "Hợp đồng đại sứ thương hiệu độc quyền — talent cam kết không hợp tác với đối thủ trong ngành hàng.",
  color: "#F58BD6",
  groups: ["Thông tin hợp đồng", GROUP_A, GROUP_B, "Phạm vi độc quyền", "Quyền lợi"],
  fields: [
    { key: "contract_no", label: "Số hợp đồng", type: "text", group: "Thông tin hợp đồng", placeholder: "01/2026/HĐĐSTH-BBF" },
    { key: "location", label: "Nơi ký", type: "text", group: "Thông tin hợp đồng", defaultValue: "TP. Hồ Chí Minh" },
    { key: "sign_date", label: "Ngày ký", type: "date", group: "Thông tin hợp đồng", required: true },
    ...partyAFields,
    ...partyBFields,
    { key: "brand", label: "Nhãn hàng đại diện", type: "text", group: "Phạm vi độc quyền", span: "full", required: true, defaultValue: "Babyface" },
    { key: "category", label: "Ngành hàng độc quyền", type: "text", group: "Phạm vi độc quyền", span: "full", placeholder: "Mỹ phẩm, chăm sóc da", required: true },
    { key: "start_date", label: "Bắt đầu", type: "date", group: "Phạm vi độc quyền" },
    { key: "end_date", label: "Kết thúc", type: "date", group: "Phạm vi độc quyền" },
    { key: "excluded", label: "Đối thủ loại trừ", type: "textarea", group: "Phạm vi độc quyền", span: "full", hint: "Mỗi dòng một thương hiệu/đối thủ mà Bên B không được hợp tác.", placeholder: "Các thương hiệu mỹ phẩm cạnh tranh trực tiếp\nNhãn hàng cùng phân khúc chăm sóc da" },
    { key: "fee", label: "Thù lao trọn gói (VNĐ)", type: "number", group: "Quyền lợi", placeholder: "300000000" },
    { key: "benefits", label: "Quyền lợi khác", type: "textarea", group: "Quyền lợi", span: "full", hint: "Mỗi dòng một quyền lợi.", placeholder: "Sản phẩm sử dụng miễn phí trong suốt hợp đồng\n% hoa hồng trên doanh thu mã giới thiệu\nƯu tiên tham gia sự kiện của nhãn hàng" },
    { key: "posts", label: "Cam kết truyền thông", type: "textarea", group: "Quyền lợi", span: "full", hint: "Định lượng nội dung Bên B phải đăng.", placeholder: "Tối thiểu 04 bài/tháng trên trang cá nhân\n02 video/tháng trên TikTok" },
  ],
  build: (v) => {
    const excluded = (v.excluded || "").split("\n").map((s) => s.trim()).filter(Boolean);
    const benefits = (v.benefits || "").split("\n").map((s) => s.trim()).filter(Boolean);
    const posts = (v.posts || "").split("\n").map((s) => s.trim()).filter(Boolean);
    const blocks: ContractBlock[] = [
      ...nationalHeader(),
      { type: "center", text: "HỢP ĐỒNG ĐẠI SỨ THƯƠNG HIỆU", strong: true, size: "lg" },
      { type: "center", text: "(ĐỘC QUYỀN)", italic: true, size: "sm" },
      { type: "center", text: `Số: ${fallback(v.contract_no, "……/HĐĐSTH-BBF")}`, size: "sm" },
      { type: "spacer" },
      { type: "para", text: `Hôm nay, ${formatVnDate(v.sign_date)}, tại ${fallback(v.location, "……")}, chúng tôi gồm:` },
      { type: "spacer" },
      ...partyABlock(v),
      { type: "spacer" },
      ...partyBBlock(v),
      { type: "spacer" },
      { type: "para", text: "Hai bên thống nhất ký kết hợp đồng đại sứ thương hiệu với các điều khoản sau:" },
      { type: "heading", text: "ĐIỀU 1. CHỈ ĐỊNH ĐẠI SỨ" },
      {
        type: "para",
        indent: true,
        text: `Bên A chỉ định Bên B làm Đại sứ thương hiệu độc quyền cho nhãn hàng ${fallback(v.brand, "……")}, ngành hàng ${fallback(v.category, "……")}.`,
      },
      {
        type: "para",
        indent: true,
        text: `Thời hạn: từ ${v.start_date ? formatVnDate(v.start_date) : "……"} đến ${v.end_date ? formatVnDate(v.end_date) : "……"}.`,
      },
      { type: "heading", text: "ĐIỀU 2. CAM KẾT ĐỘC QUYỀN" },
      {
        type: "para",
        indent: true,
        text: `Trong thời hạn hợp đồng, Bên B KHÔNG được quảng cáo, đại diện hay hợp tác với bất kỳ thương hiệu nào cạnh tranh trong ngành hàng ${fallback(v.category, "……")} nếu chưa có văn bản đồng ý của Bên A.`,
      },
    ];
    if (excluded.length) {
      blocks.push({ type: "para", indent: true, text: "Cụ thể loại trừ các đối tượng:" });
      blocks.push({ type: "list", items: excluded, ordered: false });
    }
    blocks.push({ type: "heading", text: "ĐIỀU 3. CAM KẾT TRUYỀN THÔNG CỦA BÊN B" });
    if (posts.length) blocks.push({ type: "list", items: posts, ordered: true });
    else blocks.push({ type: "para", indent: true, text: "Theo kế hoạch truyền thông do hai bên thống nhất từng thời kỳ." });
    blocks.push({ type: "heading", text: "ĐIỀU 4. QUYỀN LỢI CỦA BÊN B" });
    blocks.push({
      type: "para",
      indent: true,
      text: `Thù lao trọn gói: ${formatVnMoney(v.fee)} cho toàn bộ thời hạn hợp đồng (đã bao gồm thuế TNCN).`,
    });
    if (benefits.length) {
      blocks.push({ type: "para", indent: true, text: "Quyền lợi kèm theo:" });
      blocks.push({ type: "list", items: benefits, ordered: false });
    }
    blocks.push({ type: "heading", text: "ĐIỀU 5. VI PHẠM & ĐIỀU KHOẢN CHUNG" });
    blocks.push({
      type: "list",
      items: [
        "Vi phạm cam kết độc quyền, Bên B phải hoàn trả toàn bộ thù lao đã nhận và bồi thường theo thỏa thuận của hai bên.",
        "Bên A được toàn quyền sử dụng hình ảnh, sản phẩm truyền thông của Bên B trong phạm vi hợp đồng.",
        "Hợp đồng có hiệu lực từ ngày ký, lập thành 02 bản có giá trị như nhau, mỗi bên giữ 01 bản.",
      ],
    });
    blocks.push({ type: "spacer" });
    blocks.push(signatures);
    return blocks;
  },
};

/* ================================================================== *
 * 6 · THANH LÝ HỢP ĐỒNG
 * ================================================================== */

const liquidation: ContractTemplate = {
  id: "liquidation",
  title: "Thanh lý hợp đồng",
  short: "Thanh lý",
  description: "Biên bản thanh lý — xác nhận hai bên đã hoàn thành nghĩa vụ và chấm dứt hợp đồng.",
  color: "#FF8B8B",
  groups: ["Biên bản", GROUP_A, GROUP_B, "Nội dung thanh lý"],
  fields: [
    { key: "liq_no", label: "Số biên bản", type: "text", group: "Biên bản", placeholder: "01/BBTL-BBF" },
    { key: "location", label: "Nơi lập", type: "text", group: "Biên bản", defaultValue: "TP. Hồ Chí Minh" },
    { key: "sign_date", label: "Ngày lập", type: "date", group: "Biên bản", required: true },
    { key: "contract_ref", label: "Thanh lý hợp đồng số", type: "text", group: "Biên bản", required: true, placeholder: "01/2025/HĐHT-BBF" },
    { key: "contract_date", label: "Ký ngày", type: "date", group: "Biên bản" },
    ...partyAFields.filter((f) => ["partyA_name", "partyA_rep", "partyA_role"].includes(f.key)),
    ...partyBFields.filter((f) => ["partyB_name", "partyB_stage", "partyB_id", "partyB_phone"].includes(f.key)),
    { key: "result", label: "Tình trạng thực hiện", type: "textarea", group: "Nội dung thanh lý", span: "full", placeholder: "Hai bên đã hoàn thành đầy đủ các nghĩa vụ theo hợp đồng." },
    { key: "settle", label: "Công nợ còn lại (VNĐ)", type: "number", group: "Nội dung thanh lý", placeholder: "0", hint: "Để 0 nếu đã tất toán." },
    { key: "settle_side", label: "Bên thanh toán", type: "text", group: "Nội dung thanh lý", placeholder: "Bên A thanh toán cho Bên B", hint: "Bỏ trống nếu không còn công nợ." },
    { key: "note", label: "Ghi chú thêm", type: "text", group: "Nội dung thanh lý", span: "full", placeholder: "Hai bên không còn khiếu nại gì về sau." },
  ],
  build: (v) => {
    const blocks: ContractBlock[] = [
      ...nationalHeader(),
      { type: "center", text: "BIÊN BẢN THANH LÝ HỢP ĐỒNG", strong: true, size: "lg" },
      { type: "center", text: `Số: ${fallback(v.liq_no, "……/BBTL-BBF")}`, size: "sm" },
      { type: "spacer" },
      {
        type: "para",
        text: `Căn cứ Hợp đồng số ${fallback(v.contract_ref, "……………")} ký ${v.contract_date ? formatVnDate(v.contract_date) : "ngày …/…/……"};`,
      },
      { type: "para", text: `Hôm nay, ${formatVnDate(v.sign_date)}, tại ${fallback(v.location, "……")}, hai bên gồm:` },
      { type: "spacer" },
      { type: "kv", label: "BÊN A", value: `${fallback(v.partyA_name)} — đại diện ${fallback(v.partyA_rep, "……")}${v.partyA_role ? " (" + v.partyA_role + ")" : ""}` },
      { type: "kv", label: "BÊN B", value: `${fallback(v.partyB_name)}${v.partyB_stage ? " (" + v.partyB_stage + ")" : ""} — CCCD ${fallback(v.partyB_id, "……")}` },
      { type: "spacer" },
      { type: "para", text: "Cùng nhau thống nhất thanh lý hợp đồng với nội dung:" },
      { type: "heading", text: "ĐIỀU 1. TÌNH TRẠNG THỰC HIỆN" },
      { type: "para", indent: true, text: fallback(v.result, "Hai bên đã hoàn thành đầy đủ các nghĩa vụ theo hợp đồng.") },
      { type: "heading", text: "ĐIỀU 2. CÔNG NỢ & TẤT TOÁN" },
      {
        type: "para",
        indent: true,
        text:
          !v.settle || Number(v.settle) === 0
            ? "Hai bên xác nhận đã tất toán toàn bộ, không còn công nợ."
            : `${fallback(v.settle_side, "Bên có nghĩa vụ")} thanh toán số tiền còn lại: ${formatVnMoney(v.settle)}.`,
      },
      { type: "heading", text: "ĐIỀU 3. CHẤM DỨT HỢP ĐỒNG" },
      {
        type: "list",
        items: [
          "Hợp đồng nêu trên được chấm dứt kể từ ngày ký biên bản này.",
          v.note ? v.note : "Hai bên không còn bất kỳ khiếu nại hay ràng buộc nào với nhau về sau.",
          "Biên bản lập thành 02 bản có giá trị như nhau, mỗi bên giữ 01 bản.",
        ],
      },
      { type: "spacer" },
      { type: "signatures", left: "ĐẠI DIỆN BÊN A", right: "ĐẠI DIỆN BÊN B" },
    ];
    return blocks;
  },
};

/* ================================================================== *
 * 7 · THỎA THUẬN BẢO MẬT (NDA)
 * ================================================================== */

const nda: ContractTemplate = {
  id: "nda",
  title: "Thỏa thuận bảo mật",
  short: "NDA",
  description: "NDA — ràng buộc bảo mật thông tin dự án, concept, dữ liệu giữa Babyface và talent/đối tác.",
  color: "#4FC3D6",
  groups: ["Thông tin", GROUP_A, GROUP_B, "Điều khoản bảo mật"],
  fields: [
    { key: "nda_no", label: "Số thỏa thuận", type: "text", group: "Thông tin", placeholder: "01/NDA-BBF" },
    { key: "location", label: "Nơi ký", type: "text", group: "Thông tin", defaultValue: "TP. Hồ Chí Minh" },
    { key: "sign_date", label: "Ngày ký", type: "date", group: "Thông tin", required: true },
    ...partyAFields.filter((f) => ["partyA_name", "partyA_rep", "partyA_role", "partyA_address"].includes(f.key)),
    ...partyBFields.filter((f) => ["partyB_name", "partyB_stage", "partyB_id", "partyB_phone"].includes(f.key)),
    { key: "scope_project", label: "Phạm vi dự án", type: "text", group: "Điều khoản bảo mật", span: "full", placeholder: "Chiến dịch ra mắt sản phẩm mới quý III/2026", required: true },
    { key: "confidential", label: "Thông tin bảo mật", type: "textarea", group: "Điều khoản bảo mật", span: "full", hint: "Mỗi dòng một loại thông tin.", placeholder: "Concept, kịch bản, kế hoạch truyền thông chưa công bố\nThông tin sản phẩm, giá, chiến lược kinh doanh\nDữ liệu khách hàng, đối tác" },
    { key: "duration", label: "Thời hạn bảo mật", type: "text", group: "Điều khoản bảo mật", defaultValue: "03 năm kể từ ngày ký" },
    { key: "penalty", label: "Mức phạt vi phạm (VNĐ)", type: "number", group: "Điều khoản bảo mật", placeholder: "100000000" },
  ],
  build: (v) => {
    const items = (v.confidential || "").split("\n").map((s) => s.trim()).filter(Boolean);
    const blocks: ContractBlock[] = [
      ...nationalHeader(),
      { type: "center", text: "THỎA THUẬN BẢO MẬT THÔNG TIN", strong: true, size: "lg" },
      { type: "center", text: "(NON-DISCLOSURE AGREEMENT)", italic: true, size: "sm" },
      { type: "center", text: `Số: ${fallback(v.nda_no, "……/NDA-BBF")}`, size: "sm" },
      { type: "spacer" },
      { type: "para", text: `Hôm nay, ${formatVnDate(v.sign_date)}, tại ${fallback(v.location, "……")}, hai bên gồm:` },
      { type: "spacer" },
      { type: "kv", label: "BÊN A (Bên tiết lộ)", value: `${fallback(v.partyA_name)} — đại diện ${fallback(v.partyA_rep, "……")}${v.partyA_role ? " (" + v.partyA_role + ")" : ""}` },
      { type: "kv", label: "BÊN B (Bên nhận)", value: `${fallback(v.partyB_name)}${v.partyB_stage ? " (" + v.partyB_stage + ")" : ""} — CCCD ${fallback(v.partyB_id, "……")}` },
      { type: "spacer" },
      { type: "para", text: `Thống nhất ký thỏa thuận bảo mật trong khuôn khổ: ${fallback(v.scope_project, "…………")}.` },
      { type: "heading", text: "ĐIỀU 1. THÔNG TIN BẢO MẬT" },
    ];
    if (items.length) {
      blocks.push({ type: "para", indent: true, text: "Bao gồm nhưng không giới hạn:" });
      blocks.push({ type: "list", items, ordered: false });
    } else {
      blocks.push({ type: "para", indent: true, text: "Mọi thông tin, tài liệu Bên A cung cấp và chưa được công bố ra công chúng." });
    }
    blocks.push({ type: "heading", text: "ĐIỀU 2. NGHĨA VỤ CỦA BÊN B" });
    blocks.push({
      type: "list",
      items: [
        "Giữ bí mật tuyệt đối, không tiết lộ cho bên thứ ba dưới bất kỳ hình thức nào.",
        "Chỉ sử dụng thông tin cho mục đích thực hiện công việc với Bên A.",
        "Hoàn trả hoặc tiêu hủy tài liệu mật khi kết thúc hợp tác nếu Bên A yêu cầu.",
      ],
    });
    blocks.push({ type: "heading", text: "ĐIỀU 3. THỜI HẠN" });
    blocks.push({ type: "para", indent: true, text: `Nghĩa vụ bảo mật có hiệu lực trong ${fallback(v.duration, "03 năm kể từ ngày ký")}, kể cả sau khi hợp đồng chính chấm dứt.` });
    blocks.push({ type: "heading", text: "ĐIỀU 4. VI PHẠM" });
    blocks.push({
      type: "para",
      indent: true,
      text:
        !v.penalty || Number(v.penalty) === 0
          ? "Bên vi phạm phải bồi thường toàn bộ thiệt hại thực tế phát sinh cho Bên A."
          : `Bên B vi phạm phải chịu phạt ${formatVnMoney(v.penalty)} và bồi thường toàn bộ thiệt hại thực tế cho Bên A.`,
    });
    blocks.push({ type: "para", text: "Thỏa thuận lập thành 02 bản có giá trị như nhau, mỗi bên giữ 01 bản, hiệu lực kể từ ngày ký." });
    blocks.push({ type: "spacer" });
    blocks.push({ type: "signatures", left: "ĐẠI DIỆN BÊN A", right: "BÊN B" });
    return blocks;
  },
};

/* ------------------------------------------------------------------ */

export const contractTemplates: ContractTemplate[] = [
  contractCollab,
  talentRelease,
  ambassador,
  extension,
  acceptance,
  liquidation,
  nda,
];

/** Initial value map for a template — pre-fills every field's default. */
export function initialValues(t: ContractTemplate): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of t.fields) out[f.key] = f.defaultValue ?? today();
  return out;
}

/** Render document blocks to plain text (for copy / download). */
export function blocksToText(blocks: ContractBlock[]): string {
  const lines: string[] = [];
  for (const b of blocks) {
    switch (b.type) {
      case "center":
      case "para":
      case "heading":
        lines.push(b.text);
        break;
      case "kv":
        lines.push(`${b.label}: ${b.value}`);
        break;
      case "list":
        b.items.forEach((it, i) => lines.push(`${b.ordered ? `${i + 1}.` : "-"} ${it}`));
        break;
      case "divider":
        lines.push("————————————————————");
        break;
      case "spacer":
        lines.push("");
        break;
      case "signatures":
        lines.push("");
        lines.push(`${b.left}                              ${b.right}`);
        lines.push("(Ký, ghi rõ họ tên)                    (Ký, ghi rõ họ tên)");
        break;
    }
  }
  return lines.join("\n");
}
