import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.guim.co.uk',
        pathname: '/**', // Allows all paths under this hostname
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,  // Ignore ESLint errors
  },
  typescript: {
    ignoreBuildErrors: true,  // Ignore TypeScript errors
  },
};

export default nextConfig;
