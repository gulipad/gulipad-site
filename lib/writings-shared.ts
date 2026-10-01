// Client-safe writing types and helpers (no filesystem access).

export interface WritingMeta {
  slug: string;
  title: string;
  description: string;
  date: string; // "YYYY", "YYYY-MM" or "YYYY-MM-DD"
  language: string; // language it was originally written in
  original?: string; // where it was first published
  originalLabel?: string;
  coauthors?: string;
  readingMinutes: number;
}

export function formatWritingDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  if (!m) return String(y);
  return new Date(Date.UTC(y, m - 1, d || 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    ...(d ? { day: "numeric" } : {}),
    timeZone: "UTC",
  });
}

const LANGUAGE_FLAGS: Record<string, string> = {
  English: "🇺🇸",
  Spanish: "🇪🇸",
};

export const languageFlag = (language: string) =>
  LANGUAGE_FLAGS[language] ?? "🌐";
