import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import type { WritingMeta } from "@/lib/writings-shared";

export type { WritingMeta };

const WRITINGS_DIR = join(process.cwd(), "content", "writings");
// Reading speed used by Medium's estimates.
const WORDS_PER_MINUTE = 265;

export interface Writing extends WritingMeta {
  body: string; // markdown, without frontmatter
}

// Frontmatter is a flat block of `key: value` lines between `---` fences.
function parse(slug: string, raw: string): Writing {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`Writing "${slug}" is missing frontmatter`);
  const fields: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) fields[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  for (const key of ["title", "description", "date", "language"]) {
    if (!fields[key]) throw new Error(`Writing "${slug}" is missing "${key}"`);
  }
  const body = match[2];
  return {
    slug,
    title: fields.title,
    description: fields.description,
    date: fields.date,
    language: fields.language,
    original: fields.original,
    originalLabel: fields.originalLabel,
    coauthors: fields.coauthors,
    readingMinutes: readingMinutes(body),
    body,
  };
}

function readingMinutes(markdown: string): number {
  const text = markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links → their text
    .replace(/[#>*_`~-]/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function getWriting(slug: string): Writing | undefined {
  try {
    return parse(slug, readFileSync(join(WRITINGS_DIR, `${slug}.md`), "utf8"));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw err;
  }
}

/** All writings, newest first, without their bodies. */
export function getWritings(): WritingMeta[] {
  return readdirSync(WRITINGS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { body, ...meta } = parse(slug, readFileSync(join(WRITINGS_DIR, f), "utf8"));
      return meta;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}
