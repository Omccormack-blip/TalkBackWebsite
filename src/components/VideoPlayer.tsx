import React, { useRef, useEffect } from 'react';
import { VideoState } from '../types';
import { VideoPreloader } from '../services/VideoPreloader';

interface VideoPlayerProps {
  videoState: VideoState;
  onThankYouEnd: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoState, onThankYouEnd }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const getVideoNumber = (state: VideoState): number => {
    switch (state) {
      case 'welcome': return 1;
      case 'questions': return 2;
      case 'thankyou': return 3;
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      const videoNumber = getVideoNumber(videoState);
      const videoUrl = VideoPreloader.getVideoUrl(videoNumber);
      
      videoRef.current.src = videoUrl;
      videoRef.current.play().catch(console.error);

      if (videoState === 'thankyou') {
        videoRef.current.loop = false;
      } else {
        videoRef.current.loop = true;
      }
    }
  }, [videoState]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      if (videoState === 'thankyou') {
        onThankYouEnd();
      }
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [videoState, onThankYouEnd]);

  return (
    <video
      ref={videoRef}
      className="w-full h-full object-contain"
      playsInline
      muted
      autoPlay
    />
  );
};