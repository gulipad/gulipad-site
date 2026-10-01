import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Plain-markdown copy of each writing, for readers and LLMs.
      { source: "/writings/:slug.md", destination: "/api/writings/:slug" },
    ];
  },
};

export default nextConfig;
