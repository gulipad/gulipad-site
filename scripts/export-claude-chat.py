#!/usr/bin/env python3
"""Turn a Claude Code session log (.jsonl) into a transcript shown under a writing.

Usage: python3 scripts/export-claude-chat.py <session.jsonl> <slug> [stop-at-prompt-prefix]

Writes content/writings/<slug>.transcript.json and saves any images the user
pasted to public/writings/<slug>/. Keeps every prompt and every reply verbatim,
apart from the REDACTIONS below; tool work between them is summarised as a list
of short labels.
"""
import base64, json, os, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

NOISE = re.compile(r"<system-reminder>.*?</system-reminder>", re.S)
PASTE = re.compile(r'<pasted_content id="[^"]*">\n?(.*?)\n?</pasted_content id="[^"]*">', re.S)
PASTE_OPEN = re.compile(r'</?pasted_content[^>]*>')

# Passages that must not go public, as (pattern, replacement). Applied to every
# prompt, reply and tool label, so re-exporting a session keeps them out.
# Patterns that would themselves reveal what they hide live in a gitignored
# scripts/redactions.local.json: a list of [regex, replacement] pairs.
REDACTIONS = [
    # internal design files: keep the shape of the link, hide the file key and params
    (re.compile(r"https://www\.figma\.com/design/[A-Za-z0-9]+/([\w-]+)\S*"), r"https://www.figma.com/design/██████/\1"),
]
LOCAL_REDACTIONS = Path(__file__).with_name("redactions.local.json")
if LOCAL_REDACTIONS.exists():
    REDACTIONS += [(re.compile(p), r) for p, r in json.loads(LOCAL_REDACTIONS.read_text())]


def redact(text):
    for pattern, repl in REDACTIONS:
        text = pattern.sub(repl, text)
    return text


def user_text(content):
    """Text of a user message, plus any inline images (as raw blocks)."""
    if isinstance(content, str):
        return content, []
    texts, images = [], []
    for b in content:
        if b.get("type") == "text":
            texts.append(b["text"])
        elif b.get("type") == "image":
            images.append(b)
    return "\n".join(texts), images


def clean_prompt(text):
    text = NOISE.sub("", text)
    # Pasted blocks become markdown quotes so they read as "pasted in".
    text = PASTE.sub(lambda m: "\n" + "\n".join("> " + l for l in m.group(1).strip().split("\n")) + "\n", text)
    text = PASTE_OPEN.sub("", text)
    return text.strip()


def tool_label(block):
    name, inp = block.get("name", ""), block.get("input") or {}
    if inp.get("description"):
        return inp["description"]
    if name in ("Read", "Write", "Edit") and inp.get("file_path"):
        return f"{name} {os.path.basename(inp['file_path'])}"
    if name.startswith("mcp__claude-in-chrome__"):
        return "Browser: " + name.split("__")[-1].replace("_", " ")
    if name == "Skill":
        return f"Load skill {inp.get('skill', '')}"
    if name == "Artifact" or name == "AskUserQuestion":
        return name
    return name


def main(path, slug, stop=None):
    rows = [json.loads(l) for l in open(path) if l.strip()]
    rows = [r for r in rows if not r.get("isSidechain")]
    out_img = ROOT / "public" / "writings" / slug
    out_img.mkdir(parents=True, exist_ok=True)

    messages, img_n = [], 0
    reply = None  # the assistant turn being collected

    def flush():
        nonlocal reply
        if reply and (reply["text"].strip() or reply["tools"]):
            reply["text"] = reply["text"].strip()
            messages.append(reply)
        reply = None

    def add_user(text, ts, kind="prompt", images=()):
        nonlocal img_n
        flush()
        srcs = []
        for b in images:
            img_n += 1
            ext = b["source"].get("media_type", "image/png").split("/")[-1].replace("jpeg", "jpg")
            name = f"pasted-{img_n}.{ext}"
            (out_img / name).write_bytes(base64.b64decode(b["source"]["data"]))
            srcs.append(f"/writings/{slug}/{name}")
        messages.append({"role": "user", "kind": kind, "text": text, "images": srcs, "ts": ts})

    for r in rows:
        t, ts = r.get("type"), r.get("timestamp")
        if t == "user":
            if r.get("isMeta") or r.get("toolUseResult") is not None:
                continue
            if r.get("isCompactSummary"):
                flush()
                messages.append({"role": "event", "text": "Context window full: the conversation was summarised and carried on.", "ts": ts})
                continue
            text, images = user_text(r["message"]["content"])
            if text.lstrip().startswith(("<task-notification", "<tool_result", "<command-")):
                continue
            if isinstance(r["message"]["content"], list) and any(b.get("type") == "tool_result" for b in r["message"]["content"]):
                continue
            if text.strip() == "[Request interrupted by user]":
                flush()
                messages.append({"role": "event", "text": "Interrupted by Guli.", "ts": ts})
                continue
            text = clean_prompt(text)
            if text or images:
                add_user(text, ts, images=images)
        elif t == "attachment" and (r.get("attachment") or {}).get("type") == "queued_command":
            text = clean_prompt(str(r["attachment"].get("prompt") or ""))
            if text:
                # Sent while Claude was mid-task; Claude picks it up inside the running turn.
                flush()
                messages.append({"role": "user", "kind": "midturn", "text": text, "images": [], "ts": ts})
        elif t == "assistant":
            content = r["message"].get("content") or []
            if isinstance(content, str):
                content = [{"type": "text", "text": content}]
            for b in content:
                if b.get("type") == "text" and b["text"].strip():
                    if reply is None:
                        reply = {"role": "assistant", "text": "", "tools": [], "ts": ts}
                    reply["text"] += ("\n\n" if reply["text"] else "") + b["text"].strip()
                elif b.get("type") == "tool_use":
                    if reply is None:
                        reply = {"role": "assistant", "text": "", "tools": [], "ts": ts}
                    reply["tools"].append(tool_label(b))
    flush()
    if stop:  # end the transcript before the prompt that starts with `stop`
        cut = next((i for i, m in enumerate(messages) if m["role"] == "user" and m["text"].startswith(stop)), None)
        if cut is not None:
            messages = messages[:cut]
    for m in messages:
        m["text"] = redact(m["text"])
        if "tools" in m:
            m["tools"] = [redact(t) for t in m["tools"]]

    stats = {
        "prompts": sum(1 for m in messages if m["role"] == "user"),
        "replies": sum(1 for m in messages if m["role"] == "assistant"),
        "toolCalls": sum(len(m.get("tools", [])) for m in messages if m["role"] == "assistant"),
        "start": rows[0].get("timestamp") or next(r["timestamp"] for r in rows if r.get("timestamp")),
        "end": messages[-1]["ts"],
    }
    dest = ROOT / "content" / "writings" / f"{slug}.transcript.json"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(json.dumps({"stats": stats, "messages": messages}, ensure_ascii=False, indent=1))
    print(f"{dest.relative_to(ROOT)}: {stats}, {img_n} image(s)")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None)
