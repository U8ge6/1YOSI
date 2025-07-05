import React, { useState } from 'react';
import { Plus, Zap, Calendar, TrendingUp, Edit2, Trash2 } from 'lucide-react';
import { ElectricityReading, Building } from '../../types';
import { ElectricityReadingModal } from './ElectricityReadingModal';

interface ElectricityReadingsProps {
  readings: ElectricityReading[];
  buildings: Building[];
  currentBuildingId: string;
  onAddReading: (reading: Omit<ElectricityReading, 'id'>) => void;
  onUpdateReading: (reading: ElectricityReading) => void;
  onDeleteReading: (readingId: string) => void;
}

export const ElectricityReadings: React.FC<ElectricityReadingsProps> = ({
  readings,
  buildings,
  currentBuildingId,
  onAddReading,
  onUpdateReading,
  onDeleteReading
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReading, setEditingReading] = useState<ElectricityReading | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState(currentBuildingId);

  const currentBuilding = buildings.find(b => b.id === selectedBuilding);
  const buildingReadings = readings.filter(r => r.buildingId === selectedBuilding);

  // Group readings by entrance
  const readingsByEntrance = buildingReadings.reduce((acc, reading) => {
    if (!acc[reading.entrance]) {
      acc[reading.entrance] = [];
    }
    acc[reading.entrance].push(reading);
    return acc;
  }, {} as Record<string, ElectricityReading[]>);

  // Sort readings by date (newest first)
  Object.keys(readingsByEntrance).forEach(entrance => {
    readingsByEntrance[entrance].sort((a, b) => 
      new Date(b.readingDate).getTime() - new Date(a.readingDate).getTime()
    );
  });

  const handleAddReading = (readingData: Omit<ElectricityReading, 'id'>) => {
    onAddReading(readingData);
    setIsModalOpen(false);
  };

  const handleEditReading = (reading: ElectricityReading) => {
    setEditingReading(reading);
    setIsModalOpen(true);
  };

  const handleUpdateReading = (readingData: Omit<ElectricityReading, 'id'>) => {
    if (editingReading) {
      onUpdateReading({ ...readingData, id: editingReading.id });
      setEditingReading(null);
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReading(null);
  };

  const calculateConsumption = (readings: ElectricityReading[]) => {
    if (readings.length < 2) return null;
    const latest = readings[0];
    const previous = readings[1];
    return latest.meterReading - previous.meterReading;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            קריאות מונה חשמל
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            מעקב אחר קריאות מונה חשמל חודשיות לכל כניסה
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          הוסף קריאה
        </button>
      </div>

      {/* Building Selector */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          בחר בניין
        </label>
        <select
          value={selectedBuilding}
          onChange={(e) => setSelectedBuilding(e.target.value)}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
        >
          {buildings.map(building => (
            <option key={building.id} value={building.id}>
              {building.name}
            </option>
          ))}
        </select>
      </div>

      {/* Readings by Entrance */}
      {currentBuilding && (
        <div className="grid gap-6">
          {currentBuilding.entrances.map(entrance => {
            const entranceReadings = readingsByEntrance[entrance] || [];
            const consumption = calculateConsumption(entranceReadings);
            const latestReading = entranceReadings[0];

            return (
              <div key={entrance} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    כניסה {entrance}
                  </h4>
                  {latestReading && (
                    <div className="text-sm text-gray-600">
                      קריאה אחרונה: {new Date(latestReading.readingDate).toLocaleDateString('he-IL')}
                    </div>
                  )}
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">קריאה נוכחית</span>
                    </div>
                    <div className="text-lg font-bold text-yellow-900">
                      {latestReading ? latestReading.meterReading.toLocaleString() : 'אין נתונים'}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">צריכה חודשית</span>
                    </div>
                    <div className="text-lg font-bold text-blue-900">
                      {consumption !== null ? `${consumption.toLocaleString()} kWh` : 'אין נתונים'}
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">סך קריאות</span>
                    </div>
                    <div className="text-lg font-bold text-green-900">
                      {entranceReadings.length}
                    </div>
                  </div>
                </div>

                {/* Readings Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-right">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">תאריך</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">קריאת מונה</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">צריכה</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">הערות</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">פעולות</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {entranceReadings.map((reading, index) => {
                        const previousReading = entranceReadings[index + 1];
                        const monthlyConsumption = previousReading 
                          ? reading.meterReading - previousReading.meterReading 
                          : null;

                        return (
                          <tr key={reading.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-600">
                              {new Date(reading.readingDate).toLocaleDateString('he-IL')}
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-900">
                              {reading.meterReading.toLocaleString()}
                            </td>
                            <td className="px-4 py-3">
                              {monthlyConsumption !== null ? (
                                <span className={`font-medium ${
                                  monthlyConsumption > 0 ? 'text-blue-600' : 'text-gray-500'
                                }`}>
                                  {monthlyConsumption > 0 ? `+${monthlyConsumption.toLocaleString()}` : '-'}
                                </span>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {reading.notes || '-'}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditReading(reading)}
                                  className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                  title="ערוך"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => onDeleteReading(reading.id)}
                                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                                  title="מחק"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  
                  {entranceReadings.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      אין קריאות רשומות עבור כניסה זו
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <ElectricityReadingModal
          reading={editingReading}
          buildings={buildings}
          defaultBuildingId={selectedBuilding}
          onSave={editingReading ? handleUpdateReading : handleAddReading}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};