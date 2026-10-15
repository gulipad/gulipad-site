---
title: Making Mila's launch video with Claude Code
description: How I made Mila's launch video in a day with Claude Code, plus the full conversation - every prompt and every reply.
date: 2026-10-05
language: English
label: AI-written, supervised
readingMinutes: 45
poster: /writings/mila-launch-video/poster.jpg
video: /writings/mila-launch-video/mila.mp4
videoCaption: The final version is a bit more polished. This is the video this chat generated.
---

We're launching Mila at Capchase, and I really wanted a launch video like the ones Attio, Rippling or Raycast put out - no cameras, just animated product UI, type and a great track. That's usually weeks of back and forth with a motion designer, so I wanted to see how far I could get with Claude Code and [HyperFrames](https://hyperframes.heygen.com), which lets you write a video as HTML and GSAP and render it to MP4.

Turns out, quite far. The video above came out of this one conversation, which took about 8 and a half hours. A lot of people ask me how I actually talk to these models, so I decided to share the whole thing as it happened (I only redacted a couple of private links). Before that, here are some of the things that worked for me.

## Start with references, not the brief

My first prompt has no context on the product at all. I asked Claude to find recent animated launch videos and download them, and then I ranked them myself and told it what I liked about each one. Only after that did I bring in the music, the brand, our blog post and, finally, the script. So, by the time we wrote the first line, we were both kind of looking at the same references.

## Music first

> I think we should actually start with the music then, and then build the video on top. Otherwise sync becomes super complex.

Everything is timed to the track. The bass drop lands on "Meet Mila" and the logo lands on the last hit. Whenever something felt off, it was almost always because it had drifted off the beat.

## Be blunt, but say what works

Most of my prompts are reviews, and to be truthful they're not very polite ("sounds like a teletienda ad", "absolute AI slop", "cutre sound effects"). However, I always try to point at what's working too, so it doesn't get thrown away in the next pass. My favorite prompts are the ones that point at something that's already right and ask for more of it:

> The acceleration is still off. You know where it's perfect? When it zooms into the is broken words. Just apply the same one!

## Commit what's good

"Now it's perfect. Please commit." Commits are save points - if the next iteration goes sideways, I can always go back. It's also a pretty clear signal to the model about what not to touch.

## Course-correct on the go

You don't have to wait for it to finish. Some of my messages went in while Claude was still working (they're marked *sent mid-task* below), mostly small nudges like "Attio is the perfect inspo for animation" or "Don't focus so much on SFX for now".

## Ask for its opinion

When the second half of the video stopped working, I didn't try to fix it scene by scene. I asked "What are we missing?", read what it came back with, and told it to give it a shot. Later on it was "If you have a better idea, let me know… gogogo". It may seem obvious, but it works surprisingly well.

## Keep the taste calls

I picked the sound effects I cared about myself and pasted the links. Same with the tagline and the lines that carry the message. Claude is extremely fast at everything else, but I wanted those to be mine.

---

Below is the full transcript. My messages are on the right and Claude's are on the left. Each reply has a collapsed list of the tools it used, in case you're curious about what it was actually doing behind the scenes.
