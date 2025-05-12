import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'apod.nasa.gov',
        pathname: '/apod/image/**',
      },
      {
        protocol: 'https',
        hostname: 'www.youtube.com',
        pathname: '/embed/**',
      },
    ],
  },
};

export default config;
