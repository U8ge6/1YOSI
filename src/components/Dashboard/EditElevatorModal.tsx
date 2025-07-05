import React, { useState, useEffect } from 'react';
import { X, Phone } from 'lucide-react';
import { Building } from '../../types';

interface EditElevatorModalProps {
  building: Building;
  onSave: (building: Building) => void;
  onClose: () => void;
}

export const EditElevatorModal: React.FC<EditElevatorModalProps> = ({
  building,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState({
    elevatorCompany: building.elevatorCompany || '',
    elevatorPhone: building.elevatorPhone || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedBuilding = {
      ...building,
      elevatorCompany: formData.elevatorCompany.trim() || undefined,
      elevatorPhone: formData.elevatorPhone.trim() || undefined
    };
    
    onSave(updatedBuilding);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Phone className="h-5 w-5 text-blue-600" />
            עריכת פרטי מעלית
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
              שם חברת המעליות
            </label>
            <input
              type="text"
              value={formData.elevatorCompany}
              onChange={(e) => setFormData(prev => ({ ...prev, elevatorCompany: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="למשל: מעליות כרמל"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              טלפון תחזוקה
            </label>
            <input
              type="tel"
              value={formData.elevatorPhone}
              onChange={(e) => setFormData(prev => ({ ...prev, elevatorPhone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="03-1234567"
            />
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              💡 <strong>טיפ:</strong> שמור את מספר הטלפון של חברת המעליות לקבלת שירות מהיר בעת תקלה
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              שמור
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};