import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The embedded Sanity Studio (and its swr dependency) isn't built to be
  // bundled through Next's RSC module graph — let Node's native require
  // handle it server-side instead of Turbopack/webpack.
  serverExternalPackages: ["sanity", "next-sanity"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;
