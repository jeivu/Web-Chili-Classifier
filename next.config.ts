import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: Ini akan membuat build berhasil meskipun ada error ESLint.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;