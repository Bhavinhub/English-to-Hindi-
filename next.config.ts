import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components / partial prefetching are off: every page is prerendered and learning data lives
  // in the browser, and the Cloudflare (OpenNext) runtime does not fully support those modes yet.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

// Makes Cloudflare bindings (D1 "DB") available to `next dev` via getCloudflareContext().
if (process.env.NODE_ENV === "development") {
  import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
}
