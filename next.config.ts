import { withNextVideo } from 'next-video/process';
const { createProxyMiddleware } = require('http-proxy-middleware');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'tailwindui.com', 'via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'tailwindui.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://www.youtube.com/",
          },
        ],
      },
    ];
  },
  env: {
    NEXT_VIDEO_PROVIDER: 'static',
    NEXT_PUBLIC_VIDEO_PROVIDER: 'static',
    MONGODB_URI: process.env.MONGODB_URI,
  },
  serverRuntimeConfig: {
    port: 3000, // ou un autre port de votre choix
  }
};

export default withNextVideo(nextConfig);