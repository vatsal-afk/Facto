import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.guim.co.uk',
        pathname: '/**', // Allows all paths under this hostname
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
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
