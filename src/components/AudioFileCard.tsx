import React from 'react';
import { AudioFile } from '../types';

interface AudioFileCardProps {
  file: AudioFile;
  onDelete: (filename: string) => void;
}

export const AudioFileCard: React.FC<AudioFileCardProps> = ({ file, onDelete }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
      <div className="flex flex-col space-y-2">
        <div className="text-sm text-gray-400">
          {formatDate(file.createdAt)}
        </div>
        <div className="text-white font-medium truncate">
          {file.filename}
        </div>
        <div className="text-sm text-gray-400">
          {formatFileSize(file.size)}
        </div>
        <div className="flex space-x-2 mt-2">
          <audio controls className="w-full h-8">
            <source src={file.url} type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
        </div>
        <button
          onClick={() => onDelete(file.filename)}
          className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};