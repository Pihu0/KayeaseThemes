import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable streaming metadata so <title>/<meta description> are always rendered
  // inside <head> for every user agent (not just JS-executing bots). Next.js 16
  // streams metadata into <body> by default for faster TTFB; that's invisible to
  // Googlebot but makes non-JS crawlers and audit tools (Lighthouse) see no
  // description. Trade-off: marginally higher TTFB. See generate-metadata docs.
  htmlLimitedBots: /.*/,

  images: {
    // Whitelist the hosts we load images from (security requirement of next/image)
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "img.kayease.com" },
      // Login-page orbit tech icons + Google logo (21st.dev animated sign-in)
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "cdn1.iconfinder.com" },
    ],
  },
};

export default nextConfig;
