import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  transcriptHours,
  type Transcript as TranscriptData,
  type TranscriptMessage,
} from "@/lib/transcript-shared";
import { formatWritingDate } from "@/lib/writings-shared";

// The AI conversation behind a writing: every prompt and reply, with the
// agent's tool work collapsed under each reply.

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
};

// Wall-clock time in Madrid, where the chat happened.
const clock = (ts: string) =>
  new Date(ts).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  });

// A prompt is plain text with its line breaks; blocks the exporter marked as
// pasted ("> " lines) collapse so they don't swamp the conversation.
function PromptText({ text }: { text: string }) {
  const parts: { pasted: boolean; lines: string[] }[] = [];
  for (const line of text.split("\n")) {
    const pasted = line.startsWith("> ") || line === ">";
    const last = parts[parts.length - 1];
    if (last && last.pasted === pasted) last.lines.push(pasted ? line.slice(2) : line);
    else parts.push({ pasted, lines: [pasted ? line.slice(2) : line] });
  }
  return (
    <>
      {parts.map((p, i) =>
        p.pasted ? (
          <details key={i} className="my-2 rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm">
            <summary className="cursor-pointer select-none text-white/60">
              Pasted text · {p.lines.length} lines
            </summary>
            <div className="mt-2 max-h-96 overflow-y-auto whitespace-pre-wrap text-white/70">
              {p.lines.join("\n")}
            </div>
          </details>
        ) : (
          <div key={i} className="whitespace-pre-wrap">
            {p.lines.join("\n").trim()}
          </div>
        )
      )}
    </>
  );
}

function Message({ m }: { m: TranscriptMessage }) {
  if (m.role === "event") {
    return (
      <div className="my-10 flex items-center gap-4 text-xs uppercase tracking-widest text-white/35">
        <span className="h-px flex-1 bg-white/10" />
        {m.text}
        <span className="h-px flex-1 bg-white/10" />
      </div>
    );
  }
  if (m.role === "user") {
    return (
      <div className="my-8 flex flex-col items-end">
        <div className="mb-1.5 flex items-center gap-2 text-xs text-white/40">
          {m.kind === "midturn" && (
            <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-2 py-0.5 text-amber-200/80">
              sent mid-task
            </span>
          )}
          <span>Guli · {clock(m.ts)}</span>
        </div>
        <div className="max-w-[88%] rounded-2xl rounded-tr-md bg-white px-5 py-3.5 text-[15px] leading-relaxed text-gray-900 shadow-lg">
          <PromptText text={m.text} />
          {m.images.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="Image pasted into the chat" loading="lazy" className="mt-3 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="my-8">
      <div className="mb-1.5 flex items-center gap-2 text-xs text-white/40">
        <span className="inline-block h-3.5 w-3.5 rounded-full bg-gradient-to-br from-[#ffe1c2] to-[#d97757]" />
        <span>Claude · {clock(m.ts)}</span>
      </div>
      {m.tools.length > 0 && (
        <details className="mb-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/50">
          <summary className="cursor-pointer select-none">
            Worked · {m.tools.length} {m.tools.length === 1 ? "step" : "steps"}
          </summary>
          <ol className="mt-2 list-decimal space-y-0.5 pl-5 font-mono text-[11px] text-white/45">
            {m.tools.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ol>
        </details>
      )}
      {m.text && (
        <div
          className="prose prose-invert prose-sm max-w-none text-[15px]
                     prose-p:leading-relaxed prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white
                     prose-headings:text-white prose-code:text-[#f0b39a] prose-code:before:content-none prose-code:after:content-none
                     prose-a:text-white prose-a:decoration-white/30 prose-table:text-sm prose-th:text-white/80 prose-td:text-gray-300
                     prose-blockquote:border-l-white/30 prose-blockquote:text-gray-300"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {m.text}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default function Transcript({
  transcript,
  date,
}: {
  transcript: TranscriptData;
  date: string;
}) {
  const { stats, messages } = transcript;
  return (
    <section className="mx-auto mt-20 max-w-2xl border-t border-white/10 pt-12" aria-label="Transcript">
      <h2 className="mb-2 text-2xl font-semibold tracking-tight">The conversation</h2>
      <p className="text-sm text-white/40">
        Unedited, apart from two small redactions. Times are Madrid time on {formatWritingDate(date)}.
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {[
          `${stats.prompts} prompts`,
          `${stats.replies} replies`,
          `${stats.toolCalls} tool calls`,
          `${transcriptHours(stats)} start to finish`,
        ].map((s) => (
          <span key={s} className="rounded-full bg-white/[0.07] px-3 py-1 text-white/60">
            {s}
          </span>
        ))}
      </div>
      {messages.map((m, i) => (
        <Message key={i} m={m} />
      ))}
    </section>
  );
}
