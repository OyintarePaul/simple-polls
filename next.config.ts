import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [{
       protocol: 'https',
      hostname: "ik.imagekit.io",
    }]
  },
  experimental: {   
    turbopackFileSystemCacheForDev: true,
    serverActions: {
      allowedOrigins: ["localhost:3000"]
    }
  }
};

export default nextConfig;
