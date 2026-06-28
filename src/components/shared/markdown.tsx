import { Fragment, type ReactNode } from "react";

/**
 * Minimal, dependency-free Markdown renderer for chat responses.
 * Handles the common output of LLMs: headings, bold, italic, inline code,
 * unordered and ordered lists, and paragraphs. Not a full CommonMark parser —
 * just enough to make assistant replies read cleanly.
 */

function parseInline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*(.+?)\*\*|`(.+?)`|\*(.+?)\*)/;
  let remaining = text;
  let i = 0;

  let match = pattern.exec(remaining);
  while (match) {
    if (match.index > 0) nodes.push(remaining.slice(0, match.index));
    const key = `${keyBase}-${i}`;
    if (match[2] !== undefined) {
      nodes.push(<strong key={key}>{match[2]}</strong>);
    } else if (match[3] !== undefined) {
      nodes.push(
        <code
          key={key}
          className="rounded bg-foreground/10 px-1 py-0.5 font-mono text-[0.85em]"
        >
          {match[3]}
        </code>
      );
    } else if (match[4] !== undefined) {
      nodes.push(<em key={key}>{match[4]}</em>);
    }
    remaining = remaining.slice(match.index + match[0].length);
    i += 1;
    match = pattern.exec(remaining);
  }
  if (remaining) nodes.push(remaining);
  return nodes;
}

export function Markdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let key = 0;

  const flushList = () => {
    if (!list) return;
    const items = list.items.map((item, idx) => (
      <li key={idx} className="leading-relaxed">
        {parseInline(item, `li-${key}-${idx}`)}
      </li>
    ));
    blocks.push(
      list.ordered ? (
        <ol key={key++} className="my-2 list-decimal space-y-1 pl-5">
          {items}
        </ol>
      ) : (
        <ul key={key++} className="my-2 list-disc space-y-1 pl-5">
          {items}
        </ul>
      )
    );
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    const bullet = /^\s*[-*]\s+(.*)$/.exec(line);
    const ordered = /^\s*\d+\.\s+(.*)$/.exec(line);

    if (heading) {
      flushList();
      const level = heading[1].length;
      const text = parseInline(heading[2], `h-${key}`);
      blocks.push(
        level === 1 ? (
          <h3 key={key++} className="mt-3 text-base font-semibold">
            {text}
          </h3>
        ) : (
          <h4 key={key++} className="mt-2 text-sm font-semibold">
            {text}
          </h4>
        )
      );
    } else if (bullet) {
      if (!list || list.ordered) {
        flushList();
        list = { ordered: false, items: [] };
      }
      list.items.push(bullet[1]);
    } else if (ordered) {
      if (!list || !list.ordered) {
        flushList();
        list = { ordered: true, items: [] };
      }
      list.items.push(ordered[1]);
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      blocks.push(
        <p key={key++} className="leading-relaxed">
          {parseInline(line, `p-${key}`)}
        </p>
      );
    }
  }
  flushList();

  return <div className="space-y-1">{blocks.map((b, i) => (
    <Fragment key={i}>{b}</Fragment>
  ))}</div>;
}
