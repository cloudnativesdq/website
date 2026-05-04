import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'community.cncf.io',
      },
      {
        protocol: 'https',
        hostname: 'ocgroups.dev',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
