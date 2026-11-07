import * as React from "react";
import { highlight } from "sugar-high";

import { CopyButton } from "./CopyButton";

type CodeBlockProps = {
  code: string;
  /** File name or short label shown in the header strip. */
  title?: string;
  /** Highlights every prop or statement whose first line contains one of these strings. */
  highlight?: string[];
  className?: string;
};

/** Lines to mark: each matched line plus the following lines until its brackets close. */
function markedLines(lines: string[], needles: string[]) {
  const marked = new Set<number>();
  const depthOf = (line: string) =>
    (line.match(/[{([]/g)?.length ?? 0) - (line.match(/[})\]]/g)?.length ?? 0);
  lines.forEach((line, start) => {
    if (!needles.some((needle) => line.includes(needle))) {
      return;
    }
    let depth = depthOf(line);
    marked.add(start);
    for (let i = start + 1; depth > 0 && i < lines.length; i++) {
      marked.add(i);
      depth += depthOf(lines[i]);
    }
  });
  return marked;
}

export function CodeBlock({ code, title = "App.tsx", highlight: marks, className = "" }: CodeBlockProps) {
  const trimmed = code.trim();
  const marksKey = marks?.join("\u0000") ?? "";
  const html = React.useMemo(() => {
    const highlighted = highlight(trimmed);
    if (!marksKey) {
      return highlighted;
    }
    const needles = marksKey.split("\u0000");
    const lines = trimmed.split("\n");
    const marked = markedLines(lines, needles);
    let index = 0;
    // sugar-high wraps each source line in one span.sh__line, in order.
    return highlighted.replace(/<span class="sh__line">/g, (tag) => {
      return marked.has(index++)
        ? '<span class="sh__line sh__line--mark">'
        : tag;
    });
  }, [trimmed, marksKey]);

  return (
    <figure
      className={`code-block overflow-hidden rounded-xl border border-border bg-muted/60 ${className}`}
    >
      <figcaption className="flex h-11 items-center justify-between border-b border-border pr-1.5 pl-4">
        <span className="font-mono text-xs text-muted-foreground">{title}</span>
        <CopyButton text={trimmed} />
      </figcaption>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-6">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </figure>
  );
}
