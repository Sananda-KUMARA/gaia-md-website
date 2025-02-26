import React from 'react';

interface VideoCardProps {
  video: {
    _id: string;
    title: string;
    videoUrl: string;
  };
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const videoId = new URL(video.videoUrl).searchParams.get('v');

  return (
    <div>
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={video.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <h3>{video.title}</h3>
    </div>
  );
};

export default VideoCard;