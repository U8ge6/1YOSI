import React, { useState, useEffect } from 'react';
import { X, Key, Eye, EyeOff } from 'lucide-react';
import { Building } from '../../types';

interface EditEntranceCodesModalProps {
  building: Building;
  onSave: (building: Building) => void;
  onClose: () => void;
}

export const EditEntranceCodesModal: React.FC<EditEntranceCodesModalProps> = ({
  building,
  onSave,
  onClose
}) => {
  const [entranceCodes, setEntranceCodes] = useState(() => {
    if (building.entranceCodes && building.entranceCodes.length > 0) {
      return building.entranceCodes;
    }
    // Initialize with building entrances
    return building.entrances.map(entrance => ({
      entrance,
      code: ''
    }));
  });

  const [showCodes, setShowCodes] = useState<{ [key: number]: boolean }>({});

  const handleCodeChange = (index: number, value: string) => {
    setEntranceCodes(prev => prev.map((item, i) => 
      i === index ? { ...item, code: value } : item
    ));
  };

  const toggleShowCode = (index: number) => {
    setShowCodes(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedBuilding = {
      ...building,
      entranceCodes: entranceCodes.filter(item => item.code.trim())
    };
    
    onSave(updatedBuilding);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Key className="h-5 w-5 text-green-600" />
            עריכת קודי כניסה
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-4">
            {entranceCodes.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  קוד כניסה {item.entrance}
                </label>
                <div className="relative">
                  <input
                    type={showCodes[index] ? "text" : "password"}
                    value={item.code}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono"
                    placeholder="הזן קוד כניסה"
                    maxLength={10}
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowCode(index)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCodes[index] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-700">
              🔒 <strong>אבטחה:</strong> שמור את הקודים במקום בטוח ושתף רק עם דיירים מורשים
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              שמור
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};