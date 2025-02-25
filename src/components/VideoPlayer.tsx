'use client'

import Video  from 'next-video'
// Import direct depuis le dossier videos (sans @)
import videoSrc from '../../videos/video1.mp4'


export default function VideoPlayer() {
  return (
    <div className="video-container">
      <Video 
        src={videoSrc}
        controls
        width="100%"
        height="auto"
      />
    </div>
  )
}