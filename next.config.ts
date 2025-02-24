import type { NextConfig } from "next";
import { withNextVideo } from 'next-video/process'

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_VIDEO_PROVIDER: 'static',
    NEXT_PUBLIC_VIDEO_PROVIDER: 'static'
  }
}

export default withNextVideo(nextConfig)