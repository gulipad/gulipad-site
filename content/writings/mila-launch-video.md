---
title: Making Mila's launch video with Claude Code
description: One working day, one conversation, a 53-second animated launch film. Every prompt I sent and every reply I got, unedited.
date: 2026-10-05
language: English
label: AI-written, supervised
poster: /writings/mila-launch-video/poster.jpg
video: /writings/mila-launch-video/mila.mp4
videoCaption: The final version is a bit more polished. This is the video this chat generated.
---

Capchase is launching Mila, our always-on AI deal desk, and it needed a launch film. Not a filmed one: the animated, product-UI kind that Attio, Rippling and Raycast put out. I made it in a single Claude Code session, written as code with [HyperFrames](https://hyperframes.heygen.com) (HTML and GSAP rendered to video), with music and sound effects from Epidemic Sound.

The film is going up on YouTube. Below is the whole conversation, from "go find me some launch videos" to the final render. I'm sharing it because people keep asking how I actually talk to these models, and the honest answer is easier to show than to describe. Here's what I'd point at.

## Make it look before you tell it anything

The first prompt has no product context at all. I asked for research first: find recent animated launch videos and download them so I could rank them. Then I ranked them, said what I liked about each, and asked it to study them closely. Only then did the music come in, then the brand, then the blog post, then the script. By the time we wrote a single line, we had a shared taste to point back to.

## Music first, then the picture

> I think we should actually start with the music then, and then build the video on top. Otherwise sync becomes super complex.

Everything after that is timed to the track: the drop lands on "Meet Mila", the logo lands on the final hit. When the edit drifted off the beat, that was the bug.

## Say exactly what's wrong, and exactly what's right

Most of my prompts are reviews. They're blunt ("sounds like a teletienda ad", "absolute AI slop", "cutre sound effects"), but they always name what's working too, so the next pass keeps it. The most useful prompts point at a moment that already feels right and ask for more of it:

> The acceleration is still off. You know where it's perfect? When it zooms into the is broken words. Just apply the same one!

## Lock in what's good

"Now it's perfect. Please commit." A commit is a save point I can come back to, and it tells the model what not to touch.

## Steer while it works

Some messages went in while Claude was in the middle of a task (they're marked *sent mid-task*). They're small course corrections: "Attio is the perfect inspo for animation", "Don't focus so much on SFX for now". You don't have to wait for it to finish to change direction.

## Ask for its opinion, then let it run

When the second half stopped working, I didn't try to fix it scene by scene. I asked "What are we missing?", read the critique, and said "Give that a shot." Later: "If you have a better idea, let me know… gogogo".

## Take the decisions that need taste

The sound effects I cared about, I picked myself and pasted the link. Same with the end-card tagline and the bits of script that carry the message. The model is fast at everything else.

---

The full transcript follows. My messages are on the right. Claude's replies are on the left, with a collapsed list of the tool calls it made behind each one.
