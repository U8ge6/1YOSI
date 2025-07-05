import React, { useState } from 'react';
import { Building, Phone, Key, Edit2 } from 'lucide-react';
import { Building as BuildingType } from '../../types';
import { EditElevatorModal } from './EditElevatorModal';
import { EditEntranceCodesModal } from './EditEntranceCodesModal';

interface BuildingInfoProps {
  building: BuildingType;
  onUpdateBuilding: (building: BuildingType) => void;
}

export const BuildingInfo: React.FC<BuildingInfoProps> = ({ building, onUpdateBuilding }) => {
  const [editingElevator, setEditingElevator] = useState(false);
  const [editingCodes, setEditingCodes] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Building className="h-5 w-5 text-blue-600" />
        פרטי הבניין
      </h3>
      
      <div className="space-y-4">
        {/* Entrance Codes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              <Key className="h-4 w-4" />
              קודי כניסה
            </h4>
            <button
              onClick={() => setEditingCodes(true)}
              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="ערוך קודי כניסה"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {building.entranceCodes?.map((code, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-600">כניסה {code.entrance}</div>
                <div className="font-mono font-bold text-gray-900">
                  {code.code || 'לא הוגדר'}
                </div>
              </div>
            )) || (
              <div className="col-span-3 text-sm text-gray-500 text-center py-2">
                לא הוגדרו קודי כניסה
              </div>
            )}
          </div>
        </div>

        {/* Elevator */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              מעלית
            </h4>
            <button
              onClick={() => setEditingElevator(true)}
              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="ערוך פרטי מעלית"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-900">
              {building.elevatorCompany || 'לא הוגדרה חברת מעליות'}
            </div>
            {building.elevatorPhone && (
              <div className="text-sm text-gray-600 font-mono">{building.elevatorPhone}</div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {editingElevator && (
        <EditElevatorModal
          building={building}
          onSave={onUpdateBuilding}
          onClose={() => setEditingElevator(false)}
        />
      )}

      {editingCodes && (
        <EditEntranceCodesModal
          building={building}
          onSave={onUpdateBuilding}
          onClose={() => setEditingCodes(false)}
        />
      )}
    </div>
  );
};