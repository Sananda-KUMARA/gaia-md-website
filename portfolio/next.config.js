const { withNextVideo } = require('next-video/process')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration spécifique pour next-video
  nextVideo: {
    provider: 'local', // Force l'utilisation du stockage local
    storage: {
      local: {
        basePath: '/videos'
      }
    }
  }
}

module.exports = withNextVideo(nextConfig)