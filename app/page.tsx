import MemojiScrubber from "@/components/MemojiScrubber";

export default function Home() {
  return (
    <main className="h-screen w-screen bg-black flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.1)_0%,transparent_60%)] pointer-events-none" />
      <MemojiScrubber />
    </main>
  );
}
