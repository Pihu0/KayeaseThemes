import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Whitelist the hosts we load images from (security requirement of next/image)
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
