import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the project root: a package-lock.json in a parent folder (e.g. the
  // home directory) otherwise makes Next guess the wrong workspace root.
  outputFileTracingRoot: __dirname,
  turbopack: { root: __dirname },
  async rewrites() {
    return [
      // Plain-markdown copy of each writing, for readers and LLMs.
      { source: "/writings/:slug.md", destination: "/api/writings/:slug" },
    ];
  },
};

export default nextConfig;
