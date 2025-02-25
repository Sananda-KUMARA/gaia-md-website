'use client'

import Video  from 'next-video'
// Import direct depuis le dossier videos (sans @)
import videoSrc from '../../videos/video1.mp4'


export default function VideoPlayer() {
  return (
    <div className="video-container">
<video
  src={videoSrc}
  controls
  width={1280}
  height={720}
  className="w-full"  // Cette classe permettra à la vidéo d'être responsive
/>
    </div>
  )
}