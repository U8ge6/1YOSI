import React, { useState, useEffect } from 'react';
import { X, Zap, Plus, Trash2 } from 'lucide-react';
import { Building } from '../../types';

interface EditElectricityModalProps {
  building: Building;
  onSave: (building: Building) => void;
  onClose: () => void;
}

export const EditElectricityModal: React.FC<EditElectricityModalProps> = ({
  building,
  onSave,
  onClose
}) => {
  const [electricityDetails, setElectricityDetails] = useState(() => {
    if (building.electricityDetails && building.electricityDetails.length > 0) {
      return building.electricityDetails;
    }
    // Initialize with building entrances
    return building.entrances.map(entrance => ({
      entrance,
      contractNumber: '',
      meterNumber: ''
    }));
  });

  const handleDetailChange = (index: number, field: string, value: string) => {
    setElectricityDetails(prev => prev.map((detail, i) => 
      i === index ? { ...detail, [field]: value } : detail
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedBuilding = {
      ...building,
      electricityDetails: electricityDetails.filter(detail => 
        detail.contractNumber.trim() || detail.meterNumber.trim()
      )
    };
    
    onSave(updatedBuilding);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            עריכת פרטי חשמל
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            {electricityDetails.map((detail, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  כניסה {detail.entrance}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      מספר חוזה חשמל
                    </label>
                    <input
                      type="text"
                      value={detail.contractNumber}
                      onChange={(e) => handleDetailChange(index, 'contractNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      placeholder="123456789"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      מספר מונה
                    </label>
                    <input
                      type="text"
                      value={detail.meterNumber}
                      onChange={(e) => handleDetailChange(index, 'meterNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      placeholder="987654321"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-yellow-700">
              💡 <strong>טיפ:</strong> שמור את מספרי החוזה והמונה לכל כניסה לטיפול מהיר בבעיות חשמל ותשלום חשבונות
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
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              שמור
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};