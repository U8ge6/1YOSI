import React from 'react';
import { Cloud, CloudOff, Save } from 'lucide-react';

interface SaveIndicatorProps {
  onForceSave: () => void;
}

export const SaveIndicator: React.FC<SaveIndicatorProps> = ({ onForceSave }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onForceSave}
        className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
        title="שמור עכשיו"
      >
        <Save className="h-3 w-3" />
        שמור
      </button>
      <div className="flex items-center gap-1">
        <Cloud className="h-3 w-3 text-blue-600" />
        <span id="save-indicator" className="text-xs text-gray-500"></span>
      </div>
    </div>
  );
};