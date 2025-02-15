import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['ik.imagekit.io'], // Allow images from ImageKit
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '/rezexxian/**', // Adjust this pattern based on your ImageKit path
      },
    ],
  },
};

export default nextConfig;