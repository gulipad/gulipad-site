import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Newsreader } from "next/font/google";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { getWriting, getWritings } from "@/lib/writings";
import { formatWritingDate, languageFlag } from "@/lib/writings-shared";

const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return getWritings().map(({ slug }) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const writing = getWriting((await params).slug);
  if (!writing) return {};
  return {
    title: `${writing.title} — Guli Moreno`,
    description: writing.description,
    alternates: { canonical: `/writings/${writing.slug}` },
    openGraph: {
      title: writing.title,
      description: writing.description,
      url: `/writings/${writing.slug}`,
      type: "article",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: writing.title,
      description: writing.description,
      images: ["/og-image.png"],
    },
  };
}

const isExternal = (href?: string) => !!href && /^https?:\/\//.test(href);

const markdownComponents: Components = {
  a: ({ href, children }) =>
    isExternal(href) ? (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ) : (
      <a href={href}>{children}</a>
    ),
  // Images take display hints from the URL fragment: `#invert` flips
  // dark-ink artwork for the dark theme, `#formula` also sizes it as an
  // inline equation. The markdown title becomes the caption.
  img: ({ src, alt, title }) => {
    const [path, hint] = String(src ?? "").split("#");
    const className =
      hint === "formula"
        ? "invert mx-auto h-10 w-auto"
        : hint === "invert"
        ? "invert mx-auto w-2/5 opacity-80"
        : "mx-auto max-h-[32rem] w-auto rounded-lg";
    return (
      <span className="not-prose my-10 block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={path}
          alt={alt ?? ""}
          loading="lazy"
          decoding="async"
          className={className}
        />
        {title && (
          <span className="mt-3 block text-center text-sm text-gray-500">
            {title}
          </span>
        )}
      </span>
    );
  },
  // Paragraphs that only hold an image would wrap a block in a <p>.
  p: ({ node, children }) => {
    const only = node?.children.length === 1 ? node.children[0] : undefined;
    if (only?.type === "element" && only.tagName === "img") return <>{children}</>;
    return <p>{children}</p>;
  },
};

export default async function WritingPage({ params }: Props) {
  const writing = getWriting((await params).slug);
  if (!writing) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: writing.title,
    description: writing.description,
    inLanguage: writing.language === "Spanish" ? "es" : "en",
    datePublished: writing.date,
    author: { "@id": "https://www.gulipad.com/#guli" },
    url: `https://www.gulipad.com/writings/${writing.slug}`,
    ...(writing.original ? { isBasedOn: writing.original } : {}),
  };

  return (
    <div
      className={`${serif.variable} h-full overflow-y-auto bg-black text-white`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-[60vh]"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(255,255,255,0.08) 0%, transparent 70%)",
        }}
      />

      <nav className="relative mx-auto flex max-w-3xl items-center justify-between px-5 pt-6 sm:px-8">
        <Link
          href="/?section=projects"
          className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 font-mono text-sm text-white/70 transition-colors hover:bg-white/20"
        >
          ‹ Back
        </Link>
        <Link
          href="/"
          className="text-sm text-white/50 transition-colors hover:text-white"
        >
          gulipad.com
        </Link>
      </nav>

      <article className="relative mx-auto max-w-3xl px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
        <header className="mx-auto max-w-2xl">
          <h1 className="font-[family-name:var(--font-serif)] text-4xl font-medium leading-tight tracking-tight sm:text-6xl">
            {writing.title}
          </h1>
          <p className="mt-5 font-[family-name:var(--font-serif)] text-xl leading-relaxed text-gray-400">
            {writing.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-white/10 py-4 text-sm text-gray-400">
            <span>
              Guli Moreno
              {writing.coauthors && (
                <span className="text-gray-500"> & {writing.coauthors}</span>
              )}
            </span>
            <span className="text-gray-600">·</span>
            <time dateTime={writing.date}>
              {formatWritingDate(writing.date)}
            </time>
            <span className="text-gray-600">·</span>
            <span>{writing.readingMinutes} min read</span>
            <span className="text-gray-600">·</span>
            <span title={`Originally written in ${writing.language}`}>
              Written in {writing.language} {languageFlag(writing.language)}
            </span>
          </div>
        </header>

        <div
          className="writing-prose prose prose-invert prose-lg mx-auto mt-12 max-w-2xl font-[family-name:var(--font-serif)]
                     prose-headings:font-sans prose-headings:font-semibold prose-headings:tracking-tight
                     prose-h2:mt-16 prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl
                     prose-p:leading-[1.75] prose-p:text-gray-200 prose-li:text-gray-200
                     prose-strong:text-white
                     prose-a:text-white prose-a:decoration-white/30 prose-a:underline-offset-4 hover:prose-a:decoration-white
                     prose-blockquote:not-italic prose-blockquote:rounded-r-lg prose-blockquote:border-l-white/40
                     prose-blockquote:bg-white/[0.04] prose-blockquote:py-1 prose-blockquote:pr-4 prose-blockquote:text-gray-200
                     prose-hr:border-white/10"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {writing.body}
          </ReactMarkdown>
        </div>

        <footer className="mx-auto mt-20 max-w-2xl border-t border-white/10 pt-8 text-sm text-gray-500">
          {writing.original && (
            <p>
              Originally published on{" "}
              <a
                href={writing.original}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 underline decoration-white/30 underline-offset-4 hover:decoration-white"
              >
                {writing.originalLabel ?? new URL(writing.original).hostname}
              </a>
              .
            </p>
          )}
          <Link
            href="/?section=projects"
            className="mt-4 inline-block text-gray-300 hover:text-white"
          >
            ‹ More writings
          </Link>
        </footer>
      </article>
    </div>
  );
}
