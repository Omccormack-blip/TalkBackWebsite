import React, { useState, useEffect } from 'react';
import { AppMode } from './types';
import { CustomerKiosk } from './components/CustomerKiosk';
import { AudioFilesView } from './components/AudioFilesView';
import { ModeToggle } from './components/ModeToggle';
import { VideoPreloader } from './services/VideoPreloader';

function App() {
  const [mode, setMode] = useState<AppMode>('customer');
  const [videosReady, setVideosReady] = useState(false);

  useEffect(() => {
    VideoPreloader.preloadVideos().then(() => {
      setVideosReady(true);
    });

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 's') {
        setMode(prev => prev === 'customer' ? 'admin' : 'customer');
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  if (!videosReady) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading videos...</div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-black relative">
      {mode === 'customer' ? (
        <CustomerKiosk />
      ) : (
        <AudioFilesView />
      )}
      <ModeToggle currentMode={mode} onModeChange={setMode} />
    </div>
  );
}

export default App;