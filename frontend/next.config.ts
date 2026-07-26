import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
