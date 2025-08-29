import React, { useState, useRef, useEffect } from 'react';
import { VideoState } from '../types';
import { VideoPlayer } from './VideoPlayer';
import { AudioRecorder } from '../services/AudioRecorder';
import { ApiClient } from '../services/ApiClient';
import { RecordingIndicator } from './RecordingIndicator';

export const CustomerKiosk: React.FC = () => {
  const [videoState, setVideoState] = useState<VideoState>('welcome');
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInteraction = async () => {
    setError(null);

    if (videoState === 'welcome') {
      setVideoState('questions');
      try {
        await AudioRecorder.startRecording();
        setIsRecording(true);
      } catch (err: any) {
        setError(err.message);
        console.error('Failed to start recording:', err);
      }
    } else if (videoState === 'questions' && isRecording) {
      try {
        const audioBlob = await AudioRecorder.stopRecording();
        setIsRecording(false);
        await ApiClient.uploadAudio(audioBlob);
        setVideoState('thankyou');
      } catch (err: any) {
        setError(err.message);
        console.error('Failed to stop recording:', err);
      }
    }
  };

  const handleThankYouEnd = () => {
    setVideoState('welcome');
    setError(null);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleInteraction();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [videoState, isRecording]);

  return (
    <div className="relative w-full h-full" onClick={handleInteraction}>
      <VideoPlayer
        videoState={videoState}
        onThankYouEnd={handleThankYouEnd}
      />
      {isRecording && <RecordingIndicator />}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};