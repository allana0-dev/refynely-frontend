import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // allow this host
    domains: ["via.placeholder.com"],
    // OR, for more control:
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'via.placeholder.com',
    //     port: '',
    //     pathname: '/**',
    //   },
    // ],
  },
};

export default nextConfig;
