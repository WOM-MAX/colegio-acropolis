import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  cacheMaxMemorySize: 0, // Deshabilita la caché en memoria RAM (ahorra memoria, lee desde disco)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverActions: {
    bodySizeLimit: '50mb',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
