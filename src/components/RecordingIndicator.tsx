import React from 'react';

export const RecordingIndicator: React.FC = () => {
  return (
    <div className="absolute top-8 right-8 flex items-center space-x-2 bg-red-600 px-4 py-2 rounded-full animate-pulse">
      <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
      <span className="text-white font-medium">Recording...</span>
    </div>
  );
};