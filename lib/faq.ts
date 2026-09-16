const FAQ_LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

/** Strip markdown-style links for JSON-LD and plain-text uses. */
export function stripFaqLinks(text: string): string {
  return text.replace(FAQ_LINK_RE, "$1");
}

export function parseFaqLinks(
  text: string
): Array<{ type: "text"; value: string } | { type: "link"; href: string; value: string }> {
  const parts: Array<
    { type: "text"; value: string } | { type: "link"; href: string; value: string }
  > = [];
  const re = new RegExp(FAQ_LINK_RE.source, "g");
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text))) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: "link", href: match[2], value: match[1] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }

  return parts;
}
