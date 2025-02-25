import { withNextVideo } from 'next-video/process'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
 
   
 
   images: {
    domains: ['images.unsplash.com', 'tailwindui.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'tailwindui.com',
      }
    ],
  },
  env: {
    NEXT_VIDEO_PROVIDER: 'static',
    NEXT_PUBLIC_VIDEO_PROVIDER: 'static',
    MONGODB_URI: process.env.MONGODB_URI
  }
}

export default withNextVideo(nextConfig)
