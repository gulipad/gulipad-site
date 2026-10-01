import { notFound } from "next/navigation";

import { getWriting, getWritings } from "@/lib/writings";
import { formatWritingDate } from "@/lib/writings-shared";

// Served at /writings/<slug>.md via the rewrite in next.config.ts.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getWritings().map(({ slug }) => ({ slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const writing = getWriting((await params).slug);
  if (!writing) notFound();
  const byline = [
    `By Guli Moreno${writing.coauthors ? ` & ${writing.coauthors}` : ""}`,
    formatWritingDate(writing.date),
    `${writing.readingMinutes} min read`,
    `Written in ${writing.language}`,
  ].join(" · ");
  const body = `# ${writing.title}\n\n> ${writing.description}\n\n${byline}\n\n${writing.body}`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
