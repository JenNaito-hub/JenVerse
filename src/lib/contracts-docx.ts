import type { ContractBlock } from "@/types";

/**
 * Generate a Word (.docx) file from contract blocks and trigger a download.
 * `docx` is imported dynamically so it never lands in the initial page bundle.
 */
export async function downloadDocx(opts: {
  title: string;
  filename: string;
  blocks: ContractBlock[];
  logo?: string | null;
}) {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
    ImageRun,
  } = await import("docx");

  const FONT = "Times New Roman";
  const NONE = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } as const;

  const run = (text: string, o: { bold?: boolean; italic?: boolean; size?: number } = {}) =>
    new TextRun({ text, bold: o.bold, italics: o.italic, size: o.size ?? 26, font: FONT });

  const children: InstanceType<typeof Paragraph | typeof Table>[] = [];

  // Optional logo, centered at the very top.
  if (opts.logo) {
    const meta = await imageMeta(opts.logo);
    if (meta) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [
            new ImageRun({
              data: meta.bytes,
              type: meta.type,
              transformation: { width: meta.width, height: meta.height },
            } as never),
          ],
        })
      );
    }
  }

  for (const b of opts.blocks) {
    switch (b.type) {
      case "center":
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
              run(b.text, {
                bold: b.strong,
                italic: b.italic,
                size: b.size === "lg" ? 32 : b.size === "sm" ? 22 : 26,
              }),
            ],
          })
        );
        break;
      case "heading":
        children.push(
          new Paragraph({
            spacing: { before: 160, after: 60 },
            children: [run(b.text, { bold: true })],
          })
        );
        break;
      case "para":
        children.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 80 },
            indent: b.indent ? { left: 360 } : undefined,
            children: [run(b.text, { bold: b.strong })],
          })
        );
        break;
      case "kv":
        children.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 80 },
            children: [run(`${b.label}: `, { bold: true }), run(b.value)],
          })
        );
        break;
      case "list":
        b.items.forEach((it, i) => {
          children.push(
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 60 },
              indent: { left: 480, hanging: 240 },
              children: [run(`${b.ordered ? `${i + 1}.` : "•"}  ${it}`)],
            })
          );
        });
        break;
      case "divider":
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [run("————————————————", { size: 22 })],
          })
        );
        break;
      case "spacer":
        children.push(new Paragraph({ children: [run("")] }));
        break;
      case "signatures":
        children.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE },
            rows: [
              new TableRow({
                children: [b.left, b.right].map(
                  (label) =>
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      borders: { top: NONE, bottom: NONE, left: NONE, right: NONE },
                      children: [
                        new Paragraph({ alignment: AlignmentType.CENTER, children: [run(label, { bold: true })] }),
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [run("(Ký, ghi rõ họ tên)", { italic: true, size: 22 })],
                        }),
                        new Paragraph({ children: [run("")] }),
                        new Paragraph({ children: [run("")] }),
                        new Paragraph({ children: [run("")] }),
                      ],
                    })
                ),
              }),
            ],
          })
        );
        break;
    }
  }

  const doc = new Document({
    styles: { default: { document: { run: { font: FONT, size: 26 } } } },
    sections: [
      {
        properties: { page: { margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
        children: children as never,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = opts.filename.endsWith(".docx") ? opts.filename : `${opts.filename}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Decode a data-URL image to bytes + natural (scaled) dimensions. */
async function imageMeta(
  dataUrl: string
): Promise<{ bytes: Uint8Array; type: "png" | "jpg" | "gif" | "bmp"; width: number; height: number } | null> {
  try {
    const [meta, b64] = dataUrl.split(",");
    if (!b64) return null;
    const mime = /data:(.*?);/.exec(meta)?.[1] ?? "image/png";
    const type = mime.includes("png")
      ? "png"
      : mime.includes("gif")
        ? "gif"
        : mime.includes("bmp")
          ? "bmp"
          : "jpg";
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const dim = await new Promise<{ w: number; h: number }>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = reject;
      img.src = dataUrl;
    });
    const maxW = 130;
    const scale = dim.w > maxW ? maxW / dim.w : 1;
    return { bytes, type, width: Math.round(dim.w * scale) || 120, height: Math.round(dim.h * scale) || 120 };
  } catch {
    return null;
  }
}
