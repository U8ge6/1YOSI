import React, { useState, useEffect } from 'react';
import { X, Zap } from 'lucide-react';
import { ElectricityReading, Building } from '../../types';

interface ElectricityReadingModalProps {
  reading?: ElectricityReading | null;
  buildings: Building[];
  defaultBuildingId: string;
  onSave: (reading: Omit<ElectricityReading, 'id'>) => void;
  onClose: () => void;
}

export const ElectricityReadingModal: React.FC<ElectricityReadingModalProps> = ({
  reading,
  buildings,
  defaultBuildingId,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState({
    buildingId: defaultBuildingId,
    entrance: '',
    readingDate: new Date().toISOString().split('T')[0],
    meterReading: undefined as number | undefined,
    notes: ''
  });

  const selectedBuilding = buildings.find(b => b.id === formData.buildingId);

  useEffect(() => {
    if (reading) {
      setFormData({
        buildingId: reading.buildingId,
        entrance: reading.entrance,
        readingDate: reading.readingDate,
        meterReading: reading.meterReading,
        notes: reading.notes || ''
      });
    } else {
      // Set default entrance when building changes
      const building = buildings.find(b => b.id === formData.buildingId);
      if (building && building.entrances.length > 0 && !formData.entrance) {
        setFormData(prev => ({ ...prev, entrance: building.entrances[0] }));
      }
    }
  }, [reading, buildings, formData.buildingId]);

  const handleBuildingChange = (buildingId: string) => {
    const building = buildings.find(b => b.id === buildingId);
    setFormData(prev => ({
      ...prev,
      buildingId,
      entrance: building?.entrances[0] || ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure meterReading is a valid number
    if (formData.meterReading === undefined || formData.meterReading < 0) {
      return;
    }
    
    onSave({
      buildingId: formData.buildingId,
      entrance: formData.entrance,
      readingDate: formData.readingDate,
      meterReading: formData.meterReading,
      notes: formData.notes.trim() || undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            {reading ? 'עריכת קריאת מונה' : 'הוספת קריאת מונה חדשה'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              בניין
            </label>
            <select
              value={formData.buildingId}
              onChange={(e) => handleBuildingChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              disabled={!!reading} // Disable when editing
            >
              {buildings.map(building => (
                <option key={building.id} value={building.id}>
                  {building.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              כניסה
            </label>
            <select
              value={formData.entrance}
              onChange={(e) => setFormData(prev => ({ ...prev, entrance: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              required
              disabled={!!reading} // Disable when editing
            >
              <option value="">בחר כניסה</option>
              {selectedBuilding?.entrances.map(entrance => (
                <option key={entrance} value={entrance}>
                  כניסה {entrance}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              תאריך קריאה
            </label>
            <input
              type="date"
              required
              value={formData.readingDate}
              onChange={(e) => setFormData(prev => ({ ...prev, readingDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              קריאת מונה (kWh)
            </label>
            <input
              type="number"
              required
              min="0"
              step="1"
              value={formData.meterReading !== undefined ? formData.meterReading : ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                meterReading: e.target.value ? parseInt(e.target.value) : undefined 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="למשל: 12500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              הערות (אופציונלי)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="הערות נוספות על הקריאה..."
            />
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-yellow-700">
              💡 <strong>טיפ:</strong> רשום את קריאת המונה בדיוק כפי שהיא מופיעה על המונה. זה יעזור לחשב את הצריכה החודשית בדיוק.
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
              {reading ? 'עדכן' : 'הוסף'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};