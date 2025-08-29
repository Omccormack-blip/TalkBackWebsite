import React, { useState, useEffect } from 'react';
import { AudioFile } from '../types';
import { ApiClient } from '../services/ApiClient';
import { AudioFileCard } from './AudioFileCard';

export const AudioFilesView: React.FC = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAudioFiles = async () => {
    try {
      setLoading(true);
      const files = await ApiClient.getAudioFiles();
      setAudioFiles(files);
      setError(null);
    } catch (err) {
      setError('Failed to load audio files');
      console.error('Error fetching audio files:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudioFiles();
    const interval = setInterval(fetchAudioFiles, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (filename: string) => {
    try {
      await ApiClient.deleteAudioFile(filename);
      await fetchAudioFiles();
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  };

  return (
    <div className="w-full h-full bg-gray-900 text-white p-8 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Audio Feedback Files</h1>
        
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!loading && audioFiles.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No audio files recorded yet
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {audioFiles.map((file) => (
            <AudioFileCard
              key={file.filename}
              file={file}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};