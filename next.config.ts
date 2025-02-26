import { withNextVideo } from 'next-video/process';
const { createProxyMiddleware } = require('http-proxy-middleware');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
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
  serverRuntimeConfig: {
    port: 3000, // ou un autre port de votre choix
  },
    async rewrites() {
        return [
          {
            source: '/robot.txt',
            destination: '/api/robot',
          },
        ];
      },
      eslint: {
          ignoreDuringBuilds: true,
        },
        typescript: {
          // Désactive la vérification TypeScript pendant le build
          ignoreBuildErrors: true,
        },

};

export default withNextVideo(nextConfig);