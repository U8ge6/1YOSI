import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save } from 'lucide-react';
import { AppState, Building } from '../../types';

interface BuildingSettingsProps {
  data: AppState;
  onUpdateSettings: (data: AppState) => void;
}

export const BuildingSettings: React.FC<BuildingSettingsProps> = ({
  data,
  onUpdateSettings
}) => {
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [isAddingBuilding, setIsAddingBuilding] = useState(false);
  const [newBuilding, setNewBuilding] = useState({
    name: '',
    entrances: ['א'],
    elevatorCompany: '',
    elevatorPhone: '',
    electricityDetails: [{ entrance: 'א', contractNumber: '', meterNumber: '' }],
    entranceCodes: [{ entrance: 'א', code: '' }]
  });

  const handleAddBuilding = () => {
    const building: Building = {
      id: `building-${Date.now()}`,
      ...newBuilding
    };

    const updatedData = {
      ...data,
      buildings: [...data.buildings, building],
      tenants: { ...data.tenants, [building.id]: [] },
      payments: { ...data.payments, [building.id]: [] },
      expenses: { ...data.expenses, [building.id]: [] },
      pettyCash: { ...data.pettyCash, [building.id]: [] },
      employees: { ...data.employees, [building.id]: [] },
      issues: { ...data.issues, [building.id]: [] }
    };

    onUpdateSettings(updatedData);
    setIsAddingBuilding(false);
    setNewBuilding({
      name: '',
      entrances: ['א'],
      elevatorCompany: '',
      elevatorPhone: '',
      electricityDetails: [{ entrance: 'א', contractNumber: '', meterNumber: '' }],
      entranceCodes: [{ entrance: 'א', code: '' }]
    });
  };

  const handleDeleteBuilding = (buildingId: string) => {
    if (data.buildings.length <= 1) {
      alert('לא ניתן למחוק את הבניין האחרון');
      return;
    }

    if (!confirm('האם אתה בטוח שברצונך למחוק את הבניין? כל הנתונים יימחקו!')) {
      return;
    }

    const updatedBuildings = data.buildings.filter(b => b.id !== buildingId);
    const { [buildingId]: deletedTenants, ...remainingTenants } = data.tenants;
    const { [buildingId]: deletedPayments, ...remainingPayments } = data.payments;
    const { [buildingId]: deletedExpenses, ...remainingExpenses } = data.expenses;
    const { [buildingId]: deletedPettyCash, ...remainingPettyCash } = data.pettyCash;
    const { [buildingId]: deletedEmployees, ...remainingEmployees } = data.employees;
    const { [buildingId]: deletedIssues, ...remainingIssues } = data.issues;

    const updatedData = {
      ...data,
      buildings: updatedBuildings,
      currentBuildingId: data.currentBuildingId === buildingId ? updatedBuildings[0].id : data.currentBuildingId,
      tenants: remainingTenants,
      payments: remainingPayments,
      expenses: remainingExpenses,
      pettyCash: remainingPettyCash,
      employees: remainingEmployees,
      issues: remainingIssues
    };

    onUpdateSettings(updatedData);
  };

  const handleUpdateBuilding = (building: Building) => {
    const updatedData = {
      ...data,
      buildings: data.buildings.map(b => b.id === building.id ? building : b)
    };
    onUpdateSettings(updatedData);
    setEditingBuilding(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">ניהול בניינים</h3>
        <button
          onClick={() => setIsAddingBuilding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          הוסף בניין
        </button>
      </div>

      {/* Add Building Form */}
      {isAddingBuilding && (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-4">הוספת בניין חדש</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שם הבניין
              </label>
              <input
                type="text"
                value={newBuilding.name}
                onChange={(e) => setNewBuilding(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="למשל: רחוב הרצל 15"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddBuilding}
                disabled={!newBuilding.name}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                הוסף
              </button>
              <button
                onClick={() => setIsAddingBuilding(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buildings List */}
      <div className="space-y-4">
        {data.buildings.map((building) => (
          <div key={building.id} className="bg-white border border-gray-200 rounded-lg p-6">
            {editingBuilding?.id === building.id ? (
              <BuildingEditForm
                building={editingBuilding}
                onSave={handleUpdateBuilding}
                onCancel={() => setEditingBuilding(null)}
              />
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{building.name}</h4>
                  <p className="text-sm text-gray-600">
                    כניסות: {building.entrances.join(', ')}
                  </p>
                  {building.elevatorCompany && (
                    <p className="text-sm text-gray-600">
                      מעלית: {building.elevatorCompany}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingBuilding(building)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                    title="ערוך"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBuilding(building.id)}
                    disabled={data.buildings.length <= 1}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg disabled:text-gray-400 disabled:cursor-not-allowed"
                    title="מחק"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface BuildingEditFormProps {
  building: Building;
  onSave: (building: Building) => void;
  onCancel: () => void;
}

const BuildingEditForm: React.FC<BuildingEditFormProps> = ({
  building,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState(building);

  const handleSave = () => {
    onSave(formData);
  };

  const addEntrance = () => {
    const nextEntrance = String.fromCharCode(1488 + formData.entrances.length); // Hebrew letters
    setFormData(prev => ({
      ...prev,
      entrances: [...prev.entrances, nextEntrance],
      electricityDetails: [
        ...(prev.electricityDetails || []),
        { entrance: nextEntrance, contractNumber: '', meterNumber: '' }
      ],
      entranceCodes: [
        ...(prev.entranceCodes || []),
        { entrance: nextEntrance, code: '' }
      ]
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          שם הבניין
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          חברת מעליות
        </label>
        <input
          type="text"
          value={formData.elevatorCompany || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, elevatorCompany: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          טלפון מעלית
        </label>
        <input
          type="tel"
          value={formData.elevatorPhone || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, elevatorPhone: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            כניסות וקודים
          </label>
          <button
            onClick={addEntrance}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + הוסף כניסה
          </button>
        </div>
        <div className="space-y-2">
          {formData.entrances.map((entrance, index) => (
            <div key={entrance} className="grid grid-cols-3 gap-2">
              <div>
                <input
                  type="text"
                  value={entrance}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={formData.entranceCodes?.[index]?.code || ''}
                  onChange={(e) => {
                    const newCodes = [...(formData.entranceCodes || [])];
                    newCodes[index] = { entrance, code: e.target.value };
                    setFormData(prev => ({ ...prev, entranceCodes: newCodes }));
                  }}
                  placeholder="קוד כניסה"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={formData.electricityDetails?.[index]?.contractNumber || ''}
                  onChange={(e) => {
                    const newDetails = [...(formData.electricityDetails || [])];
                    newDetails[index] = { 
                      entrance, 
                      contractNumber: e.target.value,
                      meterNumber: newDetails[index]?.meterNumber || ''
                    };
                    setFormData(prev => ({ ...prev, electricityDetails: newDetails }));
                  }}
                  placeholder="מספר חוזה חשמל"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="h-4 w-4" />
          שמור
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
        >
          ביטול
        </button>
      </div>
    </div>
  );
};