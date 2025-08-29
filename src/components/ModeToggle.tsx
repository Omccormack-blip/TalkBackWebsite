import React from 'react';
import { AppMode } from '../types';

interface ModeToggleProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ currentMode, onModeChange }) => {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col space-y-2 z-50">
      <button
        onClick={() => onModeChange('customer')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          currentMode === 'customer'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        Customer Screen
      </button>
      <button
        onClick={() => onModeChange('admin')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          currentMode === 'admin'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        Audio Files
      </button>
      <div className="text-xs text-gray-400 text-center mt-2">
        Press 'S' to switch
      </div>
    </div>
  );
};